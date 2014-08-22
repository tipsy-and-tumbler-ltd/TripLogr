function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.rowitem/" + s : s.substring(0, index) + "/ti.ux.rowitem/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function initUI() {
        if (args.icon) {
            $.icon.setIcon(args.icon);
            args.iconColor && ($.icon.getView().color = args.iconColor);
        } else $.titleLbl.left = $.icon.getView().left;
        $.titleLbl.text = args.title;
        $.subtitleLbl.text = args.subtitle;
        args.count && $.countLbl.applyProperties({
            visible: true,
            text: "  " + args.count + "   "
        });
        $.childrenImage.visible = args.hasChildren;
        $.row.selectionStyle = true && args.hasChildren ? Ti.UI.iPhone.TableViewCellSelectionStyle.BLUE : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
        $.row.data = args;
    }
    new (require("alloy/widget"))("ti.ux.rowitem");
    this.__widgetId = "ti.ux.rowitem";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.row = Ti.UI.createTableViewRow({
        backgroundColor: "#fff",
        height: "50",
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 16
        },
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    $.__views.icon = Alloy.createWidget("ti.ux.iconfont", "widget", {
        left: 10,
        size: "15",
        iconColor: "#333",
        id: "icon",
        __parentSymbol: $.__views.row
    });
    $.__views.icon.setParent($.__views.row);
    $.__views.titleLbl = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.normalFont,
            fontSize: "14dp"
        },
        color: "#111",
        left: 35,
        id: "titleLbl"
    });
    $.__views.row.add($.__views.titleLbl);
    $.__views.subtitleLbl = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.normalFont,
            fontSize: "14dp"
        },
        color: "#666",
        textAlign: "right",
        right: "35",
        id: "subtitleLbl"
    });
    $.__views.row.add($.__views.subtitleLbl);
    $.__views.countLbl = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.normalFont,
            fontSize: "14dp"
        },
        color: "#fff",
        backgroundColor: "#bbb",
        textAlign: "center",
        borderRadius: "8",
        height: "20",
        visible: "false",
        right: "35",
        id: "countLbl"
    });
    $.__views.row.add($.__views.countLbl);
    $.__views.childrenImage = Ti.UI.createImageView({
        right: 8,
        height: 15,
        width: 15,
        image: WPATH("arrow.png"),
        id: "childrenImage"
    });
    $.__views.row.add($.__views.childrenImage);
    $.__views.__alloyId15 = Ti.UI.createView({
        height: .5,
        backgroundColor: "#eee",
        bottom: 0,
        id: "__alloyId15"
    });
    $.__views.row.add($.__views.__alloyId15);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0];
    initUI();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;