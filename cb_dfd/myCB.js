function CB(){
    this.handlers = [];
}

CB.prototype = {
    constructor: CB,
    add: function(fn){
        this.handlers.push(fn);
        return this;
    },
    remove: function(fn){
        var index = this.handlers.indexOf(fn);
        if(index >= 0){
            this.handlers.splice(index,1);
        }
        return this;
    },
    empty: function(){
        this.handlers = [];
        return this;
    },
    has: function(fn){
        var index = this.handlers.indexOf(fn);
        return index > -1 ? true : false;
    },
    fire: function(){
        var handlers = this.handlers;
        for(var i = 0, lens = handlers.length; i < lens; i++){
            handlers[i]();
        }
    }
}

