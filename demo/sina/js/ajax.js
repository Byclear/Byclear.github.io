function ajax(options) {
    //->参数初始化
    var _default = {
        url: "",
        type: "get",
        async: true,
        data: null,
        success: null
    };
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            _default[key] = options[key];
        }
    }

    //->完成Ajax请求
    var xhr = new XMLHttpRequest();
    xhr.open(_default.type, _default.url, _default.async);
    xhr.onreadystatechange = function () {
                
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {console.log(xhr.readyState,xhr.status)
            var data = "JSON" in window ? JSON.parse(xhr.responseText) : eval("(" + xhr.responseText + ")");
            console.log(data)
            if (typeof _default.success === "function") {
                _default.success.call(window, data);
            }
        }
    };
    xhr.send(_default.data);
}