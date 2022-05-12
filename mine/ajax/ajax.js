// 默认参数
$.ajaxSettings = {
    url: ajaxLocation, // window.location.href，并对ie兼容
    type: 'get', // 默认是get, 或者用method: 'get'
    data: null, // 传的数据

    // 设置：Request Headers (Accept)
    // 如果dataType为null，也就是默认情况下，accept: */*
    // 如果dataType为html，accept: text/html, */8; q= 0.01
    // 'html text xml json json' > [html, text, xml]
    // json 和 jsonp 都会转换为 script
    dataType: null, 
    accepts: {
        '*': allTypes, // allTypes = '*/'.concat('*');
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
    },

    // 设置：Request Header (content-type)
    // 'application/josn; charset=UTF-8', 'text/script'
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8', // 默认情况

    // 检测到响应头信息
    // Response Header 中也有 content-type字段
    // 如果服务器端没有设置这个字段，服务会根据返回的内容自动匹配设置
    // 如果没有设置dataType这个值，jquery自动根据服务器response header中的content-type来设别返回的数据
    contents: { // 设置请求头能接受的数据类型，*/*
        xml: /xml/,
        html: /html/,
        json: /json/,
    },

    global: true, // 是否可以触发全局事件
    async: true, // 是否异步

    // 超时处理，默认是0，就是一直会等，如果设置了10，在10ms内还没有响应就会走error
    // 超时后，触发abort, 触发error，触发complete
    timeout: 0, 
    processData: true, // 是否串联化数据，data: {name: 'fan'}，把它转为name=fan&...
    cache: null, // 防止在ie出现缓存，设置为false, url后面会有_=1231231231233时间戳
    isLocal: rlocalProtocol.test(), // 检测当前环境，是不是本地
    username: null,
    password: null,
    throws: false,
    traditional: false,
    header: {}, // 设置请求头部信息
    context: null, // 用于指定请求的上下文，用于全局绑定的ajax事件
    flatOptions: { // 参数合并时，如果是这两个key，直接复制不做深拷贝
        url: true,
        context: true
    },
    converters: {
        "* text": String,
        "text html": true,
        "text json": jQuery.parseJSON,
        "text xml": jQuery.parseXML
    },
    responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
    },
}

// ajax 原生事件 
// xhr.onreadystatechange; xhr.status(200-300或者304); xhr.readyState(0,1,2,3,4)
// xhr = new XMLHttpRequest(), readyState = 0; ajaxStart
// xhr.open(type, url, async, username, password); readyState = 1, 代表连接状态,已经调用了open方法,准备发送请求
// xhr.send(data), readyState = 2, 代表发送状态,已经调用了send方法,尚未得到响应数据; ajaxSend

// 如果没能联通服务器, xhr.status != 200
// xhr.status = 404 or 403 or 500; ajaxError, ajaxComplete

// 如果能和服务器联通，之后的状态都是 xhr.status = 200!
// xhr.readyState = 3 代表正在接收状态,已经接收了HTTP响应的头部信息,正在接收响应内容;
// xhr.readyState = 4 代表已经加载状态,此时响应内容已经被完全接收; ajaxSuccess, ajaxComplete

// 在请求过程中执行xhr.abort(), ajaxStop, 会不会执行ajaxComplete呢？

// ajax 全局事件
// $.event.trigger('ajaxStart', 'ajaxStop'), 这两种回调，只能绑定到document才能触发
// globalEventContext.trigger('ajaxSuccess','ajaxError','ajaxComplete','ajaxSend'), 
//       可以通过绑定到非document元素来触发，前提是必须指定context选项, 并且回调也绑定到那个dom元素上

/*
new XMLHttpRequest()
0   请求未初始化 status = 0

1   正在建立连接 status = 0
    open(type, url, true)
    setRequestHeader(key, value);
    send(data || null)

2   已建立连接，还没有接收  status = 200 / 304 / 403 / 404 / 500

3   正在接受响应数据 status = 200

4   响应接受完成，且就绪 status = 200

*/


// 防止出现循环引用, 内存泄漏
// url: window.location  和  context: {}
$.ajaxExtend = function() {}

