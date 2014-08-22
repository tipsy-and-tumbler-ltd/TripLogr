//require modules
var YapDB = require('YapDB').YapDB;
var TiBeacon = require('co.mobiledatasystems.tibeacon');


function initBeacon() {
	TiBeacon.initializeBeaconMonitoring({
		success:function(e){
			//called when we have successfully registered the core location services
			Ti.API.info('success: ' + JSON.stringify(e));
			beaconsRegistered();
		},
		error:function(e){
			//called when we have failed to register the core location services
			Ti.API.error(JSON.stringify(e));
			alert("This device doesn't support iBeacons");
		},
		region:function(e){
			//called when we detect a beacon region has been entered or when we have left (i.e. no more beacons can be seen belonging to the region)
			Ti.API.info('region changed event: ' + JSON.stringify(e));
			
			//we can use the convenience method to trigger a local notification...even if the app isn't running!
			//we can test for 'entered' or 'exited'
			if(e.proximity === 'Immediate' || e.proximity === 'Near'){
				TiBeacon.sendLocalNotification({
					message: "Looks like you might be ready for a new journey! Tap to start logging with TripLogr.",
					sound:  '/sounds/honk.mp3'
				});
			}
		},
		ranged:function(e){
			//when the app is in foreground, this is fired every second or so and reports all the beacons in range
			Ti.API.info('region ranged event: ' + JSON.stringify(e));
		},
		change:function(e){
			//called when a new beacon becomes the nearest one
			Ti.API.info('change event: ' + JSON.stringify(e));
			if((e.proximity === 'Immediate' ||e.proximity === 'Near' )){
				TiBeacon.sendLocalNotification({
					message: "Looks like you might be ready for a new journey! Tap to start logging with TripLogr.",
					sound:  '/sounds/honk.mp3'
				});
			}
		}	
	});
}


if(Alloy.Globals.TripLogr.beaconActive == false) {
	//stop monitoring all regions
	TiBeacon.stopAllBeacons();
}
else {
	initBeacon();
}


function beaconsRegistered(){
	//we are using the default uuid used by estimote beacons here...
	TiBeacon.startMonitoringBeaconRegion({
	    identifier: Alloy.Globals.TripLogr.beaconName,
	    uuid: Alloy.Globals.TripLogr.beaconUUID,
	    major: Alloy.Globals.TripLogr.beaconMajor ,
	    minor: Alloy.Globals.TripLogr.beaconMinor ,
	    notifyEntryStateOnDisplay:true,
		keepRanging:true //tells the module to keep on ranging even if no beacons are in a region, this improves performance at the expense of power consumption
	});
}


var FIELDS = [
	$.username,
	$.cloudBackup,
	$.optDistance,
	$.beaconEnabled,
	$.beaconUUID,
	$.beaconMinor,
	$.beaconMajor,
	$.beaconName
];

function validateAndSave(){
	var values = {};
	for(var i = 0, j = FIELDS.length; i< j; i++){
		Ti.API.info('field: ' + FIELDS[i].id + ', value: ' + FIELDS[i].getValue()); 
		switch(FIELDS[i].id){
			case "username": 
				Alloy.Globals.TripLogr.username = FIELDS[i].getValue();
				break;
			case "cloudBackup": 
				Alloy.Globals.TripLogr.cloudBackupActive = FIELDS[i].getValue();
				break;
			case "optDistance": 
				Alloy.Globals.TripLogr.distanceMeasurement = (FIELDS[i].getValue() == 0) ? 'Miles' : 'Kilometers';
				break;
			case "beaconEnabled": 
				Alloy.Globals.TripLogr.beaconActive = FIELDS[i].getValue();
				if(Alloy.Globals.TripLogr.beaconActive == false){
					TiBeacon.stopAllBeacons();
				}
				else {
					initBeacon();
				}
				break;
			case "beaconName": 
				Alloy.Globals.TripLogr.beaconName = FIELDS[i].getValue();
				break;	
			case "beaconUUID": 
				Alloy.Globals.TripLogr.beaconUUID = FIELDS[i].getValue();
				break;
			case "beaconMinor": 
				Alloy.Globals.TripLogr.beaconMinor = FIELDS[i].getValue().replace("Minor: ","");
				break;
			case "beaconMajor": 
				Alloy.Globals.TripLogr.beaconMajor = FIELDS[i].getValue().replace("Major: ","");
				break;					
		}
	}
	
	 YapDB.saveSettings(Alloy.Globals.TripLogr.username, Alloy.Globals.TripLogr.cloudBackupActive, Alloy.Globals.TripLogr.distanceMeasurement, 
	 								  Alloy.Globals.TripLogr.beaconActive, Alloy.Globals.TripLogr.beaconUUID, Alloy.Globals.TripLogr.beaconMajor, Alloy.Globals.TripLogr.beaconMinor, Alloy.Globals.TripLogr.beaconName, 
	 								 function(success){ Ti.API.info(success); });  	
	 								 
	 YapDB.fetchSettings(function(e){Ti.API.info(e);});
	 
	 $.btnSave.title = 'Settings Saved!';
	 setTimeout(function(vT){
	 	$.btnSave.title = 'Save';
	 }, 750);
}

$.btnSave.addEventListener('click', validateAndSave);

//finally, set the fields to current values as stored in globals and the YapDB
$.username.setValue(Alloy.Globals.TripLogr.username);
$.cloudBackup.setValue(Alloy.Globals.TripLogr.cloudBackupActive);
$.beaconEnabled.setValue(Alloy.Globals.TripLogr.beaconActive);
$.optDistance.setValue(Alloy.Globals.TripLogr.distanceMeasurement);
$.beaconUUID.setValue(Alloy.Globals.TripLogr.beaconUUID);
$.beaconMajor.setValue('Major: ' + Alloy.Globals.TripLogr.beaconMajor);
$.beaconMinor.setValue('Minor: ' + Alloy.Globals.TripLogr.beaconMinor);
$.beaconName.setValue(Alloy.Globals.TripLogr.beaconName);
