/**
 * index.js
 * @authors safilo (wulinqing@hotmail.com)
 * @date    2016-06-28 19:52:26
 * @version v1.0.0
 */

var container = document.getElementById("wb-feed-container"),
    // 微博模板
    template = utils.getByClass(container, "wb-feed-wrapper")[0].cloneNode(true),
    // 评论清单模板
    // commentListTemp = utils.getByClass(template, "wb-comment-list")[0].cloneNode(true),
    // repeat模板
    WBRepeatTemp = utils.getByClass(template, "wb-feed-repeat")[0].cloneNode(true);

//回复评论模板 replyTemp 
var replyTemp = document.createElement("div");
replyTemp.className = "wb-comment-reply";
replyTemp.innerHTML = '<div class="layer-arrow-t">' + '<i></i>' + '<em></em>' + '</div>';
var WBPublish = utils.getByClass(template, "wb-publish")[0].cloneNode(true);
utils.addClass(utils.getByClass(WBPublish, "publish-comment-btn")[0], "publish-replay");
replyTemp.appendChild(WBPublish);


container.innerHTML = "";


/*
 * 事件委托:发微博、表情框、评论
 */
var expressionBox = document.getElementById("expression-box"),
    expArrow = document.getElementById("exp-arrow"),
    mediaBox = document.getElementById("send-media-box"),
    mediaArrow = document.getElementById("send-media-arrow"),
    topicBox = document.getElementById("send-topic-box"),
    topicArrow = document.getElementById("send-topic-arrow"),
    curTextarea = null,
    aSelectFaces = []; //当前输入框

