function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.criteriastudio.RemoteImageView/" + s : s.substring(0, index) + "/com.criteriastudio.RemoteImageView/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function fadein() {
        animation.fadeIn($.scroll, 300, function() {
            Ti.API.info("fade in window");
        });
    }
    function fadeout() {
        animation.fadeOut($.win, 300, function() {
            $.win.close();
        });
    }
    new (require("alloy/widget"))("com.criteriastudio.RemoteImageView");
    this.__widgetId = "com.criteriastudio.RemoteImageView";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "zoomWin";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.win = Ti.UI.createWindow({
        barColor: "#fff",
        navTintColor: "#000",
        translucent: false,
        backgroundColor: "transparent",
        navBarHidden: true,
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    fadein ? $.__views.win.addEventListener("open", fadein) : __defers["$.__views.win!open!fadein"] = true;
    $.__views.scroll = Ti.UI.createScrollView({
        opacity: 0,
        backgroundColor: "#000",
        contentHeight: "auto",
        contentWidth: "auto",
        maxZoomScale: 10,
        minZoomScale: 1,
        id: "scroll"
    });
    $.__views.win.add($.__views.scroll);
    $.__views.img = Ti.UI.createImageView({
        width: "100%",
        id: "img"
    });
    $.__views.scroll.add($.__views.img);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var animation = require("alloy/animation");
    $.img.image = args.image;
    $.scroll.addEventListener("click", fadeout);
    __defers["$.__views.win!open!fadein"] && $.__views.win.addEventListener("open", fadein);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;