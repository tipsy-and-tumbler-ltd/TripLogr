var args = arguments[0] || {};
Ti.API.info(args);

if(args) {
	$.dateDay.text = args.date.getDate();
	$.dateDay.dateMonthYear = (args.date.getMonth()+1).toString() + ' ' + args.date.getFullYear();

	$.lblDescription.text = args.purpose;
	$.lblOdometer.text = 'Odometer: ' + args['odometer_end'].toFixed(0);
	
	var distanceMeasured = 0;
	var measure = (Alloy.Globals.TripLogr.distanceMeasurement.toLowerCase() == 'miles') ? 'mi' : 'km';
	if (measure == 'mi') {
		distanceMeasured = (args.total_kilometers * 0.62137).toFixed(2);
	} else {
		distanceMeasured = args.total_kilometers.toFixed(2);
	}
	
	$.lblMileage.text = distanceMeasured + measure;
	
	exports.setBottom = function(val){
		$.rowContainer.bottom = val;
	};

}