utils.on(document, "click", function(ev) {
    var target = ev.target;

    /*
     *选择表情框、图片、视频、话题功能时设置module的位置
     */
    (function(target) {
        function setLocation(container, arrow, target) {
            var l = utils.offset(target).left,
                t = utils.offset(target).top;
            utils.css(container, {
                display: "block",
                "left": utils.offset(target.parentNode).left,
                "top": t + target.offsetHeight
            });
            utils.css(arrow, {
                left: l - utils.offset(target.parentNode).left + target.offsetWidth / 2 - 6
            });
        }
        if (target.tagName.toUpperCase() == "A" && (utils.hasClass(target.parentNode, "rls-wb-kind") || utils.hasClass(target.parentNode, "publish-opt")) || target.parentNode.tagName.toUpperCase() == "A" && (utils.hasClass(target.parentNode.parentNode, "rls-wb-kind") || utils.hasClass(target.parentNode.parentNode, "publish-opt"))) {
            if (target.parentNode.tagName.toUpperCase() == "A") {
                target = target.parentNode;
            }
            //表情框箭头定位
            if (utils.hasClass(target, "send-exp-btn")) {
                setLocation(expressionBox, expArrow, target);
                //绑定当前输入框
                curTextarea = utils.prev(target.parentNode.parentNode).getElementsByTagName("textarea")[0];
                curTextarea.focus();
                if (utils.hasClass(target.parentNode, "publish-opt")) {
                    utils.css(curTextarea, {
                        borderColor: "#fa7d3c",
                        boxShadow: "none"
                    });
                }
                utils.css(curTextarea.parentNode, {
                    borderColor: "#fa7d3c",
                    boxShadow: "none"
                });
            }
            //图片、视频框箭头定位
            if (utils.hasClass(target, "send-media-btn") || utils.hasClass(target, "send-video-btn")) {
                if (utils.hasClass(target, "send-media-btn")) {
                    var str = '<ul class="clearfix">';
                    str += '<li>';
                    str += '<a href="javascript:void(0);" target="_blank" rel="external">';
                    str += '<em>#</em>';
                    str += '<span>单图/多图</span>';
                    str += '</a>';
                    str += '</li>';
                    str += '<li>';
                    str += '<a href="javascript:void(0);" target="_blank" rel="external">';
                    str += '<em>#</em>';
                    str += '<span>拼图</span>';
                    str += "</a>";
                    str += '</li>';
                    str += '<li>';
                    str += '<a href="javascript:void(0);" target="_blank" rel="external">';
                    str += '<em>#</em>';
                    str += '<span>截屏</span>';
                    str += "</a>";
                    str += '</li>';
                    str += '<li>';
                    str += '<a href="javascript:void(0);" target="_blank" rel="external">';
                    str += '<em>#</em>';
                    str += '<span>传至相册</span>';
                    str += "</a>";
                    str += '</li>';
                    str += '</ul>';
                    utils.getByClass(mediaBox, "mb-media")[0].innerHTML = str;
                }
                if (utils.hasClass(target, "send-video-btn")) {
                    var str = '<ul class="clearfix">';
                    str += '<li>';
                    str += '<a href="javascript:void(0);" target="_blank" rel="external">';
                    str += '<em>#</em>';
                    str += '<span>本地视频</span>';
                    str += '</a>';
                    str += '</li>';
                    str += '<li>';
                    str += '<a href="javascript:void(0);" target="_blank" rel="external">';
                    str += '<em>#</em>';
                    str += '<span>在线视频</span>';
                    str += "</a>";
                    str += '</li>';
                    str += '</ul>';
                    utils.getByClass(mediaBox, "mb-media")[0].innerHTML = str;
                }
                setLocation(mediaBox, mediaArrow, target);
            }
            //话题框箭头定位
            if (utils.hasClass(target, "send-topic-btn")) {
                setLocation(topicBox, topicArrow, target);
            }
        }
    })(target);

    /*
     * 查看评论 
     */
    if (target.tagName.toUpperCase() == "A" && utils.hasClass(target, "handle-comment") || target.parentNode.tagName.toUpperCase() == "A" && utils.hasClass(target.parentNode, "handle-comment")) {
        if (target.parentNode.tagName.toUpperCase() == "A") {
            target = target.parentNode;
        }
        var handleBox = target.parentNode.parentNode.parentNode,
            WBRepeat = utils.next(handleBox),
            commentBox = utils.getByClass(WBRepeat, "wb-comment-wrapper")[0],
            commentUL = utils.getByClass(commentBox, "wb-comment-ul")[0],
            rid = target.getAttribute("rid");
        commentUL.innerHTML = "";
        if (WBRepeat.style.display == "none") {
            WBRepeat.style.display = "block";
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].id == rid) {
                    var commentContent = data[i].comment.commentContent,
                        commentListTemp = utils.getByClass(template, "wb-comment-list")[0].cloneNode(true),
                        frg = document.createDocumentFragment();
                    for (var key in commentContent) {
                        commentBox.style.display = "block";
                        var curList = commentListTemp.cloneNode(true);
                        utils.getByClass(curList, "wb-comment-faceImg")[0].src = commentContent[key][0];
                        utils.getByClass(curList, "wb-feed-text")[0].innerHTML = '<a href="javascript:void(0)" nickname="' + key + '" target="_blank" rel="external">@' + key + '</a>：' + commentContent[key][1];
                        utils.getByClass(curList, "comment-release-time")[0].innerHTML = commentContent[key][2];
                        utils.getByClass(curList, "comment-release-time")[0].innerHTML = commentContent[key][2];
                        utils.getByClass(curList, "comment-praise-count")[0].innerHTML = commentContent[key][3];

                        frg.appendChild(curList);
                    }

                    commentUL.appendChild(frg);
                    return;
                }
            }
        } else {
            WBRepeat.style.display = "none";
        }

    }

    /*
     * 回复按钮
     */
    if (target.tagName.toUpperCase() == "A" && utils.hasClass(target, "reply-btn") || target.parentNode.tagName.toUpperCase() == "A" && utils.hasClass(target.parentNode, "reply-btn")) {
        if (target.parentNode.tagName.toUpperCase() == "A") {
            target = target.parentNode;
        }
        var curWrap = target.parentNode.parentNode.parentNode.parentNode.parentNode;
        curReplyBox = utils.getByClass(curWrap, "wb-comment-reply")[0];
        replyBox = replyTemp.cloneNode(true);
        if (!curReplyBox) {
            curWrap.appendChild(replyBox);
        } else if (curReplyBox.style.display == "none") {
            curReplyBox.style.display = "block";
        } else {
            curReplyBox.style.display = "none";
        }
        refreshCheckbox();

    }

    /*
     * 评论功能
     */
    if (target.tagName.toUpperCase() == "A" && utils.hasClass(target, "publish-comment-btn")) {
        var WBRepeat = utils.getParentByClass(target, "wb-feed-repeat"),
            wrapper = utils.getByClass(WBRepeat, "wb-comment-wrapper")[0],
            commentUL = utils.getByClass(WBRepeat, "wb-comment-ul")[0];
        wrapper.style.display = "block";
        // 获取当前文本框
        curTextarea = utils.prev(target.parentNode.parentNode).getElementsByTagName("textarea")[0];
        var result = formartText(curTextarea.value),
            curList = utils.getByClass(template, "wb-comment-list")[0].cloneNode(true),
            oDate = new Date(),
            oMonth = (oDate.getMonth() + 1) < 10 ? '0' + oDate.getMonth() + 1 : oDate.getMonth(),
            oDay = oDate.getDate() < 10 ? '0' + oDate.getDate() : oDate.getDate(),
            oHour = oDate.getHours() < 10 ? '0' + oDate.getHours() : oDate.getHours(),
            oMinute = oDate.getMinutes() < 10 ? '0' + oDate.getMinutes() : oDate.getMinutes(),
            curDate = oMonth + "月" + oDay + "日 " + oHour + ":" + oMinute;


        // 生成评论
        if (!result) return;
        utils.getByClass(curList, "wb-comment-faceImg")[0].src = "./images/user-face/user1.jpg";
        utils.getByClass(curList, "wb-feed-text")[0].innerHTML = '<a href="javascript:void(0);" nickname="odabui" target="_blank" rel="external">@odaobui</a>：' + result;
        utils.getByClass(curList, "comment-release-time")[0].innerHTML = curDate;
        if (utils.hasClass(target, "publish-replay")) {
            var curReplyBox = target.parentNode.parentNode.parentNode.parentNode,
                curUserName = utils.prev(utils.prev(curReplyBox)).getElementsByTagName("a")[0].getAttribute("nickName");
            utils.getByClass(curList, "wb-feed-text")[0].innerHTML = '<a href="javascript:void(0);" nickname="odabui" target="_blank" rel="external">odaobui</a>：' + '回复<a href="javascript:void(0);" nickname="' + curUserName + '" target="_blank" rel="external"> @' + curUserName + '</a>：' + result;
            curReplyBox.style.display = "none";
        }

        utils.prepend(commentUL, curList)
        curTextarea.value = null;
        aSelectFaces = [];

    }

});

