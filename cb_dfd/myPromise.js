/**
 * Created by Administrator on 2016/2/29.
 */
function Promise(){
    this.doneList = [];
    this.failList = [];
    this.status = 'pending';
}

Promise.prototype = {
    constructor: Promise,
    done: function(fn){
        if(typeof fn == 'function'){
            this.doneList.push();
        }
    },
    fail: function(fn){
        if(typeof fn == 'function'){
            this.failList.push(fn);
        }
    },
    always: function(fn){
        this.done(fn).fail(fn);
        return this;
    },
    then: function(doneFn, failFn){
        this.done(doneFn).fail(failFn);
        return this;
    },
    resolve: function(){
        this.status = 'resolved';
        var i, handlers = this.doneList, lens = handlers.length;
        if(lens){
            for(i = 0; i < lens; i++ ){
                handlers[i].call(this);

                // 执行一个删一个
                handlers.shift();
            }
        }
    },
    reject: function(){
        this.status = 'rejected';
        var i, handlers = this.failList, lens = handlers.length;
        if(lens){
            for(i = 0; i < lens; i++ ){
                handlers[i].call(this);

                // 执行一个删一个
                handlers.shift();
            }
        }
    }
}

function when(){
    var p = new Promise();
    var success = true;
    var lens = arguments.length;

    for(var i = 0; i < lens; i++){
        if(arguments[i] instanceof Promise){

        }else{
            return false;
        }
    }

    return p;
}