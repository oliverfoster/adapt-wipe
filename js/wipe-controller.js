define(function(require) {
    var Backbone = require("backbone");
    var Adapt = require("coreJS/adapt");

    var WipeController = Backbone.View.extend({
        initialize: function(options) {
            this.collection = this.model.getChildren();
            this.config = this.model.get("_wipe") || {};
            this.currentIndex = -1;

            this.initListeners();
        },

        initListeners: function(){
            this.listenTo(Adapt, "remove", this.remove);
            this.listenTo(Adapt, "pageView:ready", this.setup);
            this.listenTo(Adapt, "page:scrollTo", this.onProgressBarScrollTo);

            this.listenTo(Adapt, "wipe:controls:wipeUpTriggered", this.onControlsWipeUp);
            this.listenTo(Adapt, "wipe:controls:wipeDownTriggered", this.onControlsWipeDown);
            this.listenTo(Adapt, "wipe:navigation:itemSelected", this.onNavigationItemSelected);

            this.listenTo(Adapt, "wipe:transitionStarted", this.onWipeTransitionStarted);
        },

        setup: function(){
            this.$page = $(".page");
            this.$page.attr("wipe", "active");
            this.$articles = $(".article");

            this.setupControls();
            this.setupNavigation();

            if(this.config._useWipeEffect) this.$page.addClass("showWipeEffect");

            _.defer(_.bind(function() {
                this.wipeToArticle(0);
            }, this));
        },

        setupControls: function(){
            if(this.config._showControls) {
                var WipeControlsView = require("extensions/adapt-wipe/js/wipe-controlsView");
                var controlsView = new WipeControlsView({ model: this.model});
                this.$page.append(controlsView.el);
            }
        },

        setupNavigation: function(){
            if(this.config._showNavigation) {
                var WipeNavigationView = require("extensions/adapt-wipe/js/wipe-navigationView");
                var navigationView =  new WipeNavigationView({model: this.model, config: this.config});
                this.$page.append(navigationView.el);
            }
        },

        updateState: function(index){
            if(index === this.currentIndex || index < 0 || index > this.$articles.length) return false;

            this.currentIndex = index;

            this.state = {
                currentIndex: this.currentIndex,
                previousIndex: this.previousIndex,
                $article : $(this.$articles[this.currentIndex]),
                isFirstArticle : this.currentIndex === 0,
                isLastArticle : this.currentIndex === this.$articles.length-1
            };

            return true;
        },

        wipeToArticle: function(index){
            if(this.updateState(index)) {
                Adapt.trigger("wipe:transitionStarted", this.state);
                var topCounter = 0 - (this.currentIndex*100);
                _.each(this.$articles, function(article, i) {
                    if(i > 0) topCounter += 100;

                    var onCompleteHandler = i === this.currentIndex ? _.bind(this.onWipeTransitionCompleted, this) : null;
                    var navOffset = ($(".navigation").height()/$(document).height())*100
                    var zIndex = $(article).css("top") > 0 ? '-1' : '1';

                    $(article).css("z-index", zIndex);
                    $(article).stop().animate({"top":topCounter + navOffset + "%"}, 500, onCompleteHandler);
                }, this);
            }
        },

        animateToComponent: function(componentSelector){
            var navOffset = $(".navigation").height();
            var spacing = $(document).height()*0.05;
            var componentTop = this.state.$article.find(componentSelector).offset().top;
            var articleTop = this.state.$article.scrollTop();
            var newTop = Math.round((articleTop + componentTop) - (navOffset + spacing));

            if(newTop !== articleTop) this.state.$article.animate({ "scrollTop": newTop }, 500);
        },

        onControlsWipeUp: function(event) {
            this.wipeToArticle(this.currentIndex-1);
        },

        onControlsWipeDown: function(event) {
            this.wipeToArticle(this.currentIndex+1);
        },

        onNavigationItemSelected: function(params){
            this.wipeToArticle(params.index);
        },

        onWipeTransitionCompleted: function(){
            if(this.state.$article.scrollTop()) this.state.$article.stop(true, true).animate({ scrollTop: 0 }, 300);
            Adapt.trigger("wipe:transitionCompleted", this.state);
        },

        onProgressBarScrollTo: function(componentSelector){
            var componentId = componentSelector.slice(1);
            var componentModel = Adapt.components.findWhere({_id:componentId});
            var articleModel = componentModel.findAncestor("articles");
            var $article = $(".article." + articleModel.get("_id"));
            var newArticleIndex = _.indexOf($(".article").get(),$article[0]);;

            if(this.currentIndex === newArticleIndex){
                this.animateToComponent(componentSelector);
            }
            else {
                Adapt.once("wipe:transitionCompleted", function() { this.animateToComponent(componentSelector); }, this);
                this.wipeToArticle(newArticleIndex);
            }
        }
    });
    return WipeController;
});
