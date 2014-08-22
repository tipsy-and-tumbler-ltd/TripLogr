function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.forms.row.text/" + s : s.substring(0, index) + "/ti.ux.forms.row.text/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function initUI() {
        if (args.icon) {
            $.icon.setIcon(args.icon);
            args.iconColor && ($.icon.getView().color = args.iconColor);
        } else $.titleLbl.left = $.icon.getView().left;
        $.titleLbl.text = args.title || "";
        $.field.hintText = args.hintText || "";
        $.field.value = args.value || "";
        $.alertIcon.getView().opacity = 0;
        Scope.setupField({
            params: args,
            control: $.field
        });
    }
    function showValidationError() {
        var icon = $.alertIcon.getView();
        Animations.fadeIn(icon);
        Animations.shake($.field, 200);
    }
    function hideValidationError() {
        var icon = $.alertIcon.getView();
        Animations.fadeOut(icon);
    }
    function focus() {
        $.field.focus();
    }
    function validate() {
        $.validate();
    }
    new (require("alloy/widget"))("ti.ux.forms.row.text");
    this.__widgetId = "ti.ux.forms.row.text";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
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
        size: 24,
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
    $.__views.field = Ti.UI.createTextField({
        height: "40dp",
        left: "43dp",
        right: "10dp",
        font: {
            fontFamily: Alloy.CFG.boldFont,
            fontSize: "16dp"
        },
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        color: "#333",
        borderRadius: 3,
        id: "field"
    });
    $.__views.row.add($.__views.field);
    validate ? $.__views.field.addEventListener("blur", validate) : __defers["$.__views.field!blur!validate"] = true;
    hideValidationError ? $.__views.field.addEventListener("focus", hideValidationError) : __defers["$.__views.field!focus!hideValidationError"] = true;
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
    $.__views.row.add($.__views.actInd);
    $.__views.alertIcon = Alloy.createWidget("ti.ux.iconfont", "widget", {
        id: "alertIcon",
        right: "10",
        icon: "fa-exclamation-triangle",
        iconColor: "#900",
        zIndex: "99",
        __parentSymbol: $.__views.row
    });
    $.__views.alertIcon.setParent($.__views.row);
    $.__views.__alloyId10 = Ti.UI.createView({
        height: .5,
        backgroundColor: "#eee",
        bottom: 0,
        id: "__alloyId10"
    });
    $.__views.row.add($.__views.__alloyId10);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0];
    var Scope = require(WPATH("Scope"));
    var Animations = require("alloy/animation");
    $.id = args.id || "none_id";
    initUI();
    $.validate = function(callback) {
        hideValidationError();
        if ($.field.validate.useCallback) {
            $.actInd.show();
            $.field.validate($.field.value, function(e) {
                callback && callback(e);
                e || showValidationError();
                $.actInd.hide();
            });
        } else {
            var isValid = $.field.validate($.field.value);
            Ti.API.info("isValid: " + isValid);
            callback && callback(isValid);
            isValid || showValidationError();
        }
    };
    $.focus = focus;
    $.blur = function() {
        $.field.blur();
    };
    $.getField = function() {
        return $.field;
    };
    $.getValue = function() {
        return $.field.value;
    };
    $.setValue = function(value) {
        $.field.value = value;
    };
    require("WidgetTools").cleanArgs(args);
    __defers["$.__views.field!blur!validate"] && $.__views.field.addEventListener("blur", validate);
    __defers["$.__views.field!focus!hideValidationError"] && $.__views.field.addEventListener("focus", hideValidationError);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;