function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.criteriastudio.RemoteImageView/" + s : s.substring(0, index) + "/com.criteriastudio.RemoteImageView/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function applyImageProperties(props) {
        Scope.applyProperties($.img, props);
    }
    new (require("alloy/widget"))("com.criteriastudio.RemoteImageView");
    this.__widgetId = "com.criteriastudio.RemoteImageView";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.img = Ti.UI.createImageView({
        id: "img"
    });
    $.__views.img && $.addTopLevelView($.__views.img);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Scope = require(WPATH("scope"));
    var args0 = arguments[0] || {};
    exports.init = function(args) {
        var args = args || {};
        args !== args0 && (args = Scope.combine(args, args0));
        var image = args.image;
        if (!image) return;
        delete args.image;
        var codedFilename = Ti.Utils.md5HexDigest(image);
        "high" === Titanium.Platform.displayCaps.density && (codedFilename += "@2x");
        Scope.TI_CACHE_DIR + codedFilename;
        var file = Ti.Filesystem.getFile(Scope.TI_CACHE_DIR, codedFilename);
        if (file.exists()) {
            applyImageProperties(args);
            $.img.image = file.read();
        } else if (Ti.Filesystem.getFile(Scope.TI_RESOURCES_DIR, image).exists()) {
            file = Ti.Filesystem.getFile(Scope.TI_RESOURCES_DIR, image);
            Ti.API.info("image exists in resources dir");
            $.img.image = file.read();
            applyImageProperties(args);
        } else {
            Ti.API.info("File does not exists. DOWNLOAD AND CACHE IMAGE");
            args.justDownloaded = true;
            applyImageProperties(args);
            Scope.downloadImage({
                file: file,
                filename: file.getNativePath(),
                url: image,
                imageView: $.img,
                container: $.img
            });
        }
        $.img.cacheFilePath = file.getNativePath();
    };
    exports.setImage = function(imagePath) {
        $.img.image = imagePath;
    };
    exports.addEventListener = function(eventName, callback) {
        $.img.addEventListener(eventName, callback);
    };
    exports.removeEventListener = function(eventName, callback) {
        $.img.removeEventListener(eventName, callback);
    };
    exports.setZoomable = function() {
        $.img.addEventListener("click", function() {
            if ($.img.image) {
                var win = Alloy.createWidget("com.criteriastudio.RemoteImageView", "zoomWin", {
                    image: $.img.cacheFilePath
                }).getView();
                win.open();
            }
        });
    };
    args0.image && exports.init(args0);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;