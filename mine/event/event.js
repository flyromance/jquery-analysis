/*

// 只有body才有这些方法！！！
body.oncontextmenu = return false; 禁用右击
body.onselectstart = return false; 禁止选中文本
body.oncopy = return false; 禁止复制

window.onbeforeunload = return 123;


*/
data_priv.cache = {
	1 : {},
	elem[expendo] = {
		events : {
			'click' : [      //arr  arr.delegateCount 委托的个数  arr.length = 2
				{},   //委托的,
				{
					data: undefined,
					guid: 3,
					handler: function (){},
					namespace: "",
					needsContext: false,
					origType: "click",
					selector: "span",
					type: "click"
				},
				{}
			],
			'mouseover' : [
				{}
			]
		},
		handle : function(e){}
	};

		// 这个handle在add内部，称为eventHandle，真正的事件函数；
		handle: function () {

		}
	}
};



// 工具函数
$.removeEvent = function (elem, type, handle) {
	// 这个handle就是eventHandle
	elem.removeEventListener(type, handle, false);
}

jQuery.event = {
	global :         事件的全局属性(源码还没用到)
	add : function (elem, types, fn, data, selector) { // 绑定事件
		
	},

	remove : function () { // 删除事件

	},

	trigger : function (elem, type,) { // 主动触发事件  1.冒泡行为 2.默认行为 3.特殊事件

	},       

	dispatch : function (event) {
		 // 配发事件的具体操作 add和trigger都是调用的dispatch，然后dispatch调用handler、props等、special等
		 event = $.event.fix(event);

		 handlerQueue = $.event.handlers.call(this, events, handlers)
	}, 

	handlers : function () { 
		// 函数执行顺序的操作

		返回：
	},
	special : { // 特殊事件的处理
		load : { // img.onload 不会冒泡到 window.onload
			noBubble : true, 
		}
		beforeunload : { // window.onbeforeunload
			postDispatch : function () {

			}
		}
		focus : { // 不能冒泡, 所有浏览器都支持，
			trigger : function () {

			},
			delegateType : 'focusin'
		},
		blur : { // 不能冒泡，所有浏览器都支持，
			trigger : function () {

			},
			delegateType : 'focusout'
		}
		focusin : { // 支持冒泡，但是chrome浏览器不支持
			setup : function () {
				// document.addEventListener('focus', handler, true); 事件捕获
			},
			teardown : function () {

			}
		}
		focusout : { // 支持冒泡，但是chrome浏览器不支持
			setup : function () {

			},
			teardown : function () {

			}
		}
		
		click : {
			trigger: function () {
				// input type = checkbox 选中
			},
			_default: function () {
				// a 链接跳转
			}
		}
		mouserenter : { // 不冒泡，但是有些浏览器不支持
			// 所有浏览器都支持 mouseover，但是冒泡
		}
		mouserleave : { // 不冒泡，但是有些浏览器不支持
			// 所有浏览器都支持 mouseout，但是冒泡
		}

	}, 

	// 对象的封装增强
	fix : function (originalEvent) { 
		// event对象的兼容处理

	},   
	props : [target, ...]  // JQ中共享原生JS的event属性,每个事件都会复制的
	fixHooks : { //收集event兼容的集合
		click等鼠标事件 : mouseHooks...直接引用！
		keydonw等键盘事件 : keyHOoks...
	}      
	keyHooks : { // 键盘的event兼容
		props : [], // 共享的属性，只有键盘事件才会共享复制
		filter : function (jq_event, originalEvent) {
			// 统一为event.which，ie8及以下不支持which、charCode
			// 用的是event.keyCode来做兼容
			keyCode 和 charCode的区别：如果事件类型为keypress，keyCode为undefined;
			解决方案：event.which > event.keyCode > event.charCode;
		}
	}       
	mouseHooks : { //鼠标的event兼容
		props : [], // 共享鼠标事件的属性
		filter : function () {
			// 1、针对event.pageX：老版本ie没有pageX属性，但是都有event.clientX属性
				解决方案 e.clintX + document.body.scrollTop 
			// 2、针对event.which: 左键1，中间滚轮2，右键3，老版本ie用的是event.button
				如果要使用e.which, 最好用 mousedown事件，因为click事件右击是弹出菜单栏！！
		}
	}     
	     
	simulate : {} //focusin的模拟操作(trigger , dispatch)
};


