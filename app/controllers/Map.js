var args = arguments[0] || {};
var YapDB = require('YapDB').YapDB;
var CloudBackup = require('OpenShiftBackup').CloudBackup;

var mapbox = require('com.polancomedia.mapbox');
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST_FOR_NAVIGATION;
Titanium.Geolocation.distanceFilter = 10;
Ti.Geolocation.purpose = "This app requires your permission to access your vehicle location.";

var _points = [];
var startLat, startLng, endLat, endLng, tripId = "";
var mapView;
var tripStarted = false, now = new Date();

//
// GET CURRENT POSITION - THIS FIRES ONCE
//
Titanium.Geolocation.getCurrentPosition(function(e) {
    if (e.error) {
        alert('Sorry, but we cannot get your current location.');
        return;
    }
 
    var longitude = e.coords.longitude;
    var latitude = e.coords.latitude;
    var longitude = e.coords.longitude;
    var heading = e.coords.heading;
    var accuracy = e.coords.accuracy;
    var speed = e.coords.speed;
    var timestamp = e.coords.timestamp;
    var altitudeAccuracy = e.coords.altitudeAccuracy;
    
    startLat = latitude;
    startLng = longitude;
 
	//create the mapbox view 
	mapView = mapbox.createView({
	    map: Alloy.CFG.mapBoxKey,
	    minZoom: 0,
	    maxZoom: 18,
	    zoom: 16,
	    centerLatLng: [latitude, longitude+0.0035],
	    width: Ti.UI.FILL,
	    height: Ti.UI.FILL,
	    userLocation: true
	});
	
	$.container.add(mapView);
	mapView.addEventListener('tapOnAnnotation', function(e) {
		Ti.API.info(e);
	});
});

Titanium.Geolocation.addEventListener('location', function(e){
	if(e.coords && mapView && tripStarted){
		if(tripStarted){
			_points.push({
				latitude: e.coords.latitude,
				longitude: e.coords.longitude,
				speed: e.coords.speed
			});
			YapDB.createWaypoint(e.coords.latitude, e.coords.longitude, tripId, function(success){});
		}
		
		
		if(_points.length == 10 && tripStarted){
			appendRoute(_points);
			_points = _points.splice(0, 9); //removes all but the last item
		}
	}
});


function appendRoute(points){
  //more info on line width, join, dash length/phases, etc:
	//https://developer.apple.com/library/ios/documentation/GraphicsImaging/Reference/CAShapeLayer_class/Reference/Reference.html#//apple_ref/occ/instp/CAShapeLayer/lineDashPhase
	var ok = {
		title : 'TripLogr Journey',
		//fillColor : '#880000',
		//fillOpacity : ,
		lineWidth : 3,
		lineColor : '#000000',
		lineOpacity: 0.8,
		//lineDashLengths: [10, 7],
		//lineDashPhase: 2.0,
		//scaleLineDash: true,
		lineJoin: mapbox.LINE_JOIN_ROUND,
		points : points
	};

	Ti.API.info("Adding shape:" );
	Ti.API.info(points );
	mapView.addShape(ok);
	
	var distance = distanceBetweenTwoPoints(points[points.length-1].latitude, points[points.length-1].longitude, startLat, startLng );
}

function distanceBetweenTwoPoints(lat1, lon1, lat2, lon2) {
	  var R = 6371; // Radius of the earth in km
	  var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
	  var dLon = (lon2 - lon1) * Math.PI / 180;
	  var a =  0.5 - Math.cos(dLat)/2 + 
	     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
	     (1 - Math.cos(dLon))/2;
	
	  return R * 2 * Math.asin(Math.sqrt(a));
}

