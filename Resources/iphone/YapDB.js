var db = require("com.dezinezync.dzyapdatabase");

var YapDB = {
    createUserId: function() {
        Alloy.Globals.userId = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 12);
        db.setInCollection("1", "user", {
            id: Alloy.Globals.userId
        }, function(success) {
            console.log("Set", success);
        });
    },
    getUserId: function(callback) {
        if (Alloy.Globals.userId && null != Alloy.Globals.userId && "" != Alloy.Globals.userId) {
            callback({
                id: Alloy.Globals.userId
            });
            return Alloy.Globals.userId;
        }
        db.getAllFromCollection("user", function(results) {
            var _id = null;
            results.obj && results.obj.length > 0 && (_id = results.obj[0].id);
            callback({
                id: _id
            });
        });
    },
    fetchAllTrips: function(callback) {
        db.getAllFromCollection("trips", function(results) {
            callback(results.obj);
        });
    },
    fetchTrip: function(id, callback) {
        db.getFromCollection("trip:" + id, "trips", function(result) {
            callback(result.obj);
        });
    },
    createTrip: function(_id, callback) {
        db.setInCollection("trip:" + _id, "trips", {
            id: _id,
            date: new Date(),
            purpose: "Trip in progress...",
            odometer_start: 0,
            odometer_end: 0,
            total_kilometers: 0
        }, function(success) {
            callback(success);
        });
    },
    updateTrip: function(_id, purpose, odo_end, km, callback) {
        var distance = "miles" == Alloy.Globals.TripLogr.distanceMeasurement.toLowerCase ? Math.floor(.62137 * km) : km;
        var odo_start = Math.floor(odo_end) - distance;
        odo_end = Math.floor(odo_end);
        odo_start = Math.floor(odo_start);
        db.setInCollection("trip:" + _id, "trips", {
            id: _id,
            date: new Date(),
            purpose: purpose,
            odometer_start: odo_start,
            odometer_end: odo_end,
            total_kilometers: km
        }, function(success) {
            callback(success);
        });
    },
    createWaypoint: function(latitude, longitude, trip_id, callback) {
        db.setInCollection("waypoint:" + Math.floor(1e7 * Math.random() + 1), "waypoints", {
            date: new Date(),
            latitude: latitude,
            longitude: longitude,
            trip_id: trip_id
        }, function(success) {
            callback(success);
        });
    },
    fetchWaypoints: function(trip_id, callback) {
        db.getAllFromCollection("waypoints", function(result) {
            var waypoints = [];
            for (var i = 0; result.obj.length > i; i++) result.obj[i].trip_id == trip_id && waypoints.push(result.obj[i]);
            callback(waypoints);
        });
    },
    saveSettings: function(name, cloudBackup, distance, beaconEnabled, beaconUUID, major, minor, beaconName, callback) {
        db.setInCollection("1", "settings", {
            lastUpdated: new Date(),
            name: name,
            cloudBackup: cloudBackup,
            distance: distance,
            beaconEnabled: beaconEnabled,
            beaconUUID: beaconUUID,
            beaconName: beaconName,
            major: major,
            minor: minor
        }, function(success) {
            callback(success);
        });
    },
    fetchSettings: function(callback) {
        db.getAllFromCollection("settings", function(results) {
            callback(results.obj);
        });
    },
    clearDatabase: function() {
        db.removeAllFromAllCollections();
    }
};

exports.YapDB = YapDB;