// 加强版event对象，冒泡、默认行为兼容；
jQuery.Event = function(){};
jQuery.Event.prototype = {
	isDefaultPrevented // 默认是返回false，
	isPropagationStopped
	isImmediatePropagationStopped : returnFalse = function () {return false;}
	preventDefault : function () { // 阻止默认行为
		this.originalEvent.preventDefault(); // 真正的阻止默认行为代码
		this.isDefaultPrevented = returnTrue; // 用于判断是否已经阻止了
	},
	stopPropagation : function () { // 阻止冒泡
		var e = this.originalEvent;
		if(e.stopPropagation){
			e.stopPropagation();
		}
		this.isPropagationStopped = returnTrue;
	},
	stopImmediatePropagation : function () { // 用于阻止绑定在同一个元素上的事件，之后的handlers就不执行了
		this.stopPropagation();
		this.isImmediatePropagationStopped = returnTrue;
	},
};


// 对外的接口
jQuery.fn.extend({
	on : function (type, selector, data, fn) {
		//调用$.event.add(elem, selector, type, data, fn)
	},
	one : function (type, selector, data, fn) {
		// 调用this.on(type, selector, data, fn, 1)
	},
	off : function () {
		//调用$.event.remove()
	},	
	bind : function (type, data, fn) { // 没有委托的形式
		// 调用this.on(type, null, data, fn)
	},
	unbind : function () {
		// 调用this.off()
	},
	delegate : function (selector, type, data, fn) {
		// 调用this.on()
	},
	undelegate : function () {
		// 调用this.off()
	},
	trigger : function (type, data) {
		// 调用$.event.trigger();
	},
	triggerHandler : function (type, data) {
		// 调用$.event.trigger();
		// 和$().trigger()比，传参不一样
		不会触发事件的默认行为！！！
	},
	hover : function () {
		// 调用this.mouserenter().mouseleave();
	},


	// 没有委托的写法！！！从null可以看出
	click, dblclick : function (data, fn) {
		//如果传参数，调用$().on(type, null, data, fn)
		//如果不传传参，调用trigger
	}
	mouserdown, mouseup
	mouseover, mouserout
	mouseenter, mouseleave
	mousemove
	keydown, keyup, keypress
	blur, focus
	focusin, focusout
	change : 当用于 select 元素时，change 事件会在选择某个选项时发生。
			当用于 text field 或 text area 时，该事件会在元素失去焦点时发生
	select : select - text field - text area
	submit : form.onsubmit
	load, unload : window.onload, new Image().onload, script.onload, 
	scroll : 
	resize 
	error 
	contextmenu : 右击事件，return false 取消右击显示菜单，body.oncontextmenu 
});


/* 实例
<div>
	<p>
		<span></span>
	</p>
</div>

$('#div1').on('click',function(a){
	alert(1);
});
$('#div1').on('click',function(b){
	alert(2);
});
$('#div1').on('click','span:first',function(c){
	alert(3);
});
$('#div1').on('click','p:first',function(c){
	alert(4);
});

dataElem数据绑定顺序：4 > 3 > 1 > 2
执行顺序：3 > 4 > 1 > 2
结论：先执行委托顺序（层级越深越早执行），再执行非委托（先添加先执行）
原理：
	针对委托：event.target 向上找其parentNode, 直到elem为止，如果元素与委托的selector一样，说明有委托回填函数，
	非委托：先添加先执行；
*/