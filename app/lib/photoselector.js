var isAndroid = (Ti.Platform.osname == 'android') ? true : false;


/*
  Gets a photo from any source, including camera, gallery and remote image
*/
function PhotoSelector(){};


/*
 *
 */
PhotoSelector.prototype.fromCamera = function(saveToGallery, allowEditing, success, failure, cancel) {
	Titanium.Media.showCamera({
		success:function(event)
		{
			 Ti.API.debug('Our type was: '+ event.mediaType);
	            if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
	            {
	            	if (isAndroid) {
	            		success(event.media);
	            		return;
	            	}
                    var ImageFactory = require('ti.imagefactory');
	                var resizedImage = ImageFactory.imageAsResized(event.media, {
                         width: event.media.width / 2,
                         height: event.media.height / 2,
                         quality: ImageFactory.QUALITY_HIGH
                    });
	            	
	            	success(resizedImage);
	            }
		},
		cancel: cancel,
		error:function(err)
		{
			failure(err);
		},
		saveToPhotoGallery: saveToGallery,
		allowEditing: allowEditing,
		mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
	});
};


/*
 *
 */
PhotoSelector.prototype.fromGallery = function(successevt, failure, cancel) {
	Titanium.Media.openPhotoGallery({
	        success:function(event)
	        {	          
	            Ti.API.debug('Our type was: '+event.mediaType);
	            if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
	            {
	            	successevt(event.media);
	            }
	        },
	        cancel: cancel,
	        error:function(err)
	        {
	        	failure(err);
	        },
	        mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
    });
};



/*
 *
 */
PhotoSelector.prototype.fromBase64String = function(_base64EncodedString) {
	return Titanium.Utils.base64decode(_base64EncodedString);
};

/*
 *
 */
PhotoSelector.prototype.toBase64String = function(_mediaObject) {
	return Titanium.Utils.base64encode(_mediaObject);
};


//finally,
exports.PhotoSelector = PhotoSelector;