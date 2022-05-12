// 为什么要data
// 解决内存泄漏问题，dom元素与一般对象互相引用，elem.name = obj，obj.key = elem；如果用attr方法，会出现内存泄漏
// 挂载数据

var cache = {
	1: {
		name: '',
	},
	2: {

	}
}

// $('elem').data(name, value); 
// data_user.expendo = jquery112312312312 
// 设置elem的expendo为1、 2 、 3等...，<div xxx = '1'></div>, 每个元素对应一个uid,

//1、 $().data() : 返回elem上所有的缓存数据 {name: xxx, name2: xxx}

//2、 $().data({name: value, name: value}) : 设置集合中所有元素的name: value值

//3、 $().data(name) : 获取集合中第一个元素上name的数据，内部调用$.access()

//4、 $().data(name, value) : 设置集合中所有元素的name: value值，内部调用$.access()

// 返回带有唯一号的对象{expendo: 'xxx', cache: {}}
function Data() {
	// this[0] 不能设置，只能获取，并且获取到的是{}	
	// 给文本节点分配0, 获取数据时，都返回{}
	Object.defineProperty(this.cache = {}, 0, {
		get: function () {
			return {}
		}
	});
	return this.expendo = jQuery.expendo + Math.random();
}

Data.uid = 1;

// 判断是否是{} 、元素节点、document
Data.accepts = function (elem) {
	return elem.nodeType ? 
		elem.nodeType == 1 || elem.nodeType == 9 : true;
}

// 原型方法
Data.prototype = {
	// elem[expendo] = Data.uid++; 给元素分配uid; 每个元素对应一个uid
	// elem的expendo属性是只读的，Object.defineProperty(elem, expendo, {value: uid})
	// this.cache[Data.uid++] == {}; 给元素分配缓存位置
	// 返回：elem元素的唯一标识符uid！！！
	key: function (elem) {}, 

	// 设置elem对应的缓存数据，data_user.cache[uid][name] = value;
	set: function (elem, name, value) {},

	// 获取elem对应的数据, 
	get: function (elem, key) {
		return key === undefined? 
			this.cache[this.key(elem)] : this.cache[this.key(elem)][key];
	}, 
	
	// 公用的入口：派发到set 和 get入口
	// 走set：name = {name: value} 对象，name == string && value != undefined
	// 走get: name === undefined，
	access: function (elem, name, value) {},

	// delete data_user.cahce[data_user.key(elem)][name]
	// 如果name === undefined : data_user.cache[data_user.key(elem)] = {};
	remove : function (elem, name) {},

	// 判断elem元素是否有缓存数据
	hasData: function (elem) {
		return !$.isEmptyObject(
			this.cache( elem[this.expendo] ) || {}
		);
	},
	discard: function () {},
}

data_user = new Data(); // 外部使用
data_priv = new Data(); // 内部使用

// 获取elem元素上面的，data-name的html-attribute属性
// 获取到之后存在cache中，data_user.cache[elem.expendo] = {name: xxx}
function dataAttr(elem, name, data) {}

$.extend({
	acceptData: Data.accepts,
	hasData: function (elem) {
		return data_user.hasData(elem) || data_priv.hasData(elem);
	},
	data: function (elem, name, data) {
		return data_user.access(elem, name, data);
	},
	removeData: function (elem, name) {
		data_user.remove(elem, name);
	},
	_data : function () {},
	_removeData: function () {},
});

// 通用入口
$.fn.data = function (key, value) {
	// 获取this[0]所有缓存数据
	if(key === undefined){

	}

	// 设置所有
	if($.type(key) == 'object'){

	}

	return $.access();
};

// 通用入口
$.fn.removeData = function (key) {
	return this.each(function(index, item){
		data_user.removeData(this, key);
	});
};
