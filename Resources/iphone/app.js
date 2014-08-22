var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.TripLogr = {
    username: "",
    beaconActive: false,
    beaconMinor: "",
    beaconMajor: "",
    beaconName: "",
    beaconUUID: "",
    cloudBackupActive: true,
    distanceMeasurement: "Miles"
};

Alloy.createController("index");