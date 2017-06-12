// null,false,undefined

// string #id or <div></div>用于创建html
// string complicated

// function

// 单个dom对象，而不是html集合

// jquery

// [],{}

rootjQuery = jQuery(document);

$.fn.extend({
    jQuery: '1.11.3',
    construtor: jQuery,

    length:0,
    selector:'',
    context:''
});

var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;

$.fn.init = function(selector , context){
    if(!selector){
        return this;
    }

    if(typeof selector === 'string'){


    } else if ($.isFunction(selector)) {

        // hanler: domcontendloaded
        return $(document).ready(selector);
    } else if (selector.nodeType) {
        this.context = selector;
        this[0] = selector;
        this.length = 1;
        return this;
    }

    // jquery对象
    if (selector.selector) {

    }

    //
    return $.makeArray(selector, this);
}
