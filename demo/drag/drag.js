/**
 * drag.js
 * @authors safilo (wulinqing@hotmail.com)
 * @date    2016-06-08 18:08:56
 * @version v1.0.0
 */

 /*
 * Drag：定义拖拽的类Drag
 * @param ele [object] -> 拖拽的元素
 */
function Drag(ele) {
    //初始化需要操作的属性
    this.ele = ele;
    this.distL = null;
    this.distT = null;
    this.ele.minL = null;
    this.ele.maxL = null;
    this.ele.minT = null;
    this.ele.maxT = null;
    //预处理down,move,up中的this关键字,使其指向当前实例
    this.DOWN = this.down.myBind(this); //myBind方法是bind的兼容性问题的解决方法
    this.MOVE = this.move.myBind(this);
    this.UP = this.up.myBind(this);
    //给this.ele绑定down方法
    on(this.ele, "mousedown", this.DOWN);
}

Drag.prototype.down = function(e) {
    // 获取当前鼠标位置与this.ele容器的左边框/上边框的距离
    this.distL = e.pageX - this.ele.offsetLeft;
    this.distT = e.pageY - this.ele.offsetTop;
    //根据当前窗口位置信息确定this.ele拖拽运动时的限制范围(只能在当前窗口中拖拽运动)
    this.ele.minL = (document.documentElement.scrollLeft || document.body.scrollLeft);
    this.ele.maxL = (document.documentElement.clientWidth || document.body.clientWidth) + this.ele.minL -this.ele.offsetWidth;
    this.ele.minT = (document.documentElement.scrollTop || document.body.scrollTop);
    this.ele.maxT = (document.documentElement.clientHeight || document.body.clientHeight) + this.ele.minT -this.ele.offsetHeight;
    //绑定move,up方法
    if (this.ele.setCapture) {
        this.ele.setCapture();
        on(this.ele, "mousemove", this.MOVE);
        on(this.ele, "mouseup", this.UP);
    } else {
        on(document, "mousemove", this.MOVE);
        on(document, "mouseup", this.UP);
    }
    e.preventDefault();
    //发布(执行)自定义事件,"selftDragStart"是down事件的一个标识符,可以预先通过该标识符为down事件订阅自定义事件，自定义事件在down发生后发布(执行),之后的"selfDragging"和"selfDragEnd"同理
    selfRun.call(this.ele,"selfDragStart",e);
};

Drag.prototype.move = function(e) {
    // 计算拖拽时this.ele的位置
    this.ele.curL = e.pageX - this.distL;
    this.ele.curT = e.pageY - this.distT;
    // 限制this.ele的拖拽范围
    this.ele.curL = this.ele.curL < this.ele.minL ? this.ele.minL :(this.ele.curL > this.ele.maxL ? this.ele.maxL : this.ele.curL);
    this.ele.curT = this.ele.curT < this.ele.minT ? this.ele.minT :(this.ele.curT > this.ele.maxT ? this.ele.maxT : this.ele.curT);
    //设置this.ele的位置
    this.ele.style.left = this.ele.curL + "px";
    this.ele.style.top = this.ele.curT + "px";
    //发布(执行)自定义事件
    selfRun.call(this.ele,"selfDragging",e);
};

Drag.prototype.up = function(e) {
    // 鼠标抬起后移除move,up方法
    if (this.ele.releaseCapture) {
        this.ele.releaseCapture();
        off(this.ele, "mousemove", this.MOVE);
        off(this.ele, "mouseup", this.UP);
    } else {
        off(document, "mousemove", this.MOVE);
        off(document, "mouseup", this.UP);
    }
    // 发布(执行)自定义事件
    selfRun.call(this.ele,"selfDragEnd",e);
};
