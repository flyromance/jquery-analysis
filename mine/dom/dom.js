/**
 * Created by Administrator on 2015/12/26.
 * 一些变量
 $.fn.extend({
    // 通过一定的条件，删选自身
	find  查找子节点， 调用的是jQuery.find == Sizzle， jQuery.unique == Sizzle.unique ；
	has 指子元素有没有，返回自身的。。
	not filter 指自身有没有，返回自身的。。
	is  返回true or false
	closest  找满足条件的最近父节点（包括自身）
	index  返回元素在兄弟节点中的索引值
	add
	addBack
});
 function sibling(){}
 jQuery.each({
	parent     //  parentNode
	parents    // parentNode 循环
	parentsUntil  //
	next    //  nextSibling
	prev    // previousSibling
	nextAll   //  循环
	prevAll  //
	nextUntil
	prevUntil   // 下面的兄弟节点，直到一个
	siblings   //  所有兄弟节点
	children   // 只有元素节点
	contents  // 包括文本节点，elem.childNodes， iframe
});
 jQuery.extend({
	filter
	dir
	sibling
});
 function winnow(){}
 一些变量
 jQuery.fn.extend({
	text   // 返回文本节点的文本形式
	append  // body.append(tr)在ie67中有问题，tbody.append(tr)
	prepend  //
	before
	after
	remove   // 返回自身，但是自身上绑定的事件都没有，调用jQuery.cleanData();
	empty    //  elem.textContent， 678不支持
	clone    // clone(true)=clone(true,true) ,clone(false)=clone(false,false)=clone(), clone(true,false)：父元素事件不清除，子元素清除
	         // 原生添加(addEventListener)的事件不会被克隆
	html   //"<script></scrip>" 与原生 innerHTML 插入不同
	replaceWith
	detach  // 与remove差不多，但是原先绑定的data或是event都存在
	domManip
});
 jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
});
 jQuery.extend({
	clone
	buildFragment
	cleanData
	_evalUrl
});
 function manipulationTarget(){}
 function disableScript(){}
 function restoreScript(){}
 function setGlobalEval(){}
 function cloneCopyEvent(){}
 function getAll(){}
 function fixInput(){}
 jQuery.fn.extend({
	wrapAll  //选择到的元素包装
	wrapInner  //包装每个元素的子节点
	wrap   //对每个元素进行包装
	unwrap  //删去每个元素的父级，除了body
});

 */