utils.on(document.body, "click", function(ev) {
    expressionBox.style.display = "none";
    mediaBox.style.display = "none";
    topicBox.style.display = "none";
    utils.css(hostReleaseIpt, {
        borderColor: "#ccc",
        boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.15) inset"
    });
    aKeyWord[0].style.display = "block";
    aTextCount[0].style.display = "none";
});

utils.on(expressionBox, "click", function(ev) {
    var target = ev.target;
    if (target.tagName.toUpperCase() === "A" && utils.hasClass(target.parentNode, "mb-close")) {
        this.style.display = "none";
        return;
    }
    /*
     * 发微博时选择表情
     */
    if (target.tagName.toUpperCase() == "LI" && utils.hasClass(target, "mb-faces-li") || target.parentNode.tagName.toUpperCase() == "LI" && utils.hasClass(target.parentNode, "mb-faces-li")) {
        curTextarea.focus();
        utils.css(curTextarea.parentNode, {
            borderColor: "#fa7d3c",
            boxShadow: "none"
        });
        if (target.parentNode.tagName.toUpperCase() == "LI") {
            target = target.parentNode;
        }
        var curImg = target.getElementsByTagName("img")[0],
            imgSrc = curImg.src;
        // 绑定当前输入框
        curTextarea.value += '[' + target.title + ']';
        // 选择表情,将选择的表情存在aSelectFaces数组里，供点击发微博按钮时提取
        var obj = {
            title: target.title,
            src: curImg.src
        };
        aSelectFaces.push(obj);

    }
    ev.stopPropagation();
});

utils.on(mediaBox, "click", function(ev) {
    var target = ev.target;
    if (target.tagName.toUpperCase() === "A" && utils.hasClass(target.parentNode, "mb-close")) {
        this.style.display = "none";
    }
    ev.stopPropagation();
});

