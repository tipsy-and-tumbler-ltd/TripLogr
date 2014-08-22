function notify(message) {
    Ti.App.iOS.scheduleLocalNotification({
        alertBody: message,
        alertAction: "OK",
        userInfo: {
            example: "e.identifier"
        },
        date: new Date(new Date().getTime() + 5)
    });
}

function enterRegion(e) {
    Ti.API.info(e);
    notify("enterRegion: " + e.identifier, e);
}

function exitRegion(e) {
    Ti.API.info(e);
    notify("exitRegion: " + e.identifier, e);
}

function regionState(e) {
    Ti.API.info(e);
    "inside" == e.regionState && notify("inside region: " + e.identifier, e);
}

function stopService() {
    TiBeacons.removeEventListener("enteredRegion", enterRegion);
    TiBeacons.removeEventListener("exitedRegion", exitRegion);
    TiBeacons.removeEventListener("determinedRegionState", regionState);
    TiBeacons.stopMonitoringAllRegions();
}

var TiBeacons = require("org.beuckman.tibeacons");

TiBeacons.disableAutoRanging();

var uuid = "DB4986CF-2009-4295-92CE-C3F75CF07D2E", purpose = "To monitor when you are inside your vehicle, ready to take a journey!", sound = "/sounds/honk.mp3", identifier = "TripLogr Beacon";

Ti.App.currentService.addEventListener("stop", stopService);

TiBeacons.addEventListener("enteredRegion", enterRegion);

TiBeacons.addEventListener("exitedRegion", exitRegion);

TiBeacons.addEventListener("determinedRegionState", regionState);

TiBeacons.startMonitoringForRegion({
    uuid: uuid,
    identifier: identifier,
    major: 1234,
    minor: 1233
});