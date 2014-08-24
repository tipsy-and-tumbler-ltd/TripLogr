function Controller() {
    function refreshTrips() {
        $.tblTrips.sections.length > 1 && $.tblTrips.deleteSection(1);
        var section = Titanium.UI.createTableViewSection();
        results.sort(sortTripData);
        for (var i = 0; results.length > i; i++) {
            var rw = Alloy.createController("TripRow", results[i]);
            i == results.length - 1 && rw.setBottom(5);
            var row = rw.getView();
            section.add(row);
        }
        $.tblTrips.insertSectionAfter(0, section);
    }
    function sortTripData(a, b) {
        if (b.date < a.date) return -1;
        if (b.date > a.date) return 1;
        return 0;
    }
    function createReport() {
        var modal = Alloy.createController("ReportGenerator");
        modal.getView().open({
            modal: true
        });
    }
    function savePhoto(media) {
        media = ImageFactory.imageAsResized(media, {
            width: 640,
            height: 440,
            quality: ImageFactory.QUALITY_HIGH,
            hires: true
        });
        var filename = "my-car.png";
        var userDir = Titanium.Filesystem.applicationDataDirectory;
        var myFile = Titanium.Filesystem.getFile(userDir, filename);
        myFile.write(media);
        setImageFromFileSystem();
    }
    function setImageFromFileSystem() {
        var filename = "my-car.png";
        var userDir = Titanium.Filesystem.applicationDataDirectory;
        var myFile = Titanium.Filesystem.getFile(userDir, filename);
        if (myFile.exists()) {
            Ti.API.info("File exists! " + myFile.getNativePath());
            $.img.setImage(myFile.getNativePath());
            $.img.image1 = myFile.getNativePath();
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "Trips";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.win = Ti.UI.createWindow({
        barColor: "#fff",
        navTintColor: "#000",
        translucent: false,
        title: "My Trips",
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId34 = Ti.UI.createButton({
        title: "Report",
        id: "__alloyId34"
    });
    createReport ? $.__views.__alloyId34.addEventListener("click", createReport) : __defers["$.__views.__alloyId34!click!createReport"] = true;
    $.__views.win.rightNavButton = $.__views.__alloyId34;
    var __alloyId35 = [];
    $.__views.__alloyId36 = Ti.UI.createTableViewSection({
        id: "__alloyId36"
    });
    __alloyId35.push($.__views.__alloyId36);
    $.__views.__alloyId37 = Ti.UI.createTableViewRow({
        height: "315",
        backgroundColor: "#fff",
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 16
        },
        selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
        id: "__alloyId37"
    });
    $.__views.__alloyId36.add($.__views.__alloyId37);
    $.__views.img = Alloy.createWidget("ti.ux.image", "widget", {
        id: "img",
        left: "0",
        right: "0",
        zoomable: "false",
        height: "180",
        innerMargin: "80",
        realTop: "40",
        top: "0",
        image: "/images/default-car.jpg",
        touchEnabled: "false",
        __parentSymbol: $.__views.__alloyId37
    });
    $.__views.img.setParent($.__views.__alloyId37);
    $.__views.cameraBtn = Ti.UI.createImageView({
        image: "/images/Instagram.png",
        width: 25,
        height: 25,
        top: 20,
        left: 10,
        zIndex: "999",
        id: "cameraBtn"
    });
    $.__views.__alloyId37.add($.__views.cameraBtn);
    $.__views.__alloyId38 = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.normalFont,
            fontSize: "14dp"
        },
        color: "#111",
        text: "This is your list of previous trips. Each trip contains an odometer reading for the start and end of your trip, plus a trip purpose. All trip information is date and time-stamped so you can easily create a report for your TripLog.",
        textAlign: "center",
        height: "90",
        left: "10",
        top: "210",
        right: "10",
        id: "__alloyId38"
    });
    $.__views.__alloyId37.add($.__views.__alloyId38);
    $.__views.tblTrips = Ti.UI.createTableView({
        backgroundColor: "#fff",
        separatorStyle: Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
        data: __alloyId35,
        id: "tblTrips"
    });
    $.__views.win.add($.__views.tblTrips);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var results = [];
    var YapDB = require("YapDB").YapDB;
    var PS = require("photoselector");
    var PhotoSelector = new PS.PhotoSelector();
    var ImageFactory = require("ti.imagefactory");
    Ti.App.addEventListener("refreshTrips", refreshTrips);
    YapDB.fetchAllTrips(function(_results) {
        results = _results;
        Ti.App.fireEvent("refreshTrips");
    });
    Ti.App.addEventListener("getTripListings", function() {
        setTimeout(function() {
            YapDB.fetchAllTrips(function(_results) {
                results = _results;
                Ti.App.fireEvent("refreshTrips");
            });
        }, 500);
    });
    $.cameraBtn.addEventListener("click", function() {
        var dialog = Ti.UI.createOptionDialog({
            options: [ "From Camera", "From Photo Gallery", "Cancel" ],
            cancel: 2,
            title: "Choose an image..."
        });
        dialog.addEventListener("click", function(photoEvt) {
            0 === photoEvt.index ? PhotoSelector.fromCamera(true, true, savePhoto, function() {}, function() {}) : 1 === photoEvt.index && PhotoSelector.fromGallery(savePhoto, function() {}, function() {});
        });
        dialog.show();
    });
    setImageFromFileSystem();
    __defers["$.__views.__alloyId34!click!createReport"] && $.__views.__alloyId34.addEventListener("click", createReport);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;