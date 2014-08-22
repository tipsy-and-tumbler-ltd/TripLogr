function mixin(target, source) {
    var name, s;
    var empty = {};
    for (name in source) {
        s = source[name];
        name in target && (target[name] === s || name in empty && empty[name] === s) || (target[name] = s);
    }
    return target;
}

exports.NO_IMAGE = "/images/no_image.jpg";

exports.TI_CACHE_DIR = Ti.Filesystem.applicationCacheDirectory;

exports.TI_RESOURCES_DIR = Ti.Filesystem.resourcesDirectory;

exports.TI_FILL = Ti.UI.FILL;

exports.DISPLAY_WIDTH = Ti.Platform.displayCaps.platformWidth;

exports.TI_DARK_INDICATOR = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;

exports.resizeWidth = function(args) {
    var args = args || {};
    var blob = args.blob || {};
    var imageWidth = blob.width, imageHeight = blob.height, newWidth = args.width;
    if (0 >= imageWidth || 0 >= imageHeight || 0 >= newWidth) return blob;
    if (newWidth > imageWidth) return blob;
    var ratio = imageWidth / imageHeight;
    var w = newWidth;
    var h = newWidth / ratio;
    return blob.imageAsResized(w, h);
};

exports.downloadImage = function(args) {
    function removeLoadIndicator() {
        Ti.API.info("removing indicator");
        actInd.hide();
        container.remove(actInd);
        actInd = null;
    }
    var args = args || {};
    var filename = args.filename, url = args.url, imageView = args.imageView, container = args.container;
    Ti.API.info("url: " + url);
    var client = Ti.Network.createHTTPClient();
    var actInd = Ti.UI.createActivityIndicator({
        style: exports.TI_DARK_INDICATOR,
        width: exports.TI_FILL,
        height: exports.TI_FILL,
        color: "#bbb",
        font: {
            fontSize: 12
        }
    });
    container.add(actInd);
    actInd.show();
    client.ondatastream = function(e) {
        actInd.message = " " + parseInt(100 * e.progress) + "%";
    };
    client.onload = function() {
        Ti.API.info("onload");
        if (200 == client.status) {
            var file = Ti.Filesystem.getFile(filename);
            file.write(this.responseData);
            imageView.image = file;
            true && file.exists() && container.fireEvent("downloaded", {
                cacheFilePath: file.getNativePath()
            });
        } else Ti.API.info("RemoteImage: Error downloading file " + url);
        removeLoadIndicator();
    };
    client.error = function() {
        Ti.API.info("RemoteImage: Error downloading file: " + url);
        imageView.image = exports.NO_IMAGE;
        removeLoadIndicator();
    };
    client.timeout = 1e4;
    client.open("GET", url);
    client.send();
};

exports.applyProperties = function(_component, _style) {
    var _style = _style || {};
    _component = mixin(_component, _style);
};

exports.mixin = function(obj) {
    obj || (obj = {});
    for (var i = 1, l = arguments.length; l > i; i++) mixin(obj, arguments[i]);
    return obj;
};

exports.combine = function() {
    var newObj = {};
    for (var i = 0, l = arguments.length; l > i; i++) mixin(newObj, arguments[i]);
    return newObj;
};