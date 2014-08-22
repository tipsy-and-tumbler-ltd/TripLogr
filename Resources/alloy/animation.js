exports.HORIZONTAL = "horizontal";

exports.VERTICAL = "vertical";

exports.flip = function(from, to, direction, duration, finishCallback) {
    var vertical = direction === exports.VERTICAL;
    var flipped_matrix = Ti.UI.create3DMatrix().rotate(-90, vertical ? 1 : 0, vertical ? 0 : 1, 0);
    var from_animation = Ti.UI.createAnimation({
        transform: flipped_matrix,
        duration: duration
    });
    to.transform = flipped_matrix;
    from.animate(from_animation, function() {
        var unflipped_matrix = Ti.UI.create3DMatrix().rotate(0, vertical ? 1 : 0, vertical ? 0 : 1, 0);
        var to_animation = Ti.UI.createAnimation({
            transform: unflipped_matrix,
            duration: duration
        });
        finishCallback ? to.animate(to_animation, finishCallback) : to.animate(to_animation);
    });
};

exports.flipHorizontal = function(from, to, duration, finishCallback) {
    exports.flip(from, to, exports.HORIZONTAL, duration, finishCallback);
};

exports.flipVertical = function(from, to, duration, finishCallback) {
    exports.flip(from, to, exports.VERTICAL, duration, finishCallback);
};

exports.crossFade = function(from, to, duration, finishCallback) {
    from && from.animate({
        opacity: 0,
        duration: duration
    });
    to && to.animate({
        opacity: 1,
        duration: duration
    });
    finishCallback && setTimeout(finishCallback, duration + 300);
};

exports.fadeAndRemove = function(from, duration, container, finishCallback) {
    from && container && from.animate({
        opacity: 0,
        duration: duration
    }, function() {
        container.remove(from);
        container = from = duration = null;
        finishCallback && finishCallback();
    });
};

exports.fadeIn = function(to, duration, finishCallback) {
    finishCallback ? to && to.animate({
        opacity: 1,
        duration: duration
    }, finishCallback) : to && to.animate({
        opacity: 1,
        duration: duration
    });
};

exports.fadeOut = function(to, duration, finishCallback) {
    finishCallback ? to && to.animate({
        opacity: 0,
        duration: duration
    }, finishCallback) : to && to.animate({
        opacity: 0,
        duration: duration
    });
};

exports.popIn = function(view, finishCallback) {
    var animate1 = Ti.UI.createAnimation({
        opacity: 1,
        transform: Ti.UI.create2DMatrix().scale(1.05, 1.05),
        duration: 200
    });
    var animate2 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix(),
        duration: 300
    });
    exports.chainAnimate(view, [ animate1, animate2 ], finishCallback);
    view = null;
};

exports.shake = function(view, delay, finishCallback) {
    var shake1 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().translate(5, 0),
        duration: 100
    });
    var shake2 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().translate(-5, 0),
        duration: 100
    });
    var shake3 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().translate(5, 0),
        duration: 100
    });
    var shake4 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().translate(-5, 0),
        duration: 100
    });
    var shake5 = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix(),
        duration: 100
    });
    delay ? setTimeout(function() {
        exports.chainAnimate(view, [ shake1, shake2, shake3, shake4, shake5 ], finishCallback);
        view = shake1 = shake2 = shake3 = shake4 = shake5 = null;
    }, delay) : exports.chainAnimate(view, [ shake1, shake2, shake3, shake4, shake5 ], finishCallback);
};

exports.flash = function(view, delay, finishCallback) {
    var flash1 = Ti.UI.createAnimation({
        opacity: .7,
        duration: 100
    });
    var flash2 = Ti.UI.createAnimation({
        opacity: 1,
        duration: 100
    });
    var flash3 = Ti.UI.createAnimation({
        opacity: .7,
        duration: 100
    });
    var flash4 = Ti.UI.createAnimation({
        opacity: 1,
        duration: 100
    });
    delay ? setTimeout(function() {
        exports.chainAnimate(view, [ flash1, flash2, flash3, flash4 ], finishCallback);
        view = flash1 = flash2 = flash3 = flash4 = null;
    }, delay) : exports.chainAnimate(view, [ flash1, flash2, flash3, flash4 ], finishCallback);
};

exports.chainAnimate = function(view, animations, finishCallback) {
    function step() {
        if (0 === animations.length) {
            view = animations = null;
            finishCallback && finishCallback();
            return;
        }
        var animation = animations.shift();
        animation.addEventListener("complete", step);
        view.animate(animation);
    }
    step();
};