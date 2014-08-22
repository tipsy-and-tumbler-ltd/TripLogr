// This is a test harness for your module
// You should do something interesting in this harness 
// to test out the module and to provide instructions 
// to users on how to use it by example.


// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});
var label = Ti.UI.createLabel();
win.add(label);
win.open();


var TiBeacon = require('co.mobiledatasystems.tibeacon');
Ti.API.info("module is => " + TiBeacon);


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
		if(e.status === 'entered' && e.identifier === 'all'){
			beacons.sendLocalNotification({
				message:'Hello from the beacon demo',
				sound:'/sounds/siren.mp3'
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
	}	
});

//stop monitoring for a specific region
TiBeacon.stopMonitoringBeaconRegion({
	identifier:'all'
});

//stop monitoring all regions
TiBeacon.stopAllBeacons();


function beaconsRegistered(){
	//you can call this function several times, to initialise several different regions as follows...
	
	//we are using the default uuid used by estimote beacons here...
	beacons.startMonitoringBeaconRegion({
		uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
		identifier:'all', //a logical name that is returned when beacons fire events so we can easily identify which region they belong to
		notifyEntryStateOnDisplay:true,
		keepRanging:true //tells the module to keep on ranging even if no beacons are in a region, this improves performance at the expense of power consumption
	});
	
	beacons.startMonitoringBeaconRegion({
		uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
		major:1,
		identifier:'major region 1',
		notifyEntryStateOnDisplay:true,
		keepRanging:true
	});
	
	beacons.startMonitoringBeaconRegion({
		uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
		major:1,
		minor:1,
		identifier:'major region 1, minor region 1',
		notifyEntryStateOnDisplay:true,
		keepRanging:true
	});
}

/*
 * typical response

 [{
 	"major":"49914",
 	"id":"0",
 	"minor":"64314",
 	"proximity":"Near",
 	"identifier":"all",
 	"rssi":"-76",
 	"accuracy":"1.303560",
 	"uuid":"B9407F30-F5F8-466E-AFF9-25556B57FE6D"
 },
 {
 	"major":"49914",
 	"id":"0",
 	"minor":"64319",
 	"proximity":"Far",
 	"identifier":"all",
 	"rssi":"-92",
 	"accuracy":"8.994594,
 	"uuid":"B9407F30-F5F8-466E-AFF9-25556B57FE6D"
 }]
*/

