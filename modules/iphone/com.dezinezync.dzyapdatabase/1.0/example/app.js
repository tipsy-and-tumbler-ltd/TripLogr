
/*
 *  Module: TiDZYapDatabase
 *  ID:     com.dezinezync.dzyapdatabase
 *  Author: Nikhil Nigade (@dezinezync)
 *  2014 Nikhil Nigade © All Rights Reserved
 *  Licensed under the MIT License. Check License file for more information.
 */

// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});
win.open();

// The Module
var db = require('com.dezinezync.dzyapdatabase');

// Storing values into the database
/*
 *  PARAMS
 *  Key : String
 *  Value: Object, Array, String (Integers, Floats, Doubles, etc... will not work.)
 *  Callback (Optional) : Function
 */
db.set("user:1",{"name":"John Appleseed", "age":34, "sex":"Male", "height": 1.74}, function(success) {
       
    console.log("Set", success);
       
});

/*
 *  PARAMS
 *  Key : String
 *  Collection: String
 *  Value: Object, Array, String (Integers, Floats, Doubles, etc... will not work.)
 *  Callback (Optional) : Function
 */
db.setInCollection("user:1","users",{"name":"John Appleseed", "age":34, "sex":"Male", "height": 1.74}, function(success) {
       
       console.log("SetInCollection",success);
       
});

/*
 *  PARAMS
 *  Key : String
 *  Collection: String
 *  Value: Object, Array, String (Integers, Floats, Doubles, etc... will not work.)
 *  Callback (Optional) : Function
 */

db.setInCollection("user:2","users",{"name":"Jane Appleseed", "age":32, "sex":"Female", "height": 1.69}, function(success) {
                   
    console.log("SetInCollection 2",success);
                   
});

// The NX methods only set the value for the key if it doesn't already exist.

db.setNX("user:1", {"name":"John Appleseed", "age":34, "sex":"Male", "height": 1.74}, function(success) {

//    This will return true even if the value was not set, but an attempt was made. returns NO on a failure as usual.
    console.log("SetNX", success);
         
});

db.setNXInCollection("user:2","users",{"name":"Jane Appleseed", "age":32, "sex":"Female", "height": 1.69}, function(success) {
                     
//    This will return true even if the value was not set, but an attempt was made. returns NO on a failure as usual.
    console.log("SetNXInCollection",success);
                     
});

// Getting Values from the Database
/*
 * PARAMS
 * Key: String
 * Callback : Function (Required)
 */

db.getValue("user:1", function(result) {
       
    console.log("GetValue",result);
       
});

/*
 * PARAMS
 * Key: String
 * Collection: String
 * Callback: Function (Required)
 */

db.getFromCollection("user:1","users", function(result) {
                     
    console.log("GetFromCollection",result);
                     
});

/*
 * PARAMS
 * Keys: Array
 * Collection: String
 * Callback: Function (Required)
 */

db.getMulti(["user:1","user:2"],"users",function(results) {
          
    console.log("GetMulti",results);
            
});

/*
 * PARAMS
 * Collection: String
 * Callback: Function (Required)
 */

db.getAllFromCollection("users", function(results) {

    console.log("GetAllFromCollection", results);

});

/*
 * PARAMS
 * Key: String
 * Callback: Function (Optional)
 */

db.del("user:1", function(result) {
       
    console.log("Del",result);
       
});

/*
 * PARAMS
 * Key: String
 * Collection: String
 * Callback: Function (Optional)
 */

db.delFromCollection("user:1", "users", function(result) {
       
    console.log("DelFromCollection",result);
       
});

/*
 * PARAMS
 * Collection: String
 * Callback: Function (Optional)
 */

db.removeAllFromCollection("users", function(result) {

    console.log("RemoveAllFromCollection", result);
                           
});

// Removes all values from all collections.
// Use this only when you need a ground-zero Database
db.removeAllFromAllCollections();
