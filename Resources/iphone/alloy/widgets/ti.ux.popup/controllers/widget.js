function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.popup/" + s : s.substring(0, index) + "/ti.ux.popup/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function initUI() {
        var children;
        if (args.children) {
            children = args.children || [];
            $.container.add(children);
        }
        var closeBtnView = $.closeBtn.getView();
        if (args.closeButton) {
            closeBtnView.visible = true;
            closeBtnView.addEventListener("click", function(e) {
                cancelPopup(e);
            });
        } else closeBtnView.visible = false;
    }
    function cancelPopup(e) {
        if (e.source !== $.bgView && e.source !== $.closeBtn.getView()) return;
        fadeOut();
    }
    function fadeIn() {
        $.bgView.open();
        $.bgView.visible = true;
        animation.fadeIn($.bgView, 300, function() {});
    }
    function fadeOut() {
        animation.fadeOut($.bgView, 300, function() {
            $.bgView.visible = false;
            $.bgView.close();
        });
    }
    new (require("alloy/widget"))("ti.ux.popup");
    this.__widgetId = "ti.ux.popup";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.bgView = Ti.UI.createWindow({
        barColor: "#fff",
        navTintColor: "#000",
        translucent: false,
        id: "bgView",
        visible: "false",
        backgroundColor: "#9000",
        opacity: "0"
    });
    $.__views.bgView && $.addTopLevelView($.__views.bgView);
    cancelPopup ? $.__views.bgView.addEventListener("click", cancelPopup) : __defers["$.__views.bgView!click!cancelPopup"] = true;
    $.__views.view = Ti.UI.createView({
        id: "view",
        left: "20",
        right: "20",
        top: "50",
        bottom: "50",
        backgroundColor: "#fff",
        borderRadius: "5"
    });
    $.__views.bgView.add($.__views.view);
    $.__views.container = Ti.UI.createView({
        id: "container",
        top: "10",
        bottom: "10",
        left: "10",
        right: "10"
    });
    $.__views.view.add($.__views.container);
    $.__views.closeBtn = Alloy.createWidget("ti.ux.iconbutton", "widget", {
        icon: "fa-times-circle",
        top: "-4",
        right: "-2",
        size: "26",
        zIndex: "9999",
        iconColor: "#000",
        id: "closeBtn",
        __parentSymbol: $.__views.view
    });
    $.__views.closeBtn.setParent($.__views.view);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0];
    require("WidgetTools");
    var animation = require("alloy/animation");
    initUI();
    $.show = function() {
        fadeIn();
    };
    $.hide = function() {
        fadeOut();
    };
    __defers["$.__views.bgView!click!cancelPopup"] && $.__views.bgView.addEventListener("click", cancelPopup);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;