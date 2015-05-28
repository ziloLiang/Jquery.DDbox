/*author :  梁冬 */
/*createDate : 20140220*/
/*alterDate : 20150310  滚动条滚轮优化*/
/*version : 1.0*/
try{
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = Domain.cdnHost.cdn1 + "/Public/Jquery.DDbox/styles/DDbox.css";
    document.getElementsByTagName("head")[0].appendChild(link);
}catch(e){
}

var CLICK = IsMobile() ? "touchend" : "click";

(function ($) {
    //模拟select
    $.DDbox = {
        init: function() {
            $(".DDBox").each(function(i, e) {
                var obj = $(e).find("input").data("option") || {},
                    h = parseInt(obj.height) + "px",
                    t = (parseInt(obj.height) || $(e).find("input").outerHeight()) + 3 + "px",
                    l = $(this).css("borderLeftWidth"),
                    w = parseInt(obj.width),
                    clickObj = obj.clickObj == '1' ? ".DDBox .con,input" : ".DDBox .con"; //触发下拉框的对象
                if (obj) {
                    $(e).css({ "width": w, "height": h }).find(".DDBoxHid").css({ "minWidth": w, "top": t, "left": "-" + l })
                        .find("li").css({ "height": h, "lineHeight": h });
                    $(e).find("input").css({
                        "width": w,
                        "height": h,
                        "lineHeight": h
                    });
                };
            });
        },
        event: function() {
            $(document).on(CLICK, ".DDBox", function(e) {
                var $parent = $(this), //下拉框父类
                    hid = $parent.find(".DDBoxHid"), //下拉层  
                    input = $parent.find("input"), // input
                    con = $parent.find(".con"), // 下拉按钮
                    that = this;
                //$parent.css("width", obj.width);
                $(".DDBox").css("zIndex", "1");
                $parent.css("zIndex", "10"); //兼容IE6 IE7 Z-INDEX问题
                if (hid.css("display") == "block") { //关闭下拉层
                    hid.slideUp(100);
                    con.removeClass("con2");
                } else {
                    con.addClass("con2");
                    hid.slideDown(150, function() {
                        if (!$.support.cssFloat && hid.height() == 220) { //修复IE滚动条超出
                            hid.width(hid.width() - 18);
                        }
                    });
                    var temp = 0; // 兼容IE6/7 宽度不自动
                    $parent.find("li").each(function(i, e) {
                        if (!+'\v1' && !'1'[0]) { // 兼容IE6/7 宽度不自动
                            $(this).width() > temp ? temp = $(this).width() : true;
                        }
                        $(this).removeClass("liNow");
                        if ($(this).attr("data-id") != null) {
                            if ($(this).attr("data-id") == input.attr("data-id")) {
                                $(this).addClass("liNow");
                            }
                        } else {
                            if ($(this).text() == input.val()) {
                                $(this).addClass("liNow");
                            }
                        }
                    });
                    if (!+'\v1' && !'1'[0]) { // 兼容IE6/7 宽度不自动
                        hid.width(temp + 25);
                    }
                    hid.on(CLICK, "li", function() {
                        var $that = $(this);
                        $that.siblings().removeClass("liNow");
                        $that.parents(".DDBoxHid").slideUp(100);
                        con.removeClass("con2");
                        input.val($that.text()).attr("value", $that.text()).attr("data-id", $that.attr("data-id"));
                    }).on("mouseenter", "li", function() {
                        $(this).addClass("liMove").siblings().removeClass("liMove");
                    });
                    $(document).on(CLICK, function(e) { //点击屏幕关闭下拉层
                        if (e.target == con[0] || e.target == input[0]) {
                            return false;
                        };
                        hid.slideUp(100);
                        con.removeClass("con2");
                        $(document).off("click", arguments.callee);
                    });
                }
            });
        },
        start: function() {
            $.DDbox.init();
            $.DDbox.event();
        }
    };

    //邮箱智能完成
    $.emailAuto = function (option) {
        var opts = $.extend({}, $.emailAuto.defaults, option);
        $(document).on("keyup", opts.obj, function (e) {
            var kw = jQuery.trim($(this).val());
            if (opts.width) { $("#searchResult").width(opts.width) };
            if (!$("#searchResult").length > 0) $("body").prepend('<div id="searchResult"></div>');
            if (kw.length < opts.visIndex) {
                $("#searchResult").hide();
                return false;
            }
            var index = kw.indexOf("@");
            var startStr = index > 0 ? kw.substring(0, index) : kw.substring(0);
            var endStr = index > 0 ? kw.substring(index) : "";
            var html = "";
            var left = $(this).offset().left;
            var top = $(this).offset().top + $(this).height() + parseInt($(this).css("paddingTop")) + parseInt($(this).css("paddingBottom"));
            $("#searchResult").css("left", left);
            $("#searchResult").css("top", top + 5);
            for (var i = 0; i < opts.email.length; i++) {
                if (index < 0) {
                    html = html + "<div class='email' onclick='getEmail(this,\"" + opts.obj + "\");'>" + startStr + opts.email[i] + "</div>"
                } else if (index > 0 && opts.email[i].indexOf(endStr) >= 0) {
                    html = html + "<div class='email' onclick='getEmail(this,\"" + opts.obj + "\");'>" + startStr + opts.email[i] + "</div>"
                }
            }
            if (html != "") {
                $("#searchResult").html(html).slideDown("fast", function () {
                    $(this).find(":first").addClass("hover");
                });
            } else {
                $("#searchResult").hide();
            }
        });
        $(document).on("mouseenter", "#searchResult .email", function () {
            $(this).addClass("hover").siblings().removeClass("hover");
        });
        //点击屏幕关闭下拉层
        $(document).on("click", function (e) {
            if (e.target == $(opts.obj)[0]) { return false };
            $("#searchResult").hide();
        });
    };
    //邮箱地址
    $.emailAuto.defaults = {
        email: [
			'@qq.com',
			'@163.com',
			'@126.com',
			'@139.com',
			'@189.com',
			'@gmail.com',
			'@hotmail.com',
			'@sina.com',
			'@sina.cn',
			'@yahoo.com.cn',
			'@yahoo.cn',
			'@sohu.com'
        ],
        obj: "" || {},//绑定对象
        visIndex: 1//从第几个字符开始显示
    };

    //placeholder兼容
    $.placeholder = function () {
        if (!hasPlaceholderSupport()) {
            var inputs = $("input[placeholder]");
            inputs.each(function (i, e) {
                var input = $(e);
                var placeholder = $(e).attr("placeholder"), f = "", b = "";
                var elementId = input.attr('id');
                input.next(".place_label").remove();
                if (!elementId) {
                    var now = new Date();
                    elementId = 'lbl_placeholder' + now.getSeconds() + now.getMilliseconds();
                    input.attr('id', elementId);
                }
                var $label = $('<label>', {
                    html: input.val() ? '' : placeholder,
                    'for': elementId,
                    'class': "place_label",
                    css:
                    {
                        "position": "absolute",
                        "left": input.position().left,
                        "top": input.position().top,
                        "verticalAlign": input.css('vertical-align'),
                        "cursor": 'text',
                        "height": input.outerHeight(),
                        "lineHeight": input.outerHeight() + "px",
                        "width": input.outerWidth(),
                        "textIndent": input.css("paddingLeft") ,
                        "textAlign": input.css('text-align'),
                        "color": '#a9a9a9',
                        "fontSize": input.css('fontSize'),
                        "fontFamily": input.css('fontFamily')
                    }
                }).insertAfter(input);
                var _resetPlaceholder = function (obj) {
                    var placeholder1 = $(obj).attr("placeholder");
                    var $label = $(obj).next("label");
                    console.log();
                    if ($(obj).val()) {
                        $label.css("display", "none");
                    } else {
                        $label.css("display", "block");
                        $label.html(placeholder1);
                    }
                };
                if ($label.prev().val() != "") $label.html(null);
                $(document).on({
                    "blur input propertychange resetplaceholder": function () {
                        _resetPlaceholder(this);
                    },
                    "focus keyup": function () {
                        $(this).next("label").hide();
                    }
                }, "input[placeholder]");
                $(document).on({
                    "focus click": function () {
                        $(this).prev().focus();
                    }
                }, ".place_label");
            });
        }
    };
    $.placeholderT = function () {
        if (!('placeholder' in document.createElement('textarea'))) {
            var textarea = $("textarea[placeholder]");
            textarea.each(function (i, e) {
                var $this = $(e),
                    p = $this.attr("placeholder");
                $this.val() == "" ? $this.val(p).text(p).css("color","#999") : true;
            });
            $(document).on({
                "focus": function () {
                    var $this = $(this),color = $this.css("color"); 
                    $(this).val() == $(this).attr("placeholder") ? $(this).val("").css("color",color) : true;
                    },
                    "blur": function () {
                        $(this).val() == "" ? $(this).val($(this).attr("placeholder")).css("color","#999") : true;
                    }
                }, "textarea[placeholder]");
            }
    }
    //鼠标悬浮出现解释效果   class='Q_tag' data-title='解释标题' data-intr='解释内容'
    if(!IsMobile()){
    	$(document).on({
	        "mouseenter": function (e) {
	            var $this = $(this),
	               t = $this.data("title") || "",
	               p = $this.data("intr"),
	               x = e.clientX + 5,
	               y = e.clientY + 5;
	            $("body").append("<div id='Q_tag_div' style='left:" + x + "px;top:" + y + "px; ' ><h2 style='color:#FAFAD2'>" + t + "</h2><p>" + p + "</p></div>");
	        },
	        "mousemove": function (e) {
	            if ($("#Q_tag_div").length > 0) {
	                var x = e.clientX +10,
	                      y = e.clientY + 10;
	                $("#Q_tag_div").css({
	                    "left": x,
	                    "top": y
	                });
	            };
	        },
	        "mouseleave": function (e) {
	            if ($("#Q_tag_div").length > 0) {
	                $("#Q_tag_div").remove();
	            }
	        }
	    }, ".Q_tag");
    }

    /*
     * 时间选择控件
     * auther 梁冬 
     * datetime 2015.04.03
     */

    $.fn.selectDate = function (options) {
        var $this = $(this),
            nowDate = new Date(),
            nowYear = nowDate.getFullYear(),
            nowMonth = nowDate.getMonth() + 1,
            nowDay = nowDate.getDate();
        var obj = {
            ".Year": nowYear,
            ".Month": nowMonth,
            ".Day": nowDay,
            ".Hour": 0,
            ".Minutes": 0
        };
        var options = $.extend({}, {
            defaultDate: true,
            startYear: nowYear,
            endYear: nowYear + 10

        }, options);

        init.apply(this);

        function init() {
            pushNum();

            $this.find(".Month").on("click", "li", function (e) {
                var Year = parseInt($this.find(".Year input").val()),
                    Month = parseInt($(this).text());
                pushLi($this.find(".Day"), DaysLength(Year, Month), 1);
            });
            $this.find(".Year").on("click", "li", function (e) {
                var Month = parseInt($this.find(".Month input").val()),
                    Year = parseInt($(this).text());
                pushLi($this.find(".Day"), DaysLength(Year, Month), 1);
            });

        }
        //初始值input
        function pushNum() {
            for (var prop in obj) {
                var box = $this.find(prop);
                options.defaultDate && box.find("input").val(doubleNum(obj[prop]));
                switch (prop) {
                    case ".Year":
                        pushLi(box, options.endYear - options.startYear + 1, options.startYear);
                        break;
                    case ".Month":
                        pushLi(box, 12, 1);
                        break;
                    case ".Day":
                        pushLi(box, DaysLength(nowYear, nowMonth), 1);
                        break;
                    case ".Hour":
                        pushLi(box, 24, 0);
                        break;
                    case ".Minutes":
                        pushLi(box, 60, 0);
                        break;
                }
            }
        }

        function pushLi(box, length, plusNum) {
            var liList = "";
            for (var i = 0; i < length; i++) {
                liList += "<li>" + doubleNum(plusNum + i) + "</li>";
            }
            box.find("ul").html(liList);
        }

        function DaysLength(Year, Month) {
            var length = 0;
            switch (Month) {
                case 4:
                case 6:
                case 9:
                case 11:
                    length = 30;
                    break;
                case 2:
                    isLeapYear(Year) ? length = 29 : length = 28;
                    break;
                default:
                    length = 31;
            }

            return length;
        }

        //是否为闰年
        function isLeapYear(year) {
            if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
                return true;
            } else {
                return false;
            }
        }
        // 1位数变成两位数  0-->00
        function doubleNum(num) {
            return num >= 10 ? num : "0" + num;
        }

    }
    


    $.fn.countLimit = function (options) {
        var option = $.extend({}, {
            fontSize: "12px",
            color: "#666",
            count: 100,
            right: "10px",
            bottom: "10px"
        }, options);
        $(this).each(function(){
            $this = $(this);
            $this.addClass("limitTextarea").parent().css("position") == "static" ? $this.parent().css("position", "relative") : false;
            var label = $("<label>", {
                html: "<span class='limitNum'>0</span>/" + option.count,
                "class": "limitLabel",
                css: {
                    "position": "absolute",
                    "fontSize": option.fontSize,
                    "color": option.color,
                    "right": option.right,
                    "bottom": option.bottom
                }
            }).insertAfter($this);
        })
        var limit = function (event) {
            var obj = $(this);
            var v = $.browser.webkit ? obj.val().replace(/\n/ig, "  ").length : obj.val().length,
            label = obj.next("label.limitLabel").find(".limitNum");
            label.text(v);
        };
        $(document).off("keydown keypress keyup focus", ".limitTextarea", limit).on("keydown keypress keyup focus", ".limitTextarea", limit);
    };

    /*
	* 滚动条插件
	* auther 梁冬 
	* datetime 2014.12.10
	*/
    $.fn.scrollBar = function(option){
		var opt = $.extend({} ,{
			bottomShow:false,    //从底部显示
			hoverShow:true,		//滑动到对象上显示滚动条
			scrollDis : 60,     //滚动距离  默认 70px
			bottomCallback:function(){
				
			},
			topCallback:function(){
				
			}
		} ,option);
		$(this).each(function(i,e){
			var this_ = this,
				$this = $(this_),
				bar = $this.find(".scroll_bar_mod"),  //滚动条内部模块
				baseHeight = bar.height(),
				topMax = $this.outerHeight()-bar.outerHeight(), 
				topY = opt.bottomShow?topMax:0,  //滚动位置
				obj = $($this.attr("data-obj")), //滚动对象
				objWarp = obj.parent(), //滚动容器
				isShow = obj.outerHeight()>objWarp.outerHeight(), //是否显示滚动条
				coefficient = 0.1/Math.round(obj.outerHeight()/opt.scrollDis/10);
			this.init = function(){
				if(IsMobile()){
					objWarp.on("scroll",function(){
						objWarp.scrollTop()+objWarp.outerHeight()>=obj.outerHeight()&&opt.bottomCallback();
					})
					return false;
				}
				isShow&&!opt.hoverShow&&$this.css("visibility","visible");
				bar.off("mousedown").on("mousedown.barDown",function(e){
					if(!isShow) return false;
					var that = $(this),
						oldY = e.pageY,
						oldBarY = bar.position().top,
						hoverShow = opt.hoverShow;
					$(document).on({
						"mousemove.barMove":function(e){
							topY = oldBarY+(e.pageY - oldY);
							this_.scroll(topY);
							opt.hoverShow = false;
						},
						"mouseup.barUp":function(e){
							opt.hoverShow = hoverShow;
							opt.hoverShow&&!this_.inContainer&&$this.css("visibility","hidden");
							$(this).off(".barMove").off(".barUp");
						}
					});
					return false;
				});
				addEvent(objWarp[0],"wheel",this.wheel);
				addEvent(objWarp[0],"mousewheel",this.wheel);
				addEvent(objWarp[0],"DOMMouseScroll",this.wheel);
				$(window).on("resize",function(){
					this_.resizeFix();
				});
				opt.bottomShow&&isShow&&this.scroll(topMax);
				opt.hoverShow&&this.hoverShow();
			};
			this.scroll = function(top){ //滚动时位置方法
				if(top=="top"||top<=0){
					bar.css("top",0);
					obj.css("marginTop",0);
					topY = 0;
					opt.topCallback();
				}else if(isShow&&(top=="bottom"||top>=topMax)){
					bar.css("top",topMax);
					obj.css("marginTop",objWarp.outerHeight()-obj.outerHeight());
					topY = topMax;
					opt.bottomCallback();
				}else{
					bar.css("top",top);
					obj.css("marginTop",-(top/topMax)*(obj.outerHeight()-objWarp.outerHeight()));
					topY = top;
				}
			};
			this.wheel = function(e){//鼠标滑轮滚动
				if(!isShow) return false;
				var evt = e||window.event,
					wheelDelta = evt.wheelDelta||evt.detail,
					newY,
					oldBarY = bar.position().top;
				if ( 'deltaX' in e ) {
					newY = topMax*coefficient;
				} else if ( 'wheelDeltaX' in e ) {
					newY = -topMax*coefficient;
				} else if ( 'wheelDelta' in e ) {
					newY = -topMax*coefficient;
				} else if ( 'detail' in e ) {
					newY = topMax*coefficient;
				} else {
					return;
				}
				this_.scroll(oldBarY+newY);
				return false;
			};
			this.resizeFix = function(){ //重置浏览器大小修正滚动条
				var  ratio = topY/topMax>1?1:topY/topMax;
				isShow = obj.outerHeight()>objWarp.outerHeight();
				bar.height(baseHeight/Math.round(obj.outerHeight()/opt.scrollDis/10)); //滚动条高度变化  700px 可滚动10次
				bar.height()<30&&bar.height(30);   //滚动条最小高度30
				topMax = $this.outerHeight()-bar.outerHeight();
				coefficient = 0.1/Math.round(obj.outerHeight()/opt.scrollDis/10);  //滚动系数700px 可滚动10次
				if(!isShow){
					$this.css("visibility","hidden");
					this_.scroll(0); 
				}else{
					$this.css("visibility","visible");
					opt.bottomShow&&this_.scroll(topMax);
				}
				topY = ratio*topMax;
				bar.css("top",topY);
				return this;
			};
			this.hoverShow = function(){
				objWarp.on({
					"mouseenter":function(){
						this_.inContainer = true;
						isShow&&$this.css("visibility","visible");
					},
					"mouseleave":function(){
						this_.inContainer = false;
						opt.hoverShow&&$this.css("visibility","hidden");
					}
				})
			}
			this.topPrepend = function(oldHeight,oldMargin){
				var oldMargin = parseInt(oldMargin)||0,
					ulDiffValue = obj.outerHeight()- oldHeight - oldMargin,
					site = ulDiffValue/(obj.outerHeight()-objWarp.outerHeight())*topMax;
				if(site != 0){
					this.scroll(site);
				}
			}
			this.init();
		});
	}
	function addEvent(obj, oEv, fn){
		if(!obj){
			return false;
		}
		if(obj.attachEvent){
			obj.attachEvent('on' + oEv, fn);
		}else if(obj.addEventListener){
			obj.addEventListener(oEv, fn, false);
		}else{
			obj["on"+oEv] = fn;
		}
	}

})(jQuery);

