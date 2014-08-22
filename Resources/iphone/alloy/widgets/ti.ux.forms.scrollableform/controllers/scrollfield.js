function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.forms.scrollableform/" + s : s.substring(0, index) + "/ti.ux.forms.scrollableform/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function blurField(e) {
        e.source === $.view && $.field.blur();
    }
    new (require("alloy/widget"))("ti.ux.forms.scrollableform");
    this.__widgetId = "ti.ux.forms.scrollableform";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "scrollfield";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.view = Ti.UI.createScrollView({
        id: "view"
    });
    $.__views.view && $.addTopLevelView($.__views.view);
    blurField ? $.__views.view.addEventListener("click", blurField) : __defers["$.__views.view!click!blurField"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0];
    if ("image" == args.type) ; else {
        $.field = Alloy.createWidget("ti.ux.forms.text", args);
        $.field.getView().top = "40dp";
        $.view.add($.field.getView());
    }
    $.getComponent = function() {
        return $.field;
    };
    __defers["$.__views.view!click!blurField"] && $.__views.view.addEventListener("click", blurField);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;