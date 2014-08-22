function Controller() {
    function appendRoute(points) {
        var ok = {
            title: "TripLogr Journey",
            lineWidth: 5,
            lineColor: "#000000",
            lineOpacity: .8,
            lineJoin: mapbox.LINE_JOIN_ROUND,
            points: points
        };
        Ti.API.info("Adding shape:");
        Ti.API.info(points);
        mapView.addShape(ok);
        distanceBetweenTwoPoints(points[points.length - 1].latitude, points[points.length - 1].longitude, startLat, startLng);
    }
    function distanceBetweenTwoPoints(lat1, lon1, lat2, lon2) {
        var R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = .5 - Math.cos(dLat) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos(dLon)) / 2;
        return 2 * R * Math.asin(Math.sqrt(a));
    }
    function finalizeTrip(obj) {
        var odometer, purpose = "";
        var distanceKM = obj.distanceKM;
        var distanceMeasured = 0;
        Ti.API.info("Total distance travelled in KM: " + distanceKM);
        var measure = "miles" == Alloy.Globals.TripLogr.distanceMeasurement.toLowerCase() ? "mi" : "km";
        distanceMeasured = "mi" == measure ? (.62137 * distanceKM).toFixed(2) : distanceKM.toFixed(2);
        var dialog = Ti.UI.createAlertDialog({
            buttonNames: [ "OK" ],
            title: "The total distance travelled was " + distanceMeasured + measure + ". What was the purpose of this trip?",
            style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT
        });
        var dialogOdometer = Ti.UI.createAlertDialog({
            buttonNames: [ "OK" ],
            title: "What is your current odometer reading?",
            style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT
        });
        dialog.addEventListener("click", function(dialogEvt) {
            Ti.API.info("dialog text: " + dialogEvt.text);
            purpose = dialogEvt.text;
            dialogOdometer.show();
        });
        dialogOdometer.addEventListener("click", function(dialogEvt) {
            Ti.API.info("dialog text: " + dialogEvt.text);
            odometer = dialogEvt.text;
            YapDB.updateTrip(tripId, purpose, odometer, distanceKM, function() {
                Ti.App.fireEvent("getTripListings");
                mapView.removeAllAnnotations();
            });
        });
        dialog.show();
    }
    function sortTripData(a, b) {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
    }
    function startTrip(e) {
        if (tripStarted) {
            e.source.title = "Start Trip";
            tripStarted = false;
            var distanceKM = 0;
            YapDB.fetchWaypoints(tripId, function(results) {
                results.sort(sortTripData);
                mapView.setAnnotation({
                    latitude: results[results.length - 1].latitude,
                    longitude: results[results.length - 1].longitude,
                    title: "End point"
                });
                var lat1 = 0, lon1 = 0;
                for (var i = 0; results.length > i; i++) if (0 == lat1) {
                    lat1 = results[i].latitude;
                    lon1 = results[i].longitude;
                } else {
                    Ti.API.info(distanceBetweenTwoPoints(lat1, lon1, results[i].latitude, results[i].longitude));
                    distanceKM += distanceBetweenTwoPoints(lat1, lon1, results[i].latitude, results[i].longitude);
                    lat1 = 0;
                    lon1 = 0;
                }
                Ti.App.fireEvent("finalizeTrip", {
                    distanceKM: distanceKM
                });
            });
        } else {
            Titanium.Geolocation.getCurrentPosition(function(es) {
                if (es.error) {
                    alert("Sorry, but we cannot get your current location.");
                    return;
                }
                startLat = es.coords.latitude;
                startLng = es.coords.longitude;
                tripStarted = true;
                tripId = Math.floor(1e7 * Math.random() + 1);
                YapDB.createTrip(tripId, function() {});
                _points = [];
                _points.push({
                    longitude: startLng,
                    latitude: startLat,
                    speed: es.coords.speed
                });
                mapView.setAnnotation({
                    latitude: startLat,
                    longitude: startLng,
                    title: "Starting point"
                });
            });
            e.source.title = "Stop Trip";
            now = new Date();
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "Map";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.container = Ti.UI.createWindow({
        barColor: "#fff",
        navTintColor: "#000",
        translucent: false,
        title: "TripLogr",
        id: "container"
    });
    $.__views.container && $.addTopLevelView($.__views.container);
    $.__views.__alloyId17 = Ti.UI.createButton({
        title: "Start Trip",
        id: "__alloyId17"
    });
    startTrip ? $.__views.__alloyId17.addEventListener("click", startTrip) : __defers["$.__views.__alloyId17!click!startTrip"] = true;
    $.__views.container.rightNavButton = $.__views.__alloyId17;
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var YapDB = require("YapDB").YapDB;
    var mapbox = require("com.polancomedia.mapbox");
    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST_FOR_NAVIGATION;
    Titanium.Geolocation.distanceFilter = 10;
    Ti.Geolocation.purpose = "This app requires your permission to access your vehicle location.";
    var _points = [];
    var startLat, startLng, tripId = "";
    var mapView;
    var tripStarted = false, now = new Date();
    Titanium.Geolocation.getCurrentPosition(function(e) {
        if (e.error) {
            alert("Sorry, but we cannot get your current location.");
            return;
        }
        var longitude = e.coords.longitude;
        var latitude = e.coords.latitude;
        var longitude = e.coords.longitude;
        e.coords.heading;
        e.coords.accuracy;
        e.coords.speed;
        e.coords.timestamp;
        e.coords.altitudeAccuracy;
        startLat = latitude;
        startLng = longitude;
        mapView = mapbox.createView({
            map: "tipsyandtumbler.j120dbcf",
            minZoom: 0,
            maxZoom: 18,
            zoom: 16,
            centerLatLng: [ latitude, longitude + .0035 ],
            width: Ti.UI.FILL,
            height: Ti.UI.FILL,
            userLocation: true
        });
        $.container.add(mapView);
        mapView.addEventListener("tapOnAnnotation", function(e) {
            Ti.API.info(e);
        });
    });
    Titanium.Geolocation.addEventListener("location", function(e) {
        if (e.coords && mapView && tripStarted) {
            if (tripStarted) {
                _points.push({
                    latitude: e.coords.latitude,
                    longitude: e.coords.longitude,
                    speed: e.coords.speed
                });
                YapDB.createWaypoint(e.coords.latitude, e.coords.longitude, tripId, function() {});
            }
            if (10 == _points.length && tripStarted) {
                appendRoute(_points);
                _points = _points.splice(0, 9);
                mapView.centerLatLng = [ e.coords.latitude, e.coords.longitude + .005 ];
            }
        }
    });
    Ti.App.addEventListener("finalizeTrip", finalizeTrip);
    $.container.open();
    __defers["$.__views.__alloyId17!click!startTrip"] && $.__views.__alloyId17.addEventListener("click", startTrip);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;