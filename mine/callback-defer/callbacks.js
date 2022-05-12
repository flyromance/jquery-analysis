/*
 * fire --- fireWith --- fire() --- for list
 *
once : 只触发一次 : 只让list循环一次; stack为false
		如果没有memory选项，之后什么操作都不能进行，因为self.disable() > list=memory=stach全部undefined: 
		如果有memory，还能add(fn)，立即执行fn，但是不能再调用fire()

memory : 调用过fire(),再add()直接触发 : add进函数，立即执行; 作用于add();

unique : 只能add()不同的函数 : 

stopOnFalse : add()的回调函数中返回false，之后的回调函数不再执行 : 作用于for list循环，break;
				list=memory=stach全部undefined;
			  	只有所有操作都无效，因为fire和add的前提是list存在；

$.Callbacks = function (options) {
	memory : 记忆功能, 保存上一次传入fire函数的参数！[context, 'xxx'], 第一个为cb，第二个为cb.fire('xxx')
	fired : 是否执fire()过
	firing : 是否正在执行回调函数
			 因为有时候cb.add()是放在回调函数中的，也就是说：在执行回填的时候，添加add()
	firingStart : 之前list的长度
	firingIndex : 开始执行循环的位置，通过firingStart设置
	firingLength : list的长度，如果在firing的过程中add回调，firingLength会增加
	list : 默认为[],只有当list存在的时候才能add回调函数;
	stack : 被once配置控制
			once=false：stack=[]
			once=true：stack=false，以此来控制能否再次fire()

	self = {
		add : 只有当 list存在的时候，才能添加进去

		fire : function () {}
			   调用 fireWith : list存在 & fired为false 能触发
			   list存在 & fired为true & stack存在时 能触发
		fireWith: function (context, args) {}
		fired :

		lock : 如果还没有fire()过，list = stack = memory 全部设置为 undefined，
			   如果触发过，stack = undefined，就不能fire()，因为fire的条件如上：
		locked : return !stack;

		disable : list = stack = memory = undefined, fire()无效，add()无效
		disabled : return !!list;
		
		remove : 删除list中的某一项，如果remove()操作的时候正在触发回调list队列，则要修改firingLength和firingIndex
		empty : 清空队列list = []
		has : function (fn) {} : fn存在，判断是否在list中 : fn不存在，判断list是否为空
	}
}

*/
var cb = $.Callbacks();

function cb_fn(context) {

    // context : 在fire(context)时传入的参数！！！
    console.log(context);

    // this指 : cb对象！！！
    console.log(this);
}
