var groot = (function ($) {
    var PREFIX = "gt";
    var RENDEAR = "Render";
    //---------------初始化对象----------------//
    var groot = {};
    groot.vms = {};//储存vm所有对象
    groot.view = function (name, factory) {
        groot.vms[name] = {};
        factory(groot.vms[name]);//vm对象
        groot.sweep(groot.vms[name], $("[" + PREFIX + "-view='" + name + "']"));
        return groot.vms[name];
    }

    //---------------扫描事件----------------//
    // 没有参数扫描所有，2个参数 扫面指定的 vn 和 html片段//
    //-------------------------------//
    groot.sweep = function (vm, element) {
        _bindData(vm, element);
    }
    //---------------私有函数-----------------//
    function _bindData(vm, element) {
        function findArr(p) {
            var _eltArrs = element.find("[" + PREFIX + "-each='" + pro + "']:eq(0)").removeAttr(PREFIX + "-each");
            if (_eltArrs.length > 0) {
                vm["$$arr" + pro] = {"element": _eltArrs, "templ": _eltArrs.html()};
                _eltArrs.html("");
            }
        }

        function findObj(p) {
            var _eltObjcts = element.find("[" + PREFIX + "-object='" + pro + "']:eq(0)").removeAttr(PREFIX + "-object");
            if (_eltObjcts.length > 0) {
                vm["$$obj" + pro] = {"element": _eltObjcts, "templ": _eltObjcts.html()};
                _eltObjcts.html("");
            }
        }

        for (var pro in  vm) {//保存数组对象模板
            if (!$.isFunction(vm[pro]) && pro.indexOf("$$") < 0) {
                if ($.isArray(vm[pro])) {//数组
                    findArr(pro);
                } else if (typeof vm[pro] == "object") {//对象;
                    findObj(pro);
                }
            }
        }
        for (var pro in  vm) {//初始化对象
            if (!$.isFunction(vm[pro]) && pro.indexOf("$$") < 0) {
                if ($.isArray(vm[pro])) {//绑定数组
                    _bindingArry(vm, pro);
                } else if (typeof vm[pro] == "object") {
                    _bindingObject(vm, pro);//绑定对象
                } else {//绑定属性
                    _bindingProperty(element, vm, pro);
                }
            }
        }
    }

    /*
     @vm 绑定的数据模型
     @pro 要绑定的属性
     * */
    function _bindingObject(vm, pro) {
        var _temp = vm["$$obj" + pro];
        _temp.element.html(_temp.templ);
        _bindData(vm[pro], _temp.element);
        vm[pro + RENDEAR] = function () {
            var _temp = vm["$$obj" + pro];
            _temp.element.html(_temp.templ);
            _bindData(vm[pro], _temp.element);
        };
    }

    /*
     @element html元素
     @vm 绑定的数据模型
     @pro 要绑定的属性
     * */
    function _bindingProperty(element, vm, pro) {
        var _eltText = element.find("[" + PREFIX + "-text^='" + pro + "']").html(vm[pro]).removeAttr(PREFIX + "-text");;
        var _eltChange = element.find("[" + PREFIX + "-value-change='" + pro + "']").val(vm[pro]).removeAttr(PREFIX + "-value-change");
        _eltChange.bind("input propertychange keyup", function () {
            vm[pro] = $(this).val();
            vm[pro + RENDEAR]();
        });
        vm[pro + RENDEAR] = function () {
            var value = vm[pro];
            _eltText.html(value);
            _eltChange.each(function () {
                if (document.activeElement !== this) {
                    $(this).val(value);
                }
            })
        };
    }

    /*绑定数组
     @element html元素
     @vm 绑定的数据模型
     @pro 要绑定的属性
     * */
    function _bindingArry(vm, pro) {
        _initArry(vm, pro);
        vm[pro + RENDEAR] = function () {
            if (arguments.length > 0) {
                var element = vm["$$child" + pro][arguments[0]];
                var _arr = vm["$$arr" + pro];
                var _newElement = $(_arr.templ).insertBefore(element);
                element.remove();
                vm["$$child" + pro][arguments[0]] = _newElement;
                _bindData(vm[pro][arguments[0]], _arr.element);
            } else {
                _initArry(vm, pro);
            }
        }
    }

    function _initArry(vm, pro) {
        vm["$$child" + pro] = [];
        var _temp = vm["$$arr" + pro];
        _temp.element.html("");
        for (var i = 0; i < vm[pro].length; i++) {
            if (!$.isFunction(vm[pro]) && pro.indexOf("$$") < 0) {
                var _child = $(_temp.templ);
                _temp.element.append(_child);
                _bindData(vm[pro][i],_child);
                vm["$$child" + pro].push(_child);
            }
        }
        vm[pro + "push"] = function (value) {
            vm[pro].push(value);
            var _temp = vm["$$arr" + pro];
            var _child = $(_temp.templ);
            _temp.element.append(_child);
            _bindData(value, _temp.element);
            vm["$$child" + pro].push(_child);
        }
    }
    return groot;
})
(jQuery);