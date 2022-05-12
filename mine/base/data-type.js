var class2type = {};

jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});
var dataTypeUtil = {
    // 通过type()返回的是：boolean/number/string/array/object/function/data/regexp/error
    type: function(data) {
        if(data == null){
            return null + ''; // "null"  undefined
        }
        return typeof data == 'object' || typeof  data == 'function' ?
            class2type[Object.prototype.toString.call(data)] : typeof data;
    },
    isWindow: function(win){
        return win && win == win.window;
    },
    isEmptyObject: function(){
        var name;
        for(name in obj){
            return false;
        };
        return true;
    },
    // 必须是个字面量对象，而且不是构造函数实例化的对象；
    isPlainObject: function(obj){
        // 排除一下情况：不存在、不是object类型、是dom对象、为window对象
        if( !obj || typeof obj !== 'object' || obj.nodeType || this.isWindow(obj) ) {
            return false;
        }

    },
    isFunction: function(fn){
        return typeof fn === 'function';
    },
    isArray: function(arr){
        if(Array.isArray){ // ecma5自带方法，不能用 arr instanceof Array（如果arr是当前页面中iframe中的数组）
            return Array.isArray(arr);
        }else{
            return Object.prototype.toString.call(arr) === '[objec Array]';
        }
//        return Array.isArray ? Array.isArray(arr) : Object.prototype.toString.call(arr) === '[objec Array]';
    },
    isNumeric: function(num){

    }
}

function isArrayLike(obj){

}