// 自定义参数，覆盖默认参数，内部调用的是ajaxExtend
// 可以传一个参数，覆盖默认的$.ajaxSettings
// 也可传两个参数，生成一个新的{}，不影响全局的$.ajaxSettings
$.ajaxSetup = function() {}


/**
 * 预过滤器：发送ajax之前，做一些处理
 * prefilters = {json: function(){}, jsonp: function(){}, script: function(){} };
 * */
$.ajaxPrefilter = function() {};
/**
 * dataType为json、jsonp、script，通过prefilter之后，dataType变为[script, json]
 *
 * dataType为undefined或*，通过prefilter之后，dataType变为[*]
 * */

/**
 * 分发处理器：不同形式的操作，ajax或者动态创建script
 * transports = {*: function(){}, script: function(){} } 请求方式ajax、script
 */
$.ajaxTransport = function() {};
/**
 * 如果dataType[0]为script，则用动态创建script标签的形式去获取数据
 * 如果dataType[0]为*，则用new XMLHttpRequest形式去获取数据
 * */


// 
function ajaxHandleResponse() {

}

// 类型转化器，识别服务器返回的数据类型，与设定的dataType匹配，一致执行success，不一致执行error
function ajaxConvert() {

}

// basic, obj中最基本有五个配置项
$.ajax = function(obj) {

}

/*
jquery中各个事件执行顺序如下：

1.ajaxStart(全局事件) 只能通过$.event.trigger('ajaxStart')来触发;

2.beforeSend

3.ajaxSend(全局事件)

4.success

5.ajaxSuccess(全局事件)

6.error

7.ajaxError (全局事件)

8.complete

9.ajaxComplete(全局事件)

10.ajaxStop(全局事件) 只能通过$.event.trigger('ajaxStop')来触发;
*/

$.ajax({
    type: 'get', // post, 默认是get
    url: '', // 请求的地址，必须填写

    // 告诉服务器需要的数据类型, 默认为？
    dataType: 'html json jsonp script',

    // 需要发送给服务器的数据，如果type为get，则以href形式发送send(null)，如果为post，则放在请求的body里xhr.send(data)
    data: {},

    // 发送之前，可以用来设置请求头的信息
    beforeSend: function() {},

    // 请求成功的回调，
    success: function(data, status, jqXHR) {},

    // 请求失败的回调，
    error: function(data, status, jqXHR) {},

    // 请求结束的回调，不管是成功或是失败都执行
    complete: function(jqXHR, status) {},
}).done(function(data, status, jqXHR) {}).fail(function(data, status, jqXHR) {}).then(done_fn, fail_fn, progress_fn);

// 加载html模板
// 有四个配置项
// 这边成功的回调内容帮我做了，就是把请求的html插入到指定的节点中！！
$.fn.load = function(url, data, complete_fn) {
    // 默认的type: get
    // 默认的dataType: html
    // url: 'xxx.html selector'，如果传了selector，可以过滤请求到的数据
    // data: 如果配置了data, 请求的类型转为post
    // complete_fn: arguments > [data, status, jqXHR]，
};

// 内部 return $.ajax({})
// 有四个配置项
// callBack对应的是成功回调
$.get = function(url, data, callBack, dataType) {
    // 调整参数
    if ($.type(data) == 'function') {
        dataType = dataType || callBack;
        callBack = data;
        data = null;
    }

    return $.ajax({
        type: 'get',
        url: url,
        dataType: dataType,
        data: data,
        success: callBack, // 这是成功的回调
    });
};
$.post = function(url, data, callBack, dataType) {}; // 同上

// 内部调用$.get
// callBack对应的是成功回调
// 注意：返回的必须是json，才会执行成功的回调
$.getJSON = function(url, data, callBack) {
    return $.get(url, data, callBack, 'json');
};

// 注意：返回的必须是js，才会执行成功回调
// 按需加载js
$.getScript = function(url, callBack) {
    return $.get(url, undefined, callBack, 'script');
};


// dataType: jsonp
data = {
    callback: 'jQuery23123123123123123' // 自动生成的数据
}
$.ajax({
    type: 'get',
    url: 'xxx',
    dataType: 'jsonp',
    data: {},
    success: function(data) {
        // data: 后台返回的包含在jQuery23123123123123(obj)中的obj
    }
});
