/**
 * Created by Administrator on 2016/1/4.
 */

$(function(){}) == $(document).ready(function(){});

readyList;
completed = function(){
    document.removeEventListener("DOMContentLoaded",completed,false);
    window.removeEventListener('load',completed,false);
    jQuery.ready();
}

$.fn.ready = function(){
    jQuery.ready.promise().done(fn);
    return this;
}

$.isReady = false;
$.readyWait = 1;
$.holdReady = function(hold){
    if(hold){
        $.readyWait++;
    }else{
        $.ready(true);
    }
}
$.ready = function(wait){
    if(wait === true ? --jQuery.readyWait : jQuery.isReady){
        return;
    }
    jQuery.isReady = true;
    if(wait !== true && --jQuery.readyWait > 0){
        return;
    }
    readyList.resolveWith(document,[ jQuery ]);
}
$.ready.promise = function(obj){
    if(!readyList){
        readyList = jQuery.Deferred();
        if(document.readyState == "completed"){
            setTimeout( jQuery.ready );
        }else{
            document.addEventListener('DOMContentLoaded', completed, false);
            window.addEventListener('load', completed, false);
        }
    }
    return readyList.promise(obj);
}
