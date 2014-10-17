define(function(require) {
    var Adapt = require("coreJS/adapt");

    Adapt.on("router:page", function(model) {
        var REQUIRED_SCREEN_SIZE = 700;
        var wipeModel = model.get("_wipe");

        if(wipeModel && wipeModel._isActive && $(window).width() >= REQUIRED_SCREEN_SIZE) {
            var WipeController = require("extensions/adapt-wipe/js/wipe-controller");
            new WipeController({model:model});
        }
    });
});
