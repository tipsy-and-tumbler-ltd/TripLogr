//setup the tabbed windows
Ti.UI.backgroundColor = "#fff";

//check for settings, insert default ones if none exist
var YapDB = require('YapDB').YapDB;
YapDB.fetchSettings(function(e){
	if(!e || e.length == 0)  {		
		 YapDB.saveSettings(Alloy.Globals.TripLogr.username, Alloy.Globals.TripLogr.cloudBackupActive, Alloy.Globals.TripLogr.distanceMeasurement, 
	 								      Alloy.Globals.TripLogr.beaconActive, Alloy.Globals.TripLogr.beaconUUID, Alloy.Globals.TripLogr.beaconMajor, Alloy.Globals.TripLogr.beaconMinor,Alloy.Globals.TripLogr.beaconName, 
	 								      function(success){ Ti.API.info(success); });  	
	}
	else {
		Alloy.Globals.TripLogr.username = e[0].name; 
		Alloy.Globals.TripLogr.cloudBackupActive = e[0].cloudBackup;
		Alloy.Globals.TripLogr.distanceMeasurement = e[0].distance;
		Alloy.Globals.TripLogr.beaconActive = e[0].beaconEnabled;
		Alloy.Globals.TripLogr.beaconUUID = e[0].beaconUUID;
		Alloy.Globals.TripLogr.beaconName = e[0].beaconName;
		Alloy.Globals.TripLogr.beaconMajor = e[0].major;
		Alloy.Globals.TripLogr.beaconMinor = e[0].minor;
	}
});

YapDB.getUserId(function(e){
	Ti.API.info(e);
	if(e.id == undefined || e.id == null){
		YapDB.createUserId();
	}
});

var mapWindow = Alloy.createController('Trips').getView();
$.index.tabs[0].setWindow(mapWindow);

var mapWindow = Alloy.createController('Map').getView();
$.index.tabs[1].setWindow(mapWindow);

var settingsWindow = Alloy.createController('Settings').getView();
$.index.tabs[2].setWindow(settingsWindow);

$.index.open();