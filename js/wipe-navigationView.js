define(function(require) {
    var Adapt = require("coreJS/adapt");
    var AdaptView = require("coreViews/adaptView");

    var WipeNavigationView = AdaptView.extend({
        className: "wipe-navigation",

        events: {
            "click .wipe-navigation-item": "onNavigationItemSelected"
        },

        initialize: function(options) {
            AdaptView.prototype.initialize.apply(this, arguments);
            this.initListeners()
        },

        initListeners: function() {
            this.listenTo(Adapt, "wipe:transitionStarted", this.onWipeTransitionStarted);
            this.listenTo(Adapt, "wipe:transitionCompleted", this.onWipeTransitionCompleted);
        },

        postRender: function() {

        },

        onNavigationItemSelected: function(event) {
            event.preventDefault();
            var index = parseInt($(event.currentTarget).attr("wipe-index"));
            Adapt.trigger("wipe:navigation:itemSelected", {event:event, index:index});
        },

        onWipeTransitionStarted: function(wipeControllerState){
            this.$el.attr("wipe-navigation-state", "disabled");

            $(".wipe-navigation-item", this.$el).removeClass("wipe-selected");
            $(".wipe-navigation-item[wipe-index='" + wipeControllerState.currentIndex + "']", this.$el).addClass("wipe-selected");
        },

        onWipeTransitionCompleted: function(wipeControllerState){
            this.$el.attr("wipe-navigation-state", "");
        }
    },{
        template : "wipe-navigation"
    });
    return WipeNavigationView;
});
