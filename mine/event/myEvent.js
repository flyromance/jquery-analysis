/**
 * Created by Administrator on 2015/12/26.
 *
 * window.onload
 * img.onload 只要给img元素设置了src就开始加载，不一定要插入到文档中；要在设置src前，监听onload事件
 * script.onload 只有当添加到文档中，并且设置了src，才开始下载；在append之前，监听即可；
 * 不支持冒泡的事件：mouseenter、mouseleave、focus、blur
 * 对应的冒泡的事件：mouseover、mouseout、focuein、focusout
 * 拖拽功能模拟：mousedown、mousemove、mouseup
 */
var eventUtil = {
    addEvent: function(obj, type ,handler){
        if (obj.addEventListener){
            // this指向为obj;
            obj.addEventListener(type, handler, false);
        } else if (obj.attachEvent){
            // IE678中，fn中的this指向window！需要做修改
            // 只有冒泡，没有捕获
            obj.attachEvent(obj, fn);
        } else {
            // this指向obj，但是只能绑定一个函数；
            obj["on" + type] = fn;
        }
    },
    removeEvent: function(obj, type , handler){
        if ( obj.removeEventListener ){
            // handler不能为匿名函数；
            obj.removeEventListener(type, handler, false);
        }else if( obj.detachEvent ){
            obj.detachEvent(type, handler);
        }else{
            obj["on" + type] = null;
        }
    },
    getEvent: function(ev){
        return ev || window.event;
    },
    getTarget: function(ev){
        return ev.target || ev.srcElement;
    },
    getRelated: function(ev){
        return ev.relatedTarget;
    },
    preventDefault: function(ev){
        if (ev.preventDefault) {
            ev.preventDefault();
        }else{
            ev.returnValue = false;
        }
    },
    stopPropagation: function(ev){
        if (ev.stopPropagation) {
            ev.stopPropagation();
        } else {
            ev.cancelBubble = true;
        }
    }
};
// 有别与传统的绑定对象操作，这里把对象事件函数储存在对应事件对象的上，jquery是存在一个新建对象上，防止内存泄露；
function addEvent(obj, type, fn){
    // 核心思想：把事件函数添加到对象上，最为对象的一个属性
    obj.handler = obj.handler || {};
    // 考虑到多次添加同名的事件类型，多次绑定click事件；
    obj.handler[type] = obj.handler[type] || [];
    obj.handler[type].push(fn);
}

function removeEvent(obj, type, fn){
    // 如果对象上有同名的事件函数，则删去
    var handlers = obj.handler[type] || [];
    if (handlers){
        var fnPos = handlers.indexOf(fn);
        if (fnPos != -1){
            handlers.splice(fnPos, 1);
        }
    }
}

function trigger(obj, type){
    // 如果对象上有同名函数，则主动执行；
    var handlers = obj.handler[type] || {};
    for (var i = 0; i < handlers.length; i++){
        if (typeof handlers[i] == "function"){
            handlers[i].call(obj);
        }
    }
}