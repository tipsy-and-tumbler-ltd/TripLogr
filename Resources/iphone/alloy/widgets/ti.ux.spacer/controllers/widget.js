function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ti.ux.spacer/" + s : s.substring(0, index) + "/ti.ux.spacer/" + s.substring(index + 1);
    return path;
}

function Controller() {
    new (require("alloy/widget"))("ti.ux.spacer");
    this.__widgetId = "ti.ux.spacer";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.view = Ti.UI.createView({
        height: "10",
        id: "view"
    });
    $.__views.view && $.addTopLevelView($.__views.view);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0];
    args.height && ($.view.height = args.height);
    args.backgroundColor && ($.view.backgroundColor = args.backgroundColor);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;