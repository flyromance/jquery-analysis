/*

once, memory : 每次fire之后，list被清空，add之后立即执行，执行完后再次清空list=[];
memory : 每次fire之后，list不被清空，add也可以添加并立即执行，list不被清空，再次fire重新执行list中的回调，
		 每次调用fire之后，firingStart会被清0，导致firingIndex为0；
		 firingIndex只有在firing的过程中才有可能不为0！

$.Deferred = function() {
	deferred = {
		resolve
		reject
		notify
		resolveWith
		rejectWith
		notifyWith
	}

	promise = {
		state 
		then
		pipe
		promise : function (obj) {
			如果obj不为空，则返回一个具有 14个属性的对象；
			如果obj为空，则返回promise对象，没有deferred对象的属性，也就是不能改状态了
		}
		done
		fail
		progress
		always
	}

	进入函数之后：
}

$.when = function (dfd...) {
	返回延迟对象
	如果参数不是延迟对象，则不作为有效计数器，
}
*/

/*

var dfd = $.Deferred() = {
	resolve(xx) > resolveWith(xx, xx) == fireWith(xx, xx) : 只会触发一次，once, memory
	reject() > rejectWith() : 只会触发一次，once,memory : 
	notify() > notifyWith() : 可以从联系触发，因为是连续的状态：需要连续的触发，进度事件 : memory

	promise : 如果参数不为null：返回正常的dfd对象
			  如果参数为null：返回阉割版的dfd对象，也就是没有上面6个方法！！
	state: pending resolved rejected
	done : 
	fail : 
	progress : 
	always : done(fn).fail(fn)
	then(done, fail, progress) : 接受三个参数，返回一个dfd对象，
}

var dfd_promise = $.Deferred)().promise() = {
		promise : 如果参数不为null：返回正常的dfd对象
			  如果参数为null：返回阉割版的dfd对象，也就是没有上面6个方法！！
	state: pending resolved rejected
	done : 
	fail : 
	progress : 
	always : done(fn).fail(fn)
	then(done, fail, progress) : 接受三个参数，返回一个dfd对象，
}
*/


// $.then() 详解
var dfd = $.Deferred();

dfd.then(done1, fail1, progess1).then(done2, fail2, progress2);

dff.resole() > done1 > done2;

添加到dfd的list中回调函数要做两件事情，并分为两种情况：
	1、执行done1 2、如果都done1返回dfd对象，则add( newDefer.resolve ) ，这样就可以不连续触发，自定义触发了；
	1、执行done1 2、如果返回的不是dfd对象，直接触发newDerfer对象的fireWith，这样就会触发下一个then添加的done2




done2是添加到dfd.then()的list中的 : 


// $.when(dfd1, dfd1) : 针对多个延迟对象 : 参数必须是延迟对象，如果不是则跳过，不算计数器 : 返回一个不能修改状态的dfd对象


$.when() : 不传参数，返回newDfd，并直接执行done回调
$.when(111) : 传一个111，返回newDfd，并直接执行done回调
$.when(111, 111) : 传多个参数，remaining = 0，返回newDefer，直接触发done

$.when(dfd) : 传一个dfd，返回的是dfd自身
$.when(dfd1, 111) : 传多个参数，dfd和非dfd混合，返回newDfd
$.when(dfd1, dfd2) : 传多个dfd，都是dfd，返回newDfd

$.when(dfd1, dfd2).done(fn); dfd1，dfd2必须都是resolve状态，才能触发done
$.when(dfd1, dfd2).fail(fn); 只要有一个是reject状态，就能触发done

原则：先去排除非dfd对象的参数，如果为0，直接触发done回调，如果不为0，只要有一个为reject，则触发fail回调

dfd 可以从notify(pending)状态变为resolve(resolved)状态或reject(rejected)状态！反过来则不行！

