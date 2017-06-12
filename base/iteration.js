/*// slice的实现原理！
// 从下面可以看出，这个传入的对象必须带有length属性，如此才能把类数组对象转变为数组对象；
Array.prototype.slice = function(start,end){
    var arr = [];
    var lens = this.length;
    var start = start || 0;
    var end = lens;
    for(var i = start; i < lens; i++ ){
        arr[i] = this[i]
    }
    return arr;
}

*/
// 类数组对象，返回true or false
function isArrayLike(){

}
$.inArray = function(elem, arr, i){
    var len;
    if(arr){
        if([].indexOf){
            return arr.indexOf(elem,i);
        }else{
            len = arr.length;
            i = i ? i < 0 ?  Math.max(0,i+len) : i  : 0;
            for(; i<len;i++){
                if(elem === arr[i]){
                    return i;
                }
            }
        }
    }
    return -1;
}
var toArray = function(obj){
    if([].slice){
        return Array.prototype.slice.call(obj);
    }else{
        var ret = [],
            lens = obj.length,
            i;
        for(i = 0; i < lens; i++){
            ret[i] = obj[i];
        }
        return ret;
    }
}

$.fn.toArray = function(){
    return Array.prototype.slice.call(this);
}

// 把html集合，或者jquery对象， 转变为数组集合；
// 如果是jquery对象的话，与调用$.fn.toArray，结果一样
$.makeArray = function(){

}
$.fn.map = function(fn){
    return $.map(this,fn);
}
$.map = function(obj,fn,args){
    var lens = obj.length,
        value,
        i = 0,
        isArray = isArrayLike(obj),
        ret = [];
    if(isArray){
        for(;i<lens;i++){
            value = fn(obj[i],i,args);
            if(value != null){
                ret.push(obj[i]);
            }
        }
    }else{
        for(i in obj){
            value = fn(obj[i],i,args);
            if(value != null){
                ret.push(obj[i]);
            }
        }
    }
    return [];
}

$.fn.each = function(fn, args){
    return $.each(this, fn, args);
}
$.each = function(obj, fn, args){
    // args 内部使用的
    var lens = obj.length,
        i = 0,
        value,
        isArray = isArrayLike(obj);
    if(isArray){
        for(;i<lens;i++){
            value = fn.call(obj[i],i,obj[i]);

            if(value === false){
                break;
            }
        }
    }else{
        for(i in obj){
            value = fn.call(obj[i],i,obj[i]);

            if(value === false){
                break;
            }
        }
    }
    return obj;
}
// 返回满足验证条件的项组成的数组
$.grep = function(elems, callback, invert){
    var ret = [];
    var lens = elems.length;
    var i = 0;
    var value;
    for(;i<lens;i++){
        value = callback(elems[i],i);
        if(!invert !== !value){
            ret.push(elem[i]);
        }
    }
    return ret;
}

// 把第二个数组项，全部扩展到第一个数组上；
$.merge = function(first,second){

}

$

