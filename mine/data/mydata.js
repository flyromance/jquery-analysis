/**
 * Created by Administrator on 2015/12/29.
 */
var cache = {};
var obj1 = {};
var key = "fly" + Math.random() * 10000000;
console.log(key);
function data(obj, name, value){
    obj[key] = 1;
    cache[1] = {};
    cache[1][name] = value;
}
function getData(obj, name){
    console.log(cache[obj[key]]);
    return cache[obj[key]][name] ;
}
data(obj1, "age", 28);
console.log(getData(obj1, "age"));

