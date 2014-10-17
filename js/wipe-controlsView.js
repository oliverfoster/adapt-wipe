define(function(require) {
    var Adapt = require("coreJS/adapt");
    var AdaptView = require("coreViews/adaptView");

    var WipeControlsView = AdaptView.extend({
        className : "wipe-controls",

        events: {
            "click .wipe-control-up": "triggerWipeUp",
            "click .wipe-control-down": "triggerWipeDown"
        },

        initialize: function(options) {
            AdaptView.prototype.initialize.apply(this, arguments);

            this.listenTo(Adapt, "wipe:transitionStarted", this.onWipeTransitionStarted);
            this.listenTo(Adapt, "wipe:transitionCompleted", this.onWipeTransitionCompleted);
        },

        postRender: function() {

        },

        triggerWipeUp: function(event) {
            event.preventDefault();
            Adapt.trigger("wipe:controls:wipeUpTriggered", event);
        },

        triggerWipeDown: function(event) {
            event.preventDefault();
            Adapt.trigger("wipe:controls:wipeDownTriggered", event);
        },

        onWipeTransitionStarted: function(wipeControllerState){
            this.$el.attr("wipe-control-state", "disabled");
        },

        onWipeTransitionCompleted: function(wipeControllerState){
            var stateStr = "";

            if(wipeControllerState.isFirstArticle) stateStr = "up-disabled";
            else if(wipeControllerState.isLastArticle) stateStr = "down-disabled";

            this.$el.attr("wipe-control-state", stateStr);
        }
    },{
        template: "wipe-controls"
    });
    return WipeControlsView;
});
