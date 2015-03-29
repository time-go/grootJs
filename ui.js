groot.ui["myui"] = function (element, id, data, value, upParent) {
    groot.createElement("<span gt-text=\"{uivalue}\" style='color: red'></span><input gt-click=\"change\" type='button' value='控件'>", id,element);
    var moudle = groot.view(id, function (vm, ve) {
        vm.uivalue = value;
        ve.change = function () {
            vm.uivalue = "李四";
            vm.uivalueRender();
            upParent();
        }
    });
}
