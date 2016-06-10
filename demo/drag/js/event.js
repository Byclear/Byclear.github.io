/**
 * event.js
 * @authors safilo (wulinqing@hotmail.com)
 * @date    2016-06-08 18:08:56
 * @version v1.0.0
 */

//bind的兼容性解决方案,在Functiond的原型上添加myBind方法
(function(pro) {
    function bind(context) {
        if ("bind" in Function.prototype) {
            return this.bind.apply(this, Array.prototype.slice.call(arguments, 0));
        } else {
            var _this = this;
            var outerArg = Array.prototype.slice.call(arguments, 1);
            return function() {
                var innerArg = Array.prototype.slice.call(arguments, 0);
                _this.apply(context, outerArg.concat(innerArg));
            };
        }
    }
    pro.myBind = bind;

})(Function.prototype);

/* -----------------------------------------------------------------*/

/*
 * on：订阅(绑定)系统内置事件或自定义事件的方法,兼容IE6~8
 * @param ele [object] -> 被订阅(绑定)的对象
 * @param type [string] -> 系统内置事件或自定义事件
 * @param fn [function] -> 订阅(绑定)的方法
 */
function on(ele, type, fn) {
    //自定义事件
    if (/^self/.test(type)) {  
        if (!ele[type]) {  //ele[type]为自定义事件type的事件池
            //创建事件池
            ele[type] = [];
        }
        var ary = ele[type];
        //遍历事件池,如果fn已经存在,则不再绑定
        for (var i = 0; i < ary.length; i++) {  
            if (ary[i] == fn) {
                return;
            }
        }
        //将fn添加到自定义事件type的事件池中
        ary.push(fn);  
    } else {
        //系统内置事件
        //标准浏览器
        if (ele.addEventListener) {
            ele.addEventListener(type, fn, false);
        } else {
            //IE6~8 解决IE6~8事件中的this关键字、事件重复绑定
            if (!ele["aEvent" + type]) {  //ele["aEvent" + type])为系统内置事件type的事件池
                //创建事件池
                ele["aEvent" + type] = [];
                //绑定run方法(在事件发生时实际上执行的就是run方法)
                ele.attachEvent("on" + type, function() {
                    run.call(ele);
                });
            }
            var ary = ele["aEvent" + type];
            //遍历事件池,防止重复绑定(如果事件池中已经存在当前要绑定的fn,则退出)
            for (var i = 0; i < ary.length; i++) {
                if (ary[i] == fn) {
                    return;
                }
            }
            //如果事件池中没有，则把当前fn加入事件池
            ary.push(fn);
        }
    }

}

/*
 * run：发布(执行)IE6~8系统内置事件,解决IE6~8系统内置事件执行顺序和事件对象的问题
 */
function run() {
    //把IE6~8的事件对象标准化
    var e = window.event;
    e.target = e.srcElement;
    e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
    e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
    e.stopPropagation = function() {
        e.cancelBubble = true;
    };
    e.preventDefault = function() {
        e.returnValue = false;
    };
    var ary = this["aEvent" + e.type];
    if (ary && ary.length) {
        //遍历事件池，将事件池中的方法按照绑定的顺序依次执行
        for (var i = 0; i < ary.length; i++) {
            var curFn = ary[i];
            //如果是函数才执行,不是函数则将其从事件池中移除
            if (typeof curFn === "function") {
                curFn.call(this, e);
            } else {
                ary.splice(i, 1);
                i--;
            }
        }
    }
}

//发布自定义事件(对应系统内置事件的run方法)
function selfRun(selftype, e) {
    var ary = this[selftype];
    if (ary && ary.length) {
        for (var i = 0; i < ary.length; i++) {
            if (typeof ary[i] === 'function') {
                ary[i].call(this, e);
            } else {
                ary.splice(i, 1);
                i--;
            }
        }
    }
}

function off(ele, type, fn) {
    //移除自定义事件
    if (/^self/.test(type)) {
        var ary = ele[type];
        if (ary && ary.length) {
            //遍历自定义事件type的事件池,如果找到fn则将其设置为null并退出
            for (var i = 0, len = ary.length; i < len; i++) {
                if (ary[i] === fn) {
                    ary[i] = null;
                    return;
                }
            }
        }
    } else {
        //移除系统内置事件
        //标准浏览器
        if (ele.removeEventListener) {
            ele.removeEventListener(type, fn, false);
        } else {
            //IE6~8
            var ary = ele["aEvent" + type];
            if (ary && ary.length) {
                //遍历事件池，将要移除的事件设置为null,在下次事件发生时执行run方法会先判断是否为函数,不是函数不会执行，并将其从事件池中移除
                for (var i = 0; i < ary.length; i++) {
                    if (ary[i] == fn) {
                        ary[i] = null;
                        return;
                    }
                }
            }

        }
    }
}
