function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.forms.text/" + s : s.substring(0, index) + "/ti.ux.forms.text/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function initUI() {
        args.height && ($.view.height = args.height);
        args.backgroundColor && ($.view.backgroundColor = args.backgroundColor);
        args.title && ($.titleLbl.text = args.title);
        args.hintText && ($.field.hintText = args.hintText);
        args.value && ($.field.value = args.value);
        args.tipText && ($.tipText.text = args.tipText);
        Scope.setupField({
            params: args,
            control: $.field
        });
    }
    function showValidationError() {
        Animations.shake($.view, 200);
        $.errorText.text = args.errorText || args.tipText;
        $.tipText.visible = false;
        $.alertImage.visible = true;
    }
    function hideValidationError() {
        $.tipText.visible = true;
        $.errorText.text = "";
        $.alertImage.visible = false;
    }
    function focus() {
        $.field.focus();
    }
    new (require("alloy/widget"))("ti.ux.forms.text");
    this.__widgetId = "ti.ux.forms.text";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.container = Ti.UI.createView({
        height: Ti.UI.SIZE,
        id: "container"
    });
    $.__views.container && $.addTopLevelView($.__views.container);
    $.__views.view = Ti.UI.createView({
        left: 20,
        right: 20,
        top: 20,
        height: "100dp",
        borderColor: "#66c0ee",
        borderWidth: "1",
        backgroundColor: "#fff",
        id: "view"
    });
    $.__views.container.add($.__views.view);
    focus ? $.__views.view.addEventListener("click", focus) : __defers["$.__views.view!click!focus"] = true;
    $.__views.actInd = Ti.UI.createActivityIndicator({
        height: 30,
        width: 30,
        backgroundColor: "transparent",
        color: "#fff",
        font: {
            fontFamily: Alloy.CFG.boldFont,
            fontSize: "12dp",
            fontWeight: "bold"
        },
        zIndex: 999,
        style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
        right: 10,
        top: 10,
        message: "",
        id: "actInd"
    });
    $.__views.view.add($.__views.actInd);
    $.__views.alertImage = Ti.UI.createImageView({
        top: 14,
        right: 15,
        height: 26,
        width: 28,
        visible: false,
        image: WPATH("warning.png"),
        id: "alertImage"
    });
    $.__views.view.add($.__views.alertImage);
    $.__views.titleLbl = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.fontLight,
            fontSize: 24
        },
        color: "#66c0ee",
        top: "5",
        left: "10",
        height: 40,
        id: "titleLbl"
    });
    $.__views.view.add($.__views.titleLbl);
    $.__views.__alloyId13 = Ti.UI.createView({
        height: "1",
        left: "10",
        right: "10",
        backgroundColor: "#66c0ee",
        id: "__alloyId13"
    });
    $.__views.view.add($.__views.__alloyId13);
    $.__views.field = Ti.UI.createTextField({
        height: "40dp",
        left: "10dp",
        right: "10dp",
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 18
        },
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        color: "#333",
        borderRadius: 3,
        bottom: 5,
        borderWidth: 0,
        clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
        suppressReturn: true,
        id: "field"
    });
    $.__views.view.add($.__views.field);
    hideValidationError ? $.__views.field.addEventListener("change", hideValidationError) : __defers["$.__views.field!change!hideValidationError"] = true;
    $.__views.tipText = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.fontNormal,
            fontSize: 12
        },
        color: "#666",
        top: 130,
        id: "tipText"
    });
    $.__views.container.add($.__views.tipText);
    $.__views.errorText = Ti.UI.createLabel({
        font: {
            fontFamily: Alloy.CFG.fontBold,
            fontSize: 12
        },
        color: "#f00",
        top: "130dp",
        id: "errorText"
    });
    $.__views.container.add($.__views.errorText);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Scope = require(WPATH("Scope"));
    var Animations = require("alloy/animation");
    var args = arguments[0];
    initUI();
    $.validate = function(callback) {
        if (!callback) return;
        hideValidationError();
        if ($.field.validate.useCallback) {
            $.actInd.show();
            $.field.validate($.field.value, function(e) {
                callback(e);
                e || showValidationError();
                $.actInd.hide();
            });
        } else {
            var isValid = $.field.validate($.field.value);
            Ti.API.info("isValid: " + isValid);
            callback(isValid);
            isValid || showValidationError();
        }
    };
    $.focus = focus;
    $.blur = function() {
        $.field.blur();
        eventHandlers.change();
    };
    var eventHandlers = {};
    exports.addEventListener = function(name, handler) {
        eventHandlers[name] = handler;
    };
    $.getField = function() {
        return $.field;
    };
    $.getFieldValue = function() {
        return $.field.value;
    };
    __defers["$.__views.view!click!focus"] && $.__views.view.addEventListener("click", focus);
    __defers["$.__views.field!change!hideValidationError"] && $.__views.field.addEventListener("change", hideValidationError);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;