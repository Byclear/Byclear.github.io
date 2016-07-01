/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-06-29 17:18:32
 * @version $Id$
 */
/************************************************************
{
    "id": "id",
    "nickName": "userName",
    "userFace": "imgUrl",
    "releaseTime": "time",
    "text": "text",
    "img": ["img1Url", "img2Url", "img3Url"],
    "comment": { 
        "commentCount": "num", 
        "commentContent": {
            "nickName": "commentContent" ,
            "nickName": "commentContent" ,
            "nickName": "commentContent" 
        } 
     },
    "forwarded": {
        "forwardCount": "num", 
        "forwardComment": { 
            "nickName": "forwardComment",
            "nickName": "commentContent" ,
            "nickName": "commentContent" 
            } 
        },
    "isForward": 1,
    "forwardFrom": "id",
    "praise" : "praise count"
}
*************************************************************/
var data = [{
    "id": "001",
    "nickName": "前端攻城狮",
    "userFace": "./images/user-face/user1.jpg",
    "releaseTime": "3月26日 01:37",
    "text": "<a>@W3CPlus</a><a>@前端攻城狮</a>【提高Web页面性能的技巧】现在动辄几兆大小的页面加载量，让性能优化成了不可避免的热门话题。WEB 应用越流畅，用户体验就会越好，继而带来更多的访问量。网页链接（来自： <a>W3CPlus</a>）",
    "img": ["./images/feedimg/feedimg1.jpg"],
    "comment": {
        "commentCount": 0,
        "commentContent": {
            /*"IT程序员": ["./images/user-face/user2.jpg","WEB 应用越流畅，用户体验就会越好，继而带来更多的访问量。","6月30日 00:28",245],
            "HTML5梦工厂": ["./images/user-face/user1.jpg","重定向状态码要么告知客户端使用替代位置来访问她们所感兴趣的资源，要么就提供一个替代的响应而不是资源的内容。","6月30日 00:28",2134],
            "IT程序员": ["./images/user-face/user2.jpg","WEB 应用越流畅，用户体验就会越好，继而带来更多的访问量。","6月30日 00:28",245],
            "HTML5梦工厂": ["./images/user-face/user1.jpg","重定向状态码要么告知客户端使用替代位置来访问她们所感兴趣的资源，要么就提供一个替代的响应而不是资源的内容。","6月30日 00:28",2134]*/
        }
    },
    "forwarded": {
        "forwardCount": 4321,
        "forwardComment": {
            "HTML5梦工厂": ["./images/user-face/user1.jpg","重定向状态码要么告知客户端使用替代位置来访问她们所感兴趣的资源，要么就提供一个替代的响应而不是资源的内容。"]
        }
    },
    "isForward": 0,
    "forwardFrom": "",
    "praise": 423
}, {
    "id": "002",
    "nickName": "HTML5梦工厂",
    "userFace": "./images/user-face/user2.jpg",
    "releaseTime": "5月26日 01:37",
    "text": "【JavaScript中的命名空间 这个比传统方法更优雅安全和灵活】传统方法告诉我们，最好的消除全局策略是创建少数作为潜在模块和子系统的实际命名空间的全局对象。我将探索几种有关命名空间的方式，并以我基于James Edwards最近的一篇文章得到的一个优雅、安全和灵活的解决方案结束。",
    "img": ["./images/feedimg/feedimg1.jpg"],
    "comment": {
        "commentCount": 5678,
        "commentContent": {
            "IT程序员": ["./images/user-face/user2.jpg","WEB 应用越流畅，用户体验就会越好，继而带来更多的访问量。","6月30日 00:28",245],
            "HTML5梦工厂": ["./images/user-face/user1.jpg","重定向状态码要么告知客户端使用替代位置来访问她们所感兴趣的资源，要么就提供一个替代的响应而不是资源的内容。","6月30日 00:28",2134]
        }
    },
    "forwarded": {
        "forwardCount": 8765,
        "forwardComment": {
            "HTML5梦工厂": ["./images/user-face/user1.jpg","重定向状态码要么告知客户端使用替代位置来访问她们所感兴趣的资源，要么就提供一个替代的响应而不是资源的内容。"]
        }
    },
    "isForward": 1,
    "forwardFrom": "001",
    "praise": 2642
}, {
    "id": "003",
    "nickName": "IT程序员",
    "userFace": "./images/user-face/user2.jpg",
    "releaseTime": "5月26日 01:37",
    "text": "《中国移动2016年终端质量报告》新鲜出炉， 3000元以下机型综合排名TOP3国产机型占据多半江山。不过摄像头评测排名细节耐人寻味（1500~3000元档），荣耀V8排名第一，而主打拍照卖点的OPPO R9排名仅在第四位，所以双摄像头优势还是很明显的，你们觉得呢？",
    "img": ["./images/feedimg/feedimg1.jpg"],
    "comment": {
        "commentCount": 8910,
        "commentContent": {
            "IT程序员": ["./images/user-face/user2.jpg","WEB 应用越流畅，用户体验就会越好，继而带来更多的访问量。","6月30日 00:28",245],
            "HTML5梦工厂": ["./images/user-face/user1.jpg","重定向状态码要么告知客户端使用替代位置来访问她们所感兴趣的资源，要么就提供一个替代的响应而不是资源的内容。","6月30日 00:28",2134]
        }
    },
    "forwarded": {
        "forwardCount": 1098,
        "forwardComment": {
            "HTML5梦工厂": "重定向状态码要么告知客户端使用替代位置来访问她们所感兴趣的资源，要么就提供一个替代的响应而不是资源的内容。"
        }
    },
    "isForward": 1,
    "forwardFrom": "002",
    "praise" :""
}]
