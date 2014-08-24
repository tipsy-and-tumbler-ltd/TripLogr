/*
 *  Module: TiDZYapDatabase
 *  ID:     com.dezinezync.dzyapdatabase
 *  Author: Nikhil Nigade (@dezinezync)
 *  2014 Nikhil Nigade © All Rights Reserved
 *  Licensed under the MIT License. Check License file for more information.
 * 
 *  Download from: https://github.com/dezinezync/TiDZYapDatabase
 */
var db = require('com.dezinezync.dzyapdatabase');

/*
 *  Wrapper implementation
 *  Author: Boydlee Pollentine
 */
var YapDB = {
	
	 createUserId: function(){
	 	Alloy.Globals.userId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 12);
	 	db.setInCollection("1" ,"user", {"id": Alloy.Globals.userId }, function(success) {    
			    console.log("Set", success);
		});
	 },
	 
	  getUserId: function(callback){	
	  	    if(Alloy.Globals.userId && Alloy.Globals.userId != null && Alloy.Globals.userId != ""){
	  	    	callback({id: Alloy.Globals.userId});
	  	    	return Alloy.Globals.userId;	  	    	
	  	    }  	
	  	    else {
				db.getAllFromCollection("user", function(results) {
					var _id = null;
					if(results.obj && results.obj.length > 0){
						_id = results.obj[0].id;
						Alloy.Globals.userId = _id;
					}
				   callback({id:_id});
				});
			}
	  },
	
	  fetchAllTrips: function(callback){
			db.getAllFromCollection("trips", function(results) {
			   //console.log("GetAllFromCollection", results);
			   callback(results.obj);
			});
	  },
	  
	  fetchTrip: function(id, callback){	  	
			db.getFromCollection("trip:"+id,"trips", function(result) {                  
			    //console.log("GetFromCollection",result);  
			    callback(result.obj);               
			});
	  },
	  
	  createTrip: function(_id, callback){  	
			db.setInCollection("trip:"+_id, "trips", {"id": _id, "date": new Date(), "purpose": "Trip in progress...", "odometer_start": 0, "odometer_end": 0, "total_kilometers": 0, "cloud": false}, function(success) {    
			    //console.log("Set", success);
			    callback(success);
			});
	  },
	  
	  updateTripCloudFlag: function(_id, callback){
	  		db.setNXInCollection("trip:"+_id, "trips", {"cloud": true}, function(success) {
	  			 callback(success);
	  		});
	  },
	  
	  updateTrip: function(_id, purpose, odo_end, km, callback){  	
	  	    var distance = (Alloy.Globals.TripLogr.distanceMeasurement.toLowerCase == 'miles') ? Math.floor(km * 0.62137) : km;
	  	    var odo_start = Math.floor(odo_end) - distance;
	  	    odo_end = Math.floor(odo_end);
	  	    odo_start = Math.floor(odo_start);

			db.setInCollection("trip:"+_id, "trips", {"id": _id, "date": new Date(), "purpose": purpose, "odometer_start": odo_start, "odometer_end":odo_end, "total_kilometers": km, "cloud": false}, function(success) {    
			   // console.log("Set", success);
			    callback(success);
			});
	  },

	  createWaypoint: function(latitude, longitude, trip_id, callback){  	
			db.setInCollection("waypoint:"+ Math.floor((Math.random() * 10000000) + 1), "waypoints", { "date": new Date(), "latitude": latitude, "longitude": longitude, "trip_id":trip_id}, function(success) {    
			    //console.log("Set", success);
			    callback(success);
			});
	  },
	  
	  
	  fetchWaypoints: function(trip_id, callback){	  	
			db.getAllFromCollection("waypoints", function(result) {        
				var waypoints = [];          
			    for(var i = 0; i < result.obj.length; i++){
			    	if(result.obj[i].trip_id == trip_id){
			    		waypoints.push(result.obj[i]);
			    	}
			    }
			    
			    callback(waypoints);               
			});
	  },
	  
	  saveSettings: function(name, cloudBackup, distance, beaconEnabled, beaconUUID, major, minor, beaconName, callback){  	
			db.setInCollection("1" ,"settings", {"lastUpdated": new Date(), "name": name, "cloudBackup": cloudBackup, "distance":distance, "beaconEnabled":beaconEnabled, "beaconUUID": beaconUUID, "beaconName":beaconName, "major":major, "minor": minor}, function(success) {    
			    //console.log("Set", success);
			    callback(success);
			});
	  },
	  
	  fetchSettings: function(callback){	  	
			db.getAllFromCollection("settings", function(results) {
			   //console.log("GetAllFromCollection", results);
			   callback(results.obj);
			});
	  },
	  
	  clearDatabase: function(){
	  		db.removeAllFromAllCollections();
	  }
	
};

exports.YapDB = YapDB;