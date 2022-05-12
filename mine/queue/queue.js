// 依赖 : data_priv

// queue是调用的内部
data_priv.cache = {
	1: {
		events: {
			click: [],
			keydown: [],
		}
		fxqueue: [],
		fxqueueHooks: {
			stop: function () {

			},
			empty: function () {

			}
		},
	}
}

jQuery.extend({
	// 添加数据，并且返回队列数组
	// data如果是数组，就会覆盖前面添加的队列
	queue: function (elem, type, data) {},                

	// 
	dequeue: function () {},

	// 生成queueHooks队列，绑定清空队列的方法，调用了$.Callbacks()
	_queueHooks: function () {}
});


jQuery.fn.extend({
	// 获取队列
	// 加入队列
	queue: function (type, data) {

	},

	// 出队
	dequeue: function (type) {
		return this.each(function(index, item){
			$.dequeue(this, type);
		});
	},

	// 入队一个函数，time后调用next()
	delay: function (time, type) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || 'fx';
		return this.queue(type, function(next, hooks){
			var timer = setTimeout(next, time);
			hooks.stop = function () {
				clearTimeout(timer);
			}
		});
	},

	// 
	clearQueue: function (type) {
		return this.queue(type || 'fx', []);
	},

	// 队列执行完之后，触发done(fn)
	// 返回new $.Deferred().promise()
	promise: function (type, obj) {

	}
});

"inprogress" ： 针对运动的参数

hooks : 缓存在data_priv.cache 上的对象；在执行的时候会当成参数传入函数；