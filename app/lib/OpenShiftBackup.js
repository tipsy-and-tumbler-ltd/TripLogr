
/*
 *  Wrapper implementation for an Openshift / Mongo / Node.js backup tool
 *  Author: Boydlee Pollentine
 */
var CloudBackup = {

	httpRequest : function(url, props, method, success, error){
		var client = Ti.Network.createHTTPClient({
	        timeout: 30000
	    });
	    
	    client.onerror = function(e) {
	    	error(e);
	    };
	    
	    client.onload = function() {
	    	var json = JSON.parse(this.responseText);
	    	success(json);
	    };
	    	    
	    client.open(method, url);
	    client.setRequestHeader("content-type", "application/json");	
	    
	    if(method == 'POST' || method == 'PUT') {
	   		client.send(props);
	   }
	   else {
	   	   client.send();
	   }
	},
	
	backupTrip: function(userId, props, callback){
		 var url = "http://triplogr-tipsyandtumbler.rhcloud.com/trips/" + userId;
		 this.httpRequest(url, props, 'POST', function(success){
		 		Ti.API.info(success);
		 		callback(success);
		 }, function(err){
		 	 	Ti.API.error(err);
		 });
	}	
	
};


exports.CloudBackup = CloudBackup;