function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.forms.scrollableform/" + s : s.substring(0, index) + "/ti.ux.forms.scrollableform/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function validateAndGoNext(e) {
        var index = e.source.index;
        var field = fieldsWidgets[index];
        if (!fieldsData[index].mandatory && !fieldsWidgets[index].getFieldValue()) {
            index++;
            increaseToStep(index);
            return;
        }
        field.validate(function(isValid) {
            if (isValid) {
                index++;
                increaseToStep(index);
            } else field.focus();
        });
    }
    function increaseToStep(index) {
        if (fieldsWidgets.length > index) {
            $.scrollableView.views = viewsWidgets.slice(0, index + 1);
            $.scrollableView.scrollToView(index);
            autofocusField(index);
        } else executeLastStep();
    }
    function autofocusField(index) {
        fieldsData[index].autofocus && fieldsWidgets[index].focus();
    }
    function changeFocus(e) {
        fieldsWidgets[e.currentPage].focus();
    }
    function executeLastStep() {
        if (!formData.onFinish) {
            Ti.API.warn("ti.ux.forms.scrollableform: WARNING, onFinish() callback function not defined");
            return;
        }
        var data = {};
        for (var i = 0, j = fieldsWidgets.length; j > i; i++) data[fieldsData[i].id] = fieldsWidgets[i].getFieldValue();
        formData.onFinish(data);
    }
    var Widget = new (require("alloy/widget"))("ti.ux.forms.scrollableform");
    this.__widgetId = "ti.ux.forms.scrollableform";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    var __alloyId14 = [];
    $.__views.scrollableView = Ti.UI.createScrollableView({
        views: __alloyId14,
        id: "scrollableView"
    });
    $.__views.scrollableView && $.addTopLevelView($.__views.scrollableView);
    changeFocus ? $.__views.scrollableView.addEventListener("scrollEnd", changeFocus) : __defers["$.__views.scrollableView!scrollEnd!changeFocus"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0];
    var formData = {};
    var viewsWidgets = [];
    var fieldsWidgets = [];
    var fieldsData = [];
    $.init = function(data) {
        formData = data || {};
        fieldsData = formData.fields || [];
        var widget = {};
        fieldsData[fieldsData.length - 1].returnKeyType = Ti.UI.RETURNKEY_DONE;
        for (var i = 0, j = fieldsData.length; j > i; i++) {
            widget = Widget.createWidget("ti.ux.forms.scrollableform", "scrollfield", fieldsData[i]);
            fieldsWidgets.push(widget.getComponent());
            viewsWidgets.push(widget.getView());
        }
        $.scrollableView.views = viewsWidgets.slice(0, 1);
        autofocusField(0);
        for (var i = 0, j = fieldsWidgets.length; j > i; i++) {
            fieldsWidgets[i].getField().addEventListener("return", validateAndGoNext);
            fieldsWidgets[i].getField().index = i;
        }
    };
    $.getFieldValue = function(id) {
        var index = -1;
        for (var i = 0, j = fieldsData.length; j > i; i++) if (id == fieldsData[i].id) {
            index = i;
            break;
        }
        return index > -1 ? fieldsWidgets[index].getFieldValue() : void 0;
    };
    __defers["$.__views.scrollableView!scrollEnd!changeFocus"] && $.__views.scrollableView.addEventListener("scrollEnd", changeFocus);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;