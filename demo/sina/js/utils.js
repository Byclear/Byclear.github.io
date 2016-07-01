/**
 * utils.js
 * @authors safilo (wulinqing@hotmail.com)
 * @date    2016-06-28 18:08:56
 * @version v1.0.0
 */

/*
 * 扩展或兼容方法
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

/*
 * utils方法库:事件、DOM操作、JS盒子模型、扩展方法
 */

var utils = (function() {
    var flag = 'getComputedStyle' in window;


    /*
     * 事件:跨浏览器的事件处理程序(包括自定义事件)及相应的大部分事件对象兼容处理
     */

    /*
     * on：订阅(绑定)系统内置事件或自定义事件的方法,兼容IE6~8
     * @param ele [object] -> 被订阅(绑定)的对象
     * @param type [string] -> 系统内置事件或自定义事件
     * @param fn [function] -> 订阅(绑定)的方法
     */
    function on(ele, type, fn) {
        //自定义事件
        if (/^self/.test(type)) {
            if (!ele[type]) { //ele[type]为自定义事件type的事件池
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
                if (!ele["aEvent" + type]) { //ele["aEvent" + type])为系统内置事件type的事件池
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
    function fire(selftype, e) {
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

    /*
     * DOM操作:跨浏览器的DOM操作方法
     */

    //getByClass:在一定范围内通过className获取元素
    function getByClass(curEle, strClass) {
        if (flag) { //高级
            return this.listToArray(curEle.getElementsByClassName(strClass));
        }
        var ary = [];
        var aryClass = strClass.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/g);
        var nodeList = curEle.getElementsByTagName('*'); //拿到当前元素下所有元素
        for (var i = 0; i < nodeList.length; i++) { //循环：目的是为了匹配每个元素的className是否符合要求，匹配要求：是这个元素上的className符合aryclass中的每一个className字符串
            var curNode = nodeList[i];
            var bOk = true; //假设法：假设都符合
            for (var k = 0; k < aryClass.length; k++) {
                var curClass = aryClass[k];
                //var reg=new RegExp('(\\b)'+curClass+'(\\b)');
                var reg = new RegExp('(^| +)' + curClass + '( +|$)');
                if (!reg.test(curNode.className)) {
                    bOk = false;
                }
            }
            if (bOk) {
                ary.push(curNode);
            }
        }
        return ary;
    }

    //hasClass:判断当前元素上是否有这个strClass（class名）
    function hasClass(curEle, strClass) {
        var reg = new RegExp('(\\b)' + strClass + '(\\b)');
        return reg.test(curEle.className);
    }

    //addClass:添加一堆class名
    function addClass(curEle, strClass) {
        var aryClass = strClass.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/g);
        for (var i = 0; i < aryClass.length; i++) {
            var curClass = aryClass[i];
            if (!this.hasClass(curEle, curClass)) {
                curEle.className += ' ' + curClass;
            }
        }

    }

    //removeClass:移除掉当前元素上的class名
    function removeClass(curEle, strClass) {
        var aryClass = strClass.replace(/(^\s+)|(\s+$)/g, '').split(/\s+/g);
        for (var i = 0; i < aryClass.length; i++) {
            var curClass = aryClass[i];
            if (this.hasClass(curEle, curClass)) {
                var reg = new RegExp('(^| +)' + curClass + '( +|$)');
                curEle.className = curEle.className.replace(reg, ' ');
            }
        }

    }

    //getCss:获取非行间样式
    function getCss(curEle, attr) {
        var val = null;
        var reg = null;
        if (flag) { //高级浏览器
            val = getComputedStyle(curEle, null)[attr];
        } else { //低级浏览器
            if (attr == 'opacity') { // alpha(opacity=10)
                val = curEle.currentStyle['filter'];
                reg = /^alpha\(opacity[=:](\d+(?:\.\d+))?\)$/i;
                return reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = curEle.currentStyle[attr];
            }

        }
        reg = /^([+-]?\d+(\.\d+)?)(px|pt|em|rem)?$/i; //-200px +200px 22.33px px pt em rem
        // reg=/^((\+|-)?\d+(\.\d+)?)(px|pt|em|rem)?$/i;
        return reg.test(val) ? parseFloat(val) : val;
    }

    //setCss:设置行间样式
    function setCss(curEle, attr, value) {
        //float
        if (attr == 'float') {
            curEle.style.cssFloat = value; //火狐
            curEle.style.styleFloat = value; //ie
            return;
        }
        //透明度的处理
        if (attr === 'opacity') {
            curEle.style.opacity = value;
            curEle.style.filter = 'alpha(opacity=' + value * 100 + ')';
            return;
        }
        //加单位的处理；
        var reg = /(width|height|top|right|bottom|left|((margin|padding)(top|right|bottom|left)?))/;
        if (reg.test(attr)) {
            value += 'px';
        }
        curEle.style[attr] = value;
    }

    //setGroupCss:设置一组样式
    function setGroupCss(curEle, options) {
        if (options.toString() !== '[object Object]') {
            return;
        }
        for (var attr in options) {
            this.setCss(curEle, attr, options[attr]);
        }
    }

    //css:获取和设置样式
    function css(curEle) {
        var argTwo = arguments[1];
        if (typeof argTwo === 'string') {
            if (typeof arguments[2] !== 'undefined') { // 单个设置
                this.setCss(curEle, argTwo, arguments[2]);
                return;
            } else { //获取
                return this.getCss(curEle, argTwo);
            }
        }
        argTwo = argTwo || 0;
        if (argTwo.toString() === '[object Object]') { //设置一组样式
            this.setGroupCss(curEle, argTwo);
        }
    }

    //children:获取当前元素的所有子节点
    function children(curEle, tagName) {
        var ary = [];
        if (flag) {
            ary = this.listToArray(curEle.children);
        } else {
            var chs = curEle.childNodes;
            for (var i = 0; i < chs.length; i++) {
                var curNode = chs[i];
                if (curNode.nodeType == 1) {
                    ary.push(curNode);
                }
            }
        }
        if (typeof tagName == 'string') {
            for (var i = 0; i < ary.length; i++) {
                if (ary[i].nodeName.toLowerCase() !== tagName.toLowerCase()) {
                    ary.splice(i, 1);
                    i--;
                }
            }
        }
        return ary;
    }

    // getParentByClass: 找到curEle拥有类名为strClass的第一个父元素
    function getParentByClass(curEle, strClass) {
        var par = curEle.parentNode;
        console.log(par.className);
        while (par) {console.log(par.className);
            if(this.hasClass(par, strClass)) {
                return par;
            }
            par = par.parentNode;
        }
        return new Error("当前元素不存在拥有类名"+strClass+"的父元素");
    }

    //prev:获取上一个哥哥元素
    function prev(curEle) {
        if (flag) {
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    //prevAll:获取所有的哥哥元素节点
    function prevAll(curEle) {
        var pre = this.prev(curEle);
        var ary = [];
        while (pre) {
            ary.unshift(pre);
            pre = this.prev(pre);
        }
        return ary;
    }

    //next:下一个弟弟元素节点
    function next(curEle) {
        if (flag) {
            return curEle.nextElementSibling;
        }
        var nex = curEle.nextSibling;
        while (nex && nex.nodeType !== 1) {
            nex = nex.nextSibling;
        }
        return nex;
    }

    //nextAll:所有的弟弟元素节点
    function nextAll(curEle) {
        var nex = this.next(curEle);
        var ary = [];
        while (nex) {
            ary.push(nex);
            nex = this.next(nex);
        }
        return ary;
    }

    //sibling:相邻元素节点
    function sibling(curEle) {
        var pre = this.prev(curEle);
        var nex = this.next(curEle);
        var ary = [];
        if (pre) ary.push(pre);
        if (nex) ary.push(nex);
        return ary;
    }

    //siblings:所有的兄弟元素节点
    function siblings(curEle) {
        return this.prevAll(curEle).concat(this.nextAll(curEle));
    }

    //firstChild:第一个子元素
    function firstChild(curEle) {
        var chs = this.children(curEle);
        return chs.length ? chs[0] : null;
    }

    //lastChild:最后一个子元素
    function lastChild(curEle) {
        var chs = this.children(curEle);
        return chs.length ? chs[chs.length - 1] : null;
    }

    //index:求当前元素的索引；
    function index(curEle) {
        return this.prevAll(curEle).length;
    }

    //appendChild:把元素插入到容器的末尾
    function appendChild(context, curEle) {
        context.appendChild(curEle);
    }

    //prepend:把元素插入到容器的最开头
    function prepend(context, curEle) {
        var fir = this.firstChild(context);
        if (fir) {
            context.insertBefore(curEle, fir);
        } else {
            context.appendChild(curEle);
        }
    }

    //insertBefore:把某个元素插入到指定元素的前面
    function insertBefore(curEle, oldEle) {
        oldEle.parentNode.insertBefore(curEle, oldEle);
    }

    //insertAfter:把某个元素插入到指定元素的后面
    function insertAfter(curEle, oldEle) {
        var nex = this.next(oldEle);
        if (nex) {
            oldEle.parentNode.insertBefore(curEle, nex);
        } else {
            oldEle.parentNode.appendChild(curEle);
        }

    }

    /*
     * JS盒子模型:offset、win等方法
     */

    //offset:当前元素距离body的偏移量
    function offset(curEle) {
        var l = 0;
        var t = 0;
        var par = curEle.offsetParent;
        l += curEle.offsetLeft;
        t += curEle.offsetTop;
        while (par) {
            //IE8 offsetLeft/top已经包含了边框，但是其他浏览器不包含边框；
            if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
                l += par.clientLeft;
                t += par.clientTop;
            }
            l += par.offsetLeft;
            t += par.offsetTop;
            par = par.offsetParent;

        }
        return { left: l, top: t };
    }

    //win:获取和设置浏览器盒子模型；
    function win(attr, value) {
        if (typeof value === 'undefined') {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = document.body[attr] = value;
    }

    /*
     * 扩展或兼容性解决方法:
     */

    //listToArray:类数组转数组
    function listToArray(arg) {
        if (flag) {
            return Array.prototype.slice.call(arg);
        } else {
            var ary = [];
            for (var i = 0; i < arg.length; i++) {
                ary.push(arg[i]);
            }
            return ary;
        }
    }

    //jsonParse:JSON格式的字符串转JSON格式数据
    function jsonParse(str) {
        return flag ? JSON.parse(str) : eval('(' + str + ')');
    }

    return {
        on: on,
        fire: fire,
        off: off,
        getByClass: getByClass,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getCss: getCss,
        setCss: setCss,
        setGroupCss: setGroupCss,
        css: css,
        getParentByClass : getParentByClass,
        children: children,
        prev: prev,
        prevAll: prevAll,
        next: next,
        nextAll: nextAll,
        sibling: sibling,
        siblings: siblings,
        firstChild: firstChild,
        lastChild: lastChild,
        index: index,
        appendChild: appendChild,
        prepend: prepend,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        offset: offset,
        win: win,
        listToArray: listToArray,
        jsonParse: jsonParse
    };
})();
