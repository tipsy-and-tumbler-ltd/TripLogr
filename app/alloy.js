// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

Alloy.Globals.TripLogr = {
	username: "",
	beaconActive: false,
	beaconMinor: "",
	beaconMajor: "",
	beaconName: "",
	beaconUUID: "", //"40D05907-C87D-4D83-A9DC-0BD1BCC7B6A8"
	cloudBackupActive: true,
	distanceMeasurement: 'Miles'
};

