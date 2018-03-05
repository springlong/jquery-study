/**
 * @file 代码着色（2013-10-05）
 * @version  1.0
 * @author  龙泉<yangtuan@126.com>
 */
(function($)
{
    //关键字、对象、方法汇总
    var codeNameStr = {
        keywords:{
            net: ["using", "namespace", "public", "private", "static", "partial", "protected", "void", "get", "set", "EventArgs", "true", "false", "object", "new", "if", "else", "switch", "case", "default", "while", "do", "for","break", "continue", "return", "with", "got", "try", "catch", "finally", "bool", "char", "string", "sbyte", "short", "int", "long", "byte", "ushort", "uint", "ulong", "float", "double", "decimal", "const", "checked", "is", "this" ],
            js: ["var", "new", "if", "else", "switch", "case", "default", "while", "do", "for","break", "continue", "return", "with", "try", "catch", "finally", "Number", "Boolean", "function", "this", "prototype"]
        },
        object:{
            net: ["Object", "DateTime", "Decimal", "Double", "Single", "UInt64", "Uint32", "UInt16", "Byte", "Int64", "Int16", "SByte", "String", "Char", "Boolean", "Exception", "MessageBox", "SqlConnection", "CommandType", "Parameters", "SqlDataReader ", "CommandBehavior", "SqlDataAdapter ", "SqlCommandBuilder ", "DataSet ", "SqlCommand", "SqlCommandBuilder", "DataView ", "DataRowView ", "CurrencyManager", "OleDbConnection ", "Img"],
            js: ["Object", "String", "Function", "Array", "Date", "Math", "RegExp", "arguments", "window", "screen", "navigator", "history", "location", "document", "XMLHttpRequest", "ActiveXObject" ]
        },
        method:{
            net: ["sizeOf", "CacheImage"],
            js: ["$", "alert", "length", "true", "false", "undefined", "null", "setTimeout", "setInterval", "addEventListener", "attachEvent", "removeEventListener", "detachEvent", "preventDefault", "stopPropagation", "getElementById", "getElementsByTagName"]
        }
    };
        
    //着色代码内容替换
    function replaceCode(code, html)
    {
        code.innerHTML = compatibleCode(html);
    }

    //着色代码的兼容性处理
    function compatibleCode(html)
    {
        var reg, match, str;

        //替换回车键，该操作仅在IE6、7、8中有效（因为在IE6、7、8中，重新对innerHTML赋值后回车符与多个连续的空格一起只会显示一个空格）
        reg = /(\r+)/g;
        html = colorCode(html, reg, "<br>");

        //替换<br>标签后的空格为&nbsp;（因为在IE6、7中，重新对innerHTML赋值后会多个连续空格只会显示一个空格）
        reg = /<br>(\s+)/gi;
        do
        {
            match = reg.exec(html);
            if(match !== null)
            {
                str = match[1].replace(/\s{1}/g, "&nbsp;");
                html = html.replace(match[0], "<br>" + str.substring(6, str.length));
            }
        }
        while(match !== null)

        return html;
    }

    //统一着色处理程序
    function colorCode(html, reg, rule)
    {
        var i, len, match, replaceStr;
        do
        {
            replaceStr = rule;
            match = reg.exec(html);
            if(match !== null)
            {
                for(i = 1, len = match.length; i < len; i++)
                {
                    replaceStr = replaceStr.replace("{" + i + "}", match[i]);
                }
                html = html.replace(match[0], replaceStr);
            }
        }
        while(match !== null)

        return html;
    }

    //JS和.NET代码着色
    function colorJS(html, type)
    {
        var i, j, len, arr, reg, match, value;

        //字符串
        reg = /(")([^">]*")/g;
        html = colorCode(html, reg, "<span class='js_str'><span>{1}</span>{2}</span>");

        //关键字
        arr = codeNameStr.keywords[type] || codeNameStr.keywords["js"];
        for(i = 0, len = arr.length; i < len; i++)
        {
            reg = new RegExp("([^\\w>]+)(" + arr[i] + ")([^\\w:]+)", "g");
            html = colorCode(html, reg, "{1}<span class='js_keywords'>{2}</span>{3}");

            reg = new RegExp("^(" + arr[i] + ")(\\W+)", "g");
            html = colorCode(html, reg, "<span class='js_keywords'>{1}</span>{2}");
        }

        //对象
        arr = codeNameStr.object[type] || codeNameStr.object["js"];
        for(i = 0, len = arr.length; i < len; i++)
        {
            reg = new RegExp("([^\\w>]+)(" + arr[i] + ")([^\\w:]+)", "g");
            html = colorCode(html, reg, "{1}<span class='js_object'>{2}</span>{3}");
            
            reg = new RegExp("^(" + arr[i] + ")(\\W+)", "g");
            html = colorCode(html, reg, "<span class='js_object'>{1}</span>{2}");
        }

        //对象的属性及方法
        arr = codeNameStr.method[type] || codeNameStr.method["js"];
        for(i = 0, len = arr.length; i < len; i++)
        {
            reg = new RegExp("([^\\w>]+)(" + arr[i] + ")([^\\w:]+)", "g");
            html = colorCode(html, reg, "{1}<span class='js_method'>{2}</span>{3}");
        }

        //替换注释
        reg = /\r/.test(html) ? /(\/)(\/[^\r]*)/ : /(\/)(\/.*)/;
        html = colorCode(html, reg, "<span class='comments'><span>{1}</span>{2}</span>");

        reg = /\/\*/g;
        html = colorCode(html, reg, "<span class='comments'><span>/</span>*");

        reg = /\*\//g;
        html = colorCode(html, reg, "*<span>/</span></span>");

        return html;
    }
    
    $(function()
    {
        var i, j, z, l, len, reg, arr, code, wrapper, html, match, str, str1, str2, bln, script_i, script_j, div, obj, value,
            info_height = 308,  //限定代码块的高度
            pre = document.getElementsByTagName("pre"); //所有pre标签的集合

        for(i = 0, len = pre.length; i < len; i++)
        {
            code = pre[i];
            wrapper = code.parentNode;
            html = code.innerHTML.replace(/\$/g, "&#36;"); //$在正则中有特殊用途。

            //逐个条件判断进行代码着色
            //JS代码判断
            if(wrapper.className.indexOf("js_code") !== -1)
            {
                html = colorJS(html, "js");
                replaceCode(code, html);
            }
            //.NET代码判断
            else if(wrapper.className.indexOf("net_code") !== -1)
            {
                html = colorJS(html, "net");
                replaceCode(code, html);
            }
            //HTML代码判断
            else if(wrapper.className.indexOf("html_code") !== -1)
            {
                //HTML标签：<!DOCTYPE html>类型
                html = html.replace("&lt;!DOCTYPE html&gt;", "<span class='label'>&lt;</span><span class='html'>!DOCTYPE</span> <span class='attr'>html</span><span class='label'>&gt;</span>");

                //HTML标签：<?xml ?>和<%@ Page %>类型
                reg = /(&lt;)(\?xml|%@\s{1}[a-z]+)(\s+.*)(\?&gt;|%&gt;)/gi;
                html = colorCode(html, reg, "<span class='label'>{1}</span><span class='html'>{2}</span>{3}<span class='label'>{4}</span>");
                
                //替换内嵌JS
                script_i = 0;
                do
                {
                    script_i = html.indexOf("&lt;script&gt;", script_i);
                    script_j = html.indexOf("&lt;/script&gt;", script_i);
                    bln = script_i !== -1 && script_j !== -1;

                    if(bln === true)
                    {
                        str1 = html.substring(script_i+14, script_j);
                        str2 = colorJS(str1);

                        html = html.replace(str1, str2);
                        script_i += str2.length + 29;
                    }
                }
                while(bln === true)

                //HTML标签：<link  />类型
                reg = /(&lt;)([a-z\.]+)(\s*.*)(\/{1}&gt;)/gi;
                html = colorCode(html, reg, "<span class='label'>{1}</span><span class='html'>{2}</span>{3}<span class='label'>{4}</span>");

                // HTML标签：替换<p title="">类型
                reg = /(&lt;)([a-z1-6\.]+)(\s{1}.*["'])(&gt;)/gi;
                html = colorCode(html, reg, "<span class='label'>{1}</span><span class='html'>{2}</span>{3}<span class='label'>{4}</span>");

                //HTML标签：替换<html>类型
                reg = /(&lt;)([a-z1-6\.]+)(&gt;)/gi;
                html = colorCode(html, reg, "<span class='label'>{1}</span><span class='html'>{2}</span><span class='label'>{3}</span>");

                //HTML标签：替换</html>类型
                reg = /(&lt;\/)([a-z1-6\.]+)(&gt;)/gi;
                html = colorCode(html, reg, "<span class='label'>{1}</span><span class='html'>{2}</span><span class='label'>{3}</span>");

                //HTML属性：替换 name="xxx" 类型
                reg = /\s{1}([a-z-_]+)(=)("[^"]*")/gi;
                html = colorCode(html, reg, " <span class='attr'>{1}</span><span class='equal'>{2}</span><span class='value'>{3}</span>");
                
                //替换注释
                reg = /(\/)(\*.*\*\/)/g;
                html = colorCode(html, reg, "<span class='comments'><span>{1}</span>{2}</span>");

                reg = /&lt;!--/g;
                html = colorCode(html, reg, "<span class='comments'><span>&lt;</span>!--");

                reg = /--&gt;/g;
                html = colorCode(html, reg, "--<span>&gt;</span></span>");

                reg = /&lt;%--/g;
                html = colorCode(html, reg, "<span class='comments'><span>&lt;</span>%--");

                reg = /--%&gt;/g;
                html = colorCode(html, reg, "--%<span>&gt;</span></span>");
              
                //替换CSS属性
                reg = /([;{\s>]+)([a-z-]+):([^;]+);{1}/gi;
                html = colorCode(html, reg, "{1}<span class='css_attr'>{2}</span>:<span class='css_value'>{3}</span>;");

                replaceCode(code, html);
            }
            //否则：进入下一轮循环
            else
            {
                continue;
            }

            //代码块超过指定高度后，默认隐藏
            if(code.offsetHeight > info_height && wrapper.className.indexOf("autoHeight") === -1)
            {
                code.style.overflow = "hidden";
                code.style.height = info_height + "px";
                wrapper.style.height = info_height + "px";
                wrapper.className += " height_code";

                div = document.createElement("div");
                div.className = "showMore";
                div.innerHTML = "\u5c55\u5f00\u2193"; //展开↓
                div.info_height = info_height + "px";

                div.onclick = function()
                {
                    obj = this.parentNode.children[0];
                    if(this.innerHTML === "\u5c55\u5f00\u2193") //展开↓
                    {
                        //展开
                        obj.style.height = "auto";
                        this.parentNode.style.height = obj.offsetHeight + "px";
                        this.innerHTML = "\u6536\u8d77\u2191"; //收起↑
                    }
                    else
                    {
                        //收起
                        obj.style.height = this.info_height;
                        this.parentNode.style.height = this.info_height;
                        document.body.scrollTop += this.parentNode.parentNode.getBoundingClientRect().top;
                        document.documentElement.scrollTop += this.parentNode.parentNode.getBoundingClientRect().top;
                        this.innerHTML = "\u5c55\u5f00\u2193"; //展开↓
                    }
                }
                wrapper.appendChild(div);
            }
        }
    });
})(jsApp);