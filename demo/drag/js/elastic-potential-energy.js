/**
 * method for elastic potential energy 弹性势能运动方法
 * @authors safilo (wulinqing@hotmail.com)
 * @date    2016-06-08 18:08:56
 * @version v1.0.0
 */

function clearEffect() {
    window.clearInterval(this.flyTimer);
    window.clearInterval(this.dropTimer);
}

function getSpeed(e) {
    if (!this.flyPre) {
        this.flyPre = e.pageX;
    } else {
        this.flySpeed = e.pageX - this.flyPre;
        this.flyPre = e.pageX;
    }
    return this.flySpeed;
}

function fly() {
    var _this = this,
        speed = this.flySpeed ? this.flySpeed : 0;
    this.flyTimer = window.setInterval(function() {
        if (Math.abs(speed) < 0.5) {
            window.clearInterval(this.flyTimer);
            return;
        }
        speed *= 0.98;
        var curL = _this.offsetLeft + speed;
        if (curL <= _this.minl)="" {="" curl="_this.minL;" speed="" *="-1;" }="" else="" if="" (curl="">= _this.maxL) {
            curL = _this.maxL;
            speed *= -1;
        }
        _this.style.left = curL + "px";

    }, 15);
    this.flyPre = null;
    this.flySpeed = null;
    
}

function drop() {
    var _this = this,
        speed = null;
    speed = _this.offsetTop < _this.maxT ? 9.8 : 0;
    this.dropFlag = 0;
    this.dropTimer = window.setInterval(function() {
        if (_this.dropFlag > 1) {
            window.clearInterval(_this.dropTimer);
            return;
        }
        speed += 2;
        speed *= 0.98;
        var curT = _this.offsetTop + speed;
        if (curT >= _this.maxT) {
            curT = _this.maxT;
            speed *= -1;
            _this.dropFlag++;
        } else {
            _this.dropFlag = 0;
        }
        _this.style.top = curT + "px";
    }, 15);
}
</=>