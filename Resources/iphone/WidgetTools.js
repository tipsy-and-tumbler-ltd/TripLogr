var TI_PROPS = [ "backgroundColor", "borderColor", "borderRadius", "borderWidth", "bottom", "bubbleParent", "center", "color", "height", "layout", "left", "opacity", "right", "tintColor", "top", "touchEnabled", "transform", "visible", "width", "zIndex" ];

exports.cleanArgs = function(args) {
    delete args.id;
    delete args.__parentSymbol;
    delete args.children;
    return args;
};

exports.setTiProps = function(args, component) {
    if (!component) return;
    var args = args || {}, prop = "";
    for (var i = 0, j = TI_PROPS.length; j > i; i++) {
        prop = TI_PROPS[i];
        "undefined" != typeof args[prop] && (component[prop] = args[prop]);
    }
};