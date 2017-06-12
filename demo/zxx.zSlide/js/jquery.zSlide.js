/*!
 * zSlide.js - JS for HTML5 Slide
 * Copyright (c) zhangxinxu
 * http://www.zhangxinxu.com/
 * 2011-12-28 基于HTML5 的幻灯片播放核心脚本
 * 2011-12-30 内置的弹框脚本
 * 2011-12-31 工具类功能
 * 2012-01-03 零星修复
 */
 
(function($) {
	$.extend({
		zSlide: {
			//当前激活幻灯片页，后置
			activeSlide: null,
			//当前激活动画元素（页或段落，或层），后置
			activeAnimate: null,
			//全部幻灯片页，作用在于方便页面见的快速跳转
			arraySlide: [],
			//全部含有动画显示的部件
			arrayAnimate: [],
			//幻灯片索引
			indexSlide: 0,
			//动画部件索引，先行(先变该值，引发对应slide, fade的改变)
			indexAnimate: 0,
			//右下角的工具栏
			arrayTool: ["Home", "Time", "Background", "Prev", "Index", "Next"],			
			//本地存储时间提醒的关键字
			timeLocalstorageKey: location.href.split("#")[0] + "zslTime",
			bgLocalstorageKey: location.href.split("#")[0] + "zslBg",
			
			visible: function(activeSlide, targetSlide) {
				if (activeSlide) {
					activeSlide.removeClass("zsl_slide_target");
				}
				
				//动画时间350毫秒，隐藏这里需要加个定时器，动画结束再修改一些东西
				if ($.browser.webkit) {
					setTimeout(function() {
						//改变url地址栏的快速锚点
						location.replace(location.href.split("#")[0] + "#" + targetSlide.attr("id"));	
					}, 350);
				} else {
					location.replace(location.href.split("#")[0] + "#" + targetSlide.attr("id"));
				}
				
				//一些中间变量的修改
				this.activeSlide = targetSlide.addClass("zsl_slide_target").trigger("slideload");
				this.indexSlide = targetSlide.data("indexSlide");
				
				this.process();
				
				return this;
			},
			
			slide: function() {
				//或slide或fade，其决定的索引值就是indexAnimate
				var eleBeingAnimate = this.arrayAnimate[this.indexAnimate], roleBeingAnimate = eleBeingAnimate && eleBeingAnimate.attr("data-role"),
					//前后slide页
					elePrevSlide = this.arraySlide[this.indexSlide - 1], eleNextSlide = this.arraySlide[this.indexSlide + 1];
					indexActiveSlide = -1, indexActiveAnimate = -1;
				
				if (this.activeSlide) {
					//当前显示slide页面的索引值
					indexActiveSlide = this.activeSlide.data("index");
				}
				if (this.activeAnimate) {
					indexActiveAnimate = this.activeAnimate.data("index");
				}
				
				if (roleBeingAnimate) {
					if (roleBeingAnimate === "fade") {
						//如果是slide内部分步播放的fade元素
						//注：这种情况下一定会有this.activeAnimate元素的
						//先判断是从本slide过来，还是从之后的slide过来(例如执行后退操作的时候)
						//根据本动画部件与当前激活的slide页面的index索引做比较
						if (this.indexAnimate < indexActiveSlide) {
							//当前fade元素索引小于当前slide页面，说明当前fade元素是从上一个页面后退过来的
							//此时，我们需要有slide间的切换，而且是反向的
							if (elePrevSlide) {
								//当前页离开
								this.activeSlide.removeClass("in").addClass("out reverse");
								//目标页进入
								elePrevSlide.removeClass("out").addClass("in reverse");
								
								//目标元素的显示
								this.visible(this.activeSlide, elePrevSlide);
								
								//下面还有个需要注意的麻烦的事情，就是要让当前fade元素及其之前slide下的fade元素显示
								elePrevSlide.find("[data-role='fade']").removeClass("out").addClass("in");
							}
						} else {
							//当前fade元素（即将动画的）就是当前展示的slide页上的某个元素
							//这种情况下，如果是前进，则前面的元素可能是slide或是fade，如果是后退，则之前的元素一定是fade
							//因此要先判断是前进还是后退，判断的方法跟上面一样，根据索引
							if (this.indexAnimate > indexActiveAnimate) {
								//即将展示fade元素大于之前激活fade元素，说明这是前进
								//之前激活元素不做任何处理，当前即将展示fade元素展示
								eleBeingAnimate.removeClass("out").addClass("in");	
							} else {
								//如果是后退
								//则之前激活元素隐藏，当前展示元素不做任何处理
								this.activeAnimate.removeClass("in").addClass("out");
							}
						}
					} else if (roleBeingAnimate === "slide") {
						//如果当前元素是slide
						//有三种情况，一是通过新页面访问（此时this.activeSlide为null），二是通过页面索引链接直接跳转，三是通过前后翻页
						//这三种情况，无论哪种，都要将slide上面所有的fade元素隐藏
						
						//首先判断是直接载入、前进还是后退
						if (!this.activeSlide) {
							//直接载入，很简单，当前元素从右侧进入，现改为不做处理
							//eleBeingAnimate.addClass("in")
						} else if (this.indexAnimate > indexActiveSlide) {
							//即将展示的slide也索引大于当下展示的slide页的索引，说明这是前进
							//当下展示向左移出
							this.activeSlide.removeClass("in reverse").addClass("out");
							//即将展示右侧进入
							eleBeingAnimate.removeClass("out reverse").addClass("in");
						} else if (this.indexAnimate < indexActiveSlide) {
							//即将展示的slide也索引小于当下展示的slide页的索引，说明这是页面后退
							//当下展示向右移出
							this.activeSlide.removeClass("in").addClass("out reverse");
							//即将展示左侧进入
							eleBeingAnimate.removeClass("out").addClass("in reverse");
						}
						
						//当前即将展示的slide页面上所有fade还原初始状态
						eleBeingAnimate.find("[data-role='fade']").removeClass("in out");
						//目标元素的显示
						this.visible(this.activeSlide, eleBeingAnimate);
					}
					
					this.activeAnimate = eleBeingAnimate;
				}
				
				return this;
			},
			group: function() {
				//将幻灯片所有相关页面和动画分批放入数组通道
				var arraySlide = [], arrayAnimate = [], indexAnimate = 0;
				$("div[data-role='slide']").each(function(indexSlide) {
					arrayAnimate.push($(this).data("index", indexAnimate));
					arraySlide.push($(this).data("indexSlide", indexSlide));
					indexAnimate++;
					$(this).find("[data-role='fade']").each(function() {
						arrayAnimate.push($(this).data("index", indexAnimate));
						indexAnimate++;	
					});	
				});
				
				this.arraySlide = arraySlide;
				this.arrayAnimate = arrayAnimate;
				
				return this;
			},
			initIndex: function() {
				//根据URL的快速锚点获知即将载入的slide页面的索引值
				var targetId = location.href.split("#")[1], targetElement = targetId && $("#" + targetId);
				
				//如果锚点不存在存在， 或锚点对应元素不存在，索引值为0，即显示页面第一个slide
				if (targetElement && targetElement.size()) {
					this.indexSlide = targetElement.data("indexSlide") || 0;
					//确定动画部件索引位置
					this.indexAnimate = targetElement.data("index") || 0;
				} else {
					this.indexSlide = 0;
					this.indexAnimate = 0;		
				}
				
				return this;
			},
			process: function() {
				var nowSlide = this.indexSlide + 1, totalSlide = this.arraySlide.length;
				if (nowSlide === totalSlide) {
					this.eleProcess.html("&nbsp;").width("100%");	
				} else {
					this.eleProcess.html(nowSlide).width(nowSlide / totalSlide * 100 + "%");
				}
				return this;
			},
			element: function() {
				var eleHeader = $("div[data-role='header']").eq(0), eleFooter =  $("div[data-role='footer']").eq(0);
				
				var hashTool = {
					"Home": "回到起始页|!",
					"Time": "定时提醒|c",
					"Background": "更改背景|p",
					"Prev": "往前播放|^",
					"Index": "快速索引|("	,
					"Next": "向后播放|$"
				};
				
				//头部总页数和进度信息
				if (eleHeader) {
					this.eleHeader = eleHeader;
					this.eleTotal = $('<strong class="zsl_slide_total"></strong>').html(this.arraySlide.length);	
					this.eleProcess = $('<strong class="zsl_progress"></strong>');
					
					this.eleHeader.append(this.eleProcess).append(this.eleTotal);
					this.process();
				}
				
				//底部工具栏信息
				if (eleFooter) {
					var htmlTools = '';
					$.each(this.arrayTool, function(index, keyTool) {
						var arrToolBtnAttr = hashTool[keyTool] && hashTool[keyTool].split("|");
						if (arrToolBtnAttr.length === 2) {
							htmlTools = htmlTools + 
								'<a href="javascript:" class="zsl_tool" data-title="'+ arrToolBtnAttr[0] +'" data-key="'+ keyTool +'" data-role="tool">' +
									arrToolBtnAttr[1] +
								'</a>';	
						}
					});
					
					htmlTools = htmlTools + '<a href="http://www.zhangxinxu.com/wordpress/?p=2136" class="zsl_tool" data-title="使用帮助">d</a>';
					
					this.eleFooter = eleFooter;
					
					if (htmlTools) {
						this.eleToolBar = $('<div class="zsl_tool_bar"></div>').html(htmlTools);
						this.eleFooter.append(this.eleToolBar);	
					}
				}
				
				this.eleBody = $("body");
				
				return this;
			},
			time: function() {
				var now = new Date().getTime(), self = this;
				var timeLocalstorage = localStorage.getItem(this.timeLocalstorageKey);
				
				//arrayTimeStorage为本地存储的事件提醒数组, arrayTimeGrep为去除过期时间后的数组
				var	arrayTimeStorage = [], arrayTimeGrep = [];
				
				//检测存储的提醒时间是否过期
				if (timeLocalstorage) {
					//时间戳提醒数组，顺便从小到大排序(时间戳位数一致，顾可以)
					arrayTimeStorage = timeLocalstorage.split(",").sort();
	
					//去除比当前时间戳小的数组内容
					arrayTimeGrep = $.grep(arrayTimeStorage, function(time, i) {
						return Number(time) > now;
					});	
				}
				
				
				if (!this.timeHasDetected) {
					//初始化进入
					//这是加载进入页面必执行的部分
					if (arrayTimeGrep.length) {
						//当含有未过期时间戳的时候，弹出是否采用的提示
						$.zDialog.confirm("主人，发现当前页面含有未完成的时间提醒，是否使用该时间提醒？", function() {
							//如果确定，使用该时间提醒，做法是更改本地时间存储
							localStorage.setItem(self.timeLocalstorageKey, arrayTimeGrep.join());
	
							//启动时间提醒
							self.time();
							//关闭选择提示框
							$.zDialog.close();
						}, function() {
							//如果取消，则去除本地存储
							localStorage.removeItem(self.timeLocalstorageKey);
						});	
					}
					//已经做过初始化检测
					self.timeHasDetected = true;	
				} else {
					//如果已经做过是否过期时间检测
					//只要进入这个语句，说明本地一定已经存储了时间戳
					//我们就要不断做时间匹配处理，每1分钟去检测一次
					//如果本地存储数组和过期处理数组位数不一致，则说明有时间过期，此时，需要弹出卖萌提示
					if (arrayTimeStorage.length !== arrayTimeGrep.length) {
						//本地存储事件最大值和最小值的差值就是所剩时间
						var minuteLeft = Math.round((arrayTimeStorage[arrayTimeStorage.length - 1] - arrayTimeStorage[0]) / (1000 * 60));	
						if (minuteLeft === 0) {
							$.zDialog.alert("主人，时间到了，喵~~");	
						} else if (minuteLeft < 10) {
							$.zDialog.alert("主人，只剩下" + minuteLeft + "分钟了，要抓紧时间咯♥");	
						} else {
							$.zDialog.alert("主人，还有" + minuteLeft + "分钟❤");		
						}
						if (arrayTimeGrep.length) {
							//如果还有提示时间（可能有多个提示）	，更新提示时间的本地存储
							localStorage.setItem(self.timeLocalstorageKey, arrayTimeGrep.join());
						} else {
							//否则清除
							localStorage.removeItem(self.timeLocalstorageKey);	
						}
					}
					if (arrayTimeGrep.length) {
						setTimeout(function() {
							//一分钟后回调
							self.time();	
						}, 60000);			
					}
				}
				
				return this;
			},
			background: function() {
				var dataBackground = localStorage.getItem(this.bgLocalstorageKey),
					eleBody = this.eleBody,
					tmpImage = new Image();
				if (dataBackground) {
					//背景数据，可能是图片数据，可能是背景图片地址，也可能是背景颜色
					//首先验证是否是图片数据
					if (/^data:image/.test(dataBackground)) {
						eleBody.css("backgroundImage", "url("+ dataBackground +")");
					} else {
						tmpImage.onload = function() {
							//是合法图片地址
							eleBody.css("backgroundImage", "url("+ dataBackground +")");
						};
						tmpImage.onerror = function() {
							//否则作为颜色处理
							eleBody.css("backgroundColor", dataBackground);
							eleBody.css("backgroundImage", "");
						};
						tmpImage.src = dataBackground;
					}
				}			
				return this;
			},
			events: function() {
				var indexAnimate = this.indexAnimate, arrayAnimate = this.arrayAnimate, self = this;
				var funIndexAnimate = function() {
					if (indexAnimate >= arrayAnimate.length) {
						indexAnimate = arrayAnimate.length -1;
						if (!$.zDialog.isOpen) {
							$.zDialog.alert("主人，已经播放完毕了！");
						}
					} else if (indexAnimate < 0) {
						indexAnimate = 0;
						if (!$.zDialog.isOpen) {
							$.zDialog.alert("主人，前面已经没有了！");
						}
					} else {
						self.indexAnimate = indexAnimate;
						self.slide();	
					}
				};	
				
				//用来决定是否显示鼠标的定时器
				this.timerCursor = null;
				var posMouseXLast = 0;
				
				$(document).bind({
					"keyup": function(event) {
						var keyCode = event.keyCode;
						if ($.zDialog.isOpen) {
							return false;
						}
						if (keyCode === 34) {
							//key of PageDown
							indexAnimate++;	
							event.preventDefault();
							funIndexAnimate();
						} else if (keyCode === 33) {
							//key of PageUp
							indexAnimate--;
							event.preventDefault();
							funIndexAnimate();
						}
					},
					"mousemove": function(e) {
						var posMouseXNow = e.pageX;
						//Chrome浏览器下mousemove事件貌似有bug，即使鼠标不移动也会触发。为修复此问题，监听为如果鼠标移动前后距离大于10，则……
						if (Math.abs(posMouseXNow - posMouseXLast) > 10) {
							//鼠标移动的时候手形一定显示，当放置3.5秒不动之后，隐藏
							if (self.timerCursor) {
								//清除定时器
								clearTimeout(self.timerCursor);	
								self.eleBody.css("cursor", "auto");
							}
							
							self.timerCursor = setTimeout(function() {
								self.eleBody.css("cursor", "none");
							}, 3500);
							
							posMouseXLast = posMouseXNow;
						}
					},
					"dblclick": function(event) {
						if (event.target.nodeName.toLowerCase() === "div") {
							self.eleFooter.toggle();
							self.eleHeader.toggle();	
						}
					}
				});
				
				//工具栏的工具们的效果
				if (this.eleToolBar) {
					this.eleToolBar.find("a[data-role='tool']")	.bind("click", function() {
						var keyTool = $(this).attr("data-key");
						
						switch (keyTool) {
							case "Next": {
								//向后播放
								indexAnimate++;
								funIndexAnimate();
								break;	
							}
							case "Prev": {
								//向前播放
								indexAnimate--;
								funIndexAnimate();
								break;	
							}
							case "Index": {
								//快速索引
								//要使用到内置弹框组件
								var htmlIndex = '请选择：<select id="zDialogIndexSelect" class="zsl_dialog_index_select">';
									
								$.each(self.arraySlide, function(index, slide) {
									var indexAnimate = slide.data("index"), indexSlide = slide.data("indexSlide");
									htmlIndex = htmlIndex + '<option value="'+ indexAnimate +'"'+ (indexSlide === self.indexSlide? ' selected="selected"': "") +'>第'+ (index + 1) +'页</option>';	
								});	
								htmlIndex += '</select>';
								
								$.zDialog.confirm(htmlIndex, function() {
									indexAnimate = $("#zDialogIndexSelect").val();	
									funIndexAnimate();
									$.zDialog.close();
								});
								break;	
							}
							case "Home": {
								//回首页
								indexAnimate = 0;
								funIndexAnimate();
								break;
							}
							case "Time": {
								//定时提醒
								var htmlTime = '<p class="zsl_dialog_p">总时间：<input type="number" id="zDialogTimeTotal" class="zsl_dialog_time_input" /> 分钟(*)</p>' + 
									'<p class="zsl_dialog_p">结束前：<input type="text" id="zDialogTimeRemind" class="zsl_dialog_time_input" title="多个时间可使用任意非数字字符分隔" /> 分钟提醒</p>';
								
								$.zDialog.confirm(htmlTime, function() {
									var eleTimeTotal = $("#zDialogTimeTotal"), eleTimeRemind = $("#zDialogTimeRemind"),
										valTimeTotal = $.trim(eleTimeTotal.val()), valTimeRemind = $.trim(eleTimeRemind.val()),
										numTimeTotal = parseInt(valTimeTotal, 10),
										arrTimeUseful = [], arrTimeRemind = [];
									
									var nowTime = new Date().getTime();
									
									if (eleTimeTotal.size() && eleTimeRemind.size()) {	
										if (!numTimeTotal|| numTimeTotal < 1 || numTimeTotal > 720) {
											eleTimeTotal.get(0).focus();
											eleTimeTotal.get(0).select();
											return false;
										} else {
											if (valTimeRemind) {
												arrTimeRemind = valTimeRemind.match(/\d+/g) || [];
												//遍历出小于总时长的时间提醒
												arrTimeUseful = $.map(arrTimeRemind, function(minute) {
													return minute < numTimeTotal ? (numTimeTotal - minute) : null;
												});
												arrTimeUseful.push(numTimeTotal);
											} else {
												//如果只有总时长
												arrTimeUseful.push(numTimeTotal);	
											}
											
											//转换成时间戳
											localStorage.setItem(self.timeLocalstorageKey, $.map(arrTimeUseful, function(n) {
												return 	nowTime + n * 60 * 1000;
											}).join());	
											
											//开始倒计时
											self.time();								
										}
									}
									
									$.zDialog.close();
								});
								
								break;	
							}
							case "Background": {
								//更改背景
								var htmlBackground = '<div class="zsl_dialog_background">' +
									'<p class="zsl_dialog_p">' +
										'<input id="zslBgCustom" type="radio" name="zslBg" checked /><label for="zslBgCustom">自定义背景&emsp;</label> ' +
										'<input type="text" id="zslBgCustomText" size="22" /><label for="zslBgCustomText">（颜色值或url地址）</label>' +
									'</p>' +
									'<p class="zsl_dialog_p">' +
										'<input id="zslBgLocalImage" type="radio" name="zslBg" /><label for="zslBgLocalImage">使用本地图片</label> ' +
										'<input type="file" id="zslBgLocalImageFile" disabled size="22" style="color: #fff;" />' +
									'</p>' +
									'<p class="zsl_dialog_p">' +
										'<input type="checkbox" id="zslBgRemember" checked="checked" /><label for="zslBgRemember">记住我的选择</label>' +
									'</p>' +
								'</div>' + 
								'<div class="zsl_dialog_btn">' +
									'<input type="button" id="zslBgSure" class="zsl_dialog_btn_ok" value="确定" />' +
									'<input type="button" id="zslBgCancel" class="zsl_dialog_btn_no" value="取消" />' +
								'</div>';
								
								var localStorageBackground = "", localStorageCustom = "", localStorageLocal = "";
								//存储页面的背景色和背景图片，以便取消和不勾选预览的时候将预览效果卡掉
								var storeBackgroundImage = self.eleBody.css("backgroundImage"),
									storeBackgroundColor = self.eleBody.css("backgroundColor");
								
								$.zDialog.open({
									url: htmlBackground,
									ajax: false,
									title: "修改背景",
									overlay: false,
									onShow: function() {
										var eleRadioCustom = $("#zslBgCustom"), eleRadioLocal = $("#zslBgLocalImage"),
											eleInputCustom = $("#zslBgCustomText"), eleFileLocal = $("#zslBgLocalImageFile"),
											eleRemember = $("#zslBgRemember");
											
										eleRadioCustom.bind("click", function() {
											if ($(this).attr("checked")) {
												eleInputCustom.removeAttr("disabled").trigger("change");
												eleFileLocal.attr("disabled", "disabled");
											}
										});
										
										eleRadioLocal.bind("click", function() {
											if ($(this).attr("checked")) {
												eleFileLocal.removeAttr("disabled");
												eleInputCustom.attr("disabled", "disabled");
												if (localStorageLocal) {
													self.eleBody.css("backgroundImage", "url("+ localStorageLocal +")");	
												} else {
													//还原
													self.eleBody.css("backgroundColor", storeBackgroundColor);
													self.eleBody.css("backgroundImage", storeBackgroundImage);
												}
											}
										});
										
										eleInputCustom.bind("change", function() {
											var value = $(this).val(), tmpImage = new Image();
											//有值同时勾选了预览
											if (value) {
												//判别value的格式，合法图片则背景图片，否则作为图片处理
												tmpImage.onload = function() {
													self.eleBody.css("backgroundImage", "url("+ value +")");
												};
												tmpImage.onerror = function() {
													self.eleBody.css("backgroundColor", value);
													self.eleBody.css("backgroundImage", "");	
												};
												tmpImage.src = value;
												localStorageCustom = value;
											}
										});
										
										
										eleFileLocal.bind("change", function(event) {
											var files = event.target.files || event.dataTransfer.files, file = files[0];
											if (file.type.indexOf("image") == 0) {
												if (file.size >= 512000) {
													alert('主人，您这张"'+ file.name +'"图片尺寸大了点，奴家消受不起，请小于500k.');
												} else {
													var reader = new FileReader();
													reader.onload = function(e) {
														localStorageLocal = e.target.result;
														self.eleBody.css("backgroundImage", "url("+ localStorageLocal +")");
													}
													reader.readAsDataURL(file);	
												}			
											} else {
												alert('主人，这个"' + file.name + '"不是图片，奴家无所适从了。');	
											}											
										});
										
										$("#zslBgSure").bind("click", function() {
											if (eleFileLocal.attr("disabled")) {
												//本地图片禁用
												if (localStorageCustom) {
													localStorageBackground = localStorageCustom;
												}
											} else {
												//如果自定义背景禁用，说明看本地图片选择
												if (localStorageLocal) {
													localStorageBackground = localStorageLocal;
												}
											}
											
											//点击确定
											if (localStorageBackground) {
												if (eleRemember.attr("checked")) {
													localStorage.setItem(self.bgLocalstorageKey, localStorageBackground);
												} else {
													//如果不记住我的选择，则清空本地背景存储
													localStorage.removeItem(self.bgLocalstorageKey);
												}
											}
											
											$.zDialog.close();	
										});
										
										$("#zslBgCancel").bind("click", function() {
											self.eleBody.css("backgroundColor", storeBackgroundColor);
											self.eleBody.css("backgroundImage", storeBackgroundImage);	
											
											$.zDialog.close();	
										});
									}
								}).position();
									
								break;
							}
						}
						
						return false;	
					});
				}
				
				//a标签锚点链接
				$("a[href^='#']").bind("click", function() {
					location.replace(location.href.split("#")[0] + $(this).attr("href"));
					self.initIndex().slide();
					indexAnimate = self.indexAnimate;
					return false;	
				});
				
				return this;
			},
			init: function() {
				this.group().initIndex().element().events().slide().background().time();
			}
		},
		zDialog: {
			open: function(options) {
				var defaults = {
					url: "",
					ajax: true,
					ajaxData: {},
					overlay: true,
					closable: false,
					title: "",
					pageContainer: $("body"),
					onShow: $.noop,
					onClose: $.noop
				};
				
				this.options = $.extend(defaults, options || {});
				
				this.remove().init().get();
				
				return this;
			},
			
			alert: function(message, callback, options) {
				var self = this;
				options = options || {};
				var fixParams = {
					url: '<div class="zsl_dialog_alert">'+ message +'</div>' +
						'<p class="zsl_dialog_btn">' +
							'<input type="button" id="zDialogBtnOk" class="zsl_dialog_btn_ok" value="确定" />' +
						'</p>',
					ajax: false
				}
				
				options = $.extend(options, fixParams);
				
				this.open(options);
				
				//事件
				this.btnOk = $("#zDialogBtnOk");
				
				this.btnOk.bind("click", function() {
					if ($.isFunction(callback)) {
						callback.call(this, self);	
					}
					self.close();
				});
				
				if (this.btnOk.size()) {
					this.btnOk.get(0).focus();	
				}
				
				return this;
			},
			
			confirm: function(message, sureCall, cancelCall, options) {
				var self = this;
				options = options || {};
				var fixParams = {
					url: '<div class="zsl_dialog_confirm">'+ message +'</div>' +
						'<p class="zsl_dialog_btn">' +
							'<input type="button" id="zDialogBtnOk" class="zsl_dialog_btn_ok" value="确定" />' +
							'<input type="button" id="zDialogBtnNo" class="zsl_dialog_btn_no" value="取消" />' +
						'</p>',
					ajax: false
				}
				
				options = $.extend(options, fixParams);
				
				this.open(options);
				
				//事件
				this.btnOk = $("#zDialogBtnOk");
				this.btnNo = $("#zDialogBtnNo");
				
				this.btnOk.bind("click", function() {
					if ($.isFunction(sureCall)) {
						sureCall.call(this, self);	
					}
				});
				
				this.btnNo.bind("click", function() {
					if ($.isFunction(cancelCall)) {
						cancelCall.call(this, self);	
					}
					self.close();
				});
				
				if (this.btnOk.size()) {
					this.btnOk.get(0).focus();	
				}
				
				return this;
			},
			
			remind: function(message, options) {
				var fixParams = {
					url: '<div class="zsl_dialog_remind">'+ message +'</div>',
					ajax: false
				}
				
				this.open($.extend(options || {}, fixParams));
				
				return this;
			},
			
			loading: function(options) {
				var fixParams = {
					url: '<div class="zsl_dialog_loading">加载中...</div>',
					ajax: false
				}
				
				this.open($.extend(options || {}, fixParams));
			},
			
			get: function() {
				var self = this;
				if (this.options.ajax) {
					this.loading();
					$.ajax({
						url: this.options.url,
						data: this.options.ajaxData || {},
						error: function() {
							self.alert("加载嗝屁啦，仔细检查检查吧！");	
						},
						success: function(data) {
							self.content = data;
							self.show();
						}
					});	
				} else {
					this.content = $(this.options.url);	
					this.show();
				}
				
				return this;
			},
			
			position: function() {
				//定位
				$.zDialog.box.css({
					"marginLeft": $.zDialog.box.width() / 2 * -1,
					"marginTop": $.zDialog.box.height() / 2 * -1	
				});	
				return this;
			},
			
			show: function() {
				this.options.pageContainer = this.options.pageContainer || document.body;
				
				if (this.options.closable && window.screenX) {
					this.body.append(this.shut);	
				}
				if (this.options.title) {
					this.body.append(this.title);
				}
				
				this.box.append(this.body.append(this.content));
				
				this.options.pageContainer.append(this.box.addClass("in"));
				if (this.overlay) {
					this.options.pageContainer.append(this.overlay);	
				}
				
				if ($.isFunction(this.options.onShow)) {
					this.options.onShow.call(this);	
				}
				
				this.isOpen = true;
				
				return this;
			},
			
			close: function() {
				var self = this;
				
				if (this.box) {
					this.box.removeClass("in").addClass("out reverse");
				}
				if (this.overlay) {
					this.overlay.css("opacity", 0);
				}
				setTimeout(function() { self.remove(); }, 300);
		
				if ($.isFunction(this.options.onClose)) {
					this.options.onClose.call(this);	
				}
			},
			
			remove: function() {
				if (this.box) {
					this.box.remove();
				}
				if (this.overlay) {
					this.overlay.remove();	
				}
				
				this.isOpen = false;
				
				return this;
			},
			
			init: function() {			
				this.body = $('<div class="zsl_dialog_body"></div>');
				
				if (this.options.overlay) {
					this.box = $('<div class="zsl_dialog pop"></div>');	
					this.overlay = $('<div class="zsl_overlay"></div>');	
				} else {
					this.box = $('<div class="zsl_dialog pop"></div>');	
					this.overlay = null;	
				}
				
				if (this.options.closable) {
					this.shut = $('<a href="javascript:" class="zsl_dialog_close" title="关闭该弹框">x</a>').bind("click", function() {
						this.close();
					//ES5 bind
					}.bind(this));	
				}
				
				if (this.options.title) {
					this.title = $('<h2 class="zsl_dialog_title">'+ this.options.title +'</h2>');	
				}
				
				return this;
			}	
		}
	});
})(jQuery);
