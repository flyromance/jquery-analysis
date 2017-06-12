function ManageDfd(name) {
    this.list = {};
    this.name = name || 'derferredModel';
}

ManageDfd.prototype = {
    constructor: ManageDfd,
    add: function(type) {
        this.list[type] = $.Derferred();
        return this.list[type]
    },
    get: function(type) {
        return this.list[type] ? this.list[type] : this.add(type)
    }
}

var dfdModel = new ManageDfd();
dfdModel.add('');


// 异步解决方案
var dfd = $.Deferred(); // baseload
var dfd_1 = $.Deferred(); // guessload
var dfd_2 = $.Deferred(); // cmsload

setTimeout(function() {

    dfd.done(function(a, b) {
        // 插入猜你爱购
        console.log(a);
        dfd_1.resolve('guessload');
    });
}, 900);

setTimeout(function() {

    dfd.resolve('baseload', 'ddd', 'dfasd');
}, 500);

setTimeout(function() {
    dfd_2.done(function(a) {
        console.log(a);
    });
}, 100);

dfd_1.done(function(a) {

    // 插入cms配置广告
    console.log(a);
    dfd_2.resolve('cmsload');
});
