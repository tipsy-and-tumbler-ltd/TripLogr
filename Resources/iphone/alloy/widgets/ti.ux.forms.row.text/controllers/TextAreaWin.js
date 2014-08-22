function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.forms.row.text/" + s : s.substring(0, index) + "/ti.ux.forms.row.text/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function init() {
        $.textarea.value = args.value || "";
        $.textarea.focus();
    }
    function save() {
        $.win.close();
        $.win.fireEvent("save", {
            value: $.textarea.value
        });
    }
    function cancel() {
        $.win.close();
        $.win.fireEvent("cancel", {
            value: $.textarea.value
        });
    }
    new (require("alloy/widget"))("ti.ux.forms.row.text");
    this.__widgetId = "ti.ux.forms.row.text";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "TextAreaWin";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.__alloyId3 = Ti.UI.createWindow({
        barColor: "#fff",
        navTintColor: "#000",
        translucent: false,
        backgroundColor: "#fff",
        id: "__alloyId3"
    });
    init ? $.__views.__alloyId3.addEventListener("open", init) : __defers["$.__views.__alloyId3!open!init"] = true;
    $.__views.__alloyId5 = Ti.UI.createButton({
        title: "Save",
        id: "__alloyId5"
    });
    save ? $.__views.__alloyId5.addEventListener("click", save) : __defers["$.__views.__alloyId5!click!save"] = true;
    $.__views.__alloyId3.leftNavButton = $.__views.__alloyId5;
    $.__views.__alloyId7 = Ti.UI.createButton({
        title: "Cancel",
        id: "__alloyId7"
    });
    cancel ? $.__views.__alloyId7.addEventListener("click", cancel) : __defers["$.__views.__alloyId7!click!cancel"] = true;
    $.__views.__alloyId3.rightNavButton = $.__views.__alloyId7;
    $.__views.__alloyId8 = Ti.UI.createView({
        id: "__alloyId8"
    });
    $.__views.__alloyId3.add($.__views.__alloyId8);
    $.__views.textarea = Ti.UI.createTextArea({
        height: "240",
        left: "2",
        right: "2",
        backgroundColor: "#fff",
        suppressReturn: false,
        font: {
            fontFamily: Alloy.CFG.normalFont,
            fontSize: "16dp"
        },
        color: "#333",
        borderWidth: 2,
        borderColor: "#999",
        borderRadius: 6,
        id: "textarea",
        top: "2"
    });
    $.__views.__alloyId8.add($.__views.textarea);
    $.__views.win = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.__alloyId3,
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0];
    __defers["$.__views.__alloyId3!open!init"] && $.__views.__alloyId3.addEventListener("open", init);
    __defers["$.__views.__alloyId5!click!save"] && $.__views.__alloyId5.addEventListener("click", save);
    __defers["$.__views.__alloyId7!click!cancel"] && $.__views.__alloyId7.addEventListener("click", cancel);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;