<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>GrootJs官网-API文档</title>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/base.css">
    <script src="js/jquery-1.11.2.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/groot.js"></script>
</head>
<body data-spy="scroll" data-target="#learn-sider">
<nav class="navbar navbar-inverse">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="/">GrootJs</a>
        </div>
        <ul class="nav navbar-nav">
            <li><a href="index.html">首页</a></li>
            <li><a href="learn.html">简明教程</a></li>
            <li class="active"><a>API文档</a></li>
            <li><a href="support.html">技术支持</a></li>
        </ul>
    </div>
</nav>
<div class="container">
    <div class="row">
        <div class="col-sm-3">
            <ul id="learn-sider" class="list-group" style="position: fixed;top: 90px;background: #ffffff;z-index: 3">
                <li data-index="li0" class="list-group-item active">groot.view(name,factory)<i
                        class="glyphicon glyphicon-chevron-right"></i></li>
                <li data-index="li1" class="list-group-item">xxxRender()<i
                        class="glyphicon glyphicon-chevron-right"></i></li>
                <li data-index="li2" class="list-group-item">数组操作方法<i class="glyphicon glyphicon-chevron-right"></i>
                </li>
                <li data-index="li3" class="list-group-item">属性绑定<i class="glyphicon glyphicon-chevron-right"></i></li>
                <li data-index="li4" class="list-group-item">事件绑定<i class="glyphicon glyphicon-chevron-right"></i></li>
                <li data-index="li5" class="list-group-item">gt-watch(变量监控指令)<i
                        class="glyphicon glyphicon-chevron-right"></i></li>
                <li data-index="li6" class="list-group-item">事件参数$self<i class="glyphicon glyphicon-chevron-right"></i>
                </li>
                <li data-index="li7" class="list-group-item">时间属性过滤器<i class="glyphicon glyphicon-chevron-right"></i>
                </li>

                <li data-index="li8" class="list-group-item">require()<i class="glyphicon glyphicon-chevron-right"></i>
                </li>
                <li data-index="li9" class="list-group-item">gt-include<i class="glyphicon glyphicon-chevron-right"></i>
                </li>
                <li data-index="li10" class="list-group-item">groot.filter<i
                        class="glyphicon glyphicon-chevron-right"></i></li>
                <li data-index="li11" class="list-group-item">groot.bindExtend<i
                        class="glyphicon glyphicon-chevron-right"></i></li>

                <li data-index="li12" class="list-group-item">系统扩展属性<i class="glyphicon glyphicon-chevron-right"></i>
                </li>
                <li data-index="li13" class="list-group-item">UI控件定义<i class="glyphicon glyphicon-chevron-right"></i>
                </li>
                <li data-index="li14" class="list-group-item">系统常用API<i class="glyphicon glyphicon-chevron-right"></i>
                </li>
            </ul>
        </div>
        <div class="col-sm-9">
            <h3 id="li0">groot.view(name,factory)</h3>
            <table class="table">
                <caption>用于创建一个modelView对象与指令gt-view对应</caption>
                <thead>
                <tr>
                    <th width="20%">参数</th>
                    <th width="80%">用途</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>name</td>
                    <td>创建的modelView的名称,用groot.vms[name]可以访问到创建的对象</td>
                </tr>
                <tr>
                    <td>factory</td>
                    <td>函数：有两个参数:vm,ve,分别放属性和事件</td>
                </tr>
                <tr>
                    <td>返回</td>
                    <td>一个modelView对象</td>
                </tr>
                </tbody>
            </table>
            <h3 id="li1">xxxRender()</h3>
            <table class="table">
                <caption>更新视图，参数可有可无</caption>
                <thead>
                <tr>
                    <th width="20%">场景</th>
                    <th width="80%">用法</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>属性</td>
                    <td>xxxRender()调用。没有参数；xxx为属性名</td>
                </tr>
                <tr>
                    <td>对象</td>
                    <td>xxxRender()调用。没有参数；xxx为对象名</td>
                </tr>
                <tr>
                    <td>数组</td>
                    <td>xxxRender(index)调用。xxx为数组名，当无参数时，更新整个数组；有参数时，更新数组对应的项</td>
                </tr>
                </tbody>
            </table>
            <h3 id="li2">数组操作方法</h3>
            <table class="table">
                <caption>此类方法由于操作vm中的数组，用这些方法操作数组不用调用xxxRender()刷新视图,xxx为数组名称</caption>
                <thead>
                <tr>
                    <th width="20%">方法名</th>
                    <th width="80%">用法</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>xxxpush()</td>
                    <td>同数组push()方法</td>
                </tr>
                <tr>
                    <td>xxxpop()</td>
                    <td>同数组pop()</td>
                </tr>
                <tr>
                    <td>xxxshift()</td>
                    <td>同数组shift()</td>
                </tr>
                <tr>
                    <td>xxxunshift()</td>
                    <td>同数组unshift()方法</td>
                </tr>
                <tr>
                    <td>xxxsplice()</td>
                    <td>同数组splice()方法</td>
                </tr>
                <tr>
                    <td>xxxconcat()</td>
                    <td>同数组concat()方法</td>
                </tr>
                </tbody>
            </table>
            <h3 id="li3">属性绑定</h3>
            <table class="table">
                <caption>用于绑定vm的属性，以便和vm对应起来</caption>
                <thead>
                <tr>
                    <th width="20%">指令</th>
                    <th width="80%">用法</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>gt-visible</td>
                    <td>格式{属性名};也可以是表达式如：{属性名1}+{属性名2} 表达式为true 显示，为false 移除</td>
                </tr>
                <tr>
                    <td>$p.属性名</td>
                    <td>绑定父元素属性，如gt-text={$p.name},同理，绑定父元素的父元素属性gt-text={$p.$p.name}以此类推</td>
                </tr>
                <tr>
                    <td>gt-text</td>
                    <td>格式{属性名};也可以是表达式如：{属性名1}+{属性名2},<a href="learn.html" target="_blank">详见简明教程属性绑定</a></td>
                </tr>
                <tr>
                    <td>gt-attr</td>
                    <td>
                        gt-attr="标签属性:属性名1}+{属性名2},标签属性:{属性名1}+{属性名2}..." 如 gt-attr="id:'view'+{uid}"对应 id="view"+uid<br>
                        <a href="learn" target="_blank">详见简明教程属性绑定</a>
                    </td>
                </tr>
                <tr>
                    <td>gt-css</td>
                    <td>gt-css="标签属性:{属性名1}+{属性名2},标签属性:{属性名1}+{属性名2}..." ;同上</td>
                </tr>
                <tr>
                    <td>gt-class</td>
                    <td>
                        gt-class="class名称:{属性名1}+{属性名2},class名称:{属性名1}+{属性名2},class名称:{属性名1}+{属性名2}..."<br>
                        value表达式为true 就绑定对应的属性 为fale 就不绑定对应的属性<a href="learn.html" target="_blank">详见简明教程属性绑定</a>
                    </td>
                </tr>
                <tr>
                    <td>gt-valule</td>
                    <td>gt-value="属性名称" 用于input textarea绑定</td>
                </tr>
                <tr>
                    <td>gt-valule-change</td>
                    <td>gt-value="属性名称" 用于input textarea绑定;当输入框的值变化时 输入框的值同步到viewModel</td>
                </tr>
                <tr>
                    <td>gt-valule-blur</td>
                    <td>gt-value="属性名称" 用于input textarea绑定;当输入框失去焦点时 输入框的值同步到viewModel<</td>
                </tr>
                <tr>
                    <td>gt-radio</td>
                    <td>
                        gt-radio="属性名称" 用于radio的绑定，选中后，属性名更新为选中radio的value值<br>
                        <a href="learn.html" target="_blank">详见简明教程checkbox radio select</a></td>
                </tr>
                <tr>
                    <td>gt-select</td>
                    <td>
                        gt-select="属性名称" 用于select的绑定，选中后，属性名更新为选中option的value值<br>
                        <a href="learn.html" target="_blank">详见简明教程checkbox radio select</a>
                    </td>
                </tr>
                <tr>
                    <td>gt-check</td>
                    <td>
                        gt-check="属性名称" 用于checkbox的绑定,属性为true时选中，为false是不选中<br>
                        <a href="learn.html" target="_blank">详见简明教程checkbox radio select</a>
                    </td>
                </tr>
                <tr>
                    <td>gt-ui</td>
                    <td>
                        gt-ui="属性名称(控件名称)" 用于绑定控件;控件名称在控件文件里定义<code>groot.ui[控件名称]</code><br>
                        控件需要用<code>require("./路径");</code>引用进来
                        <a href="learn.html" target="_blank">详见示例11</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <h3 id="li4">事件绑定</h3>
            <table class="table">
                <caption>用于绑定vm的事件，以便操作vm</caption>
                <thead>
                <tr>
                    <th width="20%">格式</th>
                    <th width="80%">指令</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>gt-xxx(事件名)</td>
                    <td>
                        click, abort, blur, change, dblclick, error, focus, keydown, keypress, keyup, unload,
                        load, mousedown, mousemove, mouseout, mouseover, mouseup, reset, resize, submit
                    </td>
                </tr>
                <tr>
                </tbody>
            </table>
            <pre>    groot.<span class="gtcode">view</span>("<span class="str">myview</span>", <span class="kword">function</span> (vm, ve) {
        vm.data = {
            say: 1,
            say2: 2
        }
        ve.fuzhi = <span class="kword">function</span> () {
            $(this).hide();//this为出发触发事件的元素,在变量监控里  this也为触发事件的元素
            vm.data = {say: 10, say2: 50}
            vm.<span class="gtcode">dataRender()</span>;
        }
    })
    </pre>
            <h3 id="li5">gt-watch(变量监控指令)</h3>
            <table class="table">
                <caption>用于监控属性变化</caption>
                <thead>
                <tr>
                    <th width="20%">格式</th>
                    <th width="80%">用法</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>gt-watch(函数)</td>
                    <td>
                        gt-watch放在要监控的变量所在的标签里(gt-value,gt-valule-change,gt-valule-blur,gt-radio,gt-select,gt-check,gt-ui和扩展属性)，函数定义在ve上面;<a href="learn.html" target="_blank">详见简明教程变量监控</a>
                    </td>
                </tr>
                <tr>
                    <td>函数($self, value)</td>
                    <td>
                        $self:发生变化的属性所在的vm;value:变化后新的值
                    </td>
                </tr>
                </tbody>
            </table>
            <h3 id="li6">事件参数$self</h3>
            <table class="table">
                <caption>用于监控属性变化</caption>
                <thead>
                <tr>
                    <th width="20%">格式</th>
                    <th width="80%">用法</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>ve.函数($self)</td>
                    <td>
                        发生事件所在的vm<a href="learn.html" target="_blank">详见简明教程变量监控</a>
                    </td>
                </tr>
                <tr>
                    <td>$self.$index</td>
                    <td>
                        为对象在数组中的索引</span>
                    </td>
                </tr>
                <tr>
                    <td>$self.$first</td>
                    <td>
                        该对象是否为数组中的第一个对象 是 true 否 false</span>
                    </td>
                </tr>
                <tr>
                    <td>$self.$last</td>
                    <td>
                        该对象是否为数组中的最后一个对象 是 true 否 false</span>
                    </td>
                </tr>
                <tr>
                    <td>$self.parent()</td>
                    <td>
                        返回整个数组 当时对象时 返回此对象所在的对象</span>
                    </td>
                </tr>
                <tr>
                    <td>$self.outerParent()</td>
                    <td>
                        返回数组所在vm</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <h3 id="li7">时间属性过滤器 _.d({属性},格式))</h3>
            <table class="table">
                <caption>用于格式化输出时间</caption>
                <thead>
                <tr>
                    <th width="20%">格式</th>
                    <th width="80%">用法</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>_.d({属性},格式))</td>
                    <td>
                        用于格式化输出时间;<a href="learn.html" target="_blank">详见简明教程属性过滤器</a>;<br>
                        备注:只对gt-text有效
                    </td>
                </tr>
                </tbody>
            </table>
            <h3 id="li8">require()</h3>
            <table class="table">
                <caption>CommonJs规范的实现，默认加载符合CommonJs的js模块</caption>
                <thead>
                <tr>
                    <th width="20%">格式</th>
                    <th width="80%">用法</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>require(路径)</td>
                    <td>
                        <a href="http://www.open-open.com/doc/view/f7df10bb81c347f79b436faa85dcfd81" target="_blank">CommonJs规范</a>
                    </td>
                </tr>
                <tr>
                    <td>require(路径!text)</td>
                    <td>
                        引用 文本如<code>var txt = require(路径!text)</code> <code>txt</code>变量就获得文件的内容
                    </td>
                </tr>
                <tr>
                    <td>require(路径!css)</td>
                    <td>
                        加载css,把加载的样式放入页面<code>head</code>的<code>&lt;style&gt;--&lt;/style&gt;</code>中
                    </td>
                </tr>
                </tbody>
            </table>
            <h3 id="li9">gt-include</h3>
            <table class="table">
                <caption>引入外部模版</caption>
                <thead>
                <tr>
                    <th width="20%">场景</th>
                    <th width="80%">用法</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>常规</td>
                    <td>
                        <code>gt-include="./templ.html"</code> <a href="learn" target="_blank">详见示例7</a>
                    </td>
                </tr>
                <tr>
                    <td>递归</td>
                    <td>
                        用于绑定树 <a href="learn" target="_blank">详见示例14</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <h3 id="li10"> groot.filter({过滤器名称:function(属性,格式)},...)</h3>
            <table class="table">
                <caption>属性过滤器扩展函数</caption>
                <thead>
                <tr>
                    <th width="20%">项目</th>
                    <th width="80%">说明</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>过滤器名称</td>
                    <td>
                        <code>_.d({time},'yyyy-MM-dd')</code>中的d
                    </td>
                </tr>
                <tr>
                    <td>过滤器名称</td>
                    <td>
                        <code>_.d({time},'yyyy-MM-dd')</code>中的time
                    </td>
                </tr>
                <tr>
                    <td>格式</td>
                    <td>
                        <code>_.d({time},'yyyy-MM-dd')</code>中的'yyyy-MM-dd'
                    </td>
                </tr>
                </tbody>
            </table>
            <h4>代码示例
                <small>(GrootJs865行)</small>
            </h4>
            <pre>
    groot.filter(
        {
            "过滤器名称": ,<span class="kword">function</span> (value, format) {
                code
                ...
                code
                <span class="kword">return</span> 返回值
            }
        }
    )
            </pre>
            <h3 id="li11"> groot.bindExtend({name:属性名,Handler(elment, value))},...)</h3>
            <table class="table">
                <caption>自定义展函数</caption>
                <thead>
                <tr>
                    <th width="20%">参数</th>
                    <th width="80%">说明</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>name</td>
                    <td>
                        自定义属性名称
                    </td>
                </tr>
                <tr>
                    <td>Handler</td>
                    <td>
                        自定义属性处理函数:elment-docment对象,value-属性值
                    </td>
                </tr>
                </tbody>
            </table>
            <h4>代码示例
                <small>(GrootJs840行)</small>
            </h4>
            <pre>
    groot.bindExtend(
        {
            "Name": "show",
            "Handler": <span class="kword">function</span> (elment, value) {
                if (value == true) {
                    elment.show();
                } else {
                    elment.hide();
                }
            }
        }
    )
            </pre>
            <h3 id="li12">系统扩展属性</h3>
            <table class="table">
                <caption>系统内置的用<code>groot.bindExtend</code>扩展的属性</caption>
                <thead>
                <tr>
                    <th width="20%">属性名</th>
                    <th width="80%">用法</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>show</td>
                    <td>
                        docment对象是否显示 true显示,false隐藏
                    </td>
                </tr>
                <tr>
                    <td>width</td>
                    <td>
                        docment对象宽 <a href="learn" target="_blank">详见示例12</a>
                    </td>
                </tr>
                <tr>
                    <td>height</td>
                    <td>
                        docment对象高 <a href="learn" target="_blank">详见示例12</a>
                    </td>
                </tr>
                </tbody>
            </table>
            <h3 id="li13">UI控件定义</h3>
            <table class="table">
                <caption>函数<code>groot.ui[控件名] = function (element, id, data, value, upParent)</code></caption>
                <thead>
                <tr>
                    <th width="20%">参数</th>
                    <th width="80%">用法</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>element</td>
                    <td>
                        控件所在的html容器 即<code>&lt;span gt-ui="name(myui)"&gt;&lt;/span&gt;</code>
                    </td>
                </tr>
                <tr>
                    <td>id</td>
                    <td>
                        系统为控件生成的唯一id
                    </td>
                </tr>
                <tr>
                    <td>upParent</td>
                    <td>
                        同步父vm得值函数
                    </td>
                </tr>
                <tr>
                    <td>data</td>
                    <td>
                        初始化控件所用值;如果需要初始化数据<br>
                        <code>&lt;span gt-ui="name(myui)" gt-ui-data="{key:'张三'}"&gt;</code> data就会接受到，并自动转为json对象<br>
                        也可以这样初始化<br>
                        <code>groot.uiInit["test"]={"key":"GUJ778-090909"}</code><br>
                        <code>&lt;span gt-ui="name(myui)" gt-ui-data="uiInit[test]"&gt;</span></code>
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="table">
                <caption>UI控件定义相关</caption>
                <thead>
                <tr>
                    <th width="20%">名称</th>
                    <th width="80%">用法</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>uivalue</td>
                    <td>
                        当改变父vm的属性值的时候的值的时候，程序是通过 控件的uivalue 来更新控件的值的，所有每个控件必须有uivalue属性
                    </td>
                </tr>
                <tr>
                    <td>gt-ui-id</td>
                    <td>
                        控件id，如果不设置 系统生成默认值 如果设置 groot.vms[id],即控件 通过操作可以操作控件groot.vms[id]
                    </td>
                </tr>
                <tr>
                    <td>gt-ui-data</td>
                    <td>
                        初始化控件所用值
                    </td>
                </tr>
                <tr>
                    <td>groot.createElement(html片段,id,element)</td>
                    <td>
                        把html加入element; 只有用groot.creatElement函数 控件才会被系统的垃圾回收机制回收
                    </td>
                </tr>
                </tbody>
            </table>
            <h4>代码示例
                <small>(示例ui.js)</small>
            </h4>
            <pre>
   groot.ui["myui"] = <span class="kword">function</span> (element, id, data, value, upParent) {
        groot.createElement(<span class="str">"&lt;span gt-text=\"{uivalue}\" style='color: red'&gt;&lt;/span&gt;&lt;input gt-click=\"change\" type='button' value='控件'&gt;"</span>, id,element);
        var moudle = groot.view(id, function (vm, ve) {
            vm.uivalue = value;
            ve.change = <span class="kword">function</span> () {
                vm.uivalue = "李四";
                vm.uivalueRender();
                upParent();
            }
        });
    }
            </pre>
            <h3 id="li14">系统API</h3>
            <table class="table">
                <caption>GrootJs 系统常用API</caption>
                <thead>
                <tr>
                    <th width="20%">名称</th>
                    <th width="80%">用途</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>groot.absUrl(url)</td>
                    <td>
                        把相对路径转换为绝对路径
                    </td>
                </tr>
                <tr>
                    <td>groot.model</td>
                    <td>
                        把vm对象转换为json 去掉系统生成的的属性groot.model
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</div>
</body>
</html>
<script>
    var scroll = true;
    $("#learn-sider").on("click", ">li", function () {
        scroll = false;
        $("#learn-sider").find("li").removeClass("active");
        $(this).addClass("active");
        $("html,body").animate({scrollTop: $("#" + $(this).attr("data-index")).offset().top}, function () {
            scroll = true;
        })
    });
    $(window).scroll(function () {
        if (scroll) {
            for (var i = 0; i <= 14; i++) {
                var _top = $("#li" + i).offset().top - $(window).scrollTop();
                if (_top > -100 && _top < 150) {
                    $("#learn-sider").find("li").removeClass("active");
                    $("[data-index='li" + i + "']").addClass("active");
                    break;
                }
            }
        }
    });
</script>
