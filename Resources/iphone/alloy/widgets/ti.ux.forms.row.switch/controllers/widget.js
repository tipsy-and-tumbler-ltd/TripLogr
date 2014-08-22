function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.forms.row.switch/" + s : s.substring(0, index) + "/ti.ux.forms.row.switch/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function initUI() {
        if (args.icon) {
            $.icon.setIcon(args.icon);
            args.iconColor && ($.icon.getView().color = args.iconColor);
        } else $.titleLbl.left = $.icon.getView().left;
        $.titleLbl.text = args.title || "";
    }
    function initValues() {
        var value = "true" === args.value || true == args.value;
        Ti.API.info("value: " + value);
        $.switchControl.value = value;
        $.value = value;
    }
    new (require("alloy/widget"))("ti.ux.forms.row.switch");
    this.__widgetId = "ti.ux.forms.row.switch";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.row = Ti.UI.createTableViewRow({
        backgroundColor: "#fff",
        height: "50",
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 16
        },
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    $.__views.icon = Alloy.createWidget("ti.ux.iconfont", "widget", {
        left: 10,
        size: 24,
        iconColor: "#333",
        id: "icon",
        __parentSymbol: $.__views.row
    });
    $.__views.icon.setParent($.__views.row);
    $.__views.titleLbl = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.normalFont,
            fontSize: "14dp"
        },
        color: "#111",
        left: "35",
        id: "titleLbl"
    });
    $.__views.row.add($.__views.titleLbl);
    $.__views.switchControl = Ti.UI.createSwitch({
        value: false,
        id: "switchControl",
        right: "10"
    });
    $.__views.row.add($.__views.switchControl);
    $.__views.__alloyId2 = Ti.UI.createView({
        height: .5,
        backgroundColor: "#eee",
        bottom: 0,
        id: "__alloyId2"
    });
    $.__views.row.add($.__views.__alloyId2);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0];
    $.id = args.id || "switch";
    initUI();
    initValues();
    $.getValue = function() {
        return $.switchControl.value;
    };
    $.setValue = function(value) {
        $.switchControl.value = value;
    };
    require("WidgetTools").cleanArgs(args);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;