utils.on(topicBox, "click", function(ev) {
    var target = ev.target;
    if (target.tagName.toUpperCase() === "A" && utils.hasClass(target.parentNode, "mb-close")) {
        this.style.display = "none";
    }
    ev.stopPropagation();
});


/*
 * 绑定微博数据和发微博
 */

function bindData(resData) {
    data = resData;
    var DOMFrg = document.createDocumentFragment();
    for (var i = 0, len = data.length; i < len; i++) {
        DOMFrg.appendChild(loadBlog(data[i], data));
    }
    container.appendChild(DOMFrg);
    refreshCheckbox();
}

var data = null;
ajax({
    url: "./js/jsonData.json",
    type: "GET",
    ansync: true,
    success: bindData
});

/*
 *主页发微博监听输入框事件
 */
var hostReleaseIpt = document.getElementById("host-release-input"),
    hostReleaseTextarea = utils.children(hostReleaseIpt, "textarea")[0],
    aKeyWord = utils.getByClass(document, "rls-wb-keyword"),
    aTextCount = utils.getByClass(document, "rls-wb-textCount"),
    curTextCount = 140,
    rlsSubmitBtn = utils.getByClass(document, "rls-wb-submitBtn")[0];
utils.on(hostReleaseIpt, "click", function(ev) {
    utils.css(this, {
        borderColor: "#fa7d3c",
        boxShadow: "none"
    });
    aKeyWord[0].style.display = "none";
    aTextCount[0].style.display = "block";
    ev.stopPropagation();
});
utils.on(hostReleaseTextarea, "keyup", function() {
    var val = this.value.length,
        count = 140 - val;
    aTextCount[0].innerHTML = count >= 0 ? ('还可以输入<span>' + count + '</span>个字') : ('已超出<span class="count-overflow">' + Math.abs(count) + '</span>个字');
});

/*
 * 格式化文本框的文字
 */
