(function (w, $) {
    //---------------commonjs规范----------------//
    var tmpTag = document.location.protocol + "//";
    var _cssCache = {};
    var _absUrl = (function () {
        var a;
        return function (url) {
            if (!a) a = document.createElement('a');
            a.href = url;
            return a.href;
        };
    })();
    var _define = function (factory) {
        var _exports = {};
        var _module = {};
        _module.exports = {};
        factory(_exports, _module);
        return $.extend(true, {}, _exports, _module.exports);
    }
    var _require = function (parent, path) {
        var _moudle;
        var _type = "js";
        var _basePath;
        if (path.indexOf(tmpTag) < 0) {
            if (path.substr(0, 2) == "./") {
                path = path.substr(2);
                _basePath = parent + path;
            } else if (path.substr(0, 1) == "/") {
                _basePath = tmpTag + window.location.host + path;
            } else {
                var _host;
                if (parent == "") {
                    _host = window.location.href;
                } else {
                    _host = parent;
                }
                if (_host.indexOf("/") > -1) {
                    _host = _host.substr(0, _host.lastIndexOf("/") + 1);
                } else {
                    _host = _host + "/";
                }
                _basePath = _host + path;
            }
        } else {
            _basePath = path;
        }
        var _path = _basePath;
        _basePath = _basePath.substr(0, _basePath.lastIndexOf("/") + 1);
        if (_path.lastIndexOf("!") > -1) {
            _type = _path.substr(_path.lastIndexOf("!") + 1);
            _path = _path.substr(0, _path.lastIndexOf("!"));
        } else {
            if (_path.lastIndexOf(".js") < 0) {
                _path = _path + ".js";
            }
        }
        var _myUrl = _absUrl(_path);
        $.ajax({
            type: 'get',
            "url": _myUrl + "?r=" + (new Date() - 1),
            "cache": true,
            "dataType": "text",
            "error": function (err) {
                console && console.log(_myUrl + "加载失败");
            },
            "async": false,
            "success": function (data) {
                _moudle = data;
            }
        });

        if (_type == "js") { //js预编译
            var _script = "_define(function(exports,module){\n";
            _script += "var $parent = \"" + _basePath + "\";\n";
            _script += _moudle.replace(/require\(/g, "_require($parent,");
            _script += ";\n});" + "//@ sourceURL=" + _myUrl;
            _moudle = eval(_script);
        } else if (_type == "css") {
            var _key = _myUrl;
            if (!_cssCache.hasOwnProperty(_key)) {
                $("<style></style>").html(_moudle).appendTo("head");
                _cssCache[_key] = "load";
            }
        }
        return _moudle;
    }
    window.require = function (path) {
        return _require("", path);
    };
})(window, jQuery);
var groot = (function ($) {
    //---------------作者:大盗乔三---------------//
    //---------------qq:289880020---------------//
    //---------------系统常量----------------//
    var PREFIX = "gt";
    var RENDEAR = "Render";
    //---------------初始化对象----------------//
    function isNum(value) {
        return typeof value == "number";
    }

    var groot = {};
    groot.ui = {};//ui控件开发接口
    groot.bindingHandler = [];
    groot.bindExtend = function () {
        for (var i = 0; i < arguments.length; i++) {
            groot.bindingHandler.push(arguments[i]);
        }
    }
    var _ = {};
    groot.filter = function () {
        for (var i = 0; i < arguments.length; i++) {
            groot.filter = $.extend(_, arguments[i]);
        }
    }
    groot.vms = {};//储存vm所有对象
    groot.uiInit = {};//存放控件初始化数据
    groot.control = function (name, factory) {//初始化view
        groot.vms[name] = {};
        groot.vms[name].$$ve = {};
        factory(groot.vms[name], groot.vms[name].$$ve);//vm对象
        var htmlElment = $("[" + PREFIX + "-view='" + name + "']").removeAttr(PREFIX + "-view");
        return groot.vms[name];
    }
    groot.view = function (name, factory) {//初始化view并扫描
        groot.vms[name] = {};
        groot.vms[name].$$ve = {};
        factory(groot.vms[name], groot.vms[name].$$ve);//vm对象
        var htmlElment = $("[" + PREFIX + "-view='" + name + "']").removeAttr(PREFIX + "-view");
        groot.sweep(groot.vms[name], htmlElment);
        return groot.vms[name];
    }
    //绑定事件
    var _bindEvents = [
        "click", "abort", "blur", "change", "dblclick", "error", "focus", "keydown", "keypress", "keyup", "unload",
        "load", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "reset", "resize", "submit"
    ]
    //垃圾回收算法
    var _collect = true;
    var _dynVMS = {};

    function _collection() {//垃圾回收
        if (_collect) {
            _collect = false;
            groot.asyn(function () {
                for (var vm in _dynVMS) {
                    if ($("#" + vm).length <= 0) {
                        delete  groot.vms[vm];
                        delete  _dynVMS[vm];
                    }
                }
                _collect = true;
            })
        }
    }

    //---------------扫描事件----------------//
    // 没有参数扫描所有，2个参数 扫面指定的 vn 和 html片段//
    //-------------------------------//
    groot.sweep = function (vm, element) {
        var ars = arguments;
        if (ars.length == 0) {
            for (var _vm in  groot.vms) {
                var htmlElment = $("[" + PREFIX + "-view='" + _vm + "']").removeAttr(PREFIX + "-view");
                _bindData(groot.vms[_vm], htmlElment, groot.vms[_vm].$$ve);
            }
        } else {
            _bindData(vm, element, vm.$$ve);
        }
    }
    groot.collection = _collection;
    function _sweepEvents(vm, element, ve) {
        for (var e in ve) {//绑定事件
            for (var i = 0; i < _bindEvents.length; i++) {
                $("[" + PREFIX + "-" + _bindEvents[i] + "='" + e + "']", element)
                    .unbind(_bindEvents[i])
                    .bind(_bindEvents[i], _triggerEvents(ve[e], vm))
                    .removeAttr(PREFIX + "-" + _bindEvents[i]);
            }
        }
    }

    function _triggerEvents(ve, args) {
        return function () {
            ve.apply(this, [args]);
        }
    }

    //---------------私有函数-----------------//
    function _bindData(vm, element, ve) {
        vm.$$selector = element[0];
        var _include = $("[" + PREFIX + "-include]", element);
        _include.each(function () {
            var _text = require($(this).attr(PREFIX + "-include") + "!text");
            $(this).html(_text);
            $(this).removeAttr(PREFIX + "-include");
        });
        function findArr(p) {
            var _eltArrs = $("[" + PREFIX + "-each='" + p + "']", element).first().removeAttr(PREFIX + "-each");
            if (_eltArrs.length > 0) {
                vm["$$arr" + pro] = {"element": _eltArrs, "tmpl": _eltArrs.html()};
                _eltArrs.html("");
            }
        }

        function findObj(p) {
            var _eltObjcts = $("[" + PREFIX + "-object='" + p + "']", element).first().removeAttr(PREFIX + "-object");
            if (_eltObjcts.length > 0) {
                vm["$$obj" + pro] = {"element": _eltObjcts, "tmpl": _eltObjcts.html()};
                _eltObjcts.html("");
            }
        }

        for (var pro in  vm) {//保存数组对象模板
            if (!$.isFunction(vm[pro]) && pro.indexOf("$$") < 0) {
                if ($.isArray(vm[pro])) {//数组
                    findArr(pro);
                } else if (typeof vm[pro] == "object") {//对象
                    findObj(pro);
                }
            }
        }
        var textlsit = [];
        for (var pro in  vm) {
            if (!$.isFunction(vm[pro]) && pro.indexOf("$$") < 0) {
                if (!$.isArray(vm[pro]) && typeof vm[pro] !== "object") {
                    textlsit.push(pro);
                }
            }
        }
        _bindText(element, vm, textlsit);//绑定text
        for (var pro in  vm) {//初始化对象
            if (!$.isFunction(vm[pro]) && pro.indexOf("$$") < 0) {
                if ($.isArray(vm[pro]) && vm.hasOwnProperty("$$arr" + pro)) {//绑定数组
                    _bindingArry(vm, pro, ve);
                } else if (typeof vm[pro] == "object" && vm.hasOwnProperty("$$obj" + pro)) {
                    _bindingObject(vm, pro, ve);//绑定对象
                } else {//绑定属性
                    _bindingProperty(element, vm, pro, ve);
                }
            }
        }
        _sweepEvents(vm, element, ve);//绑定事件
        _collection();//回收垃圾
    }

    /*
     @vm 绑定的数据模型
     @textlsit 要绑定的属性数组
     * */
    function _bindText(element, vm, textlsit) {
        function _selecs(selector) {
            var _ls = [];
            if (element.attr(selector) != undefined) {
                _ls.push(element[0]);
            }
            var _ele = $("[" + selector + "]", element);
            if (_ele.length > 0) {
                _ele.each(function () {
                    _ls.push(this)
                })
            }
            return $(_ls);
        }

        var _eltText = _selecs(PREFIX + "-text");
        var _expressions = [];
        _eltText.each(function () {
            var _expression = $(this).attr(PREFIX + "-text");
            _expressions.push({ele: this, expr: _expression});
        });
        _eltText.removeAttr(PREFIX + "-text");
        function replaceAll(str, ostr, nstr) {
            if (str.indexOf(ostr) > -1) {
                str = str.replace(ostr, nstr);
                return replaceAll(str, ostr, nstr);
            } else {
                return str;
            }
        }

        function renderText() {
            for (var i = 0; i < _expressions.length; i++) {
                var _o = _expressions[i];
                var _expshow = _o.expr;
                for (var k = 0; k < textlsit.length; k++) {
                    try {
                        if (isNum(vm[textlsit[k]]) || typeof vm[textlsit[k]] == "boolean") {
                            _expshow = replaceAll(_expshow, "{" + textlsit[k] + "}", vm[textlsit[k]]);
                            _expshow = _expshow.replace(new RegExp("{" + textlsit[k].replace("$", "\\$") + "}", "g"), vm[textlsit[k]]);
                        } else {
                            _expshow = replaceAll(_expshow, "{" + textlsit[k] + "}", "\"" + vm[textlsit[k]].replace(/\"/g, "\\\"") + "\"");
                        }
                    } catch (e) {
                        console.log(textlsit[k]);
                    }
                }
                _expshow = _expshow.replace(/(\n)|(\r\n)/g, "\\\r\\\n");
                eval("var _v=" + _expshow);
                $(_o.ele).html(_v);
            }
        }

        renderText();
        vm.$$renderText = renderText;

    }

    function _creatArrProperty(opvm, pvm, vm) {//创建数组的层次关系
        vm.parent = function () {
            return pvm;
        }
        vm.outerParent = function () {
            return opvm;
        }
    }

    /*
     @vm 绑定的数据模型
     @pro 要绑定的属性
     * */
    function _bindingObject(vm, pro, ve) {
        var _obj = vm["$$obj" + pro];
        _obj.element.html(_obj.tmpl);
        vm[pro].parent = function () {
            return vm;
        }
        _bindData(vm[pro], _obj.element, ve);
        vm[pro + RENDEAR] = function () {
            var _obj = vm["$$obj" + pro];
            _obj.element.html(_obj.tmpl);
            vm[pro].parent = function () {
                return vm;
            }
            _bindData(vm[pro], _obj.element, ve);
        };
    }

    /*
     @element html元素
     @vm 绑定的数据模型
     @pro 要绑定的属性
     * */
    function _bindingProperty(element, vm, pro, ve) {

        function _selecs(selector) {
            var _ls = [];
            if (element.attr(selector) != undefined && element.attr(selector).indexOf(pro) == 0) {
                _ls.push(element[0]);
            }
            var _ele0 = $("[" + selector + "^='" + pro + "(']", element);
            var _ele1 = $("[" + selector + "='" + pro + "']", element);
            var _ele2;
            if (selector == (PREFIX + "-class")) {
                _ele2 = $("[" + selector + "-" + pro.replace(/\$/g, "") + "]", element);
            }
            _ele0.each(function () {
                _ls.push(this)
            })
            _ele1.each(function () {
                _ls.push(this)
            })
            if (selector == (PREFIX + "-class")) {
                _ele2.each(function () {
                    _ls.push(this)
                })
            }

            return $(_ls);
        }

        var _eltValue = _selecs(PREFIX + "-value");
        var _eltChange = _selecs(PREFIX + "-value-change");
        var _eltBlur = _selecs(PREFIX + "-value-blur");
        var _eltAttr = _selecs(PREFIX + "-attr");
        var _eltCss = _selecs(PREFIX + "-css");//"pro(id,value+""")"
        var _eltClass = _selecs(PREFIX + "-class");
        var _eltRadio = _selecs(PREFIX + "-radio");
        var _elSelect = _selecs(PREFIX + "-select");
        var _elCheck = _selecs(PREFIX + "-check");
        var _elUi = _selecs(PREFIX + "-ui");
        var _objElements = {
            "_eltValue": _eltValue,
            "_eltChange": _eltChange,
            "_eltBlur": _eltBlur,
            "_eltAttr": _eltAttr,
            "_eltCss": _eltCss,
            "_eltClass": _eltClass,
            "_eltRadio": _eltRadio,
            "_elSelect": _elSelect,
            "_elCheck": _elCheck,
            "_elUi": _elUi
        };
        /*********************** watch  *******************************/
        for (var e in _objElements) {
            var _elmt = _objElements[e];
            if (typeof _elmt.attr(PREFIX + "-watch") != "undefined") {
                var _fun = _elmt.attr(PREFIX + "-watch");
                if ($.isFunction(ve[_fun])) {
                    vm[pro + "watch"] = (function ($this, $ve) {
                        return function () {
                            var args = $.makeArray(arguments);
                            $ve.apply($this, args);
                        }
                    })(_elmt[0], ve[_fun])
                }
                _elmt.removeAttr(PREFIX + "-watch");
            }
        }
        /*********************** ui控件开发扫描  *******************************/
        var _uiList = [];
        _elUi.each(function () {
            var _uiname = $(this).attr(PREFIX + "-ui");
            _uiname = _uiname.substring(_uiname.indexOf("(") + 1, _uiname.lastIndexOf(")"));
            $(this).removeAttr(PREFIX + "-ui");
            var _data = null;
            if (typeof $(this).attr(PREFIX + "-ui-data") != "undefined") {
                var _default = $(this).attr(PREFIX + "-ui-data");
                if (_default.indexOf("uiInit") > -1) {
                    _default = _default.substring(_default.indexOf("[") + 1, _default.lastIndexOf("]"));
                    _data = groot.uiInit[_default];
                } else {
                    _data = eval("(" + _default + ")");
                }

                $(this).removeAttr(PREFIX + "-ui-data");
            }
            var _id = new Date() - 1;
            if (typeof $(this).attr(PREFIX + "-ui-id") != "undefined") {
                _id = $(this).attr(PREFIX + "-ui-id");
                $(this).removeAttr(PREFIX + "-ui-id");
            } else {
                _id = "ui" + _id;
            }
            _uiList.push(_id);
            groot.ui[_uiname]($(this), _id, _data, vm[pro], (function (_id) {
                return function () {
                    vm[pro] = groot.vms[_id].uivalue;
                    vm[pro + "Render"]();
                }
            })(_id));
        });
        /*********************** checkbox  *******************************/
        _elCheck.removeAttr(PREFIX + "-check");
        if (vm[pro]) {
            _elCheck.attr("checked", "checked");//.is(":checked")
        } else {
            _elCheck.removeAttr("checked");
        }
        _elCheck.change(function () {
            if ($(this).is(":checked")) {
                vm[pro] = true;
                vm[pro + RENDEAR]();
            } else {
                vm[pro] = false;
                vm[pro + RENDEAR]();
            }
        });
        /*********************** selectBox  *******************************/
        _elSelect.removeAttr(PREFIX + "-select");
        _elSelect.find("option[value='" + vm[pro] + "']").attr("selected", "selected");
        _elSelect.change(function () {
            vm[pro] = $(this).val();
            vm[pro + RENDEAR]();
        });
        /*********************** Radio  *******************************/
        _eltRadio.removeAttr(PREFIX + "-radio");
        _eltRadio.each(function () {
            if ($(this).val() == vm[pro]) {
                //$(this).attr("checked", "checked");元写法在火狐下有bug
                $(this).click();
            }
        });
        _eltRadio.change(function () {
            if ($(this).is(':checked')) {
                vm[pro] = $(this).val();
                vm[pro + RENDEAR]();
            }
        });
        /*********************** class 样式 *******************************/
        var _classList = [];
        _eltClass.each(function () {
            var _sx = $(this).attr(PREFIX + "-class");
            var _sx0 = $(this).attr(PREFIX + "-class-" + pro);
            var _expression;
            if (typeof _sx == "undefined") {
                _expression = _sx0;
            } else {
                _expression = _sx.substring(_sx.indexOf("(") + 1, _sx.lastIndexOf(")"));
            }

            _classList.push({"element": $(this), "express": _expression});
            var _express;
            if (isNum(vm[pro]) || typeof vm[pro] == "boolean") {

                _express = _expression.replace(/value/g, vm[pro]);
            } else {

                _express = _expression.replace(/value/g, "\"" + vm[pro] + "\"");
            }
            var _classArr = _express.split(",");
            $(this).removeAttr(PREFIX + "-class");
            $(this).removeAttr(PREFIX + "-class-" + pro);
            for (var i = 0; i < _classArr.length; i++) {
                var index = _classArr[i].indexOf(":");
                var _cname = _classArr[i].substr(0, index);
                var _cexpress = _classArr[i].substr(index + 1)
                eval("var myValue = " + _cexpress);
                if (myValue) {
                    $(this).addClass(_cname);
                } else {
                    $(this).removeClass(_cname);
                }
            }
        });
        /*********************** value 文本  *******************************/
        var temp = $("<div>" + vm[pro] + "</div>");
        _eltValue.removeAttr(PREFIX + "-value").val(temp.text());
        /*********************** text 属性  *******************************/
        var _attrList = [];
        _eltAttr.each(function () {
            var _sx = $(this).attr(PREFIX + "-attr");
            var _attr = _sx.substring(_sx.indexOf("(") + 1, _sx.indexOf(","));
            var _expression = _sx.substring(_sx.indexOf(",") + 1, _sx.lastIndexOf(")"));
            _attrList.push({"attr": _attr, "element": $(this), "express": _expression});
            var _express;
            if (isNum(vm[pro]) || typeof vm[pro] == "boolean") {

                _express = _expression.replace(/value/g, vm[pro]);
            } else {
                var txt = $("<div>" + vm[pro] + "</div>");
                vm[pro] = txt.html();
                _express = _expression.replace(/value/g, "\"" + vm[pro] + "\"");
            }
            eval("var myValue = " + _express);
            $(this).removeAttr(PREFIX + "-attr").attr(_attr, myValue)
        });
        /*********************** css style样式  *******************************/
        var _cssList = [];
        _eltCss.each(function () {
            var _sx = $(this).attr(PREFIX + "-css");
            var _css = _sx.substring(_sx.indexOf("(") + 1, _sx.indexOf(","));
            var _expression = _sx.substring(_sx.indexOf(",") + 1, _sx.lastIndexOf(")"));
            _cssList.push({"css": _css, "element": $(this), "express": _expression});
            var _express;
            if (isNum(vm[pro]) || typeof vm[pro] == "boolean") {

                _express = _expression.replace(/value/g, vm[pro]);
            } else {

                _express = _expression.replace(/value/g, "\"" + vm[pro] + "\"");
            }
            eval("var myValue = " + _express);
            $(this).removeAttr(PREFIX + "-css").css(_css, myValue)
        });
        /*********************** 绑定扩展属性  *******************************/
        var _eblist = [];
        for (var i = 0; i < groot.bindingHandler.length; i++) {
            var _temp = groot.bindingHandler[i];
            var _elts = $("[" + PREFIX + "-" + _temp.Name + "='" + pro + "']", element).removeAttr(PREFIX + "-" + _temp.Name);
            _temp.Handler(_elts, vm[pro]);
            _eblist.push(_elts);
        }
        /*********************** 绑定输入框值变化  *******************************/
        var temp = $("<div>" + vm[pro] + "</div>");
        _eltChange.removeAttr(PREFIX + "-value-change").val(temp.text());
        _eltChange.bind("input propertychange", function () {
            vm[pro] = $(this).val();
            vm[pro + RENDEAR]();

        });
        /*********************** 绑定输入失去焦点 *******************************/
        var temp = $("<div>" + vm[pro] + "</div>");
        _eltBlur.removeAttr(PREFIX + "-value-blur").val(temp.text());
        _eltBlur.change(function () {
            vm[pro] = $(this).val();
            vm[pro + RENDEAR]();
        });
        vm[pro + RENDEAR] = function () {
            var value = vm[pro];
            /*********************** 渲染控件  *******************************/
            for (var i = 0; i < _uiList.length; i++) {
                groot.vms[_uiList[i]].uivalue = value;
                groot.vms[_uiList[i]].uivalueRender();
            }
            /*********************** 触发监控  *******************************/
            if ($.isFunction(vm[pro + "watch"])) {
                vm[pro + "watch"](vm, value);//调用监控函数
            }
            /*********************** checkBox  *******************************/
            if (vm[pro]) {
                _elCheck.attr("checked", "checked");//.is(":checked")
            } else {
                _elCheck.removeAttr("checked");
            }
            /*********************** selectBox  *******************************/
            _elSelect.find("option[value='" + vm[pro] + "']").attr("selected", "selected");
            /*********************** Radio  *******************************/
            _eltRadio.each(function () {
                if ($(this).val() == value) {
                    $(this).attr("checked", "checked");
                } else {
                    $(this).removeAttr("checked");
                }
            });
            /*********************** class样式  *******************************/
            for (var i = 0; i < _classList.length; i++) {
                var _express;
                if (isNum(value) || typeof value == "boolean" || value == null) {
                    _express = _classList[i].express.replace(/value/g, value);
                } else {
                    _express = _classList[i].express.replace(/value/g, "\"" + value + "\"");
                }
                var _classIntem = _express.split(",");
                for (var j = 0; j < _classIntem.length; j++) {
                    var index = _classIntem[j].indexOf(":");
                    var _cname = _classIntem[j].substr(0, index);
                    var _cexpress = _classIntem[j].substr(index + 1);
                    eval("var myValue = " + _cexpress);
                    if (myValue) {
                        _classList[i].element.addClass(_cname);
                    } else {
                        _classList[i].element.removeClass(_cname);
                    }
                }
            }
            /*********************** text 标签值  *******************************/
            vm.$$renderText();
            /*********************** value 文本  *******************************/
            _eltValue.val(vm[pro]);
            _eltChange.each(function () {
                if (!$(this).is(':focus')) {
                    $(this).val(vm[pro])
                }

            });
            _eltBlur.val(vm[pro]);
            /*********************** attract 属性值  *******************************/
            for (var i = 0; i < _attrList.length; i++) {
                var _express;
                if (isNum(value) || typeof value == "boolean" || value == null) {
                    _express = _attrList[i].express.replace(/value/g, value);
                } else {
                    _express = _attrList[i].express.replace(/value/g, "\"" + value + "\"");
                }
                eval("var myValue = " + _express);
                _attrList[i].element.attr(_attrList[i].attr, myValue);
            }
            /*********************** style 式 属性值  *******************************/
            for (var i = 0; i < _cssList.length; i++) {
                var _express;
                if (isNum(value) || typeof value == "boolean" || value == null) {
                    _express = _cssList[i].express.replace(/value/g, value);
                } else {
                    _express = _cssList[i].express.replace(/value/g, "\"" + value + "\"");
                }
                eval("var myValue = " + _express);
                _cssList[i].element.css(_cssList[i].css, myValue);
            }
            /*********************** style 式 刷新扩展属性  *******************************/
            for (var i = 0; i < groot.bindingHandler.length; i++) {
                var _temp = groot.bindingHandler[i];
                _temp.Handler(_eblist[i], value);
            }
        };
    }

    /*绑定数组
     @element html元素
     @vm 绑定的数据模型
     @pro 要绑定的属性
     * */
    function _bindingArry(vm, pro, ve) {
        _initArry(vm, pro, ve);
        vm[pro + RENDEAR] = function () {
            if (arguments.length > 0) {
                var _child = vm["$$child" + pro][arguments[0]];
                var _temp = $(vm["$$arr" + pro].tmpl).insertBefore(_child);
                _child.remove();
                vm["$$child" + pro][arguments[0]] = _temp;
                _IndexInit(vm[pro])
                _creatArrProperty(vm, vm[pro], vm[pro][arguments[0]]);
                _bindData(vm[pro][arguments[0]], _temp, ve);
                _IndexRender(vm[pro])
            } else {
                _initArry(vm, pro, ve);
            }
        }
    }

    function _IndexInit(vm) {
        for (var i = 0; i < vm.length; i++) {
            vm[i]["$index"] = i;
            vm[i]["$first"] = false;
            vm[i]["$last"] = false;
            if (i == 0)vm[i]["$first"] = true;
            if (i == vm.length - 1)vm[i]["$last"] = true;
        }
    }

    function _IndexRender(vm) {
        for (var i = 0; i < vm.length; i++) {
            vm[i].$indexRender();
            vm[i].$firstRender();
            vm[i].$lastRender();
        }
    }

    function _initArry(vm, pro, ve) {
        _IndexInit(vm[pro]);
        vm["$$child" + pro] = [];
        var _arr = vm["$$arr" + pro];
        _arr.element.html("");
        for (var i = 0; i < vm[pro].length; i++) {
            if (!$.isFunction(vm[pro]) && pro.indexOf("$$") < 0) {
                var _child = $(_arr.tmpl);
                _arr.element.append(_child);
                _creatArrProperty(vm, vm[pro], vm[pro][i])
                _bindData(vm[pro][i], _child, ve);
                vm["$$child" + pro].push(_child);
            }
        }
        _IndexRender(vm[pro]);
        vm[pro + "push"] = function (value) {
            vm[pro].push(value);
            _IndexInit(vm[pro]);
            var _child = $(_arr.tmpl);
            _arr.element.append(_child);
            _creatArrProperty(vm, vm[pro], value);
            _bindData(value, _child, ve);
            _IndexRender(vm[pro]);
            vm["$$child" + pro].push(_child);
        }
        vm[pro + "pop"] = function () {
            var _arrchid = vm["$$child" + pro].pop();
            _arrchid.remove();
            var ret = vm[pro].pop();
            _IndexInit(vm[pro]);
            _IndexRender(vm[pro]);
            return ret;
        }
        vm[pro + "shift"] = function () {
            var _arrchid = vm["$$child" + pro].shift();
            _arrchid.remove();
            var ret = vm[pro].shift();
            _IndexInit(vm[pro]);
            _IndexRender(vm[pro]);
            return ret;
        }
        vm[pro + "unshift"] = function (value) {
            vm[pro].unshift(value);
            _IndexInit(vm[pro]);
            var _child = $(_arr.tmpl);
            _arr.element.prepend(_child);
            _creatArrProperty(vm, vm[pro], value);
            _bindData(value, _child, ve);
            _IndexRender(vm[pro]);
            vm["$$child" + pro].unshift(_child);
        };
        vm[pro + "splice"] = function () {
            var args = arguments;
            var list = groot.model(vm[pro]);
            var retList = list.splice.apply(list, args);
            vm[pro] = list;
            vm[pro + "Render"]();
            return retList;
        };
        vm[pro + "concat"] = function () {
            var args = arguments;
            for (var i = 0; i < args.length; i++) {
                if ($.isArray(args[i])) {
                    for (var j = 0; j < args[i].length; j++) {
                        this[pro + "push"](args[i][j]);
                    }
                } else {
                    this[pro + "push"](args[i][j]);
                }
            }

        }
    }

//获取model对象
    groot.model = function (o) {
        var _o;
        if ($.isArray(o)) {
            _o = $.extend(true, [], o);
        } else if (typeof o == "object") {
            _o = $.extend(true, {}, o);
        } else {
            return o;
        }
        function _getModel(m) {
            if ($.isArray(m)) {
                for (var i = 0; i < m.length; i++) {
                    if ($.isArray(m[i])) {
                        _getModel(m[i]);
                    } else if (typeof m[i] == "object") {
                        _getModel(m[i]);
                    }
                }
            } else if (typeof m == "object") {
                for (var p in  m) {
                    if ($.isFunction(m[p]) || p.indexOf("$") > -1) {
                        delete m[p];
                    } else if ($.isArray(m[p])) {
                        _getModel(m[p]);
                    }
                    else if (typeof m[p] == "object") {
                        _getModel(m[p]);
                    }
                }
            }
        }

        _getModel(_o);
        return _o;
    }
//---------------groot API---------------//
    groot.log = function (a) {//输出到控制台
        window.console && console.log && console.log(a);
    }
    groot.asyn = function (foo) {//异步函数
        setTimeout(foo, 10);
    }
    groot.createElement = function (html, id, element) {
        var _temp = $(html + "<input type='hidden' id=\"" + id + "\">");
        element.html(_temp);
        element.attr(PREFIX + "-view", id);
        _dynVMS[id] = id;
        return element;
    }
    return groot;
})
(jQuery);
///bindExtend,自定义属性,自定义属性 gt-width="w"
(function ($, groot) {
    groot.bindExtend(
        {
            "Name": "show",
            "Handler": function (elment, value) {
                if (value == true) {
                    elment.show();
                } else {
                    elment.hide();
                }
            }
        }
        ,
        {
            "Name": "height",
            "Handler": function (elment, value) {
                elment.height(value);
            }
        }
        ,
        {
            "Name": "width",
            "Handler": function (elment, value) {
                elment.width(value);
            }
        }
        ,
        {
            "Name": "readonly",
            "Handler": function (elment, value) {
                if (value == false) {
                    elment.attr("readonly", "readonly");
                } else {
                    elment.removeAttr("readonly");
                }
            }
        }
        ,
        {
            "Name": "disabled",
            "Handler": function (elment, value) {
                if (value == false) {
                    elment.attr("disabled", "disabled");
                } else {
                    elment.removeAttr("disabled");
                }
            }
        },
        {
            "Name": "focus",
            "Handler": function (elment, value) {
                if (value) {
                    elment.focus()
                }
            }
        }
    );
    groot.filter(
        {
            "d": function (value, format) {
                if (!value) return;
                if (!format) format = "yyyy-MM-dd";
                switch (typeof value) {
                    case "string":
                        value = new Date(value.replace(/-/, "/"));
                        break;
                    case "number":
                        value = new Date(value);
                        break;
                }
                if (!value instanceof Date) return;
                var dict = {
                    "yyyy": value.getFullYear(),
                    "M": value.getMonth() + 1,
                    "d": value.getDate(),
                    "H": value.getHours(),
                    "m": value.getMinutes(),
                    "s": value.getSeconds(),
                    "MM": ("" + (value.getMonth() + 101)).substr(1),
                    "dd": ("" + (value.getDate() + 100)).substr(1),
                    "HH": ("" + (value.getHours() + 100)).substr(1),
                    "mm": ("" + (value.getMinutes() + 100)).substr(1),
                    "ss": ("" + (value.getSeconds() + 100)).substr(1)
                };
                return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
                    return dict[arguments[0]];
                });
            }
        }
    )
})(jQuery, groot)
