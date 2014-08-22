var args = arguments[0] || {};
var results = [];
var YapDB = require('YapDB').YapDB;
var PS = require('photoselector');
var PhotoSelector = new PS.PhotoSelector();
var ImageFactory = require('ti.imagefactory');

//YapDB.clearDatabase();

function refreshTrips(){
	if($.tblTrips.sections.length > 1) {
		$.tblTrips.deleteSection(1);
	}	
	var section = Titanium.UI.createTableViewSection();
	results.sort(sortTripData);
	
	for(var i = 0; i < results.length; i++){
		var rw = Alloy.createController('TripRow', results[i]);
		if(i == results.length-1){
			rw.setBottom(5);
		}
				
		var row = rw.getView();
		section.add(row);
	}
	
	$.tblTrips.insertSectionAfter(0, section);
}

function sortTripData(a,b) {
  if (b.date < a.date)
     return -1;
  if (b.date > a.date)
    return 1;
  return 0;
}

Ti.App.addEventListener('refreshTrips', refreshTrips);

YapDB.fetchAllTrips(function(_results){
	results = _results;
	Ti.App.fireEvent('refreshTrips');
});

Ti.App.addEventListener('getTripListings', function(e){
	setTimeout(function(timr){
			YapDB.fetchAllTrips(function(_results){
			results = _results;
			Ti.App.fireEvent('refreshTrips');
		});
	}, 500);
});


function createReport(){
	var modal = Alloy.createController('ReportGenerator');
	modal.getView().open({
		modal:true
	});
}

function savePhoto(media){
	 media = ImageFactory.imageAsResized(media, { width: 640, height: 440, quality:ImageFactory.QUALITY_HIGH, hires:true });
     //media = ImageFactory.imageAsCropped(media, {width: 640, height: 420, y: 40, x:0, highres: true});  
            
	var filename = 'my-car.png';
    var userDir = Titanium.Filesystem.applicationDataDirectory; 
    var myFile = Titanium.Filesystem.getFile(userDir, filename); 
        myFile.write(media);

    setImageFromFileSystem();
};

function setImageFromFileSystem(){
	var filename = 'my-car.png';
    var userDir = Titanium.Filesystem.applicationDataDirectory; 
    var myFile = Titanium.Filesystem.getFile(userDir, filename); 

    if(myFile.exists()){
    	Ti.API.info('File exists! '+myFile.getNativePath());
    	$.img.setImage(myFile.getNativePath());
    	$.img.image1 = myFile.getNativePath();
    }
}

$.cameraBtn.addEventListener('click', function(e){
	var dialog = Ti.UI.createOptionDialog({
        options: ["From Camera", "From Photo Gallery", 'Cancel'],
        cancel: 2,
        title: "Choose an image..."
    });
    
    dialog.addEventListener('click', function(photoEvt) {
        if(photoEvt.index === 0) {
            PhotoSelector.fromCamera(true, true, savePhoto, function(failEvt) {}, function(cancelEvt) {});
        }
        else if(photoEvt.index === 1) {
            PhotoSelector.fromGallery(savePhoto, function(failEvt) {}, function(cancelEvt) {});
        }
    });
    
    dialog.show();
});


//finally, get an existing photo if there's one
setImageFromFileSystem();