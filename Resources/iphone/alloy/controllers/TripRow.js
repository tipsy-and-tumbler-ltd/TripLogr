function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "TripRow";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.row = Ti.UI.createTableViewRow({
        backgroundColor: "#CCC",
        height: 85,
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 16
        },
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    $.__views.rowContainer = Ti.UI.createView({
        left: 5,
        right: 5,
        top: 5,
        bottom: 0,
        backgroundColor: "#fff",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "rowContainer"
    });
    $.__views.row.add($.__views.rowContainer);
    $.__views.dateDay = Ti.UI.createLabel({
        font: {
            fontSize: 50
        },
        color: "#000",
        left: 10,
        top: 0,
        height: 30,
        width: Ti.UI.SIZE,
        text: "30",
        id: "dateDay"
    });
    $.__views.rowContainer.add($.__views.dateDay);
    $.__views.dateMonthYear = Ti.UI.createLabel({
        font: {
            fontSize: 12
        },
        color: "#000",
        left: 12,
        bottom: 7,
        height: 15,
        width: Ti.UI.SIZE,
        text: "August, 2014",
        id: "dateMonthYear"
    });
    $.__views.rowContainer.add($.__views.dateMonthYear);
    $.__views.__alloyId32 = Ti.UI.createImageView({
        image: "images/row_divider.jpg",
        height: "60",
        width: "1",
        left: "100",
        top: "10",
        id: "__alloyId32"
    });
    $.__views.rowContainer.add($.__views.__alloyId32);
    $.__views.lblDescription = Ti.UI.createLabel({
        font: {
            fontSize: 13
        },
        color: "#111",
        text: "Off to the airport, heading to Split HR",
        top: 10,
        width: Ti.UI.FILL,
        right: 5,
        left: 112,
        height: 40,
        verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
        id: "lblDescription"
    });
    $.__views.rowContainer.add($.__views.lblDescription);
    $.__views.lblOdometer = Ti.UI.createLabel({
        font: {
            fontSize: 12
        },
        color: "#000",
        left: 112,
        bottom: 7,
        height: 15,
        width: Ti.UI.SIZE,
        text: "Odometer: 82300",
        id: "lblOdometer"
    });
    $.__views.rowContainer.add($.__views.lblOdometer);
    $.__views.lblMileage = Ti.UI.createLabel({
        font: {
            fontSize: 14,
            fontWeight: "bold"
        },
        color: "#000",
        right: 5,
        bottom: 7,
        height: 15,
        width: Ti.UI.SIZE,
        text: "129mi",
        id: "lblMileage"
    });
    $.__views.rowContainer.add($.__views.lblMileage);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    Ti.API.info(args);
    if (args) {
        $.dateDay.text = args.date.getDate();
        $.dateDay.dateMonthYear = (args.date.getMonth() + 1).toString() + " " + args.date.getFullYear();
        $.lblDescription.text = args.purpose;
        $.lblOdometer.text = "Odometer: " + args["odometer_end"].toFixed(0);
        var distanceMeasured = 0;
        var measure = "miles" == Alloy.Globals.TripLogr.distanceMeasurement.toLowerCase() ? "mi" : "km";
        distanceMeasured = "mi" == measure ? (.62137 * args.total_kilometers).toFixed(2) : args.total_kilometers.toFixed(2);
        $.lblMileage.text = distanceMeasured + measure;
        exports.setBottom = function(val) {
            $.rowContainer.bottom = val;
        };
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;