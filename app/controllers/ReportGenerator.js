var args = arguments[0] || {};

var YapDB = require('YapDB').YapDB;
//Require the securely module into your project
var pdf = require('bencoding.pdf');
//Create a new properties object
var converters = pdf.createConverters();
var results = [];

function closeWindow(){
	$.win.close();
}

function generatePDF(){
	$.tableCreate.hide();
	results.sort(sortTripData);
	var rows = [];
	
	for(var i = 0; i < results.length; i++){
		var row = Ti.UI.createTableViewRow({
			className: 'reportRow'
		});
		
		row.add(Ti.UI.createLabel({
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			left: 20,
			font: {
				fontSize: 18
			},
			width: 300,
			text: results[i].purpose
		}));
		
		row.add(Ti.UI.createLabel({
			width: Ti.UI.SIZE,
			height: 30,
			font: {
				fontSize: 18
			},
			left:380,
			text: results[i].date.toString()
		}));
		
		if(results[i].odometer_start) {
			row.add(Ti.UI.createLabel({
				width: Ti.UI.SIZE,
				height: 30,
				font: {
					fontSize: 18
				},
				left: 700,
				text:  Math.floor(results[i].odometer_start).toString()
			}));
		}
		if(results[i].odometer_end) {
			row.add(Ti.UI.createLabel({
				width: Ti.UI.SIZE,
				height: 30,
				font: {
					fontSize: 18
				},
				left: 800,
				text:  Math.floor(results[i].odometer_end).toString()
			}));
		}
		
		row.add(Ti.UI.createView({
			width: Ti.UI.FILL,
			height: 2,
			top: 40
		}));
		
		rows.push(row);
	}
	
	Ti.API.warn(rows);
	
	$.tableReport.setData(rows);
	$.tableReport.visible = true;
	
	var media = $.tableReport.toImage();
	var pdfBlob = converters.convertImageToPDF(media,100);
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

function sortTripData(a,b) {
  if (b.date < a.date)
     return -1;
  if (b.date > a.date)
    return 1;
  return 0;
}

Ti.App.addEventListener('generateReport', generatePDF);

$.btnCreateReport.addEventListener('click',function(e){	
	YapDB.fetchAllTrips(function(_results){
		results = _results;
		Ti.App.fireEvent('generateReport');
	});
});
