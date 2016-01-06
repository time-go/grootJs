exports.UIComponent = function (element, id, data) {
    groot.createElement(require("list.html!text"), id, element);
    var m = groot.view(id, function (vm, ve) {
        vm.list = data;
        ve.upSex = function ($self) {//修改性别
            $self.sexState = true;
            $self.sexStateRender();
        }
        ve.submitSex = function ($self) {//保存修改
            $self.sexState = false;
            $self.sexStateRender();
        }
        ve.upInfo = function ($self) {//修改简介
            $self.infoState = true;
            $self.sexStateRender();
        }
        ve.submitInfo = function ($self) {//保存修改
            $self.infoState = false;
            $self.sexStateRender();
        }
        ve.remove = function ($self) {//删除
            groot.confrim("温馨提示", "确认要删除吗?", function () {
                vm.listsplice($self.$index, 1);
            })
        }

        ve.wh = function ($self, value) {
            console.log(value);
        }
    })
    var page = groot.paging($("#page"), function (p) {
        console.log(p);
        page(p, 15)
    })
    page(9, 15);
    return {
        push: function (data) {
            m.listpush(data);
        }
    }
}