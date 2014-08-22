function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.iconfont/" + s : s.substring(0, index) + "/ti.ux.iconfont/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function initUI() {
        WTools.setTiProps(args, $.iconLbl);
        $.init(args);
        WTools.cleanArgs(args);
    }
    new (require("alloy/widget"))("ti.ux.iconfont");
    this.__widgetId = "ti.ux.iconfont";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.iconLbl = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.normalFont,
            fontSize: "14dp"
        },
        color: "#111",
        id: "iconLbl"
    });
    $.__views.iconLbl && $.addTopLevelView($.__views.iconLbl);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var WTools = require("WidgetTools");
    var IconicFont = require(WPATH("IconicFont")), fontawesome = new IconicFont({
        font: WPATH("FontAwesome")
    });
    $.getCharMap = function() {
        return fontawesome.font.charcode || {};
    };
    $.setIcon = function(codename) {
        $.iconLbl.text = fontawesome.icon(codename);
    };
    $.init = function(argsInit) {
        $.iconLbl.font = {
            fontSize: args.size || 24,
            fontFamily: fontawesome.fontfamily
        };
        argsInit.iconColor && ($.iconLbl.color = args.iconColor);
        argsInit.icon && ($.iconLbl.text = fontawesome.icon(args.icon));
    };
    initUI();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;