<!DOCTYPE html>
<html>
<head lang="zh">
    <meta charset="UTF-8">
    <title>绑定数组</title>
    <script src="js/jquery-1.7.2.min.js"></script>
    <script src="js/groot.js"></script>
</head>
<body>
<div gt-view="myview">
    <input type="button" gt-click="push" value="添加数组"/>
    <input type="button" gt-click="pop" value="删除数组pop"/>
    <input type="button" gt-click="chObject" value="改变数组某一项"/>
    <input type="button" gt-click="splice" value="删除数组splice"/>
    <input type="button" gt-click="insert" value="插入"/>
    <input type="button" gt-click="chList" value="给整个数组重新赋值"/>
    <input type="button" gt-click="show1" value="显示奇数行"/>
    <input type="button" gt-click="show2" value="显示偶数行"/>
    <input type="button" gt-click="show3" value="显示全部行"/>
    <ul gt-each="list">
        <li gt-attr="id:{$index} +1"
            gt-visible="{$p.show}===3||({$p.show}==1&&{$index}%2==0)||({$p.show}==2&&{$index}%2==1)">
            <span gt-text="{$index}+1"></span>
            <span>姓名:</span><span gt-text="{name}"></span>---
            <span>性别:</span><span gt-text="{sex}"></span>
            <input type="text" gt-value-change="name"/>
            <input type="button" value="奇偶切换" gt-click="change"/>
            <span gt-visible="{$p.show}===1">奇</span>
            <span gt-visible="{$p.show}===2">偶</span>
            <span gt-visible="{$p.show}===3">全</span>
        </li>
    </ul>
</div>
</body>
</html>
<script>
    var list = [];
    for (var i = 0; i < 1000; i++) {
        list.push({"name": "张三", "sex": "男"});
    }

    var date1 = new Date();  //开始时间
    groot.view("myview", function (vm, ve) {
        vm.show = 1;
        vm.list = list;
        ve.change = function ($self) {
            if ($self["$p.show"] === 1) {
                $self["$p.show"] = 2;
                $self["$p.showRender"]();
            } else if ($self["$p.show"] === 2) {
                $self["$p.show"] = 1;
                $self["$p.showRender"]();
            }
        }
        ve.show1 = function () {
            vm.show = 1;
            vm.showRender();
        }
        ve.show2 = function () {
            vm.show = 2;
            vm.showRender();
        }
        ve.show3 = function () {
            vm.show = 3;
            vm.showRender();
        }
        ve.push = function () {
            vm.listpush({"name": "张三", "sex": "男"});
        }
        ve.pop = function () {
            vm.listpop();
        }
        ve.splice = function () {
            vm.listsplice(1, 1);
        }
        ve.insert = function () {
            vm.listsplice(1, 0, {"name": "李四", "sex": "男"});
        }
        ve.chObject = function () {
            vm.list[1] = {"name": "王五", "sex": "男"};
            vm.listRender(1);
        }
        ve.chList = function () {
            vm.list = [
                {"name": "大盗", "sex": "男"}
                , {"name": "乔三", "sex": "男"}
            ];
            vm.listRender();
        }
    })
    var date2 = new Date();    //结束时间
    var date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数
    console.log(date3);
</script>