function formartText(str) {
    // 网址
    var linkReg = /(http(s)?:\/\/)(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*/g;
    if (linkReg.test(str)) {
        str = str.replace(linkReg, function() {
            return '<a href="' + arguments[0] + '" target="_blank">' + arguments[0] + '</a>';
        });
        console.log("link is success");
    }
    // @好友
    var callReg = /@(\w||[\u4e00-\u9fa5])+/g;
    if (callReg.test(str)) {
        str = str.replace(callReg, function() {
            return '<a href="javascript:void(0);" target="_blank" rel="external">' + arguments[0] + '</a>';
        });
        console.log("@ is success");
    }
    // 表情
    var faceReg = /\[(\w||[\u4e00-\u9fa5])+\]/g; /* console.log(str)*/
    if (faceReg.test(str)) {
        str = str.replace(faceReg, function() {
            var isIn = false;
            for (var i = 0, len = aSelectFaces.length; i < len; i++) {
                var curTitle = '[' + aSelectFaces[i].title + ']';
                if (curTitle == arguments[0]) {
                    isIn = true;
                    return '<img src="' + aSelectFaces[i].src + '" alt="" title="' + aSelectFaces[i].title + '">';
                }
            }
            if (!isIn) {
                return arguments[0];
            }
        });
        console.log("faces is success");
    }
    console.log("最终结果: " + str);
    return str;
}
//发微博按钮 
utils.on(rlsSubmitBtn, "click", function(ev) {
    var curTextarea = hostReleaseTextarea,
        result = formartText(curTextarea.value);

    if (!result) return;
    var curWrap = template.cloneNode(true);
    curWrap.setAttribute("rid", utils.children(container).length + 1);
    utils.getByClass(curWrap, "host-nickName")[0].innerHTML = "odaobui";
    utils.getByClass(curWrap, "host-user-face")[0].getElementsByTagName("img")[0].src = "./images/user-face/user1.jpg";
    utils.getByClass(curWrap, "host-user-face")[0].getElementsByTagName("img")[0].setAttribute("data-img", "./images/user-face/user1.jpg");
    var oDate = new Date(),
        oMonth = (oDate.getMonth() + 1) < 10 ? '0' + oDate.getMonth() + 1 : oDate.getMonth(),
        oDay = oDate.getDate() < 10 ? '0' + oDate.getDate() : oDate.getDate(),
        oHour = oDate.getHours() < 10 ? '0' + oDate.getHours() : oDate.getHours(),
        oMinute = oDate.getMinutes() < 10 ? '0' + oDate.getMinutes() : oDate.getMinutes(),
        curDate = oMonth + "月" + oDay + "日 " + oHour + ":" + oMinute;

    utils.getByClass(curWrap, "host-release-time")[0].innerHTML = curDate;
    utils.getByClass(curWrap, "host-text")[0].innerHTML = result;
    utils.getByClass(curWrap, "host-forward-count")[0].innerHTML = "转发";
    utils.getByClass(curWrap, "host-comment-count")[0].innerHTML = "评论";
    utils.getByClass(curWrap, "host-comment-count")[0].parentNode.setAttribute("rid", utils.children(container).length + 1);
    utils.getByClass(curWrap, "host-praise-count")[0].innerHTML = "赞";
    utils.prepend(container, curWrap);
    curTextarea.value = null;
    aSelectFaces = [];

});

function loadBlog(curData, allData) {
    var id = curData.id,
        nickName = curData.nickName,
        userFace = curData.userFace,
        releaseTime = curData.releaseTime,
        text = curData.text,
        img = curData.img,
        commentCount = curData.comment.commentCount,
        commentContent = curData.comment.commentContent,
        forwardCount = curData.forwarded.forwardCount,
        forwardComment = curData.forwarded.forwardComment,
        isForward = curData.isForward,
        forwardFrom = curData.forwardFrom,
        praise = curData.praise;

    var curWrap = template.cloneNode(true);
    curWrap.setAttribute("rid", id);
    utils.getByClass(curWrap, "host-nickName")[0].innerHTML = nickName;
    utils.getByClass(curWrap, "host-user-face")[0].getElementsByTagName("img")[0].src = userFace;
    utils.getByClass(curWrap, "host-user-face")[0].getElementsByTagName("img")[0].setAttribute("data-img", userFace);
    utils.getByClass(curWrap, "host-release-time")[0].innerHTML = releaseTime;
    utils.getByClass(curWrap, "host-text")[0].innerHTML = text;
    utils.getByClass(curWrap, "host-forward-count")[0].innerHTML = forwardCount || "转发";
    utils.getByClass(curWrap, "host-comment-count")[0].innerHTML = commentCount || "评论";
    utils.getByClass(curWrap, "host-comment-count")[0].parentNode.setAttribute("rid", id)
    utils.getByClass(curWrap, "host-praise-count")[0].innerHTML = praise || "赞";
    //原创微博
    if (!isForward) {
        var str = "";
        str += '<li class="feed-media-video">';
        str += '<img src="' + img[0] + '" alt="data-img">';
        str += '</li>';
        for (var i = 0, len = img.length; i < len; i++) {
            utils.getByClass(curWrap, "media-host-box")[0].getElementsByTagName("ul")[0].innerHTML += str;
        }
    } else {
        //转发的微博
        var forwardBox = utils.getByClass(curWrap, "wb-feed-farward")[0];
        forwardBox.style.display = "block";
        for (var i = 0, len = allData.length; i < len; i++) {
            if (allData[i].id === forwardFrom) {
                utils.getByClass(forwardBox, "forward-nickName")[0].innerHTML = '@' + allData[i].nickName;
                utils.getByClass(forwardBox, "forward-text")[0].innerHTML = allData[i].text;
                utils.getByClass(forwardBox, "forward-release-time")[0].innerHTML = allData[i].releaseTime;
                utils.getByClass(curWrap, "func-handle-forward-c")[0].innerHTML = allData[i].forwarded.forwardCount || "转发";
                utils.getByClass(curWrap, "func-handle-comment-c")[0].innerHTML = allData[i].comment.commentCount || "评论";
                utils.getByClass(curWrap, "func-handle-praise-c")[0].innerHTML = allData[i].praise || "赞";
            }
        }

    }
    return curWrap;
}




/*
 * 使所有选项框对应其label
 */
function refreshCheckbox() {
    var aLabels = utils.getByClass(document, "optLabel");
    for (var i = 0, len = aLabels.length; i < len; i++) {
        aLabels[i].setAttribute("for", "forward" + i);
        aLabels[i].getElementsByTagName("input")[0].setAttribute("id", "forward" + i);
    }
}
