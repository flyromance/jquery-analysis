// 分两种情况，拓展自己 || 拓展第一个对象（又分为深度复制、浅复制）
// 有的话覆盖，没有的话就加上；
$.extend = $.fn.extend = function(){
    var options, copy, src, copyIsArray, name, clone;
    var lens = arguments.length,
        i = 1,
        target = arguments[0] || {},
        deep = false;
    // 处理第一个参数为true or false的情况；
    if( typeof target == 'boolean'){
        deep = arguments[0];
        target = arguments[1] || {};
        i++;
    }
    // 如果target不是对象，也不是函数，就把target变为{}
    if(typeof target != 'object' && !$.isFunction(target) ){
        target = {};
    }
    // 处理参数只有一个的情况；
    if(i == lens){
        target = this;
        i--;
    }
    for(; i<lens; i++){
        if( (options = arguments[i]) != null){ // 扩展对象存在的情况
            // 如果是数组，name为0,1,2,3...等，value为对应的值；
            for(name in options){
                src = target[name];
                copy = options[name];
                // 如果相等就不扩展
                if(src == copy){
                    continue;
                }
                // 深度复制的情况，需要判断copy类型：数组还是对象，最终都要把深度clone的对象添加给target[name]
                // 所以这个clone必须是经过深度拷贝的，不然引用的是同一个对象就不好了；
                if( deep && src && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))){
                    if(copyIsArray){
                        copyIsArray = false; // 重置参数，为下个循环做准备；
                        // 要保证相同属性的值 类型都一样
                        clone = src && jQuery.isArray(src) ? src : [];
                    }else{
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }
                    target[name] = $.extend(deep, clone, copy);
                }else if(copy != null){ // 处理target为this的情况
                    target[name] = copy;
                }
            }
        }
    }

    return target;
}
