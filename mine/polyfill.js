(function () {


    function jQuery(str, context) {
        return new jQuery.prototype.init(str, context);
    }

    jQuery.prototype = {
        constructor: jQuery,
        length: 0, // 
        selector: '', //  
        jquery: '1.11.3', // 版本
        init: function (str, context) {
            var that = this;
            context = context || document;

            var nodeList = context.querySelectorAll(str);

            for (var i = 0; i < nodeList.length; i++) {
                that[i] = nodeList[i];
            }

            that.length = nodeList.length;
            that.selector = str;
            that.context = context;

            return this;
        },
        each: function (handler) {
            var that = this;
            for (var i = 0; i < that.length; i++) {
                if (handler.call(that[i], i, that[i]) === false) {
                    break;
                }
            }

            return this;
        },
        show: function () {
            var that = this;
            this.each(function (index, item) {
                item.style.display = 'block';
            });
        },
        hide: function () {
            var that = this;
            this.each(function (index, item) {
                item.style.display = 'none';
            });
        }
    }

    jQuery.fn = jQuery.prototype.init.prototype = jQuery.prototype;

    jQuery.fn.console = function (str) {
        console.log(str);
    }

    jQuery.extend = jQuery.fn.extend = function () {
        var deep = false,
            lens = arguments.length,
            args = [].slice.call(arguments);
            target, sources, source, i, key, parent, copy, 
            copyIsArray = false;

        if (typeof arguments[0] === 'boolean') {
            deep = args.shift();
            lens--;
        }

        if (lens == 1) {
            target = this;
        } else {
            target = args.shift();
        }

        sources = args;

        target = target || {}; // 防止扩展null、undefined

        for (var i = 0; i < sources.length; i++) {
            source = sources[i];

            // 必须为对象
            if (typeof source == null) continue;

            for (var key in source) {
                parent = target[key];
                copy = source[key];

                // 深度扩展 && copy必须为数组或者{}之一
                if (deep && ((copyIsArray = $.isArray(copy)) || $.isPlainObject(copy))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = $.isArray(parent) ? parent : []; // parent 不是数组，就直接被覆盖
                    } else {
                        clone = $.isPlainObject(parent) ? parent : {}; // parent
                    }
                    target[key] = $.extend(true, clone, copy);
                } else if (copy !== undefined) {
                    target[key] = copy;
                }
            }
        }

        return target;
    }

    $ = jQuery;


    var _jQuery = window.jQuery,
        _$ = window.$;
    $.noConflict = function (deep) {
        if (window.$ === $) {
            window.$ = _$
        }

        if (deep && window.jQuery === jQuery) {
            window.jQuery = _jQuery;
        }
        return jQuery;
    }


    $.fn.parent = function () {
        return this.pustStack();
    }
})();