$(function () {
    //动态生成标签
    $(".ContextualTab").bind("click", function () {
        $(this).find("input").focus();
    });
    $(".ContextualTab input").bind("keydown", function (e) {
        var $this = $(this), val = $this.val(), parent = $this.parent(".ContextualTab "),
        	maxlength = parseInt(parent.data("max")), isEnter = parent.data("enter") || 1,
        	noBlurDiv = parent.data("mutex") || ".ac_results";
        if (e.keyCode == 13 && val != "" && $(noBlurDiv).css("display") != "block") {
            if (isEnter != 1) {
                $this.val("");
                return false;
            }
            tags($this);
        } else if (e.keyCode == 37 && val == "") {
            $this.insertBefore($this.prev());
            $this.focus();
        } else if (e.keyCode == 39 && val == "") {
            $this.insertAfter($this.next());
            $this.focus();
        } else if (e.keyCode == 8 && val == "") {
            $this.prev().remove();
        }
        e.stopPropagation();
    }).bind("blur", function (e) {
        var $this = $(this), parent = $this.parent(".ContextualTab "), isEnter = parent.data("enter") || 1;
        var noBlurDiv = parent.data("mutex") || ".ac_results";
        if (isEnter != 1) {
            $this.val("");
            return false;
        }
        if ($(".ac_results[data-id='" + $this.attr("id") + "']").css("display") == "block") return false; //autocomplete
        if ($this.parents(".ContextualTab").data("blur") != undefined || $this.val() == "" || $(noBlurDiv).css("display") == "block") { return false; }
        tags($this);
        e.stopPropagation();
    });
    $(document).on("click", ".ContextualTab .tags em", function () {
        $(this).parent().remove();
    });
})

