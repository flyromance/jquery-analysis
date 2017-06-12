/*
 * param: {key: value, key: value}
 * param: [{name: '', value: ''}, {name: '', value: ''}]
 * 
   如果value值为数组[]
 * param: {a: [a1, b1], b: 1}
 * param: [{name: a, value: [a1, b1]}, {}]
 * 
 */
var r20 = /%20/g, // 空格被编码后转化为%20，要把它替换为+号
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g, // r是回车，n是换行
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    rsubmittable = /^(?:input|select|textarea|keygen)/i;

var $ = {};

function buildParams(prefix, obj, traditional, add) {
	
}

$.param = function(obj, traditional) {
    var prefix,
        arr = [],
        add = function(key, value) {
            value = $.isFunction(value) ? value() : (value ? value : '');
            arr[arr.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        };

    if ($.isArray(obj) || (obj.jquery && $.isPlainObject(obj))) {
        $.each(obj, function(index, item) {
            add(this.name, this.value);
        })
    } else {
    	for(prefix in obj){
    		buildParams(prefix, obj[prefix], traditional, add);
    	}
    }

    return arr.join('&').replace(/%20/g, '+');
}

$.fn.serialize = function() {
    return $.param(this.serializeArray());
}

$.fn.serializeArray = function() {
    return this.map(function(index, item) {

        })
        .filter(function(index, item) {

        })
        .map(function(index, item) {

        }).get();
}
