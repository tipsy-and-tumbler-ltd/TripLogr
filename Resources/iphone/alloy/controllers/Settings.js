function Controller() {
    function initBeacon() {
        TiBeacon.initializeBeaconMonitoring({
            success: function(e) {
                Ti.API.info("success: " + JSON.stringify(e));
                beaconsRegistered();
            },
            error: function(e) {
                Ti.API.error(JSON.stringify(e));
                alert("This device doesn't support iBeacons");
            },
            region: function(e) {
                Ti.API.info("region changed event: " + JSON.stringify(e));
                ("Immediate" === e.proximity || "Near" === e.proximity) && TiBeacon.sendLocalNotification({
                    message: "Looks like you might be ready for a new journey! Tap to start logging with TripLogr.",
                    sound: "/sounds/honk.mp3"
                });
            },
            ranged: function(e) {
                Ti.API.info("region ranged event: " + JSON.stringify(e));
            },
            change: function(e) {
                Ti.API.info("change event: " + JSON.stringify(e));
                ("Immediate" === e.proximity || "Near" === e.proximity) && TiBeacon.sendLocalNotification({
                    message: "Looks like you might be ready for a new journey! Tap to start logging with TripLogr.",
                    sound: "/sounds/honk.mp3"
                });
            }
        });
    }
    function beaconsRegistered() {
        TiBeacon.startMonitoringBeaconRegion({
            identifier: Alloy.Globals.TripLogr.beaconName,
            uuid: Alloy.Globals.TripLogr.beaconUUID,
            major: Alloy.Globals.TripLogr.beaconMajor,
            minor: Alloy.Globals.TripLogr.beaconMinor,
            notifyEntryStateOnDisplay: true,
            keepRanging: true
        });
    }
    function validateAndSave() {
        for (var i = 0, j = FIELDS.length; j > i; i++) {
            Ti.API.info("field: " + FIELDS[i].id + ", value: " + FIELDS[i].getValue());
            switch (FIELDS[i].id) {
              case "username":
                Alloy.Globals.TripLogr.username = FIELDS[i].getValue();
                break;

              case "cloudBackup":
                Alloy.Globals.TripLogr.cloudBackupActive = FIELDS[i].getValue();
                break;

              case "optDistance":
                Alloy.Globals.TripLogr.distanceMeasurement = 0 == FIELDS[i].getValue() ? "Miles" : "Kilometers";
                break;

              case "beaconEnabled":
                Alloy.Globals.TripLogr.beaconActive = FIELDS[i].getValue();
                false == Alloy.Globals.TripLogr.beaconActive ? TiBeacon.stopAllBeacons() : initBeacon();
                break;

              case "beaconName":
                Alloy.Globals.TripLogr.beaconName = FIELDS[i].getValue();
                break;

              case "beaconUUID":
                Alloy.Globals.TripLogr.beaconUUID = FIELDS[i].getValue();
                break;

              case "beaconMinor":
                Alloy.Globals.TripLogr.beaconMinor = FIELDS[i].getValue().replace("Minor: ", "");
                break;

              case "beaconMajor":
                Alloy.Globals.TripLogr.beaconMajor = FIELDS[i].getValue().replace("Major: ", "");
            }
        }
        YapDB.saveSettings(Alloy.Globals.TripLogr.username, Alloy.Globals.TripLogr.cloudBackupActive, Alloy.Globals.TripLogr.distanceMeasurement, Alloy.Globals.TripLogr.beaconActive, Alloy.Globals.TripLogr.beaconUUID, Alloy.Globals.TripLogr.beaconMajor, Alloy.Globals.TripLogr.beaconMinor, Alloy.Globals.TripLogr.beaconName, function(success) {
            Ti.API.info(success);
        });
        YapDB.fetchSettings(function(e) {
            Ti.API.info(e);
        });
        $.btnSave.title = "Settings Saved!";
        setTimeout(function() {
            $.btnSave.title = "Save";
        }, 750);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "Settings";
    var __parentSymbol = arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.Settings = Ti.UI.createWindow({
        barColor: "#fff",
        navTintColor: "#000",
        translucent: false,
        title: "Settings",
        id: "Settings"
    });
    $.__views.Settings && $.addTopLevelView($.__views.Settings);
    var __alloyId31 = [];
    $.__views.username = Alloy.createWidget("ti.ux.forms.row.text", "widget", {
        title: "",
        hintText: "Insert your name",
        icon: "fa-user",
        id: "username",
        __parentSymbol: __parentSymbol
    });
    $.__views.cloudBackup = Alloy.createWidget("ti.ux.forms.row.switch", "widget", {
        title: "  Cloud Backup",
        value: "true",
        icon: "fa-cloud",
        id: "cloudBackup",
        __parentSymbol: __parentSymbol
    });
    $.__views.optDistance = Alloy.createWidget("ti.ux.forms.row.optionspicker", "widget", {
        title: " Distance Measurement",
        value: "0",
        id: "optDistance",
        cancel: "2",
        options: "Miles|Kilometers|Cancel",
        icon: "fa-car",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId32 = Ti.UI.createTableViewSection({
        id: "__alloyId32"
    });
    __alloyId31.push($.__views.__alloyId32);
    $.__views.__alloyId33 = Ti.UI.createTableViewRow({
        height: "70",
        backgroundColor: "#fff",
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 16
        },
        selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
        id: "__alloyId33"
    });
    $.__views.__alloyId32.add($.__views.__alloyId33);
    $.__views.__alloyId34 = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.fontItalic,
            fontSize: "12dp"
        },
        color: "#333",
        text: "TripLogr can automatically backup your Trip data to the Cloud for free if you wish. Cloud backup is necessary if you want to generate PDF trip reports.",
        textAlign: "center",
        left: "10",
        right: "10",
        id: "__alloyId34"
    });
    $.__views.__alloyId33.add($.__views.__alloyId34);
    $.__views.username = Alloy.createWidget("ti.ux.forms.row.text", "widget", {
        title: "",
        hintText: "Insert your name",
        icon: "fa-user",
        id: "username",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId32.add($.__views.username.getViewEx({
        recurse: true
    }));
    $.__views.cloudBackup = Alloy.createWidget("ti.ux.forms.row.switch", "widget", {
        title: "  Cloud Backup",
        value: "true",
        icon: "fa-cloud",
        id: "cloudBackup",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId32.add($.__views.cloudBackup.getViewEx({
        recurse: true
    }));
    $.__views.optDistance = Alloy.createWidget("ti.ux.forms.row.optionspicker", "widget", {
        title: " Distance Measurement",
        value: "0",
        id: "optDistance",
        cancel: "2",
        options: "Miles|Kilometers|Cancel",
        icon: "fa-car",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId32.add($.__views.optDistance.getViewEx({
        recurse: true
    }));
    $.__views.beaconEnabled = Alloy.createWidget("ti.ux.forms.row.switch", "widget", {
        title: "  iBeacon Enabled",
        icon: "fa-bullseye",
        id: "beaconEnabled",
        __parentSymbol: __parentSymbol
    });
    $.__views.beaconName = Alloy.createWidget("ti.ux.forms.row.text", "widget", {
        title: "",
        hintText: "Beacon Identifer",
        icon: "fa-bold",
        id: "beaconName",
        __parentSymbol: __parentSymbol
    });
    $.__views.beaconUUID = Alloy.createWidget("ti.ux.forms.row.text", "widget", {
        title: "",
        hintText: "Beacon UUID",
        icon: "fa-tag",
        id: "beaconUUID",
        __parentSymbol: __parentSymbol
    });
    $.__views.beaconMajor = Alloy.createWidget("ti.ux.forms.row.text", "widget", {
        title: "",
        hintText: "Beacon Major",
        icon: "fa-circle-o",
        id: "beaconMajor",
        __parentSymbol: __parentSymbol
    });
    $.__views.beaconMinor = Alloy.createWidget("ti.ux.forms.row.text", "widget", {
        title: "",
        hintText: "Beacon Minor",
        icon: "fa-circle-thin",
        id: "beaconMinor",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId35 = Ti.UI.createTableViewSection({
        id: "__alloyId35"
    });
    __alloyId31.push($.__views.__alloyId35);
    $.__views.__alloyId36 = Ti.UI.createTableViewRow({
        height: "100",
        backgroundColor: "#fff",
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 16
        },
        selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
        id: "__alloyId36"
    });
    $.__views.__alloyId35.add($.__views.__alloyId36);
    $.__views.__alloyId37 = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.fontItalic,
            fontSize: "12dp"
        },
        color: "#333",
        text: "If you have a compatible iBeacon device, you can connect it to TripLogr for instant reminders before you set off on a journey.",
        textAlign: "center",
        left: "10",
        top: "30",
        right: "10",
        id: "__alloyId37"
    });
    $.__views.__alloyId36.add($.__views.__alloyId37);
    $.__views.beaconEnabled = Alloy.createWidget("ti.ux.forms.row.switch", "widget", {
        title: "  iBeacon Enabled",
        icon: "fa-bullseye",
        id: "beaconEnabled",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId35.add($.__views.beaconEnabled.getViewEx({
        recurse: true
    }));
    $.__views.beaconName = Alloy.createWidget("ti.ux.forms.row.text", "widget", {
        title: "",
        hintText: "Beacon Identifer",
        icon: "fa-bold",
        id: "beaconName",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId35.add($.__views.beaconName.getViewEx({
        recurse: true
    }));
    $.__views.beaconUUID = Alloy.createWidget("ti.ux.forms.row.text", "widget", {
        title: "",
        hintText: "Beacon UUID",
        icon: "fa-tag",
        id: "beaconUUID",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId35.add($.__views.beaconUUID.getViewEx({
        recurse: true
    }));
    $.__views.beaconMajor = Alloy.createWidget("ti.ux.forms.row.text", "widget", {
        title: "",
        hintText: "Beacon Major",
        icon: "fa-circle-o",
        id: "beaconMajor",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId35.add($.__views.beaconMajor.getViewEx({
        recurse: true
    }));
    $.__views.beaconMinor = Alloy.createWidget("ti.ux.forms.row.text", "widget", {
        title: "",
        hintText: "Beacon Minor",
        icon: "fa-circle-thin",
        id: "beaconMinor",
        __parentSymbol: __parentSymbol
    });
    $.__views.__alloyId35.add($.__views.beaconMinor.getViewEx({
        recurse: true
    }));
    $.__views.__alloyId38 = Ti.UI.createTableViewRow({
        height: "80",
        backgroundColor: "#fff",
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 16
        },
        selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
        id: "__alloyId38"
    });
    $.__views.__alloyId35.add($.__views.__alloyId38);
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
        id: "btnSave",
        title: "Save"
    });
    $.__views.__alloyId38.add($.__views.btnSave);
    $.__views.__alloyId30 = Ti.UI.createTableView({
        backgroundColor: "#fff",
        separatorStyle: Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
        data: __alloyId31,
        id: "__alloyId30"
    });
    $.__views.Settings.add($.__views.__alloyId30);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var YapDB = require("YapDB").YapDB;
    var TiBeacon = require("co.mobiledatasystems.tibeacon");
    false == Alloy.Globals.TripLogr.beaconActive ? TiBeacon.stopAllBeacons() : initBeacon();
    var FIELDS = [ $.username, $.cloudBackup, $.optDistance, $.beaconEnabled, $.beaconUUID, $.beaconMinor, $.beaconMajor, $.beaconName ];
    $.btnSave.addEventListener("click", validateAndSave);
    $.username.setValue(Alloy.Globals.TripLogr.username);
    $.cloudBackup.setValue(Alloy.Globals.TripLogr.cloudBackupActive);
    $.beaconEnabled.setValue(Alloy.Globals.TripLogr.beaconActive);
    $.optDistance.setValue(Alloy.Globals.TripLogr.distanceMeasurement);
    $.beaconUUID.setValue(Alloy.Globals.TripLogr.beaconUUID);
    $.beaconMajor.setValue("Major: " + Alloy.Globals.TripLogr.beaconMajor);
    $.beaconMinor.setValue("Minor: " + Alloy.Globals.TripLogr.beaconMinor);
    $.beaconName.setValue(Alloy.Globals.TripLogr.beaconName);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;