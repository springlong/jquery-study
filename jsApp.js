//所有的对象、方法的声明都放到一个匿名函数中进行，是为了防止过多垃圾变量污染Window对象。
//另外在该匿名函数中传递window和undefined作为参数，是为了在进行压缩时减少它们所占用的字节。
(function(window, undefined){

    //原型扩展与兼容处理
    var arrayPrototype = Array.prototype, stringPrototype = String.prototype;
    arrayPrototype.unique === undefined && (arrayPrototype.unique = function()
    {
        //返回目标数组去除重复值之后所组成的新数组（原数组的值不受影响）。
        var output = [],  //最终输出结果
            result = {},  //用于结果判断
            i = 0,
            len = this.length,
            num;

        for(; i < len; )
        {
            num = this[i++];
            if(result[num] === undefined)
            {
                result[num] = 1;     //使用1来表示目标结果已加入新的数组中
                output.push(num);    //保存唯一值
            }
        }
        return output;
    });
    arrayPrototype.indexOf === undefined && (arrayPrototype.indexOf = function(val, fromIndex)
    {
        //返回目标数组中参数val的值第一次出现所在的索引位置，不存在则返回-1。（返回类型：Number）
        var result = -1,
            len = this.length,
            i = typeof fromIndex === "number" && fromIndex >= 0 ? fromIndex : 0;

        for(; i < len; i++)
        {
            if(this[i] === val)
            {
                result = i;
                break;
            }
        }
        return result;
    });
    arrayPrototype.filter === undefined && (arrayPrototype.filter = function(func)
    {
        //筛选出原数组中符合条件（即回调函数返回ture时）的所有成员，并以数组形式返回。
        //回调函数-参数item：当前项的值；
        //回调函数-参数i：当前项的索引值；
        //回调函数-this：window对象；
        var result = [],
            len = this.length,
            i = 0,
            item;

        for(; i < len; i++)
        {
            if(func(item = this[i], i))
            {
                result.push(item);
            }
        }

        return result;
    });
    arrayPrototype.forEach === undefined && (arrayPrototype.forEach = function(func)
    {
        //遍历目标数组中的每一个元素，并执行回调函数。
        //回调函数-参数item：当前项的值；
        //回调函数-参数i：当前项的索引值；
        //回调函数-this：window对象；
        var i = 0, len = this.length;
        for(; i < len; )
        {
            func(this[i], i++);
        }
    });
    arrayPrototype.remove = function(val)
    {
        //删除原数组中与参数val的值相等的所有元素，并返回原数组（原数组中的值将会受到影响）。
        var idx;

        while((idx = this.indexOf(val)) !== -1)
        {
            this.splice(idx, 1);
        }
        return this;
    };
    stringPrototype.trim === undefined && (stringPrototype.trim = function()
    {
        //去除目标字符串首尾两端的所有空格，并作为新字符串返回
        return this.replace(/^\s*|\s*$/g, "");
    });
    stringPrototype.trimLeft === undefined && (stringPrototype.trimLeft = function()
    {
        //去除目标字符串头部的所有空格，并作为新字符串返回
        return this.replace(/^\s*/g, "");
    });
    stringPrototype.trimRight === undefined && (stringPrototype.trimRight = function()
    {
        //去除目标字符串末尾的所有空格，并作为新字符串返回
        return this.replace(/\s*$/g, "");
    });
    stringPrototype.contains === undefined && (stringPrototype.contains = function(match)
    {
        //判断目标字符串中是否存在检索字符串
        return typeof(match) === "string" && this.indexOf(match) >= 0;
    });
    stringPrototype.startsWith === undefined && (stringPrototype.startsWith = function(match)
    {
        //判断目标字符串是否以检索字符串开头
        return typeof(match) === "string" && this.indexOf(match) === 0;
    });
    stringPrototype.endsWith === undefined && (stringPrototype.endsWith = function(match)
    {
        //判断目标字符串是否以检索字符串结束
        return typeof(match) === "string" && new RegExp(match + "$").test(this);
    });
    //其他浏览器兼容选项
    typeof HTMLElement !== "undefined" && HTMLElement.prototype.contains === undefined && (HTMLElement.prototype.contains = function(obj)
    {
        //判断当前元素的子元素中是否包含目标元素，如果是则返回true，否则返回false（同一元素进行比较时将返回true）
        //该方法在IE6+中均已支持，在较老版本的Firefox、Chrome、Opera浏览器中未被支持
        while(obj !== null)
        {
            if(obj === this) return true;
            obj = obj.parentNode;
        }
        return false;
    });

    //声明相关变量
    var 

        //声明document、location等对象或特殊值的替代变量，一是为了减少使用他们时查找所需的时间，二是为了在进行压缩时减少字节。
        document = window.document,
        location = window.location,
        navigator = window.navigator,
        
        //用于ready方法存放处理程序集合
        readyList = [],

        //简化需要多处使用的对象量
        arr_slice = arrayPrototype.slice,
        arr_indexOf = arrayPrototype.indexOf,
        arr_filter = arrayPrototype.filter,
        isIE6 = !window.XMLHttpRequest,         //IE6不支持window.XMLHttpRequest属性。
        lessIE8 = !document.querySelectorAll,   //IE8以下的浏览器不支持document.querySelectorAll操作。
        lessIE9 = !document.addEventListener,   //IE9以下的浏览器不支持document.addEventListener属性。

        reg_notwihte = /\S+/g,  //非空格文本（将常用正则保存使用，可以提升一定运行效率）

        /**
         * 执行readyList列表
         */
        doReady = function()
        {
            jsApp.each(readyList, function(index, callback)
            {
                callback.call(document, jsApp); //readyList被执行时，this指向document，而第一个参数则指向jsApp对象
            });
            document.addEventListener && document.removeEventListener("DOMContentLoaded", arguments.callee, false);
        },

        /**
         * DomContentLoaded事件的兼容处理
         */
        DomContentLoaded = function()
        {
            if(document.addEventListener)
            {
                //标准事件模型（IE9+、Chrome、Safari、Firefox、Opera）
                document.addEventListener("DOMContentLoaded", doReady, false);
                return;
            }
            //兼容IE6、7、8，原理是因为在IE浏览器中DOM未加载完成时调用doScroll方法，会产生异常。参考地址：http://javascript.nwbox.com/IEContentLoaded/
            var checkReady = function()
            {
                try
                {
                    document.documentElement.doScroll('left');
                }
                catch(e)
                {
                    setTimeout(checkReady, 10);
                    return;
                }
                doReady();
            }
            checkReady();
        },

        /**
         * 对事件对象进行重写
         * @param  {Object} e 重写前的事件对象
         * @return {Object}   重写后的事件对象
         */
        rewriteEvent = function(e)
        {
            e = e || window.event;
            var type = e.type, 
            target = e.target || e.srcElement,
            compatible = {

                //事件类型，即事件的名称，如：click、dblclick、mouseover
                type: type,

                //事件目标，即用户的操作是基于哪一个目标元素进行的
                target : target,

                //Ctrl键是否按下
                ctrlKey: e.ctrlKey,

                //Shift键是否按下
                shiftKey: e.shiftKey,

                //Alt键是否按下
                altKey: e.altKey,

                //防止事件冒泡
                stopPropagation: function()
                {
                    "stopPropagation" in e ? e.stopPropagation() : (e.cancelBubble  = true);
                },

                //取消默认行为
                preventDefault: function()
                {
                    "preventDefault" in e ? e.preventDefault() : (e.returnValue = false);
                }
            };

            //鼠标事件
            if(/mouse|click/gi.test(type))
            {
                //作用于鼠标事件, 对于mouseover而言表示从哪个DOM元素进来，而对于mouseout而言则表示鼠标着落在那个DOM元素
                compatible.relatedTarget = e.relatedTarget === undefined ? (type === "mouseover" ? e.fromElement : e.toElement) : e.relatedTarget;

                //鼠标相对于目标元素的X轴坐标位置（由于offsetX和offsetY并没有被加入标准，所以Firefox浏览器并不支持这两个属性）
                compatible.offsetX = e.offsetX === undefined ? (e.clientX - target.getBoundingClientRect().left) : e.offsetX;

                //鼠标相对于目标元素的Y轴坐标位置
                compatible.offsetY = e.offsetY === undefined ? (e.clientY - target.getBoundingClientRect().top) : e.offsetY;

                //鼠标相对于文档显示区的X轴坐标位置
                compatible.clientX = e.clientX;

                //鼠标相对于文档显示区的Y轴坐标位置
                compatible.clientY = e.clientY;

                //鼠标相对于整个页面的X轴坐标位置（pageX和pageY在IE6/7/8中没有得到支持）
                compatible.pageX = e.pageX === undefined ? (document.documentElement.scrollLeft + event.clientX) : e.pageX;

                //鼠标相对于整个页面的Y轴坐标位置
                compatible.pageY = e.pageY === undefined ? (document.documentElement.scrollTop + event.clientY) : e.pageY;

                //鼠标相对于屏幕的X坐标位置
                compatible.screenX = e.screenX;

                //鼠标相对于屏幕的Y坐标位置
                compatible.screenY = e.screenY;

                //判断鼠标所按的是哪个键（0—左键；1—中间键；2—右键）
                if(document.implementation.hasFeature("MouseEvents", "2.0"))
                {
                    compatible.button = e.button;
                }
                else
                {
                    //在非标准的IE6/7/8事件模型下，按键有7个值
                    switch(e.button)
                    {
                        case 0:
                        case 1:
                        case 3:
                        case 5:
                        case 7:
                            compatible.button =  0;
                            break;
                        case 2:
                        case 6:
                            compatible.button =  2;
                            break;
                        case 4:
                            compatible.button =  1;
                            break;
                    }
                }
            }
            //键盘按键事件的兼容性处理
            else if(/key/gi.test(type))
            {
                //键盘按键的键码值
                compatible.keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
            }

            return compatible;
        },

        /**
         * 获取目标元素的后一相邻节点（不包含文本和注释节点），如果不存在则返回null
         * @param  {DOMElement}   ele 目标元素
         * @return {DOMElement}   后一相邻节点
         */
        nextElementSibling = lessIE9 ? 
            function(ele)
            {
                while((ele = ele.nextSibling) !== null)
                {
                    if(ele.nodeType === 1) return ele;
                }
                return null;
            } : 
            function(ele){ return ele.nextElementSibling; },

        /**
         * 获取目标元素的前一相邻节点（不包含文本和注释节点），如果不存在则返回null
         * @param  {DOMElement}   ele 目标元素
         * @return {DOMElement}   前一相邻节点
         */
        previousElementSibling = lessIE9 ? 
            function(ele)
            {
                while((ele = ele.previousSibling) !== null)
                {
                    if(ele.nodeType === 1) return ele;
                }
                return null;
            } : 
            function(ele){ return ele.previousElementSibling; },

        /**
         * 将HTML字符串转化为Nodes
         * @param  {String} text HTML字符串
         * @return {NodeList}
         */
        convertNodes = function(text)
        {
            var ele = document.createElement("div");
            ele.innerHTML = "" + text;
            try
            {
                return ele.childNodes;
            }
            finally
            {
                ele = null;
            }
        },

        /**
         * 设置CSS样式时的兼容性选操作
         * @param  {String} name  样式的名称
         * @param  {String} value 样式的值
         * @return {String}       样式设置字符串（如：“font-size:12px”）
         */
        cssString = function(name, value)
        {
            var result = "";

            switch(name)
            {
                //透明度（IE8以及更低版本中不支持document.addEventListener，且不支持opacity透明度属性）
                case "opacity":

                    result = !document.addEventListener ? "filter:alpha(opacity=" + value*100 + ")" : "opacity:" + value; 
                    break;

                //其他
                default:

                    result = jsApp.dashCase(name) + ":" + value;
            }
            return result;
        },

        /**
         * 获取CSS样式时的兼容性筛选操作
         * @param  {DOMElement} 目标节点
         * @param  {String} name 样式的名称
         * @param  {Object}      样式对象
         * @return {String}      样式的值
         */
        getCSS = function(ele, name, currentStyle)
        {
            var result;

            switch(name)
            {
                //透明度（IE8以及更低版本中不支持document.addEventListener，且不支持opacity透明度属性）
                case "opacity":

                    result = !document.addEventListener ? (ele.filters.alpha ? ele.filters.alpha.opacity / 100 : 1) : currentStyle[name]; 
                    break;

                //浮动（IE支持styleFloat访问，其他浏览器支持cssFloat访问）
                case "float":

                    result = ele.style.styleFloat === undefined ? currentStyle["cssFloat"] : currentStyle["styleFloat"];
                    break;

                //其他
                default:

                    result = currentStyle[name];
            }

            if(result === "auto" && /width|height/.test(name))
            {
                //给IE设置width、height的属性值为auto时，即使使用计算后的样式对象也无法获取真实的值，在此使用.width()或.height方法进行重新获取。
                result = name === "width" ? jsApp(ele).width() : jsApp(ele).height();
            }
            return result;
        },

        /**
         * 获取十六进制数值A~F所对应的十进制数值
         * @param  {String} num 十六进制数值A-F
         * @return {Number}     十进制数值
         */
        getDecimalValue = function(num)
        {
            switch(num.toString().toLowerCase())
            {
                case "a": return 10; break;
                case "b": return 11; break;
                case "c": return 12; break;
                case "d": return 13; break;
                case "e": return 14; break;
                case "f": return 15; break;
                default: return parseInt(num);
            }
        },

        //用于attr()获取属性时进行筛选兼容
        getAttrFilter = function(ele, attr)
        {
            var result;
            switch(attr)
            {
                case "class":
                    //如果元素的class属性为空字符串，则认为没有设置class属性
                    result = ele.className || null;
                    break;

                case "style":
                    //移除style属性后，值为空字符串
                    result = ele.style.cssText || null;
                    break;

                case "tabindex":
                    //当没有tabindex属性时，IE6/7中的值为0，而非null（tabindex属性属于元素属性）
                    result = ele.getAttribute(attr) || null;
                    break;

                case "for":
                    //label标签的for属性以DOM属性的形式进行存储，命名为htmlFor；其他标签如果有设置for属性，则作为元素属性进行访问
                    result = "htmlFor" in ele ? ele.htmlFor : ele.getAttribute(attr);
                    break;

                default:
                    //默认获取DOM属性，其次再取元素属性，与赋值时的操作保持目的一致性
                    //目的一致性：如果需要操作DOM属性，使用node[属性名]进行；如果要操作元素属性，则使用node.setAttribute()和node.getAttribute()进行；
                    result = ele[attr] || ele.getAttribute(attr);
            }

            return result || null;
        },

        //用于attr()设置属性时进行筛选兼容
        /*----------------------------------
         *说明：IE6、7、8中表单控件的type属性为只读
         *      IE6、7、8中各焦点元素的tabindex属性设置无效
         *      IE6、7、8中表单控件的maxlength属性设置无效
         *      IE6、7中label标签的for属性设置无效
         *--------------------------------------------------------------------------------------------------------------------*/
        setAttrFilter = function(ele, attr, value)
        {
            switch(attr)
            {
                case "class":
                    ele.className = value;
                    break;

                case "style":
                    ele.style.cssText = value;
                    break;

                default:
                    //当DOM对象的DOM属性值为空时，使用setAttribute方法进行赋值。因为采用该种方式时，无论目标属性是作为元素属性还是DOM属性，设置的结果值都会是正确的。
                    ele[attr] === null || ele[attr] === undefined ? ele.setAttribute(attr, value) : (ele[attr] = value);
            }
        },

        //用于attr、css等方法中value参数值的筛选工作，即是直接的字符串值还是一个执行函数。
        //该函数在执行时，this关键字指向的是目标元素的引用。
        /*----------------------------------
         *参数说明：
         *1. index：（类型：Number，必填）即目标元素在匹配集合中的索引位置；
         *2. value：（类型：String/Function，必填）即需要进行赋值的目标值；
         *=================================================================================*/
        filterValue = function(index, value)
        {
            if(jsApp.isFunction(value))
            {
                return value.call(this, index);
            }
            return value;
        },

        /**
         * 获取十进制数值0~15所对应的十六进制表示法
         * @param  {Number} num 十进制数值
         * @return {String}     十六进制表示法
         */
        getHexValue = function(num)
        {
            switch(num)
            {
                case 10: return "A"; break;
                case 11: return "B"; break;
                case 12: return "C"; break;
                case 13: return "D"; break;
                case 14: return "E"; break;
                case 15: return "F"; break;
                default: return "" + num;
            }
        },

        /**
         * 美元符号原来表示的对象
         * @type Object
         */
        $ = window.$,

        /**
         * 构建基类jsApp
         * @class
         * @global
         * @param  {String|Function|Window|DOMElement} selector 选择器（用来构建实例对象的基础组件）
         * @example
         * var ele = jsApp("#element_ID");  //初始化jsApp对象实例，并返回目标ID元素的封装集合
         */
        jsApp = function(selector, context)
        {
            return new jsApp.init(selector, context);
        };

    /**
     * 初始化jsAPp对象实例
     * @param  {All} selector 选择器
     * @param  {DOMElement|DOMDocument} context  上下文
     * @return {jsApp}
     */
    jsApp.init = function(selector, context)
    {
        var _self = this, ele;

        //匹配：$()、$("")、$(undefined)、$(null)、$(false)、$(0)
        if(!selector)
        {
            return;
        }

        //匹配：选择器字符串——$("#id")、$("div")、$("div p:first-child span")、$("<p></p><p></p>")...
        if(typeof(selector) === "string")
        {
            if(/<|>/.test(selector))
            {
                jsApp.merge(_self, convertNodes(selector));
            }
            else
            {
                jsApp.merge(_self, jsApp.find(selector, context));    
            }
        }
        //匹配：$(DOMElement)、$(document)、$(window)
        else if(selector.nodeType || selector === window)
        {
            _self[0] = selector;
            _self.length = 1;
        }
        //匹配：$(function)
        //为ready事件提供的快捷方式
        else if(jsApp.isFunction(selector))
        {
            _self.ready(selector);
        }
        //匹配：$($("p"))
        else if(jsApp.isJSApp(selector))
        {
            return selector;
        }
        //匹配：$(document.getElementsByTagName("p"))、$([1, 2, 3])、$(123)
        else
        {
            jsApp.merge(_self, selector);
        }
    }

    //扩展jsApp对象的实例成员
    jsApp.fn = jsApp.prototype = /** @lends jsApp.prototype */{
        
        //元素集合的长度
        length: 0,

        /**
         * 将元素集合作为数组返回
         * @return {Array}
         */
        toArray: function()
        {
            return arr_slice.call(this);  //IE6~8不支持该种方式转换NodeList，但可以转换JavaScript对象
        },

        /**
         * 用于访问元素集合中的DOM元素
         * @param  {Number} [index] 索引值
         * @return {DOMElement|Array}
         */
        get: function(index)
        {
            //如果没有index参数，则返回元素集合的数组形式
            return jsApp.isNumeric(index) ? (index < 0 ? this[this.length + index] : this[index]) : this.toArray();
        },

        /**
         * 查询元素集合中的元素与查询条件的位置关系
         * @param  {String|DOMElement|jsApp} condition 查询关系
         * @return {Number}
         */
        index: function(condition)
        {
            if(this.length < 1) return -1;

            var ele = this[0], parent;

            //如果不提供查询条件，或者为null，0，"",false等值时
            //返回元素集合中第一个元素相对于父级元素的索引位置
            if(!condition)
            {
                return (parent = ele.parentNode) ? arr_indexOf.call(parent.children, ele) : -1;
            }
            //如果为字符串则表示选择器
            //返回元素集合中第一个元素相对于选择器所匹配的元素集合的索引位置
            else if(jsApp.isString(condition))
            {
                return arr_indexOf.call(jsApp(condition), ele);
            }

            //如果为DOM元素或者jsApp对象
            //返回DOM元素或者jsApp对象元素集合中的第一个元素相对于原元素集合中的索引位置
            ele = jsApp.isJSApp(condition) ? condition[0] : condition;
            return arr_indexOf.call(this, ele);
        },

        /**
         * 将元素数组加入到新的jsApp实例对象，并返回新的jsApp对象
         * @param  {DOMElement Array} eles 元素数组
         * @return {jsApp}
         */
        pushStack: function(eles)
        {
            var result = jsApp.merge(jsApp(), eles);
            result.prevObject = this;   //使用prevObject属性表示进行遍历筛选操作前的结果
            return result;
        },

        /**
         * 执行元素集合的遍历操作
         * @param {Function} callback 回调函数
         * @return {jsApp}
         */
        each: function(callback)
        {
            jsApp.each(this, callback);
            return this;
        },

        /**
         * 获取元素集合中索引值从start起始位置到end结束位置之间（不包括end）的所有元素构建的新的jsApp对象。
         * @param  {Number} [start] 起始位置
         * @param  {Number} [end] 结束位置
         * @return {jsApp}
         */
        slice: function(start, end)
        {
            //起始位置和结束位置，既可以是非负数，也可以是负数。当为非负数时，表示的是具体的索引位置；而为负数时，则表示的是倒数第几个元素。
            //在获取结果之前，通常会将start和end两个参数转换为正确的索引位置。转换为正确的索引位置后：其中start必须位于end之前，否则获取的结果为空；且start必须为有效的索引位置，否则获取的结果也为空；end可以超出元素集合的长度也可以不提供该参数，此时的结果表示从start位置开始一直到元素集合的最后一个元素（包括该元素）；start和end参数都可以不提供，此时表示集合中的所有元素。。
            //如果获取的结果为空，则直接返回实例对象本身。
            if(this.length === 0) return this;
            return this.pushStack(arr_slice.apply(this, arguments));
        },

        /**
         * 获取元素集合中指定索引的元素构建的新的jsApp对象
         * @param  {Number} index 索引值
         * @return {jsApp}
         */
        eq: function(index)
        {
            //索引值为非负数时，表示索引值为index的那个元素
            //索引值为负数时，则表示倒数第几个元素。例如：index参数为-1时，则表示元素集合中的最后一个元素。
            //如果索引值不在范围内，则直接返回实例对象本身
            return index === -1 ? this.slice(index) : this.slice(index, index + 1);
        },

        /**
         * 获取元素集合中第一个元素构建的新的jsApp对象
         * @return {jsApp}
         */
        first: function()
        {
            //如果元素集合为空，则直接返回实例对象本身
            return this.slice(0, 1);
        },

        /**
         * 获取元素集合中最后一个元素构建的新的jsApp对象
         * @return {jsApp}
         */
        last: function()
        {
            //如果元素集合为空，则直接返回实例对象本身
            return this.slice(-1);
        },

        /**
         * 获取元素集合中每个元素后一相邻节点所构建的新的jsApp对象
         * @param {String} [selector] 选择器，只有满足该选择器时才会被返回
         * @return {jsApp}
         */
        next: function(selector)
        {
            var result = [];
            jsApp.each(this, function(index, ele)
            {
                (ele = nextElementSibling(ele)) !== null && result.push(ele);
            });
            result = jsApp.unique(result);
            return this.pushStack(jsApp.isValidString(selector) ? jsApp.matches(selector, result) : result);
        },

        /**
         * 获取元素集合中每个元素之后的所有兄弟节点所组成的新的jsApp对象
         * @param {String} [selector] 选择器，只有满足该选择器时才会被返回
         * @return {jsApp}
         */
        nextAll: function(selector)
        {
            var result = [];   
            jsApp.each(this, function(index, ele)
            {
                while((ele = nextElementSibling(ele)) !== null)
                {
                    result.push(ele);
                }
            });
            result = jsApp.unique(result);
            return this.pushStack(jsApp.isValidString(selector) ? jsApp.matches(selector, result) : result);
        },

        /**
         * 获取元素集合中每个元素之后到满足停止条件之前的所有兄弟节点所组成的新的jsApp对象
         * @param  {String|Function|jsApp|DOMElement} until    停止条件
         * @param  {String} selector 选择器，只有满足该选择器时才会被返回
         * @return {jsApp}
         */
        nextUntil: function(until, selector)
        {
            var result = [];   
            jsApp.each(this, function(index, ele)
            {
                while((ele = nextElementSibling(ele)) !== null && !jsApp(ele).is(until))
                {
                    result.push(ele);
                }
            });
            result = jsApp.unique(result);
            return this.pushStack(jsApp.isValidString(selector) ? jsApp.matches(selector, result) : result);
        },

        /**
         * 获取元素集合中每个元素前一相邻节点所构建的新的jsApp对象
         * @param {String} [selector] 选择器，只有满足该选择器时才会被返回
         * @return {jsApp}
         */
        prev: function(selector)
        {
            var result = [];
            jsApp.each(this, function(index, ele)
            {
                (ele = previousElementSibling(ele)) !== null && result.push(ele);
            });
            result = jsApp.unique(result);
            return this.pushStack(jsApp.isValidString(selector) ? jsApp.matches(selector, result) : result);
        },

        /**
         * 获取元素集合中每个元素之前的所有兄弟节点所组成的新的jsApp对象
         * @param {String} [selector] 选择器，只有满足该选择器时才会被返回
         * @return {jsApp}
         */
        prevAll: function(selector)
        {
            var result = [];   
            jsApp.each(this, function(index, ele)
            {
                while((ele = previousElementSibling(ele)) !== null)
                {
                    result.push(ele);
                }
            });
            result = jsApp.unique(result);
            return this.pushStack(jsApp.isValidString(selector) ? jsApp.matches(selector, result) : result);
        },

        /**
         * 获取元素集合中每个元素之前到满足停止条件之后的所有兄弟节点所组成的新的jsApp对象
         * @param  {String|Function|jsApp|DOMElement} until    停止条件
         * @param  {String} selector 选择器，只有满足该选择器时才会被返回
         * @return {jsApp}
         */
        prevUntil: function(until, selector)
        {
            var result = [];   
            jsApp.each(this, function(index, ele)
            {
                while((ele = previousElementSibling(ele)) !== null && !jsApp(ele).is(until))
                {
                    result.push(ele);
                }
            });
            result = jsApp.unique(result);
            return this.pushStack(jsApp.isValidString(selector) ? jsApp.matches(selector, result) : result);
        },

        /**
         * 获取元素集合中每个元素所有兄弟节点所组成的新的jsApp对象
         * @param {String} [selector] 选择器，只有满足该选择器时才会被返回
         * @return {jsApp}
         */
        siblings: function(selector)
        {
            var result = [];
            jsApp.each(this, function(index, ele)
            {
                jsApp.merge(result, arr_filter.call(ele.parentNode.children, function(item){ return item !== ele }));
            });
            result = jsApp.unique(result);
            return this.pushStack(jsApp.isValidString(selector) ? jsApp.matches(selector, result) : result);
        },
        
        /**
         * 获取元素集合中每个元素所有子节点（不包含文字和注释节点）所组成的新的jsApp对象
         * @param {String} [selector] 选择器，只有满足该选择器时才会被返回
         * @return {jsApp}
         */
        children: function(selector)
        {
            var result = [];
            jsApp.each(this, function(index, ele)
            {
                jsApp.merge(result, ele.children);
            });
            result = jsApp.unique(result);
            return this.pushStack(jsApp.isValidString(selector) ? jsApp.matches(selector, result) : result);
        },
        
        /**
         * 获取元素集合中每个元素所有子节点（包含文字和注释节点）所组成的新的jsApp对象
         * @return {jsApp}
         */
        contents: function()
        {
            var result = [];
            jsApp.each(this, function(index, ele)
            {
                jsApp.merge(result, arr_filter.call(ele.childNodes, function(item){ return item.nodeType !== 3 || /\S/.test(item.nodeValue) }));
            });
            result = jsApp.unique(result);
            return this.pushStack(result);
        },

        /**
         * 获取元素集合中每个元素的父节点所组成的新的jsApp对象
         * @param {String} [selector] 选择器，只有满足该选择器时才会被返回
         * @return {jsApp}
         */
        parent: function(selector)
        {
            var result = [];
            jsApp.each(this, function(index, ele)
            {
                (ele = ele.parentNode) !== null && result.push(ele);
            });
            result = jsApp.unique(result);
            return this.pushStack(jsApp.isValidString(selector) ? jsApp.matches(selector, result) : result);
        },

        /**
         * 获取元素集合中每个元素的所有父节点（不包含根元素）所组成的新的jsApp对象
         * @param {String} [selector] 选择器，只有满足该选择器时才会被返回
         * @return {jsApp}
         */
        parents: function(selector)
        {
            var result = [];   
            jsApp.each(this, function(index, ele)
            {
                while((ele = ele.parentNode) !== null && ele.nodeType !== 9)
                {
                    result.push(ele);
                }
            });
            result = jsApp.unique(result);
            return this.pushStack(jsApp.isValidString(selector) ? jsApp.matches(selector, result) : result);
        },

        /**
         * 获取元素集合中每个元素一直匹配到满足停止条件为止的所有父节点（不包含根元素）所组成的新的jsApp对象
         * @param  {String|Function|jsApp|DOMElement} until    停止条件
         * @param  {String} selector 选择器，只有满足该选择器时才会被返回
         * @return {jsApp}
         */
        parentsUntil: function(until, selector)
        {
            var result = [];
            jsApp.each(this, function(index, ele)
            {
                while((ele = ele.parentNode) !== null && ele.nodeType !== 9 && !jsApp(ele).is(until))
                {
                    result.push(ele);
                }
            });
            result = jsApp.unique(result);
            return this.pushStack(jsApp.isValidString(selector) ? jsApp.matches(selector, result) : result);
        },

        /**
         * 获取元素集合中每个元素满足筛选条件的第一个父级元素所组成的新的jsApp对象
         * @param  {String|Function|jsApp|DOMElement} selector 筛选条件
         * @param  {DOMElement} context  当筛选条件为选择器时，用于指定查询上下文
         * @return {jsApp}
         */
        closest: function(selector, context)
        {
            var result = [];
            jsApp.each(this, function(index, ele)
            {
                while((ele = ele.parentNode) !== null && ele.nodeType !== 9)
                {
                    if(jsApp(ele).is(selector, context))
                    {
                        result.push(ele);
                        break;
                    }
                }
            });
            result = jsApp.unique(result);
            return this.pushStack(result);
        },

        /**
         * 遍历元素集合中的每一项，将回调函数返回的值组合成一个新的jsApp对象并返回（不包含null和undefined）
         * @param  {Function} callback 回调函数
         * @return {jsApp}
         */
        map: function(callback)
        {
            //回调函数：function(index, ele){}
            //回调函数-参数index：当前项的索引
            //回调函数-参数ele：当前项的值
            //回调函数-this：当前项的值
            return this.pushStack(jsApp.map(this, function(ele, index)
            {
                return callback.call(ele, index, ele);
            }));
        },

        /**
         * 对元素集合进行筛选操作，将符合条件的元素组合成新的jsApp对象并返回
         * @param  {String|Function|DOMElement|jsApp} selector 筛选条件
         * @return {jsApp}
         */
        filter: function(selector)
        {
            var result = [];

            //筛选出满足选择器条件的元素
            if(jsApp.isString(selector))
            {
                result = jsApp.matches(selector, this);
            }
            //筛选出回调函数返回true的元素
            //回调函数——参数index：元素集合当前项的索引值
            //回调函数——参数ele：元素集合当前项的值
            //回调函数——this：元素集合当前项的值
            else if(jsApp.isFunction(selector))
            {
                jsApp.each(this, function(index, ele)
                {
                    selector.call(ele, index, ele) === true && result.push(ele);
                });
            }
            //筛选出jsApp对象中的元素
            else if(jsApp.isJSApp(selector))
            {
                jsApp.each(this, function(index, ele)
                {
                    arr_indexOf.call(selector, ele) >= 0 && result.push(ele);
                });
            }
            //移除指定的DOM元素
            else if(jsApp.isDOM(selector))
            {
                jsApp.each(this, function(index, ele)
                {
                    ele === selector && result.push(ele);
                });
            }
            
            return this.pushStack(result);
        },

        /**
         * 对元素集合进行筛选操作，将符合条件的元素从原元素集合中移除，并返回余下的元素所组成的新的jsApp对象
         * @param  {String|Function|DOMElement|jsApp} selector 筛选条件
         * @return {jsApp}
         */
        not: function(selector)
        {
            var result = [];

            //移除满足选择器条件的元素
            if(jsApp.isString(selector))
            {
                result = jsApp.matches(":not(" + selector + ")", this);
            }
            //移除回调函数返回true的元素
            //回调函数——参数index：元素集合当前项的索引值
            //回调函数——参数ele：元素集合当前项的值
            //回调函数——this：元素集合当前项的值
            else if(jsApp.isFunction(selector))
            {
                jsApp.each(this, function(index, ele)
                {
                    selector.call(ele, index, ele) !== true && result.push(ele);
                });
            }
            //移除jsApp对象中的元素
            else if(jsApp.isJSApp(selector))
            {
                jsApp.each(this, function(index, ele)
                {
                    arr_indexOf.call(selector, ele) < 0 && result.push(ele);
                });
            }
            //移除指定的DOM元素
            else if(jsApp.isDOM(selector))
            {
                jsApp.each(this, function(index, ele)
                {
                    ele !== selector && result.push(ele);
                });
            }
            else
            {
                result = this;
            }

            return this.pushStack(result);
        },

        /**
         * 判断当前元素集合中是否含有满足目标参数条件的元素，如果有至少一个元素匹配则返回true
         * @param  {String|Function|DOMElement|jsApp} selector 用于对比的目标参数
         * @param  {DOMElement} context  当筛选条件为选择器时，用于指定查询上下文
         * @return {Boolean}
         */
        is: function(selector, context)
        {
            var matches = [], result = false;

            //匹配选择器
            if(jsApp.isString(selector))
            {
                matches = jsApp.find(selector, context);
            }
            //匹配回调函数
            //回调函数——参数index：元素集合当前项的索引值
            //回调函数——参数ele：元素集合当前项的值
            //回调函数——this：元素集合当前项的值
            else if(jsApp.isFunction(selector))
            {
                jsApp.each(this, function(index, ele)
                {
                    return !(result = selector.call(ele, index, ele));
                });
                return result;
            }
            //匹配jsApp对象
            else if(jsApp.isJSApp(selector))
            {
                matches = selector;
            }
            //匹配DOM元素
            else if(jsApp.isDOM(selector))
            {
                matches = [selector];
            }

            jsApp.each(this, function(index, ele)
            {
                return !(result = arr_indexOf.call(matches, ele) >= 0);
            });

            return result;
        },

        /**
         * 对元素集合进行筛选操作，将含有满足选择器条件的后代元素或包含指定HTML对象的元素组合成新的jsApp对象并返回
         * @param  {String|DOMElement}  selector 筛选条件
         * @return {jsApp}
         */
        has: function(selector)
        {
            var result = [], matches;

            //筛选出后代元素中满足选择器条件的元素
            if(jsApp.isString(selector))
            {
                if(/^[^\s>+~]+$/.test(selector))
                {
                    //当为并列关系或单个选择器时（该方式效率要远远高于下面）
                    jsApp.each(this, function(index, ele)
                    {
                        if(jsApp.find(selector, ele).length > 0)
                        {
                            result.push(ele);
                        }
                    });
                }
                else
                {
                    //匹配：后代选择器（div p）、相邻选择器（div+p）、子选择器（div>p）、后续兄弟选择器（div~p）
                    matches = jsApp.find(selector);
                    return this.filter(function(index, ele)
                    {
                        var item, i = 0, len;
                        for(len = matches.length; i < len;)
                        {
                            if(ele.contains(item = matches[i++]) && ele !== item) return true;
                        }
                    });
                }
            }
            //筛选出包含指定HTML对象的元素
            else if(jsApp.isDOM(selector))
            {
                jsApp.each(this, function(index, ele)
                {
                    if(ele.contains(selector) && ele !== selector)
                    {
                        result.push(ele);
                    }
                });
            }

            return this.pushStack(result);
        },

        /**
         * 获取元素集合的每个元素中符合查询条件的所有子级元素，并将他们整合进新的jsApp对象
         * @param  {String|DOMElement|jsApp} selector 查询条件
         * @return {jsApp}
         */
        find: function(selector)
        {
            var result = [], i, len;

            //查询条件：符合选择器的所有元素
            if(jsApp.isString(selector))
            {
                jsApp.each(this, function(index, ele)
                {
                    jsApp.merge(result, jsApp.find(selector, ele));
                });
            }
            //查询条件：在DOM元素和jsApp对象中进行筛选
            else if(selector)
            {
                selector = jsApp.isJSApp(selector) ? selector : [selector];
                len = selector.length;
                jsApp.each(this, function(index, ele)
                {
                    for(i = 0; i < len; i++)
                    {
                        jsApp.contains(ele, selector[i]) && result.push(selector[i]);
                    }
                });
            }

            return this.pushStack(jsApp.unique(result));
        },

        /**
         * 将新的元素数组、jsApp对象、DOM元素加入到元素集合中并以新的jsApp对象返回
         * @param {String|jsApp|DOMElement} selector 添加的内容
         * @param {DOMElement} context  当为选择器添加时作为查询上下文
         * @return {jsApp}
         */
        add: function(selector, context)
        {
            var result = [];

            //将满足符合选择器的元素节点加入
            if(jsApp.isString(selector))
            {
                result = jsApp.find(selector, context);
            }
            //将jsApp对象加入
            else if(jsApp.isJSApp(selector))
            {
                result = selector;
            }
            //将DOM元素加入
            else if(jsApp.isDOM(selector))
            {
                result = [selector];
            }

            return this.pushStack(jsApp.unique(jsApp.merge(result, this)));
        },

        /**
         * 将本次元素集合加入到上一次获得的元素集合中并以新的jsApp对象返回
         * @return {jsApp}
         */
        addBack: function()
        {
            return this.add(this.prevObject);
        },

        /**
         * 终止最新的过滤操作，返回到上一次获得的元素集合
         * @return {jsApp}
         */
        end: function()
        {
            return this.prevObject || this;
        },

        /**
         * 移除目标元素下的所有内容，并返回原jsApp对象
         * @return {jsApp}
         */
        empty: function()
        {
            return this.each(function(index, ele)
            {
                ele.innerHTML = '';  //直接将innerHTML属性设置为空，将会释放浏览占用的相关内存，只有当移除childNodes时在某些浏览器中不会被释放
            });
        },

        /**
         * 将目标元素本身从文档中移除，并返回原jsApp对象
         * @param  {String} selector 选择器条件（只有满足选择器条件的元素才会被移除）
         * @return {jsApp}
         */
        remove: function(selector)
        {
            selector = jsApp.isString(selector) ? jsApp.matches(selector, this) : this;
            jsApp.each(selector, function(index, ele)
            {
                var parent = ele.parentNode;
                parent && parent.removeChild(ele);
            });
            return this;
        },

        /**
         * 将DOM元素、jsApp对象、HTML文本作为子节点加入到元素集合中每个元素内部的开头处，并返回原jsApp对象。
         * 如果参数是DOM元素或者jsApp对象，则执行这些元素的移动操作，而非复制。
         * @param  {String|Function|DOMElement|jsApp} contents 需要被添加的内容
         * @return {jsApp}
         */
        prepend: function()
        {
            return this.moveNode(arguments, function(ele, add)
            {
                ele.insertBefore && ele.insertBefore(add, ele.firstChild);
            });
        },

        /**
         * 将元素集合中的每个元素作为子节点加入到目标元素内部的开头处，并返回执行操作后元素集合以及所有克隆元素所组成的新的jsApp对象
         * @param  {String|DOMElement|jsApp} target 目标元素
         * @return {jsApp}
         */
        prependTo: function(target)
        {
            return this.pushStack(jsApp(target).moveNode([this], function(ele, add)
            {
                ele.insertBefore && ele.insertBefore(add, ele.firstChild);
            }, true));
        },

        /**
         * 将DOM元素、jsApp对象、HTML文本作为子节点加入到元素集合中每个元素内部的末尾处，并返回原jsApp对象。
         * 如果参数是DOM元素或者jsApp对象，则执行这些元素的移动操作，而非复制。
         * @param  {String|Function|DOMElement|jsApp} contents 需要被添加的内容
         * @return {jsApp}
         */
        append: function()
        {
            return this.moveNode(arguments, function(ele, add)
            {
                ele.appendChild && ele.appendChild(add);
            });
        },

        /**
         * 将元素集合中的每个元素作为子节点加入到目标元素内部的末尾处，并返回执行操作后元素集合以及所有克隆元素所组成的新的jsApp对象
         * @param  {String|DOMElement|jsApp} target 目标元素
         * @return {jsApp}
         */
        appendTo: function(target)
        {
            return this.pushStack(jsApp(target).moveNode([this], function(ele, add)
            {
                ele.appendChild && ele.appendChild(add);
            }, true));
        },

        /**
         * 将DOM元素、jsApp对象、HTML文本作为兄弟节点加入到元素集合中每个元素的前面，并返回原jsApp对象。
         * 如果参数是DOM元素或者jsApp对象，则执行这些元素的移动操作，而非复制。
         * @param  {String|Function|DOMElement|jsApp} contents 需要被添加的内容
         * @return {jsApp}
         */
        before: function()
        {
            return this.moveNode(arguments, function(ele, add)
            {
                ele.parentNode && ele.parentNode.insertBefore(add, ele);
            });
        },

        /**
         * 将元素集合中的每个元素作为兄弟节点加入到目标元素的前面，并返回执行操作后元素集合以及所有克隆元素所组成的新的jsApp对象
         * @param  {String|DOMElement|jsApp} target 目标元素
         * @return {jsApp}
         */
        insertBefore: function(target)
        {
            return this.pushStack(jsApp(target).moveNode([this], function(ele, add)
            {
                ele.parentNode && ele.parentNode.insertBefore(add, ele);
            }, true));
        },

        /**
         * 将DOM元素、jsApp对象、HTML文本作为兄弟节点加入到元素集合中每个元素的后面，并返回原jsApp对象。
         * 如果参数是DOM元素或者jsApp对象，则执行这些元素的移动操作，而非复制。
         * @param  {String|Function|DOMElement|jsApp} contents 需要被添加的内容
         * @return {jsApp}
         */
        after: function()
        {
            return this.moveNode(arguments, function(ele, add)
            {
                ele.parentNode && ele.parentNode.insertBefore(add, ele.nextSibling);
            });
        },

        /**
         * 将元素集合中的每个元素作为兄弟节点加入到目标元素的后面，并返回执行操作后元素集合以及所有克隆元素所组成的新的jsApp对象
         * @param  {String|DOMElement|jsApp} target 目标元素
         * @return {jsApp}
         */
        insertAfter: function(target)
        {
            return this.pushStack(jsApp(target).moveNode([this], function(ele, add)
            {
                ele.parentNode && ele.parentNode.insertBefore(add, ele.nextSibling);
            }, true));
        },

        /**
         * 针对prepend、append、before、after、prependTo、appendTo、insertBefore、insertAfter的统一操作（仅内部使用）。
         * 如果将相关节点进行位置移动操作，那么第一次执行操作时，进行的是对该节点本的移动操作；之后的每次操作则都是对该节点的clone副本进行的移动操作。
         * 节点本身的移动操作将保留原有的样式属性、元素属性、事件绑定等数据；而clone副本的移动操做则不保留事件的绑定数据（IE6~8除外）；另外在IE中clone的副本不保留复选框的选中状态。
         * @param  {String|Function|DOMElement|jsApp} argus 需要被添加的内容参数
         * @param  {Function} callback 控制操作如何进行
         * @param  {Boolean} returnClone 是否返回Clone后的所有元素
         * @param  {Boolean} doClone 是否执行克隆节点的操作
         * @return {jsApp}
         */
        moveNode: function(argus, callback, returnClone, doClone)
        {
            var i = 0, len, one, value = argus[0], contents = [], clones = [];

            if(this.length < 1) return this;

            //匹配回调函数：将回调函数返回的内容加入
            //回调函数：function(index, oldhtml){}
            //回调函数-参数index：元素集合当前项的索引值
            //回调函数-参数oldhtml：元素集合当前项的HTML文本内容
            //回调函数-this：元素集合当前项的值
            if(jsApp.isFunction(value))
            {
                return this.each(function(index, ele)
                {
                    argus[0] = value.call(ele, index, ele.innerHTML);
                    jsApp(ele).moveNode(argus, callback, returnClone, index > 0);
                });
            }

            for(len = argus.length; i< len;)
            {
                one = argus[i++];

                //匹配DOM元素和jsApp对象
                if(jsApp.isJSApp(one) || jsApp.isDOM(one))
                {
                    jsApp.merge(contents, one);
                }
                //匹配字符串以及其他类型（undefined、null不进行添加）
                else if(one != undefined)
                {
                    jsApp.merge(contents, convertNodes(one));
                }
            }
            len = contents.length;

            jsApp.each(this, function(index, ele)
            {
                var fragment = document.createDocumentFragment(), add;
                for(i = 0; i < len; i++)
                {
                    try
                    {
                        //当执行appendTo、insertBefore等操作时无法确保被添加的对象是DOM元素
                        add = index < 1 && !doClone ? contents[i] : jsApp.clone(contents[i]);
                        returnClone && clones.push(add);
                        fragment.appendChild(add);   
                    }
                    catch(e){}
                }
                callback.call(ele, ele, fragment);
            });

            return returnClone ? clones : this;
        },

        /**
         * 将元素集合中的每个元素替换为目标内容，并返回原jsApp对象
         * @param  {String|DOMElement|jsApp} target 目标元素
         * @return {jsApp}
         */
        replaceWith: function()
        {
            jsApp.fn.before.apply(this, arguments);
            return this.remove();
        },

        /**
         * 将目标元素替换为元素集合中的元素，并返回执行操作后元素集合以及所有克隆元素所组成的新的jsApp对象
         * @param  {String|DOMElement|jsApp} target 目标元素
         * @return {jsApp}
         */
        replaceAll: function(target)
        {
            var result = this.insertBefore(target = jsApp(target));    
            target.remove();
            return result;
        },

        /**
         * 将元素集合中的第一个元素外套一层目标容器，同时将其他元素移动至目标容器内，并返回原jsApp对象。
         * 如果给定的目标容器是一个元素数组，则取第一个元素作为内套容器。
         * 如果参数是函数调用，则执行的是wrap操作。
         * @param  {String|DOMElement|jsApp} content 目标容器
         * @return {jsApp}
         */
        wrapAll: function(content)
        {
            var clone, place;

            //回调函数：function(index, ele){}
            //回调函数-参数index：元素集合当前项的索引值
            //回调函数-参数ele：元素集合当前项的值
            //回调函数-this：元素集合当前项的值
            if(jsApp.isFunction(content))
            {
                return this.each(function(index, ele)
                {
                    jsApp(ele).wrapAll(content.call(ele, index, ele));
                });
            }

            //确保被外套的容器是一个有效的HTML元素，且元素集合不为空
            if(this.length && jsApp.isElement(content = jsApp(content)[0]))
            {
                place = clone = jsApp.clone(content);
                while(jsApp.isElement(place.firstChild))
                {
                    place = place.firstChild;
                }

                jsApp(this[0]).before(clone);
                jsApp(place).append(this);
            }

            return this;
        },

        /**
         * 将元素集合的每个元素外套一层目标容器（元素本身以及所有子节点将被包含在容器内），并返回原jsApp对象。
         * 如果给定的目标容器是一个元素数组，则取第一个元素作为外套容器。
         * @param  {String|Function|DOMElement|jsApp} content 目标容器
         * @return {jsApp}
         */
        wrap: function(content)
        {
            var isFunction = jsApp.isFunction(content);
            return this.each(function(index, ele)
            {
                jsApp(ele).wrapAll(isFunction ? content.call(ele, index, ele) : content);
            });
        },

        /**
         * 将元素集合的每个元素内套一层目标容器（仅元素的子节点被包含在容器内），并返回原jsApp对象。
         * 如果给定的目标容器是一个元素数组，则取第一个元素作为内套容器。
         * @param  {String|Function|DOMElement|jsApp} content 目标容器
         * @return {jsApp}
         */
        wrapInner: function(content)
        {
            //回调函数：function(index, ele){}
            //回调函数-参数index：元素集合当前项的索引值
            //回调函数-参数ele：元素集合当前项的值
            //回调函数-this：元素集合当前项的值
            if(jsApp.isFunction(content))
            {
                return this.each(function(index, ele)
                {
                    jsApp(ele).wrapInner(content.call(ele, index, ele));
                });
            }

            return this.each(function(index, ele)
            {
                var _self = jsApp(ele), contents = _self.contents();
                if(contents.length)
                {
                    contents.wrapAll(content);
                }
                else
                {
                    _self.append(jsApp.clone(jsApp(content)[0]));
                }
            });
        },

        /**
         * 移除元素集合中各元素的外围容器，并返回原jsApp对象
         * @return {jsApp}
         */
        unwrap: function()
        {   
            return this.parent().each(function(index, ele)
            {
                if(!jsApp.nodeName(ele, "body"))
                {
                    ele = jsApp(ele);
                    ele.replaceWith(ele.contents());                    
                }
            }).end();
        },

        /**
         * 目标1：获取元素集合中第一个元素的内部HTML内容；
         * 目标2：将元素集合中每个元素的内部HTML内容替换成新的HTML文本
         * @param  {String|Function} [html]  新的HTML文本
         * @return {String|jsApp}  当获取HTML文本内容时，返回字符串格式；如果需要执行替换操作，则返回实例对象本身
         */
        html: function(html)
        {
            if(html === undefined && this.length > 0)
            {
                return this[0].innerHTML; //IE6~8中返回的标签字母为大写，且属性值没有双引号
            }
            
            //匹配回调函数function(index, oldhtml)
            //回调函数——参数index：元素集合当前项的索引值
            //回调函数——参数oldhtml：元素集合当前项的innerHTML属性值
            //回调函数——this：元素集合当前项的值
            if(jsApp.isFunction(html))
            {
                return this.each(function(index, ele)
                {
                    html = html.call(ele, index, ele.innerHTML);
                    jsApp(ele).empty();
                    ele.innerHTML = "" + html;
                });
            }

            //匹配字符串或者其它类型
            this.empty();
            return this.each(function(index, ele)
            {
                ele.innerHTML = "" + html;  //将参数转换为字符串
            });
        },

        /**
         * 目标1：获取元素集合中第一个元素的内部文本内容（即将HTML标记全部去除的结果）:；
         * 目标2：将元素集合中每个元素的内部文本内容替换成新的文本内容（如果是HTML标记，将被进行转码处理）
         * @param  {String|Function} [html]  新的文本内容
         * @return {String|jsApp}  当获取文本内容时，返回字符串格式；如果需要执行替换操作，则返回实例对象本身
         */
        text: function(text)
        {
            if(text === undefined && this.length > 0)
            {
                return this[0].innerText || this[0].textContent; //Firefox支持textContent，其他浏览器支持innerText
            }
            
            //匹配回调函数function(index, oldhtml)
            //回调函数——参数index：元素集合当前项的索引值
            //回调函数——参数oldtext：元素集合当前项的内部文本内容
            //回调函数——this：元素集合当前项的值
            if(jsApp.isFunction(text))
            {
                return this.each(function(index, ele)
                {
                    text = text.call(ele, index, ele.innerText || ele.textContent);
                    jsApp(ele).empty();
                    ele.appendChild(document.createTextNode("" + text));
                });
            }

            //匹配字符串或者其它类型
            this.empty();
            return this.each(function(index, ele)
            {
                ele.appendChild(document.createTextNode("" + text));
            });
        },

        /**
         * 为元素集合中的每个元素添加类名，并返回原jsApp对象。
         * 如果需要添加多个类名，则在字符串中使用空格隔开。
         * 如果参数为函数，则需要添加的类名字符串由函数进行返回。
         * @param {String|Function} name 需要添加的类名
         * @return {jsApp}
         */
        addClass: function(name)
        {
            //匹配回调函数function(index, oldClass)
            //回调函数——参数index：元素集合当前项的索引值
            //回调函数——参数oldClass：元素集合当前项的类名字符串
            //回调函数——this：元素集合当前项的值
            if(jsApp.isFunction(name))
            {
                return this.each(function(index, ele)
                {
                    jsApp(ele).addClass(name.call(ele, index, ele.className));
                });
            }

            //普通操作
            var len = this.length, ele, index = 0, className, addNames, item, i;
            if(jsApp.isValidString(name))
            {
                addNames = name.match(reg_notwihte);
                for(; index < len;)
                {
                    if(jsApp.isElement(ele = this[index++]))
                    {
                        i = 0;
                        className = " " + ele.className + " ";
                        while(item = addNames[i++])
                        {
                            if(className.indexOf(" " + item + " ") < 0) className += item + " ";
                        }
                        ele.className = className.trim();
                    }
                }
            }
            // 注意：虽然下面的代码能够实现跟上面代码一样的功能，但是运行效率在对几百个节点进行操作时却要慢很多，如果对几十个节点进行操作则没有多大影响。
            // if(jsApp.isValidString(name))
            // {
            //     jsApp.each(this, function(index, ele)
            //     {
            //         ele.className = (ele.className + " " + name).match(reg_notwihte).unique().join(" ");
            //     });
            // }
            return this;
        },

        /**
         * 为元素集合中的每个元素移除类名，并返回原jsApp对象。
         * 如果需要删除多个类名，则在字符串中使用空格隔开。
         * 如果没有参数，则表明移除元素中的所有类名。
         * 如果参数为函数，则需要删除的类名字符串由函数进行返回。
         * @param {String|Function} [name] 需要移除的类名
         * @return {jsApp}
         */
        removeClass: function(name)
        {
            //匹配回调函数function(index, oldClass)
            //回调函数——参数index：元素集合当前项的索引值
            //回调函数——参数oldClass：元素集合当前项的类名字符串
            //回调函数——this：元素集合当前项的值
            if(jsApp.isFunction(name))
            {
                return this.each(function(index, ele)
                {
                    jsApp(ele).removeClass(name.call(ele, index, ele.className));
                });
            }

            //移除所有的类名
            if(name === undefined)
            {
                return this.each(function(index, ele)
                {
                    ele.className = "";
                });
            }
        
            //普通操作
            var len = this.length, ele, index = 0, className, removeNames, item, i;
            if(jsApp.isValidString(name))
            {
                removeNames = name.match(reg_notwihte);
                for(; index < len;)
                {
                    if(jsApp.isElement(ele = this[index++]))
                    {
                        i = 0;
                        className = " " + ele.className + " ";
                        while(item = removeNames[i++])
                        {
                            while(className.indexOf(" " + item + " ") >= 0)
                            {
                                //注意：这里不能使用正则进行全局替换，因为那样在类名字符串存在连续多个相同的类名时最终会保留一个
                                className = className.replace(" " + item + " ", " ");
                            }
                        }
                        ele.className = className.trim();
                    }
                }
            }
            return this;
        },

        /**
         * 为元素集合中每个元素切换类名状态，并返回原jsApp对象。
         * 如果需要切换多个类名状态，则在字符串中使用空格隔开。
         * 如果第一个参数为Function，则需要切换的类名由回调函数返回。
         * 如果参数为空，则每次切换所有的类名状态——移除所有类名、恢复所有类名。
         * 如果第一个参数为true，同参数为空时一样，每次都切换所有的类名状态；而如果第一个参数为false，仅移除所有类名（可通过无参数的toggleClass方法再次恢复所有类名）。
         * @param {String|Function|Boolean} [name] 需要切换的类名
         * @param {Boolean} [add] 控制状态：true表示添加；false表示移除；没有该参数，则表示已存在则删除，不存在则添加。
         * @return {jsApp}
         */
        toggleClass: function(name, add)
        {
            var type = typeof name, toggleNames;

            //含有控制状态的切换方式（控制状态参数仅针对最终需要切换的类名状态为字符串时有效）
            if(typeof add === "boolean" && type === "string")
            {
                return add ? this.addClass(name) : this.removeClass(name);
            }

            //匹配回调函数function(index, oldClass, add)
            //回调函数——参数index：元素集合当前项的索引值
            //回调函数——参数oldClass：元素集合当前项的类名字符串
            //回调函数——参数add：控制状态
            //回调函数——this：元素集合当前项的值
            if(jsApp.isFunction(name))
            {
                return this.each(function(index, ele)
                {
                    jsApp(ele).toggleClass(name.call(ele, index, ele.className, add), add);
                });
            }

            //在指定的类名字符串中进行切换操作
            if(jsApp.isValidString(name))
            {
                toggleNames = name.match(reg_notwihte);
                jsApp.each(this, function(index, ele)
                {
                    var item, i = 0;
                    ele = jsApp(ele);
                    while(item = toggleNames[i++])
                    {
                        ele.hasClass(item) ? ele.removeClass(item) : ele.addClass(item);
                    }
                });
            }
            //切换所有的类名状态
            else if(name === undefined || type === "boolean")
            {
                jsApp.each(this, function(index, ele)
                {
                    if(jsApp.isElement(ele))
                    {
                        var className = ele.className;
                        if(className !== "")
                        {
                            ele.data_className = className;
                        }
                        ele.className = className !== "" || name === false ? "" : ele.data_className || "";
                    }
                });
            }
            return this;
        },

        /**
         * 返回元素集合中的某个元素是否存在某个类名（只要一个元素满足则返回true）
         * @param {String} name 需要判断的类名
         * @return {Boolean}    是/否
         */
        hasClass: function(name)
        {
            var i = 0, len = this.length, ele;
            if(jsApp.isValidString(name))
            {
                for(; i < len;)
                {
                    ele = this[i++];
                    if(jsApp.isElement(ele) && (" " + ele.className + " ").indexOf(" " + name + " ") >= 0)
                    {
                        return true;
                    }
                }
            }
            return false;
        },

        //============================================================================================================================//
        //设置或获取HTML元素的标签属性（如果要表示自定义属性，其名称必须添加“data-”前缀）
        //说明：如果获取的属性没有被设置则返回null。
        //注意：value参数值可以是字符串值，也可以是一个函数调用。当为函数调用时，调用函数中的this指向的是目标元素，而第一个参数为index——表示元素在匹配集合中的索引。
        attr: function(name, value)
        {
            return this.each(function(index, ele)
            {
                var isJSON = jsApp.isPlainObject(name),
                    items = {},
                    i;

                if(!isJSON && value === undefined)
                {
                    return getAttrFilter(ele, name);
                }

                isJSON ? (items = name) : (items[name] = value);
                for(i in items)
                {
                    setAttrFilter(ele, i, filterValue.call(ele, index, items[i]));
                }
                return this;
            });
        },

        //============================================================================================================================//
        //返回目标HTML元素中是否设置了相关属性
        hasAttr: function(name)
        {
            return this.attr(name) !== null;
        },

        //============================================================================================================================//
        //移除HTML元素的相关属性
        removeAttr: function(name)
        {
            return this.each(function(index, ele)
            {
                name === "class" ? ele.className = "" : ele.removeAttribute(name);
                return this;
            });
        },

        /**
         * 功能1：当缺少[value]参数时，表示获取元素集合中第一个元素的某个或多个样式的值。如果需要返回多个样式的值，则样式的名称以数组形式给出，返回的结果为“属性-值”的JSON格式。
         * 功能2：当拥有[value]参数时，表示为元素集合中的每个元素设置相应样式的值。如果该参数为函数，则由函数返回最终需要赋予的样式值；在函数中分别传递索引值以及索引元素当前的样式值，this则指向索引元素。
         * 功能3：当[name]参数为Object时，表示为元素集合中的每个元素设置样式的值，且样式名称和对应的值来自Object。
         * 注意：如果获取的属性不存在，则返回undefined。
         * @param  {String|Array|Object} name  属性名称
         * @param  {String|Function} value 属性值
         * @return {String|Object}  获取的样式值|实例对象本身
         */
        css: function(name, value)
        {
            var result, obj, key, css;

            if(this.length < 1)
            {
                return this;
            }

            //获取单个或多个样式的值
            if(!jsApp.isPlainObject(name) && value === undefined)
            {
                obj = this[0];

                if(jsApp.isString(name))
                {
                    result = getCSS(obj, name);   
                }
                else if(jsApp.isArray(name))
                {
                    result = {};
                    name.forEach(function(item)
                    {
                        result[item] = getCSS(obj, item);
                    });
                }
                return result;
            }
            //设置单个样式的值
            else if(jsApp.isString(name))
            {
                if(jsApp.isString(value))
                {
                    css = ";" + cssString(name, value);
                }
                else if(jsApp.isFunction(value))
                {
                    return this.each(function(index, ele)
                    {
                        if(ele.nodeType === 1)
                        {
                            value = value.call(ele, index, getCSS(ele, name));
                            ele.style.cssText += ";" + cssString(name, value);   
                        }
                    });
                }
            }

            //使用“样式名:值”的JSON格式进行赋值时
            for(key in name)
            {
                css += ";" + cssString(key, name[key]);
            }

            //将需要设置的样式属性通过cssText属性追加，从而减少重绘与回流的次数
            return this.each(function(index, ele)
            {
                if(ele.nodeType === 1)
                {
                    ele.style.cssText += ";" + css;      
                }
            });
        },

        /**
         * 返回或设置目标元素的内容宽度，即不包括padding、border和margin的值
         * @param  {[type]} value [description]
         * @return {[type]}       [description]
         */
        width: function(value)
        {

        },

        /**
         * 添加事件绑定
         * @param  {String} name    事件名称
         * @param  {Function} handler 事件处理程序
         * @param  {Boolean} [capture=false] 是否进行事件捕捉
         * @return {Function}         事件处理程序
         * @example
         * var testID_click = $("#testID").bind("click", function()
         * {
         *     alert("点击事件！");
         * });
         */
        bind: function(name, handler, capture)
        {
            return this.each(function(index, ele)
            {
                var callback = function(e)
                {
                    //通过中转实现各浏览器下this与事件对象的兼容性
                    e = rewriteEvent(e);
                    handler.call(e.target, e);
                };

                if(/mouseenter|mouseleave/i.test(name) && !("onmouseenter" in ele))
                {
                    // 兼容mouseenter和mouseleave事件（在Chrome和Safari中未得到支持），这两个事件不会发生冒泡，鼠标在子级元素的移动不会触发父级元素的相关事件。
                    name = name === "mouseenter" ? "mouseover" : "mouseout";
                    callback = function(e)
                    {
                        e = rewriteEvent(e);
                        var target = e.target;
                        var mouseTo = e.relatedTarget;

                        //如果相关目标不是目标元素的子元素且不是元素本身则继续执行
                        if(!ele.contains(mouseTo) && ele !== mouseTo)
                        {
                            handler.call(target, e);
                        }
                    };
                }

                document.addEventListener ? ele.addEventListener(name, callback, capture) : ele.attachEvent("on" + name, callback); 
                return callback;
            });
        },

        /**
         * 解除事件绑定
         * @param  {String} name    事件名称
         * @param  {Function} handler 事件处理程序
         * @param  {Boolean} [capture=false] 是否进行事件捕捉
         * @example
         * $("#testID").unbind("click", testID_click);
         */
        unbind: function(name, handler, capture)
        {
            return this.each(function(index, ele)
            {
                if(/mouseenter|mouseleave/i.test(name) && !("onmouseenter" in ele))
                {
                    name = name === "mouseenter" ? "mouseover" : "mouseout";
                }
                document.addEventListener ? ele.removeEventListener(name, handler, capture) : ele.detachEvent("on" + name, handler);
                return this;
            });
        },

        /**
         * DOM树加载完成时即执行通过ready添加的处理程序
         * <br />通过该方式添加的处理程序可以在形成完整的DOM树之后就触发，而不需要像load事件那样在所有页面元素全部加载完毕后才会触发，可以在页面下载的早期就添加事件处理程序，这意味着用户能够尽早地与页面进行交互。
         * @param  {Function} handler 需要绑定的处理程序
         * @return {Object}         实例对象本身
         */
        ready: function(handler)
        {
            //如果添加处理程序时DOM树已经加载完毕，那么1毫秒后自动执行（之所以使用定时器，是为了实现异步执行）
            var readyState = document.readyState;
            if(readyState === "interactive" || readyState === "complete")
            {
                return setTimeout(handler, 1);
            }

            //添加处理程序列表
            readyList.push(handler);
            if(readyList.length === 1)
            {
                //仅当第一次添加处理程序时才进行DomContentLoaded事件的监测。
                DomContentLoaded();
            }
            return this;
        }

    };
    jsApp.init.prototype = jsApp.fn;

    /**
     * 扩展jsApp对象的静态成员（使用jsApp.xx访问）
     * @method
     * @name extend
     * @memberof jsApp
     * @param  {Object} members 需要扩展的成员集合
     * @example
     * jsApp.extend({
     *     e1: function(){},
     *     e2: function(){}
     * });
     */
     /**
     * 扩展jsApp对象的实例成员（使用new jsApp().xx访问）
     * @method
     * @name extend
     * @memberof jsApp.prototype
     * @param  {Object} members 需要扩展的成员集合
     * @example
     * jsApp.fn.extend({
     *     e1: function(){},
     *     e2: function(){}
     * });
     */
    jsApp.extend = jsApp.fn.extend = function()
    {
        //当第1个参数为布尔值时，该参数用来表示是否进行深度合并（深度合并表示在进行合并操作时也对嵌套的子对象进行合并）
        //当参数个数等于1，且不是布尔值时，则将该参数的各个成员合并至jsApp或者jsApp.fn中
        //当参数个数大于1，且第1个参数不是布尔值时，则将后续参数中的各成员合并至第1个参数中
        //合并处理时，相同名称的元素将被后面的值覆盖
        var name, item, src, collection,
            argu = arguments,       //参数
            arguLen = argu.length,  //参数的长度
            target = argu[0] || {}, //需要扩展成员的目标对象
            i = 1,                  //扩展的成员从哪个索引参数开始
            deep = false;           //是否进行深度合并

        if(typeof target === "boolean")
        {
            deep = target;
            target = argu[1] || {};
            i = 2;
        }
        else if(arguLen === 1)
        {
            target = this; 
            i = 0;
        }

        //将需要扩展的成员加入到目标对象
        for(; i < arguLen; i++)
        {
            collection = argu[i];
            for(name in collection) //该语句对null、undefined、数字、布尔值不会执行遍历操作
            {
                item = collection[name];
                if(deep && jsApp.isPlainObject(item) && (src = target[name]) !== undefined)
                {
                    if(!jsApp.isPlainObject(src)){ src = {}; }  //确保深度合并的结果为PlainObject类型
                    target[name] = jsApp.extend(deep, src, item);
                }
                else if(item !== undefined)
                {
                    //确保元素的值不被undefined覆盖
                    target[name] = item;
                }
            }
        }

        //将被扩展后的目标对象返回（可能是jsApp对象，也可能是其他对象）
        return target;
    };

    //扩展jsApp对象的静态成员（外部使用）
    jsApp.extend(/** @lends jsApp */{

        /**
         * 使jsApp避免$的命名冲突。执行该代码后如果$当前表示的是jsApp对象，则让其恢复至被赋值为jsApp之前的值。
         */
        noConflict: function()
        {
            window.$ === jsApp && (window.$ = $);
            return jsApp;
        },

        /**
         * 一个空函数
         * @return {undefined}
         */
        noop: function(){}, 

        /**
         * 返回当前时间的毫秒级快照
         * @return {Number}
         */
        now: function()
        {
            return new Date().valueOf();
        },

        /**
         * 计算回调函数执行所耗费的时间
         * @param  {Function} 回调函数
         * @return {Number} 执行时间（单位：毫秒）
         */
        time: function(callback)
        {
            var start = new Date().valueOf();
            callback.call();
            return new Date().valueOf() - start;
        },

        /**
         * 在全局上下文下执行一些JavaScript代码
         * @param  {String} doSometing JavaScript代码字符串
         * @return {undefined}
         */
        globalEval: function(doSometing)
        {
            if(jsApp.isValidString(doSometing))
            {
                try
                {
                    //IE使用window.execScript将其全局化
                    //其他浏览器使用window.eval将其全局化，单独使用eval则仅针对当前作用域有效
                    //当JavaScript代码字符串含有语法错误时，因为使用了try-catch语句所以在非IE中将不会抛出异常，而IE使用了window.execScript所以将抛出异常
                    (window.execScript || window.eval)(doSometing);
                }
                catch(e){}
            }
        },

        /**
         * 判断父元素中是否包含指定的子节点（同一元素比较时，返回false）
         * @param  {DOMElement} parent 父元素
         * @param  {DOMElement} child 子节点
         * @return {Boolean}
         */
        contains: function(parent, child)
        {
            return parent.contains(child) && parent !== child;
        },

        /**
         * 用于遍历数组、对象，并将每一项值参与回调函数的执行
         * @param  {Array|Object}   obj     需要遍历的数组或对象  
         * @param  {Function} callback  回调函数
         */
        each: function(obj, callback)
        {
            var i = 0, name, len;

            //回调函数：function(index, ele){}
            //回调函数-参数index：当前项的索引
            //回调函数-参数ele：当前项的值
            //回调函数-this：当前项的值
            if(jsApp.isArrayLike(obj))
            {
                for(len = obj.length; i < len; i++)
                {
                    if(callback.call(obj[i], i, obj[i]) === false)
                    {
                        break; //如果回调函数返回false，则退出遍历
                    }
                }
            }
            else
            {
                for(name in obj)
                {
                    if(callback.call(obj[name], name, obj[name]) === false)
                    {
                        break;
                    }
                }
            }
        },

        /**
         * 将目标参数转换为数组。
         * NodeList会随着DOM的更改而被更新，在某些情况下不宜直接操作，建议转换为静态数组后再行处理。
         * @param  {任意类型} data 需要被转换的对象
         * @return {Array}
         */
        makeArray: function(data)
        {
            var result = [];

            //如果参数为undefined或者null时，返回空数组
            if(data != undefined)
            {
                if(jsApp.isArrayLike(data) && !jsApp.isString(data))
                {
                    jsApp.merge(result, data);
                }
                else
                {
                    result = [data];
                }
            }
            return result;
        },

        /**
         * 将数组2合并到数组1，并返回数组1（数组1的值将变更）
         * @param  {Array} first 数组1
         * @param  {Array} second 数组2
         * @return {Array}
         */
        merge: function(first, second)
        {
            var i = 0, j, len;

            if(!jsApp.isArrayLike(first)) first = [];
            j = first.length;

            if(jsApp.isArrayLike(second))
            {
                for(len = second.length; i < len;)
                {
                    first[j++] = second[i++];
                }
            }
            else
            {
                first[j++] = second;
            }
            first.length = j;

            return first;
        },

        /**
         * 遍历数组、对象中的每一项，将回调函数返回的值组合成一个新的数组并返回（不包含null和undefined）
         * @param  {Array|Object}   arr      需要遍历的数组或对象
         * @param  {Function} callback 回调函数
         * @return {Array}
         */
        map: function(arr, callback)
        {
            var i = 0, j = 0, len, value, result = [];

            //回调函数：function(ele, index){}
            //回调函数-参数ele：当前项的值
            //回调函数-参数index：当前项的索引
            //回调函数-this：window
            if(jsApp.isArrayLike(arr))
            {
                for(len = arr.length; i < len; )
                {
                    if((value = callback(arr[i], i++)) != undefined)
                    {
                        result[j++] = value;    
                    }
                }
            }
            else
            {
                for(i in arr)
                {
                    if((value = callback(arr[i], i)) != undefined)
                    {
                        result[j++] = value;    
                    }
                }
            }

            return result;
        },

        /**
         * 填充字符以使目标字符串达到指定长度
         * <br />如果指定的长度小于目标字符串的长度，则返回原目标字符串
         * @param  {String} str       目标字符串
         * @param  {String} dir       填充的方向，"left"——左填充，"right"——右填充
         * @param  {Number} len       目标显示长度
         * @param  {String} character 用来进行填充的字符（如果是以&开头且长度大于1的字符串作为特殊HTML编码字符来使用，如果不是以&开头且长度大于1的字符串将截取第一个字符）
         * @return {String}           字符串填充后的结果
         */
        padStr: function(str, dir, len, character)
        {
            try
            {
                var strLen = str.length,
                    pad = "",
                    i = 0;
                if(strLen < len)
                {
                    character = (character.charAt(0) === "&" && character.length > 1) ? character : character.charAt(0);
                    len = len - strLen;

                    for( ; i < len; i++){
                        pad += character;
                    }
                    if(dir === "left"){
                        return pad + str;
                    }
                    return  str + pad;
                }
                return str;
            }
            catch(e)
            {
                return "";
            }
        },

        /**
         * 返回len个目标字符串的拼接结果
         * @param  {String} str 目标字符串
         * @param  {Number} len 需要拼接的次数
         * @return {String}     字符串拼接后的结果
         */
        dupStr: function(str, len)
        {
            var result = "", i = 0;
            for(; i < len; i++)
            {
                result += str;
            }
            return result;
        },

        /**
         * 返回十进制数转换为十六进制字符串的结果
         * @param  {Number} num   需要被转换的十进制数
         * @param  {Number} [digit] 最终需要显示的字符串位数（默认为转换后的实际位数），少的用“0”进行填补
         * @return {String}       被转换后的十六进制字符串
         */
        getDecimalToHex: function(num, digit)
        {
            var valueStr = [], index = 0;

            if(!jsApp.isNumeric(num)){ return "0"; }

            while(num > 15)
            {
                valueStr[index] = getHexValue(num % 16);
                num = parseInt(num / 16);
                index++;
            }
            valueStr[index] = getHexValue(num);

            if(digit === undefined)
            {
                digit = valueStr.length;
            }
            return jsApp.padStr(valueStr.reverse().join(""), "left", digit, "0");
        },

        /**
         * 返回十六进制数转换为十进制的结果值
         * @param  {String} hex 需要被转换的十六进制数
         * @return {Number}     被转换后的十进制数
         */
        getHexToDecimal: function(hex)
        {
            var i = 0, result = 0, len = ("" + hex).length - 1;
            hex = String(hex).toLowerCase();
            
            if(!/[^0-9a-f]/.test(hex)) //先行判断其是否为有效的十六进制数
            {
                for(; i < len; i++)
                {
                    result += Math.pow(16, hex.length - 1 - i) * getDecimalValue(hex.charAt(i));
                }
                result += getDecimalValue(hex.charAt(hex.length - 1));
            }
            return result;
        },

        /**
         * 判断类型是否为：DOM元素（包括元素节点、文本节点、注释节点、文档节点、文档片段节点）
         * @param  {任意类型}  value 需要判断的值
         * @return {Boolean}       是/否
         */
        isDOM: function(value)
        {
            return value && value.nodeType !== undefined;
        },

        /**
         * 判断类型是否为：元素节点（即HTML标签元素）
         * @param  {任意类型}  value 需要判断的值
         * @return {Boolean}       是/否
         */
        isElement: function(value)
        {
            return value && value.nodeType === 1;
        },

        /**
         * 判断类型是否为：jsApp对象
         * @param  {任意类型}  value 需要判断的值
         * @return {Boolean}       是/否
         */
        isJSApp: function(value)
        {
            return value instanceof jsApp;
        },

        /**
         * 判断类型是否为：字符串
         * @param  {任意类型} value 需要判断的值
         * @return {Boolean}        是/否
         */
        isString: function(value)
        {
            return typeof(value) === "string";
        },

        /**
         * 判断类型是否为：一个有效的字符串（即非全空格成员）
         * @param  {String} value 需要检索的值
         * @return {Boolean}      是/否
         */
        isValidString: function(value)
        {
            return typeof(value) === "string" && !/^\s*$/.test(value);
        },

        /**
         * 判断类型是否为：有效数字
         * @param  {任意类型} value 需要判断的值
         * @return {Boolean}        是/否
         */
        isNumeric: function(value)
        {
            return jsApp.type(value) === "number" && !isNaN(value);
        },

        /**
         * 判断类型是否为：函数
         * @param  {任意类型} value 需要判断的值
         * @return {Boolean}        是/否
         */
        isFunction: function(value)
        {
            return jsApp.type(value) === "function";
        },

        /**
         * 判断类型是否为：数组
         * @param  {任意类型} value 需要判断的值
         * @return {Boolean}        是/否
         */
        isArray: function(value)
        {
            return jsApp.type(value) === "array";
        },

        /**
         * 判断类型是否为：“数组”（即包含length值，且该值为数字类型）
         * <br />注意：window对象的length属性为1，function对象的length属性为0，他们都不作为“数组”进行处理。
         * @param  {任意类型} value 需要判断的值
         * @return {Boolean}        是/否
         */
        isArrayLike: function(value)
        {
            return value != null && !jsApp.isWindow(value) && !jsApp.isFunction(value) && typeof(value.length) === "number";
        },

        /**
         * 判断类型是否为：日期
         * @param  {任意类型} value 需要判断的值
         * @return {Boolean}        是/否
         */
        isDate: function(value)
        {
            return jsApp.type(value) === "date";
        },

        /**
         * 判断类型是否为：日期字符串，如“2012-03-26”
         * @param  {任意类型} value 需要判断的值
         * @return {Boolean}        是/否
         */
        isDateString: function(value)
        {
            return typeof(value) === "string" && !isNaN(Date.parse(value.replace(/-/g, "/")))
        },

        /**
         * 判断类型是否为：通过{}或者new Object()创建的对象（就是指除内置对象和HTML对象外的自定义对象）
         * @param  {任意类型} value 需要判断的值
         * @return {Boolean}        是/否
         */
        isPlainObject: function(value)
        {
            return jsApp.type(value) === "object" && value.toString().toLowerCase() === "[object object]";
        },

        /**
         * 判断类型是否为：一个空对象（即不包含任何成员）
         * @param  {任意类型} value 需要判断的值
         * @return {Boolean}        是/否
         */
        isEmptyObject: function(value)
        {
            var name;
            if(jsApp.isArrayLike(value)) return value.length < 1;
            for(name in value)
            {
                return false;
            }
            return true;
        },

        /**
         * 判断类型是否为：一个window对象（如当前窗口或者一个iframe）
         * @param  {任意类型} value 需要判断的值
         * @return {Boolean}        是/否
         */
        isWindow: function(value)
        {
            return value != null && value == value.window;
        },

        /**
         * 获取值的类型字符串
         * <br />各种类型返回的字符串结果如下：
         * <br />数字(含NaN)：   number
         * <br />字符串：        string
         * <br />ture/false：    boolean
         * <br />null：          null
         * <br />undefined：     undefined
         * <br />数组：          array
         * <br />函数：          function
         * <br />JSON：          object
         * <br />日期对象：      date
         * <br />数学对象：      math
         * <br />正则：          regexp
         * <br />window：
         * <br />    IE6/7/8:    object
         * <br />    chrome：    global
         * <br />    safari:     domwindow
         * <br />    其他：      window
         * <br />document.body:
         * <br />    IE6/7/8:    object
         * <br />    其他：      htmlbodyelement
         * @param  {任意类型} value 需要判断值
         * @return {String}         类型名称
         */
        type: function(value)
        {
            return value == null ? 
                String(value) :
                new RegExp("\\[object\\s+(.*)\\]").exec(Object.prototype.toString.call(value).toLowerCase())[1];
        },

        /**
         * 添加cookie或者重新给cookie赋值
         * @param  {String} name   cookie的名称
         * @param  {String} value  为cookie指定的值
         * @param  {Number} [expires] 指定当前cookie多长时间后失效（单位：分），默认为会话结束后失效（等同于设置该参数为0）。
         * @param  {Object} [config] 配置信息
         * @param  {String} config.path 指定可访问cookie的目录名称，默认值为“/”。假使cookie创建时的页面地址为http://www.xxx.com/syc/ts.html，那么在默认情况下该cookie仅能供sys目录下及其子级目录下的页面进行访问，像http://www.xxx.com/why/jjs.html这样的页面将无法访问该cookie，如果需要使why目录下的页面也能正常访问，则需要将path属性设置为“path=/why”，而如果需要使该网站的所有页面都有权限访问该cookie，则需要将path属性设置为网站根目录，即“path=/”。一个页面可以根据path路径的不同而创建多个具有相同名称的cookie。
         * @param  {String} config.domain 指定可访问cookie的主机名，默认值为空。默认情况下，二级域名之间创建的cookie是不能相互被访问的。比如yes.xxx.com访问不了www.xxx.com域名下创建的cookie，如果需要实现二级域名之间能够互相被访问，则需要设置domain属性值为“domain=.xxx.com”，这样才能保证hyck.xxx.com、osp.xxx.com、yes.xxx.com等域名下的网页也能够正常访问www.xxx.com域名下的网页所创建的cookie。当在www.xxx.com下创建一个cookie时，如果将该cookie的domain值指定为其他二级域名，那么该cookie将创建失败。一个页面可以根据domain值的不同而创建多个具有相同名称的cookie。
         * @param  {Boolean} config.secure 是否启用安全性，默认为false。 默认情况下，使用http协议进行连接的页面即可访问该cookie；当设置该属性后（只要设置为任意字符即可生效，包括""），就只有通过https或者其它安全协议连接的页面才能访问该cookie。
         */
        setCookie: function(name, value, expires, config)
        {
            var path = "/", domain = "", secure = "", e_date;

            if(value === undefined)
            {
                return; //name和value必备
            }

            if(config !== undefined)
            {
                path = (path = config.path) === undefined ? "/" : path;
                domain = (domain = config.domain) === undefined ? "" : ";domain=" + domain;
                secure = (secure = config.secure) === true ? ";secure=" : "";
            }

            if((expires = expires || "") !== "")
            {
                (e_date = new Date()).setMinutes(e_date.getMinutes() + expires)
                expires = ";expires=" + e_date.toGMTString(); //过期时间值必须是GMT时间格式，通过toGMTString()方法即可将一个时间值转换为GMT格式;
            }
            document.cookie = name + "=" + escape(value) + expires + ";path=" + path + domain + secure; //对name和value进行escape编码处理，从而使空格、汉字、特殊字符呈如“%20”的形式进行保存。
        },

        /**
         * 获取指定cookie的值
         * 如果没有目标名称的cookie，则返回null
         * @param  {String} name cookie的名称
         * @return {String}      指定cookie的值
         */
        getCookie: function(name)
        {
            var result = new RegExp("\\b" + name + "=([^;]*)").exec(document.cookie);
            return result !== null ? unescape(result[1]) : null;
        },

        /**
         * 删除指定名称的cookie
         * <br />通过将cookie的过期时间设置为一个过去的时间值即可将该cookie删除。
         * @param  {String} name   需要删除的cookie名称;
         * @param  {Object} [config]   配置信息
         * @param  {String} config.path   添加cookie时所设置的目录名称，默认值为“/”。因为一个页面可以根据path路径的不同而创建多个具有相同名称的cookie，这种情况下进行删除的时候则需要指明path路径。（说明：将path参数值指定为“/”，将无法删除path值为“/xxx”创建的cookie，如果需要删除该cookie，则必需指定delCookie方法的path参数值也为“/xxx”。）
         * @param  {String} config.domain   添加cookie时所设置的主机名称，默认值为空。因为一个页面可以根据domain值的不同而创建多个具有相同名称的cookie，所以在删除的时候也必须指明domain值。
         */
        delCookie: function(name, config)
        {
            var path = "/", domain = "";
            if(config !== undefined)
            {
                path = (path = config.path) === undefined ? "/" : path;
                domain = (domain = config.domain) === undefined ? "" : ";domain=" + domain;
            }
            document.cookie = name + "=;expires=" + new Date(1).toGMTString() + ";path=" + path + domain;
        },

        /**
         * 判断浏览器是否支持Flash插件
         * @return {Boolean} true/false
         */
        canFlash: function()
        {
            var canFlash = false,
                plugins = navigator.plugins;

            if(window.ActiveXObject)
            {
                //For IE
                try
                {
                    //下一行语句如果没有Flash组件，则无法完成创建操作，将会抛出“Automation 服务器不能创建对象”异常
                    new ActiveXObject("ShockwaveFlash.ShockwaveFlash"); 
                    canFlash = true;
                }
                catch(e){}
            }
            else if(plugins)
            {
                //For Firefox、Chrome、Safari、Opera
                for(var i = 0, len = plugins.length; i < len; i++)
                {
                    if(plugins[i].name.toLowerCase().contains("shockwave flash"))
                    {
                        canFlash = true;
                        break;
                    }
                }
            }

            return canFlash;
        },

        /**
         * 设为首页
         * <br />通常我们都会在网站头部某个位置加上一个“设为首页”的功能，但是没有一个全部兼容的设为首页的方法，所以在此创建一个函数将兼容性处理方法包装起来。
         */
        setHome: function()
        {
            try
            {
                //针对IE浏览器(setHomePage的参数必须是一个完整的网站地址才能正常触发设为首页操作)
                document.body.style.behavior = 'url(#default#homepage)';
                document.body.setHomePage(location.href);
            }
            catch(e)
            {
                //暂时没有找到兼容其他浏览器的方法，在此使用提供功能代替（ASCII码字符：您的浏览器需要手动设置首页。如需获取帮助，请参见“如何把百度设为您的上网主页”！）
                var ok = confirm("\u60a8\u7684\u6d4f\u89c8\u5668\u9700\u8981\u624b\u52a8\u8bbe\u7f6e\u9996\u9875\u3002\u5982\u9700\u83b7\u53d6\u5e2e\u52a9\uff0c\u8bf7\u53c2\u89c1\u201c\u5982\u4f55\u628a\u767e\u5ea6\u8bbe\u4e3a\u60a8\u7684\u4e0a\u7f51\u4e3b\u9875\u201d\uff01")
                if(ok)
                {
                    window.open("http://www.baidu.com/cache/sethelp/index.html", "_blank");
                }
            }
        },

        /**
         * 加入收藏
         * <br />基本上（只测试了常用的浏览器，少数浏览没有测试）浏览器将当前页面加入到收藏夹的快捷键是Ctrl+D，但为了吸引用户执行这项操作，通常在页面的某个位置放置了一个类似“加入收藏”的链接。在Firefox和Opera中让该链接的rel="sidebar"可以实现该操作，但是存在瑕疵，所以还是使用JS来执行该操作比较好！
         */
        addFavorite: function()
        {
            try
            {
                //针对IE进行添加操作
                //注：由于安全设置问题，本地文件中没有权限执这行代码。另外在IE中，无法直接执行addFavorite方法，需要通过dom节点的相关事件才能正常触发，
                //    而以IE为内核的360，搜狗等浏览器却可以正常被触发。
                window.external.addFavorite(location.href, document.title);
            }
            catch(e)
            {
                try
                {
                    //针对Firefox进行添加操作
                    //注意：addPanel方法要求网址信息必须是一个绝对且有效的网站地址，所以在本地文件进行测试将无法看到效果
                    window.sidebar.addPanel(document.title, location.href, "");
                }
                catch(e)
                {
                    //如果是其他浏览器，则提示按Ctrl+D进行添加操作（ASCII码字符：添加收藏没有成功，可使用Ctrl+D继续完成操作！）
                    alert("\u6dfb\u52a0\u6536\u85cf\u6ca1\u6709\u6210\u529f\uff0c\u53ef\u4f7f\u7528Ctrl+D\u7ee7\u7eed\u5b8c\u6210\u64cd\u4f5c\uff01");
                }
            }
        },

        /**
         * 创建browser对象用来保存浏览器的相关信息
         * @return {Object} 浏览器信息对象
         */
        browser: (function()
        {
            var browser = /** @lends jsApp.browser */{

                /**
                 * 浏览器名称（如：MSIE、Firefox、Safari、Chrome、Opera）
                 * @type {String}
                 */
                name: "",

                /**
                 * 浏览器别名（即国产浏览器的标识，360SE——360浏览器；sogou——搜狗浏览器；Maxthon——傲游；TheWorld——世界之窗；THEWORLD——世界之窗极速版；BIDUBrowser——百度；LBBROWSER——猎豹浏览器；RSEBROWSER——瑞星安全浏览器；QQBrowser——QQ浏览器；TencentTraveler——腾讯TT浏览器；SaaYaa——闪游；）
                 * @type {String}
                 */
                alias: "",

                /**
                 * 浏览器版本
                 * @type {String}
                 */
                version: ""                
            },
            ua = navigator.userAgent,
            match = /(MSIE) ([\d.]+)/i.exec(ua) || 
                    /(Firefox)\/([\d.]+)/i.exec(ua) ||
                    /(Opera).*version\/([\d.]+)/i.exec(ua) ||
                    /(OPR)\/([\d.]+)/i.exec(ua) ||
                    /(Chrome)\/([\d.]+) safari\/([\d.]+)/i.exec(ua) ||
                    /apple(Webkit).*version\/([\d.]+) safari/i.exec(ua) ||
                    [],
            name = match[1] || "",
            nameLower = name.toLowerCase(),
            version = match[2] || "",
            tags, i, len, writeContent;

            if(nameLower !== "chrome" && nameLower === "webkit")
            {
                name = "Safari";
            }
            else if(nameLower === "opr")
            {
                name = "Opera";
            }

            //针对国产浏览器，使用别名进行识别
            //不知出于什么目的，360浏览器在UA中隐藏了对自身的标识信息，所以无法通过UA对其进行判定。但是360浏览器对部分域名（www.cnzz.com、www.so.com）开放了权限，这些域名通过360浏览器发送请求时，其UA中将带有360SE的信息。
            match = /MetaSr|Maxthon|TheWorld|BIDUBrowser|LBBROWSER|RSEBROWSER|QQBrowser|TencentTraveler|SaaYaa|360SE/i.exec(ua) || [];
            alias = match[0] || "";
            if(alias === "MetaSr")
            {
                alias = "sogou";
            }

            //使IE浏览器兼容HTML5标签
            //并解决IE6中固定定位元素在滚动条滑动时的闪烁效果，即设置：* html{background-image:url(about:blank);}。
            /*----------------------------------
             *说明：截止2012-09-03，Firefox、Chrome、Safari、Opera、IE9等高级浏览器均已支持基本的HTML5标签，但是在IE8及更低版本的IE浏览器中无法使用它们。
             *解决办法：在IE中，只需要通过document.createElement()方法创建一个未被支持的HTML元素，之后就可以正常地使用这个标签了（创建后的标签默认为行内元素，所以还需要通过样式将块状元素的display属性设置为block才行）。
             *=================================================================================*/
            if(lessIE9)
            {
                tags = "header,footer,aside,article,section,hgroup,nav,menu,canvas,output,dialog,datalist,details,figure,figcaption,audio,video,progress,mark,time".split(",");
                for(i = 0, len = tags.length; i < len; i++)
                {
                    document.createElement(tags[i]);
                }
                document.write('<style id="jsApp_selectorStyle">* html{background-image:url(about:blank);}header,footer,aside,article,section,hgroup,nav,menu,canvas,details,figure,figcaption,audio,video{display:block;}</style>')
            }

            //解决IE6浏览器不缓存背景图片的Bug
            /*----------------------------------
             *说明：我们通常需要使用CSS来进行背景图片的设置，但这样在IE6下有一个Bug，那就是IE6默认情况下不缓存背景图片，CSS里每次更改图片的位置时都会重新发起请求，所以当鼠标在有CSS背景的元素上移动时，图片会闪烁甚至鼠标会出现忙的状态。
             *      解决方案一：在CSS中加入如下样式：html { filter: expression(document.execCommand(”BackgroundImageCache”, false, true)); }
             *      使用上述方案可能会影响整个页面的加载速度，所以推荐使用JS来修正这个Bug。
             *=================================================================================*/
            if(isIE6)
            {
                try
                {
                    document.execCommand("BackgroundImageCache", false, true);
                }
                catch(e){}
            }

            browser.name = name;
            browser.alias = alias;
            browser.version = version;

            return browser;
        }())
    });

    //扩展jsApp对象的静态成员（内部使用）
    jsApp.extend(/** @lends jsApp */{

        /**
         * 判断目标元素的节点名称是否与指定值相符
         * @param  {DOMElement} ele  目标元素
         * @param  {String} name 指定名称（小写）
         * @return {Boolean}
         */
        nodeName: function(ele, name)
        {
            return ele.nodeName && ele.nodeName.toLowerCase() === name.toLowerCase();
        },

        /**
         * 将通过“-”链接的字符串转为换驼峰式，如“font-size”转换为“fontSize”。
         * @param  {String} str 需要转换的字符串
         * @return {String}     原字符串的驼峰形式
         */
        camelCase: function(str)
        {
            //IE的浏览器私有属性前缀没有驼峰化
            return str.replace(/^-ms-/, "ms-").replace(/-+(.)?/g, function(match, item)
            {
                return item ? item.toUpperCase() : "";
            });
        },

        /**
         * 将驼峰式字符串转换为连字符式，如“fontSize”转换为“font-size”
         * @param  {String} str 需要转换的字符串
         * @return {String}     原字符串的连字符式
         */
        dashCase: function(str)
        {
            return /-/.test(str) ? str.toLowerCase() : str.replace(/([A-Z])/g, "-$1").toLowerCase();
        },

        /**
         * 返回目标节点的克隆结果
         * @param  {DOMElement} node 目标节点
         * @return {DOMElement}
         */
        clone: function(node)
        {
            return node && node.cloneNode(true);
        },

        /**
         * 用于获取当前页面中鼠标选择的文本值
         * @return {String} 鼠标选中的文本
         */
        getSelection: function()
        {
            var str = document.selection ? document.selection.createRange().text : document.getSelection();  //IE6~8支持selection对象，其他浏览器支持getSelection方法。
            return str + "";    //如果不使用该语句返回值，将返回selection的引用。
        },

        /**
         * 获取目标元素的属性值（不包含value参数），或给属性进行赋值（包含value参数）。
         * 如果获取的属性没有被设置，最终返回undefined（原生DOM操作返回null）。
         * @param  {DOMELement} ele   目标元素
         * @param  {String} name  属性名称
         * @param  {String} [value] 属性值
         * @return {String|Null}
         */
        attr: function(ele, name, value)
        {
            var result, attr;
            
            if(!jsApp.isElement(ele)) return; //如果目标元素不是HTML标签，则直接返回undefined
            name = name.toLowerCase();

            //返回属性值
            if(value === undefined)
            {
                switch(name)
                {
                    case "class":
                        //IE6、7不支持通过getAttribute获取class属性
                        //通过下述处理后：如果目标属性存在且没有被赋值或者被赋值为空字符串，除了IE7返回undefined外，其他浏览器都将返回一个空字符串。
                    case "tabindex":
                        //默认情况下，当没有设置tabindex属性时，通过getAttribute操作时IE6/7中的值为0，IE8+中的值为-32768，而非null，通过下述处理后IE8+依旧返回-32768，其他浏览器则返回undefined。
                        //通过下述处理后：如果目标属性存在且没有被赋值或者被赋值为空字符串，IE6/7将返回undefined、IE8+将返回-32768，其他浏览器返回空字符串。
                        result = lessIE8 ? 
                            ((attr = ele.getAttributeNode(name)) && attr.specified ? attr.value : undefined) : 
                            ele.getAttribute(name);
                        break;

                    case "style":
                        //IE6、7不支持通过getAttribute获取style属性
                        //如果属性值为无效值，在所有IE浏览器中均返回undefined，而在其他浏览器中将被正常返回
                        result = lessIE8 ? ele.style.cssText || undefined : ele.getAttribute(name);
                        break;

                    case "for":
                        //label标签的for属性以DOM属性的形式进行存储，命名为htmlFor；其他标签如果有设置for属性，则作为元素属性进行访问
                        result = "htmlFor" in ele ? ele.htmlFor : ele.getAttribute(name);
                        break;

                    default:
                        //默认获取DOM属性，其次再取元素属性，与赋值时的操作保持目的一致性
                        //目的一致性：如果需要操作DOM属性，使用node[属性名]进行；如果要操作元素属性，则使用node.setAttribute()和node.getAttribute()进行；
                        result = ele[name] == undefined ? ele.getAttribute(name) : ele[name];
                        // result = ele.getAttribute(name);
                }
                return result === null ? undefined : result;
            }

            //设置属性值
            //IE6、7、8中表单控件的type属性为只读
            //IE6、7、8中表单控件的maxlength属性设置无效
            if(value === null) jsApp.removeAttr(ele, name);
            switch(name)
            {
                case "class":
                    ele.className = value;
                    break;

                case "style":
                    lessIE8 ? (ele.style.cssText = value) : ele.setAttribute(name, value);
                    break;

                case "tabindex":
                    //tabindex属性在IE6~8中必须使用tabIndex设置方可有效，其他浏览器则都有效
                    ele.setAttribute("tabIndex", value);
                    break;

                case "maxlength":
                    //maxlength属性在IE6~7中必须使用maxLength设置方可有效，其他浏览器则都有效
                    ele.setAttribute("maxLength", value);
                    break;

                case "for":
                    "htmlFor" in ele ? (ele.htmlFor = value): ele.setAttribute(name, value);
                    break;

                default:
                    //当DOM对象的DOM属性值为空时，使用setAttribute方法进行赋值。采用下述方式，无论目标属性是作为元素属性还是DOM属性，设置的结果值都会是正确的。
                    ele[name] == undefined ? ele.setAttribute(name, value) : (ele[name] = value);
                    // ele.setAttribute(name, value);
            }
        },

        /**
         * 移除目标元素的某个属性
         * @param  {DOMELement} ele   目标元素
         * @param  {String} name  属性名称
         * @return {undefined}
         */
        removeAttr: function(ele, name)
        {
            if(jsApp.isElement(ele))
            {
                name === "class" ? ele.className = "" : ele.removeAttribute(name);    
            }            
        }    

    });

    //对jsApp的原型进行扩展：事件绑定的快捷方式
    jsApp.each("mousewheel,mouseover,mousemove,mouseout,mousedown,mouseup,mouseenter,mouseleave,click,dblclick,focus,blur,change,keydown,keypress,keyup,load,unload,beforeunload,resize,scroll,error,contextmenu,hashchange".split(","),
    function(i, name)
    {
        jsApp.fn[name] = function(handler, capture)
        {
            this.bind(name, handler, capture);
        };
    });

    window.$ = window.jsApp = jsApp;   //将jsApp转换为全局对象（之后该匿名函数将形成一个闭包）

})(window);

