function Controller() {
    function closeWindow() {
        $.win.close();
    }
    function generatePDF() {
        $.tableCreate.hide();
        results.sort(sortTripData);
        var rows = [];
        for (var i = 0; results.length > i; i++) {
            var row = Ti.UI.createTableViewRow({
                className: "reportRow"
            });
            row.add(Ti.UI.createLabel({
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE,
                left: 20,
                font: {
                    fontSize: 18
                },
                width: 300,
                text: results[i].purpose
            }));
            row.add(Ti.UI.createLabel({
                width: Ti.UI.SIZE,
                height: 30,
                font: {
                    fontSize: 18
                },
                left: 380,
                text: results[i].date.toString()
            }));
            results[i].odometer_start && row.add(Ti.UI.createLabel({
                width: Ti.UI.SIZE,
                height: 30,
                font: {
                    fontSize: 18
                },
                left: 700,
                text: Math.floor(results[i].odometer_start).toString()
            }));
            results[i].odometer_end && row.add(Ti.UI.createLabel({
                width: Ti.UI.SIZE,
                height: 30,
                font: {
                    fontSize: 18
                },
                left: 800,
                text: Math.floor(results[i].odometer_end).toString()
            }));
            row.add(Ti.UI.createView({
                width: Ti.UI.FILL,
                height: 2,
                top: 40
            }));
            rows.push(row);
        }
        Ti.API.warn(rows);
        $.tableReport.setData(rows);
        $.tableReport.visible = true;
        var media = $.tableReport.toImage();
        var pdfBlob = converters.convertImageToPDF(media, 100);
        var pdfFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "report.pdf");
        pdfFile.write(pdfBlob);
        Ti.API.warn(pdfFile.nativePath);
        $.tableReport.visible = false;
        $.tableCreate.visible = true;
        var emailDialog = Ti.UI.createEmailDialog();
        emailDialog.subject = "Your TripLogr Report";
        emailDialog.messageBody = "Your TripLogr Report is attached in PDF format.";
        emailDialog.addAttachment(pdfFile);
        emailDialog.open();
    }
    function sortTripData(a, b) {
        if (b.date < a.date) return -1;
        if (b.date > a.date) return 1;
        return 0;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "ReportGenerator";
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
        title: "Create Report",
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
    $.__views.lblHeading = Ti.UI.createLabel({
        font: {
            fontSize: 15,
            fontWeight: "bold"
        },
        color: "#111",
        width: Titanium.UI.FILL,
        top: 20,
        height: 44,
        textAlign: "center",
        id: "lblHeading",
        text: "Create Report"
    });
    $.__views.header.add($.__views.lblHeading);
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
    var __alloyId18 = [];
    $.__views.__alloyId22 = Alloy.createWidget("ti.ux.forms.row.timepicker", "widget", {
        minDate: "",
        maxDate: "",
        value: "",
        title: " Start Date",
        icon: "fa-clock-o",
        id: "__alloyId22",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId23 = Alloy.createWidget("ti.ux.forms.row.timepicker", "widget", {
        minDate: "",
        maxDate: "",
        value: "",
        title: " End Date",
        icon: "fa-clock-o",
        id: "__alloyId23",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId19 = Ti.UI.createTableViewSection({
        id: "__alloyId19"
    });
    __alloyId18.push($.__views.__alloyId19);
    $.__views.__alloyId20 = Ti.UI.createTableViewRow({
        height: "70",
        backgroundColor: "#fff",
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 16
        },
        selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
        id: "__alloyId20"
    });
    $.__views.__alloyId19.add($.__views.__alloyId20);
    $.__views.__alloyId21 = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.fontItalic,
            fontSize: "12dp"
        },
        color: "#333",
        text: "TripLogr can automatically backup your Trip data to the Cloud for free if you wish. Cloud backup is necessary if you want to generate PDF trip reports.",
        textAlign: "center",
        left: "10",
        right: "10",
        id: "__alloyId21"
    });
    $.__views.__alloyId20.add($.__views.__alloyId21);
    $.__views.__alloyId22 = Alloy.createWidget("ti.ux.forms.row.timepicker", "widget", {
        minDate: "",
        maxDate: "",
        value: "",
        title: " Start Date",
        icon: "fa-clock-o",
        id: "__alloyId22",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId19.add($.__views.__alloyId22.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId23 = Alloy.createWidget("ti.ux.forms.row.timepicker", "widget", {
        minDate: "",
        maxDate: "",
        value: "",
        title: " End Date",
        icon: "fa-clock-o",
        id: "__alloyId23",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId19.add($.__views.__alloyId23.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId24 = Ti.UI.createTableViewRow({
        height: "80",
        backgroundColor: "#fff",
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 16
        },
        selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
        id: "__alloyId24"
    });
    $.__views.__alloyId19.add($.__views.__alloyId24);
    $.__views.btnCreateReport = Ti.UI.createButton({
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
        id: "btnCreateReport",
        title: "Create Report"
    });
    $.__views.__alloyId24.add($.__views.btnCreateReport);
    $.__views.tableCreate = Ti.UI.createTableView({
        backgroundColor: "#fff",
        separatorStyle: Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
        top: 70,
        data: __alloyId18,
        id: "tableCreate"
    });
    $.__views.win.add($.__views.tableCreate);
    $.__views.tableReport = Ti.UI.createTableView({
        backgroundColor: "#fff",
        separatorStyle: Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
        top: 70,
        id: "tableReport",
        height: "1754",
        width: "1240",
        visible: "false"
    });
    $.__views.win.add($.__views.tableReport);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var YapDB = require("YapDB").YapDB;
    var pdf = require("bencoding.pdf");
    var converters = pdf.createConverters();
    var results = [];
    Ti.App.addEventListener("generateReport", generatePDF);
    $.btnCreateReport.addEventListener("click", function() {
        YapDB.fetchAllTrips(function(_results) {
            results = _results;
            Ti.App.fireEvent("generateReport");
        });
    });
    __defers["$.__views.closeBtn!click!closeWindow"] && $.__views.closeBtn.addEventListener("click", closeWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;