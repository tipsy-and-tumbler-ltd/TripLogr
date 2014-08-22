function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __alloyId41 = [];
    $.__views.__alloyId43 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        barColor: "#fff",
        navTintColor: "#000",
        translucent: false,
        title: "Tab 1",
        id: "__alloyId43"
    });
    $.__views.__alloyId42 = Ti.UI.createTab({
        window: $.__views.__alloyId43,
        title: "Trips",
        icon: "images/Map_Path.png",
        id: "__alloyId42"
    });
    __alloyId41.push($.__views.__alloyId42);
    $.__views.__alloyId45 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        barColor: "#fff",
        navTintColor: "#000",
        translucent: false,
        title: "Tab 2",
        id: "__alloyId45"
    });
    $.__views.__alloyId44 = Ti.UI.createTab({
        window: $.__views.__alloyId45,
        title: "Journey",
        icon: "images/Near_Me.png",
        id: "__alloyId44"
    });
    __alloyId41.push($.__views.__alloyId44);
    $.__views.__alloyId47 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        barColor: "#fff",
        navTintColor: "#000",
        translucent: false,
        title: "Settings",
        id: "__alloyId47"
    });
    $.__views.__alloyId46 = Ti.UI.createTab({
        window: $.__views.__alloyId47,
        title: "Settings",
        icon: "images/Network_Closed.png",
        id: "__alloyId46"
    });
    __alloyId41.push($.__views.__alloyId46);
    $.__views.index = Ti.UI.createTabGroup({
        tabsBackgroundColor: "#fff",
        tintColor: "#000",
        tabsBackgroundDisabledColor: "#fff",
        tabs: __alloyId41,
        activeTab: "1",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Ti.UI.backgroundColor = "#fff";
    var YapDB = require("YapDB").YapDB;
    YapDB.fetchSettings(function(e) {
        if (e && 0 != e.length) {
            Alloy.Globals.TripLogr.username = e[0].name;
            Alloy.Globals.TripLogr.cloudBackupActive = e[0].cloudBackup;
            Alloy.Globals.TripLogr.distanceMeasurement = e[0].distance;
            Alloy.Globals.TripLogr.beaconActive = e[0].beaconEnabled;
            Alloy.Globals.TripLogr.beaconUUID = e[0].beaconUUID;
            Alloy.Globals.TripLogr.beaconName = e[0].beaconName;
            Alloy.Globals.TripLogr.beaconMajor = e[0].major;
            Alloy.Globals.TripLogr.beaconMinor = e[0].minor;
        } else YapDB.saveSettings(Alloy.Globals.TripLogr.username, Alloy.Globals.TripLogr.cloudBackupActive, Alloy.Globals.TripLogr.distanceMeasurement, Alloy.Globals.TripLogr.beaconActive, Alloy.Globals.TripLogr.beaconUUID, Alloy.Globals.TripLogr.beaconMajor, Alloy.Globals.TripLogr.beaconMinor, Alloy.Globals.TripLogr.beaconName, function(success) {
            Ti.API.info(success);
        });
    });
    YapDB.getUserId(function(e) {
        Ti.API.info(e);
        (void 0 == e.id || null == e.id) && YapDB.createUserId();
    });
    var mapWindow = Alloy.createController("Trips").getView();
    $.index.tabs[0].setWindow(mapWindow);
    var mapWindow = Alloy.createController("Map").getView();
    $.index.tabs[1].setWindow(mapWindow);
    var settingsWindow = Alloy.createController("Settings").getView();
    $.index.tabs[2].setWindow(settingsWindow);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;