var getEmail = function (t, o) {      //邮箱调用
    $(o).val($(t).html()).prop("value", $(t).html());
    $("#searchResult").hide();
};
var hasPlaceholderSupport = function () { //placeholder兼容调用
    return 'placeholder' in document.createElement('input');
};

//生成分页
function makepaging(pageIndex, pageCount) {
    var pageIndex = parseInt(pageIndex), pageCount = parseInt(pageCount);
    var html = '<a class="page_up" title="上一页"><em class="tringle"></em><em class="tringle2"></em></a>';
    if (pageIndex > 3) {
        html += '<a class="pa" href="javascript:void(0);" title="第1页">1</a>';
        html += pageIndex > 4 ? '<span class="limit">...</span>' : '';
        for (var i = pageIndex - 2, l = pageIndex + 2; i <= l; i++) {
            if (i >= pageCount) { break; }
            if (i == 1) { continue; }
            html += '<a class="pa ' + (i == pageIndex ? "now" : "") + '" href="javascript:void(0);" title="第' + i + '页">' + i + '</a>';
        }
        if (pageCount > pageIndex + 3) {
            html += '<span class="limit">...</span>';
        }
    } else {
        for (var i = 1; i < 6; i++) {
            if (i >= pageCount) { break; }
            html += '<a class="pa ' + (i == pageIndex ? "now" : "") + '" href="javascript:void(0);" title="第' + i + '页">' + i + '</a>';
        }
        html += pageCount > 6 ? '<span class="limit">...</span>' : '';
    }
    html += '<a class="pa' + (pageIndex == pageCount ? " now" : "") + '" href="javascript:void(0);"  title="第' + pageCount + '页">' + pageCount + '</a>';
    html += '<a  class="page_down" title="下一页"><em class="tringle"></em><em class="tringle2"></em></a>';
    return html;
}

function tags(obj, valMy, attr) {    //动态标签调用
    var arrV = [],
        wapper = obj.parents(".ContextualTab"),
        ml = wapper.data("max"),
        s = wapper.find("span"),
        attr = attr || "",
        arr = [];
    valMy ? arrV.push(valMy) : arrV = obj.val().replace(/，|\s|、/gi, ",").split(",");
    s.each(function (i, e) {
        arr.push($(e).text().substring(0, $(e).text().length - 1));
    });
    if (arr.length < ml || !ml) {
        for (i = arrV.length - 1; i >= 0; i--) {
            if ($.inArray(arrV[i], arr) < 0 && arrV[i] != "") {
                obj.before('<span class="tags" ' + attr + ' >' + arrV[i] + '<em>&times;</em></span>');
            } else {
                if (arrV[i] != "") alert("前边有这个标签了，不要再添加它了");
                break;
            };
        }
    } else {
        alert("本类标签最多只能添加" + ml + "项");
    }
    obj.val("").data("attr", "");
}

//检测是否为移动设备
function IsMobile() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCe = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWm = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCe || bIsWm) {
        return true;
    } else {
        return false;
    }
}

$(function () {
    $.DDbox.start();
    $.placeholder();
    $.placeholderT();
});

