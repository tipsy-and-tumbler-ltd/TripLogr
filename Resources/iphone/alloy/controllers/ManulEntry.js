function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "ManulEntry";
    var __parentSymbol = arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.win = Ti.UI.createWindow({
        barColor: "#fff",
        navTintColor: "#000",
        translucent: false,
        modal: "true",
        navBarHidden: "false",
        title: "Manual Trip Entry",
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.header = Ti.UI.createView({
        height: 44,
        top: 0,
        width: Ti.UI.FILL,
        id: "header"
    });
    $.__views.win.add($.__views.header);
    $.__views.closeBtn = Ti.UI.createButton({
        right: 5,
        width: Ti.UI.SIZE,
        height: 44,
        top: 20,
        color: "#000",
        title: "Close",
        id: "closeBtn"
    });
    $.__views.header.add($.__views.closeBtn);
    closeWindow ? $.__views.closeBtn.addEventListener("click", closeWindow) : __defers["$.__views.closeBtn!click!closeWindow"] = true;
    var __alloyId16 = [];
    $.__views.tripDate = Alloy.createWidget("ti.ux.forms.row.timepicker", "widget", {
        minDate: "",
        maxDate: "",
        value: "",
        title: " Trip Date",
        icon: "fa-clock-o",
        id: "tripDate",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId17 = Ti.UI.createTableViewSection({
        id: "__alloyId17"
    });
    __alloyId16.push($.__views.__alloyId17);
    $.__views.__alloyId18 = Ti.UI.createTableViewRow({
        height: "70",
        backgroundColor: "#fff",
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 16
        },
        selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
        id: "__alloyId18"
    });
    $.__views.__alloyId17.add($.__views.__alloyId18);
    $.__views.__alloyId19 = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.fontItalic,
            fontSize: "12dp"
        },
        color: "#333",
        text: "TripLogr can automatically backup your Trip data to the Cloud for free if you wish. Cloud backup is necessary if you want to generate PDF trip reports.",
        textAlign: "center",
        left: "10",
        right: "10",
        id: "__alloyId19"
    });
    $.__views.__alloyId18.add($.__views.__alloyId19);
    $.__views.tripDate = Alloy.createWidget("ti.ux.forms.row.timepicker", "widget", {
        minDate: "",
        maxDate: "",
        value: "",
        title: " Trip Date",
        icon: "fa-clock-o",
        id: "tripDate",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId17.add($.__views.tripDate.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId20 = Ti.UI.createTableViewRow({
        height: "80",
        backgroundColor: "#fff",
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 16
        },
        selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
        id: "__alloyId20"
    });
    $.__views.__alloyId17.add($.__views.__alloyId20);
    $.__views.btnSave = Ti.UI.createButton({
        left: 10,
        right: 10,
        height: 40,
        borderWidth: 1,
        borderColor: "#000",
        backgroundColor: "#fff",
        top: 20,
        backgroundSelectedColor: "#ccc",
        backgroundFocusedColor: "#ccc",
        color: "#000",
        id: "btnSave",
        title: "Save"
    });
    $.__views.__alloyId20.add($.__views.btnSave);
    $.__views.tableCreate = Ti.UI.createTableView({
        backgroundColor: "#fff",
        separatorStyle: Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
        top: 70,
        data: __alloyId16,
        id: "tableCreate"
    });
    $.__views.win.add($.__views.tableCreate);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    __defers["$.__views.closeBtn!click!closeWindow"] && $.__views.closeBtn.addEventListener("click", closeWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;