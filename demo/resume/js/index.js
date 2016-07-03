new Swiper(".swiper-container", {
    loop: true,
    direction: "vertical",

});

function fn() {
    if (!arguments.length) return;
    var ary = [];
    for (var i = 0, len = arguments.length; i < len; i++) {
    	ary.push(arguments[i] * 750 / 640 * 2);

    }
    return ary;
}
