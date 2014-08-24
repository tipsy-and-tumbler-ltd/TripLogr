var args = arguments[0] || {};

var YapDB = require('YapDB').YapDB;
//Require the securely module into your project
var pdf = require('bencoding.pdf');
//Create a new properties object
var converters = pdf.createConverters();
var results = [];

function closeWindow() {
	$.win.close();
}

function generatePDF() {
	$.tableCreate.hide();
	results.sort(sortTripData);
	var rows = [];
	
	var headerRow = Ti.UI.createTableViewRow({
		height: 100
	});
	
	headerRow.add(Ti.UI.createImageView({
		 image: 'appicon.png',
		 width: 72,
		 height: 72,
		 top: 20,
		 right: 20
	}));
	
	headerRow.add();
	
	headerRow.add(Ti.UI.createLabel({
		 text: "TripLogr Report",
		 width: Ti.UI.SIZE,
		 height: Ti.UI.SIZE,
		 top: 20,
		 left: 20,
		 font: {
		 	fontSize: 25,
		 	fontWeight: 'bold'
		 }
	}));
	
	headerRow.add(Ti.UI.createLabel({
		 text: Alloy.Globals.username,
		 width: Ti.UI.SIZE,
		 height: Ti.UI.SIZE,
		 top: 50,
		 left: 20,
		 font: {
		 	fontSize: 20
		 }
	}));
	 
	 
	rows.push(headerRow);

	var row = Ti.UI.createTableViewRow({
		className : 'reportRow',
		height : 50,
		top: 50
	});

	row.add(Ti.UI.createView({
		height : 2,
		left : 20,
		right : 20,
		top : 0,
		width : Ti.UI.FILL,
		backgroundColor : '#000'
	}));

	row.add(Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		left : 20,
		top : 8,
		font : {
			fontSize : 22
		},
		width : 300,
		text : "TRIP PURPOSE"
	}));
	row.add(Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : 30,
		top : 8,
		font : {
			fontSize : 22
		},
		left : 400,
		text : "DATE"
	}));
	row.add(Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : 30,
		top : 8,
		font : {
			fontSize : 22
		},
		left : 820,
		text : "ODO. START"
	}));
	row.add(Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : 30,
		top : 8,
		font : {
			fontSize : 22
		},
		left : 960,
		text : "ODO. END"
	}));
	row.add(Ti.UI.createLabel({
		width : Ti.UI.SIZE,
		height : 30,
		top : 8,
		font : {
			fontSize : 22
		},
		left : 1120,
		text : "DISTANCE"
	}));

	row.add(Ti.UI.createView({
		height : 2,
		left : 20,
		right : 20,
		top : 43,
		width : Ti.UI.FILL,
		backgroundColor : '#000'
	}));

	rows.push(row);

	for (var i = 0; i < results.length; i++) {
		var row = Ti.UI.createTableViewRow({
			className : 'reportRow'
		});

		row.add(Ti.UI.createLabel({
			width : Ti.UI.SIZE,
			height : Ti.UI.SIZE,
			left : 20,
			font : {
				fontSize : 18
			},
			width : 300,
			text : results[i].purpose
		}));

		row.add(Ti.UI.createLabel({
			width : Ti.UI.SIZE,
			height : 30,
			font : {
				fontSize : 18
			},
			left : 400,
			text : results[i].date.toString()
		}));

		if (results[i].odometer_start) {
			row.add(Ti.UI.createLabel({
				width : Ti.UI.SIZE,
				height : 30,
				font : {
					fontSize : 18
				},
				left : 820,
				text : Math.floor(results[i].odometer_start).toString()
			}));
		}

		if (results[i].odometer_end) {
			row.add(Ti.UI.createLabel({
				width : Ti.UI.SIZE,
				height : 30,
				font : {
					fontSize : 18
				},
				left : 960,
				text : Math.floor(results[i].odometer_end).toString()
			}));
		}

		if (results[i].total_kilometers) {
			var distanceMeasured = 0;
			var measure = (Alloy.Globals.TripLogr.distanceMeasurement.toLowerCase() == 'miles') ? 'mi' : 'km';
			if (measure == 'mi') {
				distanceMeasured = (results[i].total_kilometers * 0.62137).toFixed(2);
			} else {
				distanceMeasured = results[i].total_kilometers.toFixed(2);
			}

			row.add(Ti.UI.createLabel({
				width : Ti.UI.SIZE,
				height : 30,
				font : {
					fontSize : 18
				},
				left : 1120,
				text : distanceMeasured + measure
			}));
		}

		row.add(Ti.UI.createView({
			width : Ti.UI.FILL,
			height : 2,
			top : 40
		}));

		rows.push(row);
	}

	Ti.API.warn(rows);

	$.tableReport.setData(rows);
	$.tableReport.visible = true;

	var media = $.tableReport.toImage();
	var pdfBlob = converters.convertImageToPDF(media, 100);
	var pdfFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'report.pdf');
	pdfFile.write(pdfBlob);

	Ti.API.warn(pdfFile.nativePath);

	$.tableReport.visible = false;
	$.tableCreate.visible = true;

	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.subject = "Your TripLogr Report";
	emailDialog.messageBody = 'Your TripLogr Report is attached in PDF format.';
	emailDialog.addAttachment(pdfFile);
	emailDialog.open();
}

function sortTripData(a, b) {
	if (b.date < a.date)
		return -1;
	if (b.date > a.date)
		return 1;
	return 0;
}

Ti.App.addEventListener('generateReport', generatePDF);

$.btnCreateReport.addEventListener('click', function(e) {
	if($.fromDate.getValue() == undefined || $.fromDate.getValue() == null) {
		YapDB.fetchAllTrips(function(_results) {
			for (var i = 0; i < _results.length; i++) {
				Ti.API.info($.fromDate.getValue());
				if (_results[i].date.getUTCDate() >= $.fromDate.getValue().getUTCDate() && _results[i].date.getUTCDate() <= $.toDate.getValue().getUTCDate()) {
					results.push(_results[i]);
				}
			}
			Ti.App.fireEvent('generateReport');
		});
	}
});