function finalizeTrip(obj){
	var odometer, purpose = "";		
	var distanceKM = obj.distanceKM;
	var endLat = obj.endLat;
	var endLng = obj.endLng;
	var distanceMeasured = 0;
	Ti.API.info('Total distance travelled in KM: ' + distanceKM);
	
	var measure = (Alloy.Globals.TripLogr.distanceMeasurement.toLowerCase() == 'miles') ? 'mi' : 'km';
	if (measure == 'mi') {
		distanceMeasured = (distanceKM * 0.62137).toFixed(2);
	} else {
		distanceMeasured = distanceKM.toFixed(2);
	}

	var dialog = Ti.UI.createAlertDialog({
		buttonNames : ['OK'],
		title : 'The total distance travelled was ' + distanceMeasured + measure + '. What was the purpose of this trip?',
		style : Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT
	});

	var dialogOdometer = Ti.UI.createAlertDialog({
		buttonNames : ['OK'],
		title : 'What is your current odometer reading?',
		style : Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT
	});

	dialog.addEventListener('click', function(dialogEvt) {
		Ti.API.info('dialog text: ' + dialogEvt.text);
		purpose = dialogEvt.text;
		dialogOdometer.show();
	});

	dialogOdometer.addEventListener('click', function(dialogEvt) {
		Ti.API.info('dialog text: ' + dialogEvt.text);
		odometer = dialogEvt.text;
		YapDB.updateTrip(tripId, purpose, odometer, distanceKM, function(success){
			 Ti.App.fireEvent('getTripListings');
			 mapView.removeAllAnnotations();
			 
			 //attempt to backup this to cloud
			 var backupParams = {
			 		startLat: startLat,
			 		startLng: startLng,
			 		endLat: endLat,
			 		endLng: endLng,
			 		purpose: purpose,
			 		distance: distanceKM,
			 		odometerEnd: odometer,
			 		tripDate: now,
			 		tripId: tripId
			 };
			 CloudBackup.backupTrip(Alloy.Globals.userId, backupParams, function(backupSuccess){
			 		YapDB.updateTripCloudFlag(tripId, function(flagSuccess){
			 			 Ti.API.info(flagSuccess);
			 		});
			 });
		});		
	});

	dialog.show(); 
}

Ti.App.addEventListener('finalizeTrip', finalizeTrip);

function sortTripData(a,b) {
  if (a.date < b.date)
     return -1;
  if (a.date > b.date)
    return 1;
  return 0;
}

function startTrip(e){
	if(tripStarted) { 
		e.source.title = 'Start Trip';
		tripStarted = false;
		var distanceKM = 0;
		
		var wayPoints = YapDB.fetchWaypoints(tripId, function(results){		
			results.sort(sortTripData);
			
			mapView.setAnnotation({
			    latitude: results[results.length-1].latitude,
			    longitude: results[results.length-1].longitude,
			    title: 'End point'
			});
			
			var lat1 = 0, lon1 = 0;
			for(var i = 0; i < results.length; i++) {
				if(lat1 == 0){
					lat1 = results[i].latitude;
					lon1 = results[i].longitude;
				}
				else {
					Ti.API.info( distanceBetweenTwoPoints(lat1, lon1, results[i].latitude, results[i].longitude));
					distanceKM = distanceKM + distanceBetweenTwoPoints(lat1, lon1, results[i].latitude, results[i].longitude);
					lat1 = 0;
					lon1 = 0;
				}
			}
			
			Ti.App.fireEvent('finalizeTrip', {distanceKM: distanceKM, endLat: results[results.length-1].latitude, endLng:  results[results.length-1].longitude});
		});
		
	}
	else{		
		Titanium.Geolocation.getCurrentPosition(function(es) {
		    if (es.error) {
		        alert('Sorry, but we cannot get your current location.');
		        return;
		    }
		 
		    startLat = es.coords.latitude;
		    startLng = es.coords.longitude;
		    
			tripStarted = true;
			tripId = Math.floor((Math.random() * 10000000) + 1);
			YapDB.createTrip(tripId, function(success){});
				
			_points = [];
			_points.push({
					longitude : startLng,
					latitude : startLat,
					speed: es.coords.speed
			});
	
			mapView.centerLatLng = [es.coords.latitude, es.coords.longitude+0.0035];
			
			mapView.setAnnotation({
			    latitude: startLat,
			    longitude: startLng,
			    title: 'Starting point'
			});
		});

		e.source.title = 'Stop Trip';
		now = new Date();
	}
}

function openManualEntry(){
	var modal = Alloy.createController('ManulEntry');
	modal.getView().open({
		modal:true
	});
}

//finally,
$.container.open();