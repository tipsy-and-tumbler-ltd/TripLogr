var args = arguments[0] || {};
var YapDB = require('YapDB').YapDB;
var CloudBackup = require('OpenShiftBackup').CloudBackup;

function closeWindow() {
	$.win.close();
}

function saveTrip(){
	var tripId = Math.floor((Math.random() * 10000000) + 1);
    YapDB.createTrip(tripId, function(success){});
	
				
				
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
}
