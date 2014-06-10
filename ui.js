groot.ui["myui"] = function (element, id, data, value, upParent) {
    var moudle = groot.view(id, function (vm, ve) {
        vm.uivalue = value;
        ve.change = function () {
            vm.uivalue = "李四";
            vm.uivalueRender();
            upParent();
        }
    });
    var _temp = groot.createElement("<span gt-text=\"uivalue\" style='color: red'></span><input gt-click=\"change\" type='button' value='控件'>", id);
    element.html(_temp);
}