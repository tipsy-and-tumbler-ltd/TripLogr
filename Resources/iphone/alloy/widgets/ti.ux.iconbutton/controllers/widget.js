function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.iconbutton/" + s : s.substring(0, index) + "/ti.ux.iconbutton/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function initUI() {
        WTools.setTiProps(args, $.btn);
        $.init(args);
        WTools.cleanArgs(args);
    }
    new (require("alloy/widget"))("ti.ux.iconbutton");
    this.__widgetId = "ti.ux.iconbutton";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.btn = Ti.UI.createButton({
        color: "#669",
        id: "btn"
    });
    $.__views.btn && $.addTopLevelView($.__views.btn);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0];
    var WTools = require("WidgetTools");
    var IconicFont = require(WPATH("IconicFont")), fontawesome = new IconicFont({
        font: WPATH("FontAwesome")
    });
    $.getCharMap = function() {
        return fontawesome.font.charcode || {};
    };
    $.setIcon = function(codename) {
        $.btn.title = fontawesome.icon(codename);
    };
    $.init = function(argsInit) {
        $.btn.font = {
            fontSize: args.size || 24,
            fontFamily: fontawesome.fontfamily
        };
        argsInit.iconColor && ($.btn.color = args.iconColor);
        argsInit.icon && ($.btn.title = fontawesome.icon(args.icon));
    };
    initUI();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;