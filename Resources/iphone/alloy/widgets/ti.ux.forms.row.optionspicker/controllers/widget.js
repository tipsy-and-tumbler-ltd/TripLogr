function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.forms.row.optionspicker/" + s : s.substring(0, index) + "/ti.ux.forms.row.optionspicker/" + s.substring(index + 1);
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
        var allValues = prepareValues(args.options);
        var value = args.value;
        if ("undefined" != typeof value && -1 !== value && "-1" !== value) {
            value = parseInt(value);
            allValues.length > value ? $.subtitleLbl.text = allValues[value] : console.warn("ti.ux.forms.optionspicker: value is out of index");
        } else args.hintText && ($.subtitleLbl.text = args.hintText);
        $.OPTIONS = allValues;
        $.value = value;
    }
    function openPicker() {
        var type = (args.dialogType || TYPE_OPTION_DIALOG).toLowerCase();
        if (type === TYPE_OPTION_DIALOG) {
            $.dialog.options = $.OPTIONS;
            args.cancel && ($.dialog.cancel = args.cancel);
            $.dialog.show();
        } else if (type === TYPE_POPUP) {
            var popupDialog = Alloy.createWidget("ti.ux.popup.list", "widget", {
                closeButton: false,
                selectable: true,
                options: $.OPTIONS,
                value: $.value
            });
            popupDialog.getView("table").addEventListener("click", function(e) {
                $.value = e.index;
                $.subtitleLbl.text = e.row.data.title;
                popupDialog.hide();
            });
            popupDialog.getView().show();
        } else if (type === TYPE_MODALWINDOW) {
            Ti.API.info("ti.ux.forms.optionspicker: modal window");
            alert("modal window not implemented yet");
        }
    }
    function optionSelected(e) {
        var index = e.index;
        if (-1 === index || index == args.cancel) return;
        $.value = index;
        $.subtitleLbl.text = $.OPTIONS[index];
    }
    function prepareValues(values) {
        var values = values || "";
        if (Array.isArray(values)) return values;
        return values.split("|");
    }
    new (require("alloy/widget"))("ti.ux.forms.row.optionspicker");
    this.__widgetId = "ti.ux.forms.row.optionspicker";
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
    openPicker ? $.__views.row.addEventListener("click", openPicker) : __defers["$.__views.row!click!openPicker"] = true;
    $.__views.icon = Alloy.createWidget("ti.ux.iconfont", "widget", {
        id: "icon",
        left: "10",
        size: "20",
        __parentSymbol: $.__views.row
    });
    $.__views.icon.setParent($.__views.row);
    $.__views.titleLbl = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.normalFont,
            fontSize: "14dp"
        },
        color: "#111",
        left: 35,
        id: "titleLbl"
    });
    $.__views.row.add($.__views.titleLbl);
    $.__views.subtitleLbl = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.normalFont,
            fontSize: "14dp"
        },
        color: "#666",
        textAlign: "right",
        right: "35",
        id: "subtitleLbl"
    });
    $.__views.row.add($.__views.subtitleLbl);
    $.__views.countLbl = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.normalFont,
            fontSize: "14dp"
        },
        color: "#fff",
        backgroundColor: "#bbb",
        textAlign: "center",
        borderRadius: "8",
        height: "20",
        visible: "false",
        right: "35",
        id: "countLbl"
    });
    $.__views.row.add($.__views.countLbl);
    $.__views.__alloyId0 = Alloy.createWidget("ti.ux.iconfont", "widget", {
        right: "10",
        icon: "fa-angle-right",
        id: "__alloyId0",
        __parentSymbol: $.__views.row
    });
    $.__views.__alloyId0.setParent($.__views.row);
    $.__views.__alloyId1 = Ti.UI.createView({
        height: .5,
        backgroundColor: "#eee",
        bottom: 0,
        id: "__alloyId1"
    });
    $.__views.row.add($.__views.__alloyId1);
    $.__views.dialog = Ti.UI.createOptionDialog({
        id: "dialog"
    });
    $.__views.dialog && $.addTopLevelView($.__views.dialog);
    optionSelected ? $.__views.dialog.addEventListener("click", optionSelected) : __defers["$.__views.dialog!click!optionSelected"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0];
    var TYPE_OPTION_DIALOG = "dialog", TYPE_POPUP = "popup", TYPE_MODALWINDOW = "modalwindow";
    $.id = args.id || "optionPicker";
    initUI();
    initValues();
    $.getOptions = function() {
        return $.OPTIONS || [];
    };
    $.getValue = function() {
        return $.value;
    };
    $.setValue = function(value) {
        $.subtitleLbl.text = value;
    };
    require("WidgetTools").cleanArgs(args);
    __defers["$.__views.row!click!openPicker"] && $.__views.row.addEventListener("click", openPicker);
    __defers["$.__views.dialog!click!optionSelected"] && $.__views.dialog.addEventListener("click", optionSelected);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;