/*
 * Sizzle基本API：
 * 选择器查询：（返回类型：Array）
 * 
 *     全局查询：Sizzle(Selector)
 *         查询出页面中满足选择器的所有元素所组成的数组
 *         
 *     局部查询：Sizzle(Selector, DOMElement|DOMDocument)
 *         查询出指定HTML元素下所有满足选择器的子节点所组成的数组
 *         
 * 元素匹配：（返回类型：Boolean）
 * 
 *     Sizzle.matchesSelector(DOMElement, Selector)
 *         判断指定的HTML元素是否与选择器匹配
 *         
 * 元素筛选：（返回类型：Array）
 * 
 *     Sizzle.matches(Selector, DOMElement Array)
 *         筛选出HTML元素数组中满足选择器的所有元素所组成的数组
 *         
 * 排序去重：（返回类型：Array）
 *
 *      Sizzle.uniqueSort(DOMElement Array)
 *          将元素数组进行排序并去除重复内容后将新的结果返回
 */
/*
 * Sizzle CSS Selector Engine v1.10.10-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-09-12
 */
(function( window ) {

    var i,
        support,
        cachedruns,
        Expr,
        getText,
        isXML,
        compile,
        outermostContext,
        sortInput,
        hasDuplicate,

        // Local document vars
        setDocument,
        document,
        docElem,
        documentIsHTML,
        rbuggyQSA,
        rbuggyMatches,
        matches,
        contains,

        // Instance-specific data
        expando = "sizzle" + -(new Date()),
        preferredDoc = window.document,
        dirruns = 0,
        done = 0,
        classCache = createCache(),
        tokenCache = createCache(),
        compilerCache = createCache(),
        sortOrder = function( a, b ) {
            if ( a === b ) {
                hasDuplicate = true;
            }
            return 0;
        },

        // General-purpose constants
        strundefined = typeof undefined,
        MAX_NEGATIVE = 1 << 31,

        // Instance methods
        hasOwn = ({}).hasOwnProperty,
        arr = [],
        pop = arr.pop,
        push_native = arr.push,
        push = arr.push,
        slice = arr.slice,
        // Use a stripped-down indexOf if we can't use a native one
        indexOf = arr.indexOf || function( elem ) {
            var i = 0,
                len = this.length;
            for ( ; i < len; i++ ) {
                if ( this[i] === elem ) {
                    return i;
                }
            }
            return -1;
        },

        booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

        // Regular expressions

        // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
        whitespace = "[\\x20\\t\\r\\n\\f]",
        // http://www.w3.org/TR/css3-syntax/#characters
        characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

        // Loosely modeled on CSS identifier characters
        // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
        // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
        identifier = characterEncoding.replace( "w", "w#" ),

        // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
        attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
            "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

        // Prefer arguments quoted,
        //   then not containing pseudos/brackets,
        //   then attribute selectors/non-parenthetical expressions,
        //   then anything else
        // These preferences are here to reduce the number of selectors
        //   needing tokenize in the PSEUDO preFilter
        pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

        // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
        rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

        rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
        rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

        rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

        rpseudo = new RegExp( pseudos ),
        ridentifier = new RegExp( "^" + identifier + "$" ),

        matchExpr = {
            "ID": new RegExp( "^#(" + characterEncoding + ")" ),
            "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
            "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
            "ATTR": new RegExp( "^" + attributes ),
            "PSEUDO": new RegExp( "^" + pseudos ),
            "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
            "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
            // For use in libraries implementing .is()
            // We use this for POS matching in `select`
            "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
        },

        rinputs = /^(?:input|select|textarea|button)$/i,
        rheader = /^h\d$/i,

        rnative = /^[^{]+\{\s*\[native \w/,

        // Easily-parseable/retrievable ID or TAG or CLASS selectors
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

        rsibling = /[+~]/,
        rescape = /'|\\/g,

        // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
        funescape = function( _, escaped, escapedWhitespace ) {
            var high = "0x" + escaped - 0x10000;
            // NaN means non-codepoint
            // Support: Firefox
            // Workaround erroneous numeric interpretation of +"0x"
            return high !== high || escapedWhitespace ?
                escaped :
                high < 0 ?
                    // BMP codepoint
                    String.fromCharCode( high + 0x10000 ) :
                    // Supplemental Plane codepoint (surrogate pair)
                    String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
        };

    // Optimize for push.apply( _, NodeList )
    try {
        push.apply(
            (arr = slice.call( preferredDoc.childNodes )),
            preferredDoc.childNodes
        );
        // Support: Android<4.0
        // Detect silently failing push.apply
        arr[ preferredDoc.childNodes.length ].nodeType;
    } catch ( e ) {
        push = { apply: arr.length ?

            // Leverage slice if possible
            function( target, els ) {
                push_native.apply( target, slice.call(els) );
            } :

            // Support: IE<9
            // Otherwise append directly
            function( target, els ) {
                var j = target.length,
                    i = 0;
                // Can't trust NodeList.length
                while ( (target[j++] = els[i++]) ) {}
                target.length = j - 1;
            }
        };
    }

    function Sizzle( selector, context, results, seed ) {
        var match, elem, m, nodeType,
            // QSA vars
            i, groups, old, nid, newContext, newSelector;

        if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
            setDocument( context );
        }

        context = context || document;
        results = results || [];

        if ( !selector || typeof selector !== "string" ) {
            return results;
        }

        if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
            return [];
        }

        if ( documentIsHTML && !seed ) {

            // Shortcuts
            if ( (match = rquickExpr.exec( selector )) ) {
                // Speed-up: Sizzle("#ID")
                if ( (m = match[1]) ) {
                    if ( nodeType === 9 ) {
                        elem = context.getElementById( m );
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document (jQuery #6963)
                        if ( elem && elem.parentNode ) {
                            // Handle the case where IE, Opera, and Webkit return items
                            // by name instead of ID
                            if ( elem.id === m ) {
                                results.push( elem );
                                return results;
                            }
                        } else {
                            return results;
                        }
                    } else {
                        // Context is not a document
                        if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                            contains( context, elem ) && elem.id === m ) {
                            results.push( elem );
                            return results;
                        }
                    }

                // Speed-up: Sizzle("TAG")
                } else if ( match[2] ) {
                    push.apply( results, context.getElementsByTagName( selector ) );
                    return results;

                // Speed-up: Sizzle(".CLASS")
                } else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
                    push.apply( results, context.getElementsByClassName( m ) );
                    return results;
                }
            }

            // QSA path
            if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
                nid = old = expando;
                newContext = context;
                newSelector = nodeType === 9 && selector;

                // qSA works strangely on Element-rooted queries
                // We can work around this by specifying an extra ID on the root
                // and working up from there (Thanks to Andrew Dupont for the technique)
                // IE 8 doesn't work on object elements
                if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                    groups = tokenize( selector );

                    if ( (old = context.getAttribute("id")) ) {
                        nid = old.replace( rescape, "\\$&" );
                    } else {
                        context.setAttribute( "id", nid );
                    }
                    nid = "[id='" + nid + "'] ";

                    i = groups.length;
                    while ( i-- ) {
                        groups[i] = nid + toSelector( groups[i] );
                    }
                    newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
                    newSelector = groups.join(",");
                }

                if ( newSelector ) {
                    try {
                        push.apply( results,
                            newContext.querySelectorAll( newSelector )
                        );
                        return results;
                    } catch(qsaError) {
                    } finally {
                        if ( !old ) {
                            context.removeAttribute("id");
                        }
                    }
                }
            }
        }

        // All others
        return select( selector.replace( rtrim, "$1" ), context, results, seed );
    }

    /**
     * Create key-value caches of limited size
     * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
     *  property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *  deleting the oldest entry
     */
    function createCache() {
        var keys = [];

        function cache( key, value ) {
            // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
            if ( keys.push( key + " " ) > Expr.cacheLength ) {
                // Only keep the most recent entries
                delete cache[ keys.shift() ];
            }
            return (cache[ key + " " ] = value);
        }
        return cache;
    }

    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */
    function markFunction( fn ) {
        fn[ expando ] = true;
        return fn;
    }

    /**
     * Support testing using an element
     * @param {Function} fn Passed the created div and expects a boolean result
     */
    function assert( fn ) {
        var div = document.createElement("div");

        try {
            return !!fn( div );
        } catch (e) {
            return false;
        } finally {
            // Remove from its parent by default
            if ( div.parentNode ) {
                div.parentNode.removeChild( div );
            }
            // release memory in IE
            div = null;
        }
    }

    /**
     * Adds the same handler for all of the specified attrs
     * @param {String} attrs Pipe-separated list of attributes
     * @param {Function} handler The method that will be applied
     */
    function addHandle( attrs, handler ) {
        var arr = attrs.split("|"),
            i = attrs.length;

        while ( i-- ) {
            Expr.attrHandle[ arr[i] ] = handler;
        }
    }

    /**
     * Checks document order of two siblings
     * @param {Element} a
     * @param {Element} b
     * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */
    function siblingCheck( a, b ) {
        var cur = b && a,
            diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
                ( ~b.sourceIndex || MAX_NEGATIVE ) -
                ( ~a.sourceIndex || MAX_NEGATIVE );

        // Use IE sourceIndex if available on both nodes
        if ( diff ) {
            return diff;
        }

        // Check if b follows a
        if ( cur ) {
            while ( (cur = cur.nextSibling) ) {
                if ( cur === b ) {
                    return -1;
                }
            }
        }

        return a ? 1 : -1;
    }

    /**
     * Returns a function to use in pseudos for input types
     * @param {String} type
     */
    function createInputPseudo( type ) {
        return function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && elem.type === type;
        };
    }

    /**
     * Returns a function to use in pseudos for buttons
     * @param {String} type
     */
    function createButtonPseudo( type ) {
        return function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && elem.type === type;
        };
    }

    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */
    function createPositionalPseudo( fn ) {
        return markFunction(function( argument ) {
            argument = +argument;
            return markFunction(function( seed, matches ) {
                var j,
                    matchIndexes = fn( [], seed.length, argument ),
                    i = matchIndexes.length;

                // Match elements found at the specified indexes
                while ( i-- ) {
                    if ( seed[ (j = matchIndexes[i]) ] ) {
                        seed[j] = !(matches[j] = seed[j]);
                    }
                }
            });
        });
    }

    /**
     * Checks a node for validity as a Sizzle context
     * @param {Element|Object=} context
     * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
     */
    function testContext( context ) {
        return context && typeof context.getElementsByTagName !== strundefined && context;
    }

    // Expose support vars for convenience
    support = Sizzle.support = {};

    /**
     * Detects XML nodes
     * @param {Element|Object} elem An element or a document
     * @returns {Boolean} True iff elem is a non-HTML XML node
     */
    isXML = Sizzle.isXML = function( elem ) {
        // documentElement is verified for cases where it doesn't yet exist
        // (such as loading iframes in IE - #4833)
        var documentElement = elem && (elem.ownerDocument || elem).documentElement;
        return documentElement ? documentElement.nodeName !== "HTML" : false;
    };

    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */
    setDocument = Sizzle.setDocument = function( node ) {
        var doc = node ? node.ownerDocument || node : preferredDoc,
            parent = doc.defaultView;

        // If no document and documentElement is available, return
        if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
            return document;
        }

        // Set our document
        document = doc;
        docElem = doc.documentElement;

        // Support tests
        documentIsHTML = !isXML( doc );

        // Support: IE>8
        // If iframe document is assigned to "document" variable and if iframe has been reloaded,
        // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
        // IE6-8 do not support the defaultView property so parent will be undefined
        if ( parent && parent.attachEvent && parent !== parent.top ) {
            parent.attachEvent( "onbeforeunload", function() {
                setDocument();
            });
        }

        /* Attributes
        ---------------------------------------------------------------------- */

        // Support: IE<8
        // Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
        support.attributes = assert(function( div ) {
            div.className = "i";
            return !div.getAttribute("className");
        });

        /* getElement(s)By*
        ---------------------------------------------------------------------- */

        // Check if getElementsByTagName("*") returns only elements
        support.getElementsByTagName = assert(function( div ) {
            div.appendChild( doc.createComment("") );
            return !div.getElementsByTagName("*").length;
        });

        // Check if getElementsByClassName can be trusted
        support.getElementsByClassName = assert(function( div ) {
            div.innerHTML = "<div class='a'></div><div class='a i'></div>";

            // Support: Safari<4
            // Catch class over-caching
            div.firstChild.className = "i";
            // Support: Opera<10
            // Catch gEBCN failure to find non-leading classes
            return div.getElementsByClassName("i").length === 2;
        });

        // Support: IE<10
        // Check if getElementById returns elements by name
        // The broken getElementById methods don't pick up programatically-set names,
        // so use a roundabout getElementsByName test
        support.getById = assert(function( div ) {
            docElem.appendChild( div ).id = expando;
            return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
        });

        // ID find and filter
        if ( support.getById ) {
            Expr.find["ID"] = function( id, context ) {
                if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
                    var m = context.getElementById( id );
                    // Check parentNode to catch when Blackberry 4.6 returns
                    // nodes that are no longer in the document #6963
                    return m && m.parentNode ? [m] : [];
                }
            };
            Expr.filter["ID"] = function( id ) {
                var attrId = id.replace( runescape, funescape );
                return function( elem ) {
                    return elem.getAttribute("id") === attrId;
                };
            };
        } else {
            // Support: IE6/7
            // getElementById is not reliable as a find shortcut
            delete Expr.find["ID"];

            Expr.filter["ID"] =  function( id ) {
                var attrId = id.replace( runescape, funescape );
                return function( elem ) {
                    var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                    return node && node.value === attrId;
                };
            };
        }

        // Tag
        Expr.find["TAG"] = support.getElementsByTagName ?
            function( tag, context ) {
                if ( typeof context.getElementsByTagName !== strundefined ) {
                    return context.getElementsByTagName( tag );
                }
            } :
            function( tag, context ) {
                var elem,
                    tmp = [],
                    i = 0,
                    results = context.getElementsByTagName( tag );

                // Filter out possible comments
                if ( tag === "*" ) {
                    while ( (elem = results[i++]) ) {
                        if ( elem.nodeType === 1 ) {
                            tmp.push( elem );
                        }
                    }

                    return tmp;
                }
                return results;
            };

        // Class
        Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
            if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
                return context.getElementsByClassName( className );
            }
        };

        /* QSA/matchesSelector
        ---------------------------------------------------------------------- */

        // QSA and matchesSelector support

        // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
        rbuggyMatches = [];

        // qSa(:focus) reports false when true (Chrome 21)
        // We allow this because of a bug in IE8/9 that throws an error
        // whenever `document.activeElement` is accessed on an iframe
        // So, we allow :focus to pass through QSA all the time to avoid the IE error
        // See http://bugs.jquery.com/ticket/13378
        rbuggyQSA = [];

        if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
            // Build QSA regex
            // Regex strategy adopted from Diego Perini
            assert(function( div ) {
                // Select is set to empty string on purpose
                // This is to test IE's treatment of not explicitly
                // setting a boolean content attribute,
                // since its presence should be enough
                // http://bugs.jquery.com/ticket/12359
                div.innerHTML = "<select><option selected=''></option></select>";

                // Support: IE8
                // Boolean attributes and "value" are not treated correctly
                if ( !div.querySelectorAll("[selected]").length ) {
                    rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
                }

                // Webkit/Opera - :checked should return selected option elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                // IE8 throws error here and will not see later tests
                if ( !div.querySelectorAll(":checked").length ) {
                    rbuggyQSA.push(":checked");
                }
            });

            assert(function( div ) {

                // Support: Opera 10-12/IE8
                // ^= $= *= and empty values
                // Should not select anything
                // Support: Windows 8 Native Apps
                // The type attribute is restricted during .innerHTML assignment
                var input = doc.createElement("input");
                input.setAttribute( "type", "hidden" );
                div.appendChild( input ).setAttribute( "t", "" );

                if ( div.querySelectorAll("[t^='']").length ) {
                    rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
                }

                // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                // IE8 throws error here and will not see later tests
                if ( !div.querySelectorAll(":enabled").length ) {
                    rbuggyQSA.push( ":enabled", ":disabled" );
                }

                // Opera 10-11 does not throw on post-comma invalid pseudos
                div.querySelectorAll("*,:x");
                rbuggyQSA.push(",.*:");
            });
        }

        if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
            docElem.mozMatchesSelector ||
            docElem.oMatchesSelector ||
            docElem.msMatchesSelector) )) ) {

            assert(function( div ) {
                // Check to see if it's possible to do matchesSelector
                // on a disconnected node (IE 9)
                support.disconnectedMatch = matches.call( div, "div" );

                // This should fail with an exception
                // Gecko does not error, returns false instead
                matches.call( div, "[s!='']:x" );
                rbuggyMatches.push( "!=", pseudos );
            });
        }

        rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
        rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

        /* Contains
        ---------------------------------------------------------------------- */

        // Element contains another
        // Purposefully does not implement inclusive descendent
        // As in, an element does not contain itself
        contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
            function( a, b ) {
                var adown = a.nodeType === 9 ? a.documentElement : a,
                    bup = b && b.parentNode;
                return a === bup || !!( bup && bup.nodeType === 1 && (
                    adown.contains ?
                        adown.contains( bup ) :
                        a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
                ));
            } :
            function( a, b ) {
                if ( b ) {
                    while ( (b = b.parentNode) ) {
                        if ( b === a ) {
                            return true;
                        }
                    }
                }
                return false;
            };

        /* Sorting
        ---------------------------------------------------------------------- */

        // Document order sorting
        sortOrder = docElem.compareDocumentPosition ?
        function( a, b ) {

            // Flag for duplicate removal
            if ( a === b ) {
                hasDuplicate = true;
                return 0;
            }

            var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

            if ( compare ) {
                // Disconnected nodes
                if ( compare & 1 ||
                    (!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

                    // Choose the first element that is related to our preferred document
                    if ( a === doc || contains(preferredDoc, a) ) {
                        return -1;
                    }
                    if ( b === doc || contains(preferredDoc, b) ) {
                        return 1;
                    }

                    // Maintain original order
                    return sortInput ?
                        ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
                        0;
                }

                return compare & 4 ? -1 : 1;
            }

            // Not directly comparable, sort on existence of method
            return a.compareDocumentPosition ? -1 : 1;
        } :
        function( a, b ) {
            var cur,
                i = 0,
                aup = a.parentNode,
                bup = b.parentNode,
                ap = [ a ],
                bp = [ b ];

            // Exit early if the nodes are identical
            if ( a === b ) {
                hasDuplicate = true;
                return 0;

            // Parentless nodes are either documents or disconnected
            } else if ( !aup || !bup ) {
                return a === doc ? -1 :
                    b === doc ? 1 :
                    aup ? -1 :
                    bup ? 1 :
                    sortInput ?
                    ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
                    0;

            // If the nodes are siblings, we can do a quick check
            } else if ( aup === bup ) {
                return siblingCheck( a, b );
            }

            // Otherwise we need full lists of their ancestors for comparison
            cur = a;
            while ( (cur = cur.parentNode) ) {
                ap.unshift( cur );
            }
            cur = b;
            while ( (cur = cur.parentNode) ) {
                bp.unshift( cur );
            }

            // Walk down the tree looking for a discrepancy
            while ( ap[i] === bp[i] ) {
                i++;
            }

            return i ?
                // Do a sibling check if the nodes have a common ancestor
                siblingCheck( ap[i], bp[i] ) :

                // Otherwise nodes in our document sort first
                ap[i] === preferredDoc ? -1 :
                bp[i] === preferredDoc ? 1 :
                0;
        };

        return doc;
    };

    Sizzle.matches = function( expr, elements ) {
        return Sizzle( expr, null, null, elements );
    };

    Sizzle.matchesSelector = function( elem, expr ) {
        // Set document vars if needed
        if ( ( elem.ownerDocument || elem ) !== document ) {
            setDocument( elem );
        }

        // Make sure that attribute selectors are quoted
        expr = expr.replace( rattributeQuotes, "='$1']" );

        if ( support.matchesSelector && documentIsHTML &&
            ( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
            ( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

            try {
                var ret = matches.call( elem, expr );

                // IE 9's matchesSelector returns false on disconnected nodes
                if ( ret || support.disconnectedMatch ||
                        // As well, disconnected nodes are said to be in a document
                        // fragment in IE 9
                        elem.document && elem.document.nodeType !== 11 ) {
                    return ret;
                }
            } catch(e) {}
        }

        return Sizzle( expr, document, null, [elem] ).length > 0;
    };

    Sizzle.contains = function( context, elem ) {
        // Set document vars if needed
        if ( ( context.ownerDocument || context ) !== document ) {
            setDocument( context );
        }
        return contains( context, elem );
    };

    Sizzle.attr = function( elem, name ) {
        // Set document vars if needed
        if ( ( elem.ownerDocument || elem ) !== document ) {
            setDocument( elem );
        }

        var fn = Expr.attrHandle[ name.toLowerCase() ],
            // Don't get fooled by Object.prototype properties (jQuery #13807)
            val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
                fn( elem, name, !documentIsHTML ) :
                undefined;

        return val !== undefined ?
            val :
            support.attributes || !documentIsHTML ?
                elem.getAttribute( name ) :
                (val = elem.getAttributeNode(name)) && val.specified ?
                    val.value :
                    null;
    };

    Sizzle.error = function( msg ) {
        throw new Error( "Syntax error, unrecognized expression: " + msg );
    };

    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */
    Sizzle.uniqueSort = function( results ) {
        var elem,
            duplicates = [],
            j = 0,
            i = 0;

        // 下面两行代码为龙泉自主添加
        if(!results) return [];
        if(results.length < 2) return results;

        // Unless we *know* we can detect duplicates, assume their presence
        hasDuplicate = !support.detectDuplicates;
        sortInput = !support.sortStable && results.slice( 0 );
        results.sort( sortOrder );

        if ( hasDuplicate ) {
            while ( (elem = results[i++]) ) {
                if ( elem === results[ i ] ) {
                    j = duplicates.push( i );
                }
            }
            while ( j-- ) {
                results.splice( duplicates[ j ], 1 );
            }
        }

        return results;
    };

    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    getText = Sizzle.getText = function( elem ) {
        var node,
            ret = "",
            i = 0,
            nodeType = elem.nodeType;

        if ( !nodeType ) {
            // If no nodeType, this is expected to be an array
            while ( (node = elem[i++]) ) {
                // Do not traverse comment nodes
                ret += getText( node );
            }
        } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
            // Use textContent for elements
            // innerText usage removed for consistency of new lines (jQuery #11153)
            if ( typeof elem.textContent === "string" ) {
                return elem.textContent;
            } else {
                // Traverse its children
                for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                    ret += getText( elem );
                }
            }
        } else if ( nodeType === 3 || nodeType === 4 ) {
            return elem.nodeValue;
        }
        // Do not include comment or processing instruction nodes

        return ret;
    };

    Expr = Sizzle.selectors = {

        // Can be adjusted by the user
        cacheLength: 50,

        createPseudo: markFunction,

        match: matchExpr,

        attrHandle: {},

        find: {},

        relative: {
            ">": { dir: "parentNode", first: true },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: true },
            "~": { dir: "previousSibling" }
        },

        preFilter: {
            "ATTR": function( match ) {
                match[1] = match[1].replace( runescape, funescape );

                // Move the given value to match[3] whether quoted or unquoted
                match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

                if ( match[2] === "~=" ) {
                    match[3] = " " + match[3] + " ";
                }

                return match.slice( 0, 4 );
            },

            "CHILD": function( match ) {
                /* matches from matchExpr["CHILD"]
                    1 type (only|nth|...)
                    2 what (child|of-type)
                    3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                    4 xn-component of xn+y argument ([+-]?\d*n|)
                    5 sign of xn-component
                    6 x of xn-component
                    7 sign of y-component
                    8 y of y-component
                */
                match[1] = match[1].toLowerCase();

                if ( match[1].slice( 0, 3 ) === "nth" ) {
                    // nth-* requires argument
                    if ( !match[3] ) {
                        Sizzle.error( match[0] );
                    }

                    // numeric x and y parameters for Expr.filter.CHILD
                    // remember that false/true cast respectively to 0/1
                    match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
                    match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

                // other types prohibit arguments
                } else if ( match[3] ) {
                    Sizzle.error( match[0] );
                }

                return match;
            },

            "PSEUDO": function( match ) {
                var excess,
                    unquoted = !match[5] && match[2];

                if ( matchExpr["CHILD"].test( match[0] ) ) {
                    return null;
                }

                // Accept quoted arguments as-is
                if ( match[3] && match[4] !== undefined ) {
                    match[2] = match[4];

                // Strip excess characters from unquoted arguments
                } else if ( unquoted && rpseudo.test( unquoted ) &&
                    // Get excess from tokenize (recursively)
                    (excess = tokenize( unquoted, true )) &&
                    // advance to the next closing parenthesis
                    (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

                    // excess is a negative index
                    match[0] = match[0].slice( 0, excess );
                    match[2] = unquoted.slice( 0, excess );
                }

                // Return only captures needed by the pseudo filter method (type and argument)
                return match.slice( 0, 3 );
            }
        },

        filter: {

            "TAG": function( nodeNameSelector ) {
                var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
                return nodeNameSelector === "*" ?
                    function() { return true; } :
                    function( elem ) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
            },

            "CLASS": function( className ) {
                var pattern = classCache[ className + " " ];

                return pattern ||
                    (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
                    classCache( className, function( elem ) {
                        return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
                    });
            },

            "ATTR": function( name, operator, check ) {
                return function( elem ) {
                    var result = Sizzle.attr( elem, name );

                    if ( result == null ) {
                        return operator === "!=";
                    }
                    if ( !operator ) {
                        return true;
                    }

                    result += "";

                    return operator === "=" ? result === check :
                        operator === "!=" ? result !== check :
                        operator === "^=" ? check && result.indexOf( check ) === 0 :
                        operator === "*=" ? check && result.indexOf( check ) > -1 :
                        operator === "$=" ? check && result.slice( -check.length ) === check :
                        operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
                        operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
                        false;
                };
            },

            "CHILD": function( type, what, argument, first, last ) {
                var simple = type.slice( 0, 3 ) !== "nth",
                    forward = type.slice( -4 ) !== "last",
                    ofType = what === "of-type";

                return first === 1 && last === 0 ?

                    // Shortcut for :nth-*(n)
                    function( elem ) {
                        return !!elem.parentNode;
                    } :

                    function( elem, context, xml ) {
                        var cache, outerCache, node, diff, nodeIndex, start,
                            dir = simple !== forward ? "nextSibling" : "previousSibling",
                            parent = elem.parentNode,
                            name = ofType && elem.nodeName.toLowerCase(),
                            useCache = !xml && !ofType;

                        if ( parent ) {

                            // :(first|last|only)-(child|of-type)
                            if ( simple ) {
                                while ( dir ) {
                                    node = elem;
                                    while ( (node = node[ dir ]) ) {
                                        if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
                                            return false;
                                        }
                                    }
                                    // Reverse direction for :only-* (if we haven't yet done so)
                                    start = dir = type === "only" && !start && "nextSibling";
                                }
                                return true;
                            }

                            start = [ forward ? parent.firstChild : parent.lastChild ];

                            // non-xml :nth-child(...) stores cache data on `parent`
                            if ( forward && useCache ) {
                                // Seek `elem` from a previously-cached index
                                outerCache = parent[ expando ] || (parent[ expando ] = {});
                                cache = outerCache[ type ] || [];
                                nodeIndex = cache[0] === dirruns && cache[1];
                                diff = cache[0] === dirruns && cache[2];
                                node = nodeIndex && parent.childNodes[ nodeIndex ];

                                while ( (node = ++nodeIndex && node && node[ dir ] ||

                                    // Fallback to seeking `elem` from the start
                                    (diff = nodeIndex = 0) || start.pop()) ) {

                                    // When found, cache indexes on `parent` and break
                                    if ( node.nodeType === 1 && ++diff && node === elem ) {
                                        outerCache[ type ] = [ dirruns, nodeIndex, diff ];
                                        break;
                                    }
                                }

                            // Use previously-cached element index if available
                            } else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
                                diff = cache[1];

                            // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                            } else {
                                // Use the same loop as above to seek `elem` from the start
                                while ( (node = ++nodeIndex && node && node[ dir ] ||
                                    (diff = nodeIndex = 0) || start.pop()) ) {

                                    if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
                                        // Cache the index of each encountered element
                                        if ( useCache ) {
                                            (node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
                                        }

                                        if ( node === elem ) {
                                            break;
                                        }
                                    }
                                }
                            }

                            // Incorporate the offset, then check against cycle size
                            diff -= last;
                            return diff === first || ( diff % first === 0 && diff / first >= 0 );
                        }
                    };
            },

            "PSEUDO": function( pseudo, argument ) {
                // pseudo-class names are case-insensitive
                // http://www.w3.org/TR/selectors/#pseudo-classes
                // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                // Remember that setFilters inherits from pseudos
                var args,
                    fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                        Sizzle.error( "unsupported pseudo: " + pseudo );

                // The user may use createPseudo to indicate that
                // arguments are needed to create the filter function
                // just as Sizzle does
                if ( fn[ expando ] ) {
                    return fn( argument );
                }

                // But maintain support for old signatures
                if ( fn.length > 1 ) {
                    args = [ pseudo, pseudo, "", argument ];
                    return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                        markFunction(function( seed, matches ) {
                            var idx,
                                matched = fn( seed, argument ),
                                i = matched.length;
                            while ( i-- ) {
                                idx = indexOf.call( seed, matched[i] );
                                seed[ idx ] = !( matches[ idx ] = matched[i] );
                            }
                        }) :
                        function( elem ) {
                            return fn( elem, 0, args );
                        };
                }

                return fn;
            }
        },

        pseudos: {
            // Potentially complex pseudos
            "not": markFunction(function( selector ) {
                // Trim the selector passed to compile
                // to avoid treating leading and trailing
                // spaces as combinators
                var input = [],
                    results = [],
                    matcher = compile( selector.replace( rtrim, "$1" ) );

                return matcher[ expando ] ?
                    markFunction(function( seed, matches, context, xml ) {
                        var elem,
                            unmatched = matcher( seed, null, xml, [] ),
                            i = seed.length;

                        // Match elements unmatched by `matcher`
                        while ( i-- ) {
                            if ( (elem = unmatched[i]) ) {
                                seed[i] = !(matches[i] = elem);
                            }
                        }
                    }) :
                    function( elem, context, xml ) {
                        input[0] = elem;
                        matcher( input, null, xml, results );
                        return !results.pop();
                    };
            }),

            "has": markFunction(function( selector ) {
                return function( elem ) {
                    return Sizzle( selector, elem ).length > 0;
                };
            }),

            "contains": markFunction(function( text ) {
                return function( elem ) {
                    return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
                };
            }),

            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // http://www.w3.org/TR/selectors/#lang-pseudo
            "lang": markFunction( function( lang ) {
                // lang value must be a valid identifier
                if ( !ridentifier.test(lang || "") ) {
                    Sizzle.error( "unsupported lang: " + lang );
                }
                lang = lang.replace( runescape, funescape ).toLowerCase();
                return function( elem ) {
                    var elemLang;
                    do {
                        if ( (elemLang = documentIsHTML ?
                            elem.lang :
                            elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

                            elemLang = elemLang.toLowerCase();
                            return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
                        }
                    } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
                    return false;
                };
            }),

            // Miscellaneous
            "target": function( elem ) {
                var hash = window.location && window.location.hash;
                return hash && hash.slice( 1 ) === elem.id;
            },

            "root": function( elem ) {
                return elem === docElem;
            },

            "focus": function( elem ) {
                return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
            },

            // Boolean properties
            "enabled": function( elem ) {
                return elem.disabled === false;
            },

            "disabled": function( elem ) {
                return elem.disabled === true;
            },

            "checked": function( elem ) {
                // In CSS3, :checked should return both checked and selected elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                var nodeName = elem.nodeName.toLowerCase();
                return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
            },

            "selected": function( elem ) {
                // Accessing this property makes selected-by-default
                // options in Safari work properly
                if ( elem.parentNode ) {
                    elem.parentNode.selectedIndex;
                }

                return elem.selected === true;
            },

            // Contents
            "empty": function( elem ) {
                // http://www.w3.org/TR/selectors/#empty-pseudo
                // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                //   but not by others (comment: 8; processing instruction: 7; etc.)
                // nodeType < 6 works because attributes (2) do not appear as children
                for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                    if ( elem.nodeType < 6 ) {
                        return false;
                    }
                }
                return true;
            },

            "parent": function( elem ) {
                return !Expr.pseudos["empty"]( elem );
            },

            // Element/input types
            "header": function( elem ) {
                return rheader.test( elem.nodeName );
            },

            "input": function( elem ) {
                return rinputs.test( elem.nodeName );
            },

            "button": function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === "button" || name === "button";
            },

            "text": function( elem ) {
                var attr;
                return elem.nodeName.toLowerCase() === "input" &&
                    elem.type === "text" &&

                    // Support: IE<8
                    // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                    ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
            },

            // Position-in-collection
            "first": createPositionalPseudo(function() {
                return [ 0 ];
            }),

            "last": createPositionalPseudo(function( matchIndexes, length ) {
                return [ length - 1 ];
            }),

            "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
                return [ argument < 0 ? argument + length : argument ];
            }),

            "even": createPositionalPseudo(function( matchIndexes, length ) {
                var i = 0;
                for ( ; i < length; i += 2 ) {
                    matchIndexes.push( i );
                }
                return matchIndexes;
            }),

            "odd": createPositionalPseudo(function( matchIndexes, length ) {
                var i = 1;
                for ( ; i < length; i += 2 ) {
                    matchIndexes.push( i );
                }
                return matchIndexes;
            }),

            "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                var i = argument < 0 ? argument + length : argument;
                for ( ; --i >= 0; ) {
                    matchIndexes.push( i );
                }
                return matchIndexes;
            }),

            "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                var i = argument < 0 ? argument + length : argument;
                for ( ; ++i < length; ) {
                    matchIndexes.push( i );
                }
                return matchIndexes;
            })
        }
    };

    Expr.pseudos["nth"] = Expr.pseudos["eq"];

    // Add button/input type pseudos
    for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
        Expr.pseudos[ i ] = createInputPseudo( i );
    }
    for ( i in { submit: true, reset: true } ) {
        Expr.pseudos[ i ] = createButtonPseudo( i );
    }

    // Easy API for creating new setFilters
    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();

    function tokenize( selector, parseOnly ) {
        var matched, match, tokens, type,
            soFar, groups, preFilters,
            cached = tokenCache[ selector + " " ];

        if ( cached ) {
            return parseOnly ? 0 : cached.slice( 0 );
        }

        soFar = selector;
        groups = [];
        preFilters = Expr.preFilter;

        while ( soFar ) {

            // Comma and first run
            if ( !matched || (match = rcomma.exec( soFar )) ) {
                if ( match ) {
                    // Don't consume trailing commas as valid
                    soFar = soFar.slice( match[0].length ) || soFar;
                }
                groups.push( (tokens = []) );
            }

            matched = false;

            // Combinators
            if ( (match = rcombinators.exec( soFar )) ) {
                matched = match.shift();
                tokens.push({
                    value: matched,
                    // Cast descendant combinators to space
                    type: match[0].replace( rtrim, " " )
                });
                soFar = soFar.slice( matched.length );
            }

            // Filters
            for ( type in Expr.filter ) {
                if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                    (match = preFilters[ type ]( match ))) ) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        type: type,
                        matches: match
                    });
                    soFar = soFar.slice( matched.length );
                }
            }

            if ( !matched ) {
                break;
            }
        }

        // Return the length of the invalid excess
        // if we're just parsing
        // Otherwise, throw an error or return tokens
        return parseOnly ?
            soFar.length :
            soFar ?
                Sizzle.error( selector ) :
                // Cache the tokens
                tokenCache( selector, groups ).slice( 0 );
    }

    function toSelector( tokens ) {
        var i = 0,
            len = tokens.length,
            selector = "";
        for ( ; i < len; i++ ) {
            selector += tokens[i].value;
        }
        return selector;
    }

    function addCombinator( matcher, combinator, base ) {
        var dir = combinator.dir,
            checkNonElements = base && dir === "parentNode",
            doneName = done++;

        return combinator.first ?
            // Check against closest ancestor/preceding element
            function( elem, context, xml ) {
                while ( (elem = elem[ dir ]) ) {
                    if ( elem.nodeType === 1 || checkNonElements ) {
                        return matcher( elem, context, xml );
                    }
                }
            } :

            // Check against all ancestor/preceding elements
            function( elem, context, xml ) {
                var data, cache, outerCache,
                    dirkey = dirruns + " " + doneName;

                // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                if ( xml ) {
                    while ( (elem = elem[ dir ]) ) {
                        if ( elem.nodeType === 1 || checkNonElements ) {
                            if ( matcher( elem, context, xml ) ) {
                                return true;
                            }
                        }
                    }
                } else {
                    while ( (elem = elem[ dir ]) ) {
                        if ( elem.nodeType === 1 || checkNonElements ) {
                            outerCache = elem[ expando ] || (elem[ expando ] = {});
                            if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
                                if ( (data = cache[1]) === true || data === cachedruns ) {
                                    return data === true;
                                }
                            } else {
                                cache = outerCache[ dir ] = [ dirkey ];
                                cache[1] = matcher( elem, context, xml ) || cachedruns;
                                if ( cache[1] === true ) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            };
    }

    function elementMatcher( matchers ) {
        return matchers.length > 1 ?
            function( elem, context, xml ) {
                var i = matchers.length;
                while ( i-- ) {
                    if ( !matchers[i]( elem, context, xml ) ) {
                        return false;
                    }
                }
                return true;
            } :
            matchers[0];
    }

    function condense( unmatched, map, filter, context, xml ) {
        var elem,
            newUnmatched = [],
            i = 0,
            len = unmatched.length,
            mapped = map != null;

        for ( ; i < len; i++ ) {
            if ( (elem = unmatched[i]) ) {
                if ( !filter || filter( elem, context, xml ) ) {
                    newUnmatched.push( elem );
                    if ( mapped ) {
                        map.push( i );
                    }
                }
            }
        }

        return newUnmatched;
    }

    function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
        if ( postFilter && !postFilter[ expando ] ) {
            postFilter = setMatcher( postFilter );
        }
        if ( postFinder && !postFinder[ expando ] ) {
            postFinder = setMatcher( postFinder, postSelector );
        }
        return markFunction(function( seed, results, context, xml ) {
            var temp, i, elem,
                preMap = [],
                postMap = [],
                preexisting = results.length,

                // Get initial elements from seed or context
                elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

                // Prefilter to get matcher input, preserving a map for seed-results synchronization
                matcherIn = preFilter && ( seed || !selector ) ?
                    condense( elems, preMap, preFilter, context, xml ) :
                    elems,

                matcherOut = matcher ?
                    // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                    postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                        // ...intermediate processing is necessary
                        [] :

                        // ...otherwise use results directly
                        results :
                    matcherIn;

            // Find primary matches
            if ( matcher ) {
                matcher( matcherIn, matcherOut, context, xml );
            }

            // Apply postFilter
            if ( postFilter ) {
                temp = condense( matcherOut, postMap );
                postFilter( temp, [], context, xml );

                // Un-match failing elements by moving them back to matcherIn
                i = temp.length;
                while ( i-- ) {
                    if ( (elem = temp[i]) ) {
                        matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                    }
                }
            }

            if ( seed ) {
                if ( postFinder || preFilter ) {
                    if ( postFinder ) {
                        // Get the final matcherOut by condensing this intermediate into postFinder contexts
                        temp = [];
                        i = matcherOut.length;
                        while ( i-- ) {
                            if ( (elem = matcherOut[i]) ) {
                                // Restore matcherIn since elem is not yet a final match
                                temp.push( (matcherIn[i] = elem) );
                            }
                        }
                        postFinder( null, (matcherOut = []), temp, xml );
                    }

                    // Move matched elements from seed to results to keep them synchronized
                    i = matcherOut.length;
                    while ( i-- ) {
                        if ( (elem = matcherOut[i]) &&
                            (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

                            seed[temp] = !(results[temp] = elem);
                        }
                    }
                }

            // Add elements to results, through postFinder if defined
            } else {
                matcherOut = condense(
                    matcherOut === results ?
                        matcherOut.splice( preexisting, matcherOut.length ) :
                        matcherOut
                );
                if ( postFinder ) {
                    postFinder( null, results, matcherOut, xml );
                } else {
                    push.apply( results, matcherOut );
                }
            }
        });
    }

    function matcherFromTokens( tokens ) {
        var checkContext, matcher, j,
            len = tokens.length,
            leadingRelative = Expr.relative[ tokens[0].type ],
            implicitRelative = leadingRelative || Expr.relative[" "],
            i = leadingRelative ? 1 : 0,

            // The foundational matcher ensures that elements are reachable from top-level context(s)
            matchContext = addCombinator( function( elem ) {
                return elem === checkContext;
            }, implicitRelative, true ),
            matchAnyContext = addCombinator( function( elem ) {
                return indexOf.call( checkContext, elem ) > -1;
            }, implicitRelative, true ),
            matchers = [ function( elem, context, xml ) {
                return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                    (checkContext = context).nodeType ?
                        matchContext( elem, context, xml ) :
                        matchAnyContext( elem, context, xml ) );
            } ];

        for ( ; i < len; i++ ) {
            if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
                matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
            } else {
                matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

                // Return special upon seeing a positional matcher
                if ( matcher[ expando ] ) {
                    // Find the next relative operator (if any) for proper handling
                    j = ++i;
                    for ( ; j < len; j++ ) {
                        if ( Expr.relative[ tokens[j].type ] ) {
                            break;
                        }
                    }
                    return setMatcher(
                        i > 1 && elementMatcher( matchers ),
                        i > 1 && toSelector(
                            // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                            tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
                        ).replace( rtrim, "$1" ),
                        matcher,
                        i < j && matcherFromTokens( tokens.slice( i, j ) ),
                        j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                        j < len && toSelector( tokens )
                    );
                }
                matchers.push( matcher );
            }
        }

        return elementMatcher( matchers );
    }

    function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
        // A counter to specify which element is currently being matched
        var matcherCachedRuns = 0,
            bySet = setMatchers.length > 0,
            byElement = elementMatchers.length > 0,
            superMatcher = function( seed, context, xml, results, outermost ) {
                var elem, j, matcher,
                    matchedCount = 0,
                    i = "0",
                    unmatched = seed && [],
                    setMatched = [],
                    contextBackup = outermostContext,
                    // We must always have either seed elements or outermost context
                    elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
                    // Use integer dirruns iff this is the outermost matcher
                    dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                    len = elems.length;

                if ( outermost ) {
                    outermostContext = context !== document && context;
                    cachedruns = matcherCachedRuns;
                }

                // Add elements passing elementMatchers directly to results
                // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
                // Support: IE<9, Safari
                // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
                    if ( byElement && elem ) {
                        j = 0;
                        while ( (matcher = elementMatchers[j++]) ) {
                            if ( matcher( elem, context, xml ) ) {
                                results.push( elem );
                                break;
                            }
                        }
                        if ( outermost ) {
                            dirruns = dirrunsUnique;
                            cachedruns = ++matcherCachedRuns;
                        }
                    }

                    // Track unmatched elements for set filters
                    if ( bySet ) {
                        // They will have gone through all possible matchers
                        if ( (elem = !matcher && elem) ) {
                            matchedCount--;
                        }

                        // Lengthen the array for every element, matched or not
                        if ( seed ) {
                            unmatched.push( elem );
                        }
                    }
                }

                // Apply set filters to unmatched elements
                matchedCount += i;
                if ( bySet && i !== matchedCount ) {
                    j = 0;
                    while ( (matcher = setMatchers[j++]) ) {
                        matcher( unmatched, setMatched, context, xml );
                    }

                    if ( seed ) {
                        // Reintegrate element matches to eliminate the need for sorting
                        if ( matchedCount > 0 ) {
                            while ( i-- ) {
                                if ( !(unmatched[i] || setMatched[i]) ) {
                                    setMatched[i] = pop.call( results );
                                }
                            }
                        }

                        // Discard index placeholder values to get only actual matches
                        setMatched = condense( setMatched );
                    }

                    // Add matches to results
                    push.apply( results, setMatched );

                    // Seedless set matches succeeding multiple successful matchers stipulate sorting
                    if ( outermost && !seed && setMatched.length > 0 &&
                        ( matchedCount + setMatchers.length ) > 1 ) {

                        Sizzle.uniqueSort( results );
                    }
                }

                // Override manipulation of globals by nested matchers
                if ( outermost ) {
                    dirruns = dirrunsUnique;
                    outermostContext = contextBackup;
                }

                return unmatched;
            };

        return bySet ?
            markFunction( superMatcher ) :
            superMatcher;
    }

    compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
        var i,
            setMatchers = [],
            elementMatchers = [],
            cached = compilerCache[ selector + " " ];

        if ( !cached ) {
            // Generate a function of recursive functions that can be used to check each element
            if ( !group ) {
                group = tokenize( selector );
            }
            i = group.length;
            while ( i-- ) {
                cached = matcherFromTokens( group[i] );
                if ( cached[ expando ] ) {
                    setMatchers.push( cached );
                } else {
                    elementMatchers.push( cached );
                }
            }

            // Cache the compiled function
            cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
        }
        return cached;
    };

    function multipleContexts( selector, contexts, results ) {
        var i = 0,
            len = contexts.length;
        for ( ; i < len; i++ ) {
            Sizzle( selector, contexts[i], results );
        }
        return results;
    }

    function select( selector, context, results, seed ) {
        var i, tokens, token, type, find,
            match = tokenize( selector );

        if ( !seed ) {
            // Try to minimize operations if there is only one group
            if ( match.length === 1 ) {

                // Take a shortcut and set the context if the root selector is an ID
                tokens = match[0] = match[0].slice( 0 );
                if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                        support.getById && context.nodeType === 9 && documentIsHTML &&
                        Expr.relative[ tokens[1].type ] ) {

                    context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
                    if ( !context ) {
                        return results;
                    }
                    selector = selector.slice( tokens.shift().value.length );
                }

                // Fetch a seed set for right-to-left matching
                i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
                while ( i-- ) {
                    token = tokens[i];

                    // Abort if we hit a combinator
                    if ( Expr.relative[ (type = token.type) ] ) {
                        break;
                    }
                    if ( (find = Expr.find[ type ]) ) {
                        // Search, expanding context for leading sibling combinators
                        if ( (seed = find(
                            token.matches[0].replace( runescape, funescape ),
                            rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
                        )) ) {

                            // If seed is empty or no tokens remain, we can return early
                            tokens.splice( i, 1 );
                            selector = seed.length && toSelector( tokens );
                            if ( !selector ) {
                                push.apply( results, seed );
                                return results;
                            }

                            break;
                        }
                    }
                }
            }
        }

        // Compile and execute a filtering function
        // Provide `match` to avoid retokenization if we modified the selector above
        compile( selector, match )(
            seed,
            context,
            !documentIsHTML,
            results,
            rsibling.test( selector ) && testContext( context.parentNode ) || context
        );
        return results;
    }

    // One-time assignments

    // Sort stability
    support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

    // Support: Chrome<14
    // Always assume duplicates if they aren't passed to the comparison function
    support.detectDuplicates = !!hasDuplicate;

    // Initialize against the default document
    setDocument();

    // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
    // Detached nodes confoundingly follow *each other*
    support.sortDetached = assert(function( div1 ) {
        // Should return 1, but returns 4 (following)
        return div1.compareDocumentPosition( document.createElement("div") ) & 1;
    });

    // Support: IE<8
    // Prevent attribute/property "interpolation"
    // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if ( !assert(function( div ) {
        div.innerHTML = "<a href='#'></a>";
        return div.firstChild.getAttribute("href") === "#" ;
    }) ) {
        addHandle( "type|href|height|width", function( elem, name, isXML ) {
            if ( !isXML ) {
                return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
            }
        });
    }

    // Support: IE<9
    // Use defaultValue in place of getAttribute("value")
    if ( !support.attributes || !assert(function( div ) {
        div.innerHTML = "<input/>";
        div.firstChild.setAttribute( "value", "" );
        return div.firstChild.getAttribute( "value" ) === "";
    }) ) {
        addHandle( "value", function( elem, name, isXML ) {
            if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
                return elem.defaultValue;
            }
        });
    }

    // Support: IE<9
    // Use getAttributeNode to fetch booleans when getAttribute lies
    if ( !assert(function( div ) {
        return div.getAttribute("disabled") == null;
    }) ) {
        addHandle( booleans, function( elem, name, isXML ) {
            var val;
            if ( !isXML ) {
                return elem[ name ] === true ? name.toLowerCase() :
                        (val = elem.getAttributeNode( name )) && val.specified ?
                        val.value :
                    null;
            }
        });
    }

    //Add to jsApp
    jsApp.find = Sizzle;
    jsApp.matchesSelector = Sizzle.matchesSelector;
    jsApp.matches = Sizzle.matches;
    jsApp.contains = Sizzle.contains;
    jsApp.unique = Sizzle.uniqueSort;
})(window);