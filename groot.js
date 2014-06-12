var groot = (function ($) {
    //---------------作者:大盗乔三---------------//
    //---------------qq:289880020---------------//
    //---------------系统常量----------------//
    var PREFIX = "gt";
    var RENDEAR = "Render";
    //---------------初始化对象----------------//
    function isNum(value) {
        if (value == "")return false;
        return !isNaN(value);
    }

    var groot = {};
    groot.ui = {};//ui控件开发接口
    groot.bindingHandler = [];
    groot.bindExtend = function () {
        for (var i = 0; i < arguments.length; i++) {
            groot.bindingHandler.push(arguments[i])
        }
    }
    groot.filter = {};
    groot.filter = function () {
        for (var i = 0; i < arguments.length; i++) {
            groot.filter = $.extend(groot.filter, arguments[i]);
        }
    }
    groot.vms = {};//储存vm所有对象
    groot.uiInit={};//存放控件初始化数据
    groot.view = function (name, factory) {
        groot.vms[name] = {};
        groot.vms[name].$$ve = {};
        factory(groot.vms[name], groot.vms[name].$$ve);//vm对象
        return  groot.vms[name];
    }
    //绑定事件
    var _bindEvents = [
        "click", "abort", "blur", "change", "dblclick", "error", "focus", "keydown", "keypress", "keyup", "unload",
        "load", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "reset", "resize", "submit"
    ]
    //垃圾回收算法
    var _collect = true;

    function _collection() {//垃圾回收
        if (_collect) {
            _collect = false;
            groot.asyn(function () {
                for (var vm in groot.vms) {
                    if (groot.vms[vm].hasOwnProperty("uivalue")) {
                        if ($("#" + vm).length <= 0)
                            delete  groot.vms[vm];
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
    function _sweepEvents(vm, element, ve) {
        for (var e in ve) {//绑定事件
            for (var i = 0; i < _bindEvents.length; i++) {
                element.find("[" + PREFIX + "-" + _bindEvents[i] + "='" + e + "']")
                    .unbind(_bindEvents[i])
                    .bind(_bindEvents[i], _triggerEvents(ve[e], vm))
                    .removeAttr(PREFIX + "-" + _bindEvents[i]);
            }
        }
    }

    function _triggerEvents(ve, args, e) {
        return function () {
            ve(args);
        }
    }

    //---------------私有函数-----------------//
    function _bindData(vm, element, ve) {
        var _include = element.find("[" + PREFIX + "-include]");
        _include.each(function () {
            var _text = require($(this).attr(PREFIX + "-include") + "!text");
            $(this).html(_text);
            $(this).removeAttr(PREFIX + "-include");
        });
        function findArr(p, a) {
            var _eltArrs = element.find("[" + PREFIX + "-each='" + pro + "']:eq(0)").removeAttr(PREFIX + "-each");
            if (_eltArrs.length > 0) {
                vm["$$arr" + pro].push({"element": _eltArrs, "templ": _eltArrs.html()});
                _eltArrs.html("");
                a.push(_eltArrs[0]);
                findArr(p, a);
            }
        }

        function findObj(p, a) {
            var _eltObjcts = element.find("[" + PREFIX + "-object='" + pro + "']:eq(0)").removeAttr(PREFIX + "-object");
            if (_eltObjcts.length > 0) {
                vm["$$obj" + pro].push({"element": _eltObjcts, "templ": _eltObjcts.html()});
                _eltObjcts.html("");
                a.push(_eltObjcts[0]);
                findObj(p, a);
            }
        }

        for (var pro in  vm) {//保存数组对象模板
            if (!$.isFunction(vm[pro]) && pro.indexOf("$$") < 0) {
                if ($.isArray(vm[pro])) {//数组
                    vm["$$arr" + pro] = [];
                    var _eltArrs = [];
                    findArr(pro, _eltArrs);
                    vm["$$arrSelector" + pro] = $(_eltArrs);
                } else if (typeof vm[pro] == "object") {//对象
                    vm["$$obj" + pro] = [];
                    var _eltObjcts = [];
                    findObj(pro, _eltObjcts);
                    vm["$$objSelector" + pro] = $(_eltObjcts);
                }
            }
        }
        for (var pro in  vm) {//初始化对象
            if (!$.isFunction(vm[pro]) && pro.indexOf("$$") < 0) {
                if ($.isArray(vm[pro])) {//绑定数组
                    _bindingArry(vm, pro, ve);
                } else if (typeof vm[pro] == "object") {
                    _bindingObject(vm, pro, ve);//绑定对象
                } else {//绑定属性
                    _bindingProperty(element, vm, pro, ve);
                }
            }
        }
        _sweepEvents(vm, element, ve);//绑定事件
        _collection();//回收垃圾
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
        var _arr = vm["$$obj" + pro];
        for (var i = 0; i < _arr.length; i++) {
            var _temp = _arr[i];
            _temp.element.html(_temp.templ);
        }
        vm[pro].parent = function () {
            return vm;
        }
        _bindData(vm[pro], vm["$$objSelector" + pro], ve);
        vm[pro + RENDEAR] = function () {
            var _arr = vm["$$obj" + pro];
            for (var i = 0; i < _arr.length; i++) {
                var _temp = _arr[i];
                _temp.element.html(_temp.templ);
            }
            vm[pro].parent = function () {
                return vm;
            }
            _bindData(vm[pro], vm["$$objSelector" + pro], ve);
        };
    }

    /*
     @element html元素
     @vm 绑定的数据模型
     @pro 要绑定的属性
     * */
    function _bindingProperty(element, vm, pro, ve) {
        var _eltText = element.find("[" + PREFIX + "-text^='" + pro + "']").html(vm[pro]);
        var _eltValue = element.find("[" + PREFIX + "-value='" + pro + "']").val(vm[pro]).removeAttr(PREFIX + "-value");
        var _eltChange = element.find("[" + PREFIX + "-value-change='" + pro + "']").val(vm[pro]).removeAttr(PREFIX + "-value-change");
        var _eltBlur = element.find("[" + PREFIX + "-value-blur='" + pro + "']").val(vm[pro]).removeAttr(PREFIX + "-value-blur");
        var _eltAttr = element.find("[" + PREFIX + "-attr^='" + pro + "(']");//"pro(id,value+""")"
        var _eltCss = element.find("[" + PREFIX + "-css^='" + pro + "(']");//"pro(id,value+""")"
        var _eltClass = element.find("[" + PREFIX + "-class^='" + pro + "(']");
        var _eltRadio = element.find("[" + PREFIX + "-radio='" + pro + "']").removeAttr(PREFIX + "-radio");
        var _elSelect = element.find("[" + PREFIX + "-select='" + pro + "']").removeAttr(PREFIX + "-select");
        var _elCheck = element.find("[" + PREFIX + "-check='" + pro + "']").removeAttr(PREFIX + "-check");
        var _elUi = element.find("[" + PREFIX + "-ui^='" + pro + "']");
        var _uiList = [];
        _elUi.each(function () {
            var _id = new Date() - 1;
            _id = "ui" + _id;
            _uiList.push(_id);
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
            groot.ui[_uiname]($(this), _id, _data, vm[pro], function () {
                vm[pro] = groot.vms[_id].uivalue;
                vm[pro + "Render"]();
            });
            groot.sweep(groot.vms[_id], $(this));
        });

        if (typeof _eltText.attr(PREFIX + "-wach") != "undefined") {
            var _fun = _eltText.attr(PREFIX + "-wach");
            if ($.isFunction(ve[_fun])) {
                vm[pro + "wach"] = ve[_fun]
            }
            _eltText.removeAttr(PREFIX + "-wach");
        }
        if (typeof _eltValue.attr(PREFIX + "-wach") != "undefined") {
            var _fun = _eltValue.attr(PREFIX + "-wach");
            if ($.isFunction(ve[_fun])) {
                vm[pro + "wach"] = ve[_fun]
            }
            _eltValue.removeAttr(PREFIX + "-wach");
        }
        if (typeof _eltChange.attr(PREFIX + "-wach") != "undefined") {
            var _fun = _eltChange.attr(PREFIX + "-wach");
            if ($.isFunction(ve[_fun])) {
                vm[pro + "wach"] = ve[_fun]
            }
            _eltChange.removeAttr(PREFIX + "-wach");
        }
        if (typeof _eltBlur.attr(PREFIX + "-wach") != "undefined") {
            var _fun = _eltBlur.attr(PREFIX + "-wach");
            if ($.isFunction(ve[_fun])) {
                vm[pro + "wach"] = ve[_fun]
            }
            _eltBlur.removeAttr(PREFIX + "-wach");
        }
        if (typeof _eltAttr.attr(PREFIX + "-wach") != "undefined") {
            var _fun = _eltAttr.attr(PREFIX + "-wach");
            if ($.isFunction(ve[_fun])) {
                vm[pro + "wach"] = ve[_fun]
            }
            _eltAttr.removeAttr(PREFIX + "-wach");
        }
        if (typeof _eltCss.attr(PREFIX + "-wach") != "undefined") {
            var _fun = _eltCss.attr(PREFIX + "-wach");
            if ($.isFunction(ve[_fun])) {
                vm[pro + "wach"] = ve[_fun]
            }
            _eltCss.removeAttr(PREFIX + "-wach");
        }
        if (typeof _eltClass.attr(PREFIX + "-wach") != "undefined") {
            var _fun = _eltClass.attr(PREFIX + "-wach");
            if ($.isFunction(ve[_fun])) {
                vm[pro + "wach"] = ve[_fun]
            }
            _eltClass.removeAttr(PREFIX + "-wach");
        }
        if (typeof _eltRadio.attr(PREFIX + "-wach") != "undefined") {
            var _fun = _eltRadio.attr(PREFIX + "-wach");
            if ($.isFunction(ve[_fun])) {
                vm[pro + "wach"] = ve[_fun]
            }
            _eltRadio.removeAttr(PREFIX + "-wach");
        }
        if (typeof _elSelect.attr(PREFIX + "-wach") != "undefined") {
            var _fun = _elSelect.attr(PREFIX + "-wach");
            if ($.isFunction(ve[_fun])) {
                vm[pro + "wach"] = ve[_fun]
            }
            _elSelect.removeAttr(PREFIX + "-wach");
        }
        if (typeof _elCheck.attr(PREFIX + "-wach") != "undefined") {
            var _fun = _elCheck.attr(PREFIX + "-wach");
            if ($.isFunction(ve[_fun])) {
                vm[pro + "wach"] = ve[_fun]
            }
            _elCheck.removeAttr(PREFIX + "-wach");
        }
        //////
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
        _elSelect.find("option[value='" + vm[pro] + "']").attr("selected", "selected");
        _elSelect.change(function () {
            vm[pro] = $(this).val();
            vm[pro + RENDEAR]();
        });
        _eltRadio.each(function () {
            if ($(this).val() == vm[pro]) {
                $(this).attr("checked", "checked");
            } else {
                $(this).removeAttr("checked");
            }
        });
        _eltRadio.click(function () {
            if ($(this).is(':checked')) {
                vm[pro] = $(this).val();
                vm[pro + RENDEAR]();
            }
        })
        var _classList = [];
        _eltClass.each(function () {
            var _sx = $(this).attr(PREFIX + "-class");
            var _expression = _sx.substring(_sx.indexOf("(") + 1, _sx.lastIndexOf(")"));

            _classList.push({"element": $(this), "express": _expression});
            var _express;
            if (isNum(vm[pro])) {

                _express = _expression.replace(/value/g, vm[pro]);
            } else {

                _express = _expression.replace(/value/g, "\"" + vm[pro] + "\"");
            }
            var _classArr = _express.split(",");
            $(this).removeAttr(PREFIX + "-class");
            for (var i = 0; i < _classArr.length; i++) {
                var _cname = _classArr[i].split(":")[0];
                var _cexpress = _classArr[i].split(":")[1];
                window["eval"]("var myValue = " + _cexpress);
                if (myValue) {
                    $(this).addClass(_cname);
                } else {
                    $(this).removeClass(_cname);
                }
            }
        });
        var _textList = [];
        _eltText.each(function () {
            var _sx = $(this).attr(PREFIX + "-text");
            var _expression;
            if (_sx.indexOf("(") > -1) {
                _expression = _sx.substring(_sx.indexOf("(") + 1, _sx.lastIndexOf(")"));
            } else {
                _expression = "value";
            }

            _textList.push({"element": $(this), "express": _expression});
            var _express;
            if (isNum(vm[pro])) {

                _express = _expression.replace(/value/g, vm[pro]);
            } else {

                _express = _expression.replace(/value/g, "\"" + vm[pro] + "\"");
            }
            window["eval"]("var myValue = " + _express);
            $(this).removeAttr(PREFIX + "-text").html(myValue);
        });
        var _attrList = [];
        _eltAttr.each(function () {
            var _sx = $(this).attr(PREFIX + "-attr");
            var _attr = _sx.substring(_sx.indexOf("(") + 1, _sx.indexOf(","));
            var _expression = _sx.substring(_sx.indexOf(",") + 1, _sx.lastIndexOf(")"));
            _attrList.push({"attr": _attr, "element": $(this), "express": _expression});
            var _express;
            if (isNum(vm[pro])) {

                _express = _expression.replace(/value/g, vm[pro]);
            } else {

                _express = _expression.replace(/value/g, "\"" + vm[pro] + "\"");
            }
            window["eval"]("var myValue = " + _express);
            $(this).removeAttr(PREFIX + "-attr").attr(_attr, myValue)
        });
        var _cssList = [];
        _eltCss.each(function () {
            var _sx = $(this).attr(PREFIX + "-css");
            var _css = _sx.substring(_sx.indexOf("(") + 1, _sx.indexOf(","));
            var _expression = _sx.substring(_sx.indexOf(",") + 1, _sx.lastIndexOf(")"));
            _cssList.push({"css": _css, "element": $(this), "express": _expression});
            var _express;
            if (isNum(vm[pro])) {

                _express = _expression.replace(/value/g, vm[pro]);
            } else {

                _express = _expression.replace(/value/g, "\"" + vm[pro] + "\"");
            }
            window["eval"]("var myValue = " + _express);
            $(this).removeAttr(PREFIX + "-css").css(_css, myValue)
        });
        var _eblist = [];
        for (var i = 0; i < groot.bindingHandler.length; i++) {
            var _temp = groot.bindingHandler[i];
            var _elts = element.find("[" + PREFIX + "-" + _temp.Name + "='" + pro + "']").removeAttr(PREFIX + "-" + _temp.Name);
            _temp.Handler(_elts, vm[pro]);
            _eblist.push(_elts);
        }
        _eltChange.bind("input propertychange keyup", function () {
            vm[pro] = $(this).val();
            vm[pro + RENDEAR]();
        });
        _eltBlur.change(function () {
            vm[pro] = $(this).val();
            vm[pro + RENDEAR]();
        });
        vm[pro + RENDEAR] = function () {
            var value = vm[pro];
            //_uiList
            for (var i = 0; i < _uiList.length; i++) {
                groot.vms[_uiList].uivalue = value;
                groot.vms[_uiList].uivalueRender();
            }
            if ($.isFunction(vm[pro + "wach"])) {
                vm[pro + "wach"](vm, value);//调用监控函数
            }
            if (vm[pro]) {
                _elCheck.attr("checked", "checked");//.is(":checked")
            } else {
                _elCheck.removeAttr("checked");
            }
            _elSelect.find("option[value='" + vm[pro] + "']").attr("selected", "selected");
            _eltRadio.each(function () {
                if ($(this).val() == value) {
                    $(this).attr("checked", "checked");
                } else {
                    $(this).removeAttr("checked");
                }
            });
            for (var i = 0; i < _classList.length; i++) {
                var _express;
                if (isNum(value)) {
                    _express = _classList[i].express.replace(/value/g, value);
                } else {
                    _express = _classList[i].express.replace(/value/g, "\"" + value + "\"");
                }
                var _classIntem = _express.split(",")
                for (var j = 0; j < _classIntem.length; j++) {
                    var _cname = _classIntem[j].split(":")[0];
                    var _cexpress = _classIntem[j].split(":")[1];
                    window["eval"]("var myValue = " + _cexpress);
                    if (myValue) {
                        _classList[i].element.addClass(_cname);
                    } else {
                        _classList[i].element.removeClass(_cname);
                    }
                }
            }
            for (var i = 0; i < _textList.length; i++) {
                var _express;
                if (isNum(value)) {
                    _express = _textList[i].express.replace(/value/g, value);
                } else {
                    _express = _textList[i].express.replace(/value/g, "\"" + value + "\"");
                }
                window["eval"]("var myValue = " + _express);
                _textList[i].element.html(myValue);
            }
            _eltValue.val(value);
            _eltChange.each(function () {
                if (value != $(this).val())$(this).val(value);
            })
            _eltBlur.each(function () {
                if (value != $(this).val())$(this).val(value);
            })
            for (var i = 0; i < _attrList.length; i++) {
                var _express;
                if (isNum(value)) {
                    _express = _attrList[i].express.replace(/value/g, value);
                } else {
                    _express = _attrList[i].express.replace(/value/g, "\"" + value + "\"");
                }
                window["eval"]("var myValue = " + _express);
                _attrList[i].element.attr(_attrList[i].attr, myValue);
            }
            for (var i = 0; i < _cssList.length; i++) {
                var _express;
                if (isNum(value)) {
                    _express = _cssList[i].express.replace(/value/g, value);
                } else {
                    _express = _cssList[i].express.replace(/value/g, "\"" + value + "\"");
                }
                window["eval"]("var myValue = " + _express);
                _cssList[i].element.css(_cssList[i].css, myValue);
            }
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
                var element = vm["$$child" + pro][arguments[0]];
                for (var i = 0; i < element.length; i++) {
                    var _child = element[i];
                    var _temp = $(_child.templ).insertBefore(_child.element);
                    _child.element.remove();
                    _child.element = _temp;
                }
                _IndexInit(vm[pro])
                _creatArrProperty(vm, vm[pro], vm[pro][arguments[0]]);
                _bindData(vm[pro][arguments[0]], vm["$$arrSelector" + pro], ve);
                _IndexRender(vm[pro])
            } else {
                _initArry(vm, pro);
            }
        }
    }

    function _IndexInit(vm) {
        for (var i = 0; i < vm.length; i++) {
            vm[i]["$index"] = i;
            vm[i]["$first"] = "false";
            vm[i]["$last"] = "false";
            if (i == 0)vm[i]["$first"] = "true";
            if (i == vm.length - 1)vm[i]["$last"] = "true";
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
        vm["$$child" + pro] = [];
        var _arr = vm["$$arr" + pro];
        for (var i = 0; i < _arr.length; i++) {
            _arr[i].element.html("");
        }
        _IndexInit(vm[pro]);
        for (var i = 0; i < vm[pro].length; i++) {
            if (!$.isFunction(vm[pro]) && pro.indexOf("$$") < 0) {
                var _childs = [];
                for (var j = 0; j < _arr.length; j++) {
                    var _temp = _arr[j];
                    var _child = $(_temp.templ);
                    _childs.push({"element": _child, "templ": _temp.templ});
                    var _element = _temp.element.append(_child);
                }
                _creatArrProperty(vm, vm[pro], vm[pro][i])
                _bindData(vm[pro][i], vm["$$arrSelector" + pro], ve);
                ;
                vm["$$child" + pro].push(_childs);
            }
        }
        _IndexRender(vm[pro]);
        vm[pro + "push"] = function (value) {
            vm[pro].push(value);
            _IndexInit(vm[pro]);
            var _childs = [];
            for (var j = 0; j < _arr.length; j++) {
                var _temp = _arr[j];
                var _child = $(_temp.templ);
                _childs.push({"element": _child, "templ": _temp.templ});
                var _element = _temp.element.append(_child);
            }
            _creatArrProperty(vm, vm[pro], value);
            _bindData(value, vm["$$arrSelector" + pro], ve);
            _IndexRender(vm[pro]);
            vm["$$child" + pro].push(_childs);
        }
        vm[pro + "pop"] = function () {
            var _arrchids = vm["$$child" + pro].pop();
            for (var i = 0; i < _arrchids.length; i++) {
                _arrchids[i].element.remove();
            }
            var ret = vm[pro].pop();
            _IndexInit(vm[pro]);
            _IndexRender(vm[pro]);
            return ret;
        }
        vm[pro + "shift"] = function () {
            var _arrchids = vm["$$child" + pro].shift();
            for (var i = 0; i < _arrchids.length; i++) {
                _arrchids[i].element.remove();
            }
            var ret = vm[pro].shift();
            _IndexInit(vm[pro]);
            _IndexRender(vm[pro]);
            return ret;
        }
        vm[pro + "unshift"] = function (value) {
            vm[pro].unshift(value);
            _IndexInit(vm[pro]);
            var _childs = [];
            for (var j = 0; j < _arr.length; j++) {
                var _temp = _arr[j];
                var _child = $(_temp.templ);
                _childs.push({"element": _child, "templ": _temp.templ});
                var _element = _temp.element.prepend(_child);
            }
            _creatArrProperty(vm, vm[pro], value);
            _bindData(value, vm["$$arrSelector" + pro], ve);
            _IndexRender(vm[pro]);
            vm["$$child" + pro].unshift(_childs);
        };
        vm[pro + "splice"] = function () {
            var args = arguments;
            if (args.length < 0)return;
            if (args.length == 1) {
                if (args[0] < 0)return;
            }
            if (args.length > 1) {
                if (args[0] < 0 || args[1] < 0)return;
            }
            if (args.length > 2) {
                var _removeChild = vm["$$child" + pro].splice(args[0], args[1]);
                vm[pro].splice(args[0], args[1]);
                for (var i = 0; i < _removeChild.length; i++) {
                    for (var j = 0; j < _removeChild[i].length; j++) {
                        _removeChild[i][j].element.remove();
                    }
                }//删除多余 插入新元素
                var _eleAffter = [];
                for (var j = 0; j < _arr.length; j++) {
                    _eleAffter.push(0);
                }
                for (var i = 0; i < args.length; i++) {
                    if (i > 1) {
                        vm[pro].splice(args[0], 0, args[i]);
                        var _childs = [];
                        for (var j = 0; j < _arr.length; j++) {
                            var _eleAffter;
                            var _temp = _arr[j];
                            var _child = $(_temp.templ);
                            _childs.push({"element": _child, "templ": _temp.templ});
                            if (_eleAffter[j] == 0) {
                                if (args[0] == 0) {
                                    var _element = _temp.element.prepend(_child);///
                                    _eleAffter[j] = _element;
                                } else {
                                    _eleAffter[j] = vm["$$child" + pro][args[0]][j].element;
                                    var _element = _child.insertBefore(_eleAffter[j]);///
                                    _eleAffter[j] = _element;
                                }
                            } else {
                                var _element = _child.insertAfter(_eleAffter);///
                                _eleAffter = _element;
                            }
                        }
                        _IndexInit(vm[pro]);
                        _creatArrProperty(vm, vm[pro], args[i]);
                        _bindData(args[i], vm["$$arrSelector" + pro], ve);
                        _IndexRender(vm[pro]);
                        vm["$$child" + pro].splice(args[0], 0, _childs);
                    }
                }

            } else if (args.length <= 2 && args.length > 0) {
                var _removeChild = vm["$$child" + pro].splice.apply(vm["$$child" + pro], arguments);
                vm[pro].splice.apply(vm[pro], arguments);
                for (var i = 0; i < _removeChild.length; i++) {
                    for (var j = 0; j < _removeChild[i].length; j++) {
                        _removeChild[i][j].element.remove();
                    }
                }
                _IndexInit(vm[pro]);
                _IndexRender(vm[pro]);
            } else {
                return;
            }
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

//---------------commonjs规范----------------//
    var _cssCache = {};
    var _absUrl = function (path) {
        if (path.indexOf("http://") > -1) {
            path = path.replace("http://", "").replace(/\/+/g, "/");
            return "http://" + path;
        }
        var _host = window.location.href;
        if (_host.indexOf("/") > -1) {
            _host = _host.substr(0, _host.lastIndexOf("/") + 1);
        } else {
            _host = _host + "/";
        }
        _host = _host.replace("http://", "") + path;
        _host = _host.replace(/\/+/g, "/")
        var _arr = _host.split("/");
        var _urlArr = [];
        for (var i = 0; i < _arr.length; i++) {
            if (_arr[i] != "..") {
                _urlArr.push(_arr[i]);
            } else {
                _urlArr.pop();
            }
        }
        return "http://" + _urlArr.join("/");
    }
    _require = function (parent, path) {
        var _moudle;
        var _type = "js";
        var _basePath;
        if (path.substr(0, 2) == "./") {
            path = path.substr(2);
            path = parent + path;
        } else {
            var _host = window.location.href;
            if (_host.indexOf("/") > -1) {
                _host = _host.substr(0, _host.lastIndexOf("/") + 1);
            } else {
                _host = _host + "/";
            }
            path = _host + path;
        }
        _basePath = path.substr(0, path.lastIndexOf("/") + 1);
        if (path.lastIndexOf("!") > -1) {
            _type = path.substr(path.lastIndexOf("!") + 1);
            path = path.substr(0, path.lastIndexOf("!"));
        } else {
            if (path.lastIndexOf(".js") < 0) {
                path = path + ".js";
            }
        }
        $.ajax({
            type: 'get',
            "url": path,
            "cache": true,
            "dataType": "text",
            "error": function () {
                groot.log(_absUrl(path) + "加载失败");
            },
            "async": false,
            "success": function (data) {
                if (_type == "js") {//js预编译
                    var _script = "_define(function(exports,module){\n";
                    _script += "var $parent = \"" + _basePath + "\";\n";
                    _script += data.replace(/require\(/g, "_require($parent,");
                    _script += ";\n});" + "//@ sourceURL=" + _absUrl(path);
                    _moudle = window["eval"](_script);
                } else if (_type == "text") {
                    _moudle = data;
                }
                else if (_type == "css") {
                    var _key = _absUrl(path);
                    if (!_cssCache.hasOwnProperty(_key)) {
                        $("<style></style>").html(data).appendTo("head")
                        _cssCache[_key] = "load";
                    }
                }
            }
        });
        return _moudle;
    }
    window.require = function (path) {
        return _require("", path);
    };
    _define = function (factory) {
        var _exports = {};
        var _module = {};
        _module.exports = {};
        var retExpots = factory(_exports, _module);
        return $.extend(true, {}, _exports, _module.exports, retExpots);
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
    groot.createElement = function (html, id) {
        return $(html).append("<input type='hidden' id=\"" + id + "\">")
    }
    groot.absUrl = _absUrl;//根绝相对路径获取绝对路径
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
    );
    groot.filter(
        {
            "formatDate": function (value, format) {
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
