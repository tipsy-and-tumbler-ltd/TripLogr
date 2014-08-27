var args = arguments[0] || {};
var YapDB = require('YapDB').YapDB;
var CloudBackup = require('OpenShiftBackup').CloudBackup;

function closeWindow() {
	Ti.App.fireEvent('refreshTrips');
	$.win.close();
}

function saveTrip(){
	var tripId = Math.floor((Math.random() * 10000000) + 1);
    YapDB.createTrip(tripId, function(success){});
    
    var tripDate = $.tripDate.getValue();
	var odometer = $.odoend.getValue();
	var purpose = $.purpose.getValue();
			 
	 var distanceKM = $.distance.getValue();
	 if(Alloy.Globals.TripLogr.distanceMeasurement.toLowerCase() == 'miles'){
		distanceMeasured = (distanceKM * 1.609344).toFixed(2);
	 }
			 	 
				
	YapDB.updateManualTrip(tripId, tripDate, purpose, odometer, distanceKM, function(success){		
			 //attempt to backup this to cloud
			 var backupParams = {
			 		startLat: 0,
			 		startLng: 0,
			 		endLat: 0,
			 		endLng: 0,
			 		purpose: purpose,
			 		distance: distanceKM,
			 		odometerEnd: odometer,
			 		tripDate: tripDate,
			 		tripId: tripId
			 };
			 CloudBackup.backupTrip(Alloy.Globals.userId, backupParams, function(backupSuccess){
			 		YapDB.updateTripCloudFlag(tripId, function(flagSuccess){
			 			 Ti.API.info(flagSuccess);
			 		});
			 });
			 
		});		
		
			
	  var dialog = 	Ti.UI.createAlertDialog({
			title: "Trip saved!",
			message: 'Your new trip has been saved to the database and backed up to the cloud (assuming you have Cloud Backup enabled).',
			buttonNames: ["OK"]
		});
		
		dialog.addEventListener('click', closeWindow);
		dialog.show();
}



$.btnSave.addEventListener('click', saveTrip);