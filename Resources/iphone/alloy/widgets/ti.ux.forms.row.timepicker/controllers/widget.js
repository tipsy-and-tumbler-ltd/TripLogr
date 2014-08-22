function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.forms.row.timepicker/" + s : s.substring(0, index) + "/ti.ux.forms.row.timepicker/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function initUI() {
        $.picker.visible = false;
        if (args.icon) {
            $.icon.setIcon(args.icon);
            args.iconColor && ($.icon.getView().color = args.iconColor);
        } else $.titleLbl.left = $.icon.getView().left;
        $.titleLbl.text = args.title || "";
    }
    function initValues() {
        var value = args.value;
        Ti.API.info("value: " + value);
        if (value) {
            var t = moment(value, args.format || "");
            $.dateLbl.text = t.calendar();
        }
        $.value = value;
    }
    function toggleRow() {
        if ($.row.isExpanded) {
            $.row.height = "50";
            $.picker.visible = false;
            $.row.isExpanded = false;
        } else {
            $.row.height = "240";
            $.picker.visible = true;
            $.row.isExpanded = true;
        }
    }
    function updateLabels(e) {
        Ti.API.info("User selected: " + e.value);
        var t = moment(e.value);
        $.dateLbl.text = t.calendar();
    }
    new (require("alloy/widget"))("ti.ux.forms.row.timepicker");
    this.__widgetId = "ti.ux.forms.row.timepicker";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
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
    toggleRow ? $.__views.row.addEventListener("click", toggleRow) : __defers["$.__views.row!click!toggleRow"] = true;
    $.__views.__alloyId11 = Ti.UI.createView({
        height: "50",
        top: "0",
        id: "__alloyId11"
    });
    $.__views.row.add($.__views.__alloyId11);
    $.__views.icon = Alloy.createWidget("ti.ux.iconfont", "widget", {
        left: 10,
        size: 24,
        iconColor: "#333",
        id: "icon",
        __parentSymbol: $.__views.__alloyId11
    });
    $.__views.icon.setParent($.__views.__alloyId11);
    $.__views.titleLbl = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.normalFont,
            fontSize: "14dp"
        },
        color: "#111",
        left: "35",
        id: "titleLbl"
    });
    $.__views.__alloyId11.add($.__views.titleLbl);
    $.__views.dateLbl = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.normalFont,
            fontSize: "14dp"
        },
        color: "#111",
        id: "dateLbl",
        textAlign: "right",
        right: "20"
    });
    $.__views.__alloyId11.add($.__views.dateLbl);
    $.__views.picker = Ti.UI.createPicker({
        id: "picker",
        top: "40",
        type: Ti.UI.PICKER_TYPE_DATE_AND_TIME
    });
    $.__views.row.add($.__views.picker);
    updateLabels ? $.__views.picker.addEventListener("change", updateLabels) : __defers["$.__views.picker!change!updateLabels"] = true;
    $.__views.__alloyId12 = Ti.UI.createView({
        height: .5,
        backgroundColor: "#eee",
        bottom: 0,
        id: "__alloyId12"
    });
    $.__views.row.add($.__views.__alloyId12);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0], moment = require("alloy/moment");
    $.id = args.id || "datePicker";
    initUI();
    initValues();
    $.getValue = function() {
        return $.picker.value;
    };
    require("WidgetTools").cleanArgs(args);
    __defers["$.__views.row!click!toggleRow"] && $.__views.row.addEventListener("click", toggleRow);
    __defers["$.__views.picker!change!updateLabels"] && $.__views.picker.addEventListener("change", updateLabels);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;