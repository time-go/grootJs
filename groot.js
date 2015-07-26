<!DOCTYPE html>
<html>
<head lang="zh">
    <meta charset="UTF-8">
    <title>变量监控</title>
    <script src="js/jquery-1.11.2.min.js"></script>
    <script src="js/groot.js"></script>
    <style>
        .back0{
            background: red;
        }
        .back1{
            background: green;
        }
    </style>
</head>
<body>
<div gt-view="myview">
    <ul gt-each="list">
        <li gt-class="back0:{$index} % 2 ==0,back1:{$index} % 2==1">
            <span gt-text="{$index}+1"></span>
            <span>姓名:</span><span gt-text="{name}"></span>---
            <span>性别:</span><span gt-text="{sex}"></span>
            <input type="text" gt-watch="mychange" gt-value-change="name">
        </li>
    </ul>
</div>
</body>
</html>
<script>
    groot.view("myview", function (vm, ve) {
        vm.list = [
            {"name": "张三", "sex": "男"}
            ,
            {"name": "李四", "sex": "男"}
            ,
            {"name": "王五", "sex": "男"}
        ];
        ve.mychange = function ($self, value) {
            groot.log("第" + $self.$index + "项在变化,新值为\"" + value + "\"");
        }
    })
</script>
