function block(element) {
    var list = [];
    var stack = [];
    var init = {
        has: true,
        arr: [],
        width: $(element).width(),
        left: 0,
        list: [{
            top: $(element).height(),
            bottom: 0,
            width: $(element).width(),
            left: 0
        }]
    }

    function creatBlock() {
        function add(intem, base) {
            var o = {};
            o.block = [{
                id: intem.id,
                bottom: intem.bottom,
                top: intem.top,
                width: base.width,
                left: base.left
            }]
            o.space = [];
            for (var i = 0; i < base.list.length; i++) {
                var _base = base.list[i];
                if (intem.bottom > _base.bottom) {
                    o.space.push({
                        bottom: _base.bottom,
                        top: intem.bottom,
                        width: _base.width,
                        left: _base.left
                    })
                }
                if (intem.top < _base.top) {
                    o.space.push({
                        bottom: intem.top,
                        top: _base.top,
                        width: _base.width,
                        left: _base.left
                    })
                }
            }
            o.space = o.space.concat(base.arr);
            stack.push(o);
            creatBlock()
        }

        if (list.length > 0) {
            var intem = list.pop();
            if (stack.length == 0) {
                add(intem, init);
            } else {
                function check() {
                    var space = stack[stack.length - 1].space;
                    var has = false;
                    var w = 0;
                    var _list = [];
                    for (var i = 0; i < space.length; i++) {
                        var _p = space[i];
                        if (_p.top >= intem.top && _p.bottom <= intem.bottom && _p.width > w) {
                            has = true;
                            _list.push({index: i, p: _p})
                        }
                    }
                    if (has) {
                        // 按left从小到大排序
                        var sortList = [];//排序后的列表
                        function sort() {
                            if (_list.length == 0)return;
                            var min = _list[0];
                            var index = 0;
                            for (var i = 0; i < _list.length; i++) {
                                if (_list[i].p.left < min.p.left) {
                                    min = _list[i];
                                    index = i;
                                }
                            }
                            _list.splice(index, 1);
                            sortList.push(min);
                            sort();
                        }

                        sort();
                        _list = sortList;//排序以后
                        _list
                        sortList = [];
                        var merg = [];//合并后
                        for (var i = 0; i < _list.length; i++) {
                            if (merg.length == 0) {
                                merg.push(_list[i]);
                                if (i == _list.length - 1) {
                                    sortList.push(merg);
                                    merg = [];
                                }
                            } else {
                                var p = merg[merg.length - 1].p;
                                if (p.left + p.width >= _list[i].p.left) {
                                    merg.push(_list[i]);
                                    if (i == _list.length - 1) {
                                        sortList.push(merg);
                                        merg = [];
                                    }
                                } else {
                                    sortList.push(merg);
                                    merg = [];
                                    merg.push(_list[i])
                                }
                            }
                        }
                        //合并求最大宽度
                        _list = sortList;//合并后
                        var w = 0;
                        var delMerg = [];
                        for (var i = 0; i < _list.length; i++) {
                            var _w = 0;
                            var l = _list[i];
                            var retList = [];
                            var delList = [];
                            for (var j = 0; j < l.length; j++) {
                                _w += l[j].p.width;
                                retList.push(l[j].p);
                                delList.push(l[j]);
                            }
                            if (_w > w) {
                                merg = retList;
                                delMerg = delList;
                                w = _w;
                            }
                        }
                        //组装返回数组
                        var _arr = $.extend(true, [], space);
                        for (var i = 0; i < delMerg.length; i++) {
                            delete  _arr[delMerg[i].index];
                        }
                        for (var i = _arr.length - 1; i >= 0; i--) {
                            if (_arr[i] === undefined) {
                                _arr.splice(i, 1);
                            }
                        }
                        return {
                            has: has,
                            arr: _arr,
                            width: w,
                            left: merg[0].left,
                            list: merg
                        }
                    } else {
                        return {
                            has: has
                        }
                    }
                }

                var _check = check();
                if (_check.has) {
                    add(intem, _check);
                } else {//回退的情况
                    function goback() {
                        var back = {
                            block: []
                        };
                        var _check;
                        if (stack.length > 0) {
                            back = stack.pop();
                        }
                        if (stack.length > 0) {
                            _check = check();
                        } else {
                            _check = init;
                        }
                        if (_check.has) {
                            //回退关键设计
                            /* bottom: intem.bottom,
                             top: intem.top,
                             width: base.width,
                             left: base.left*/
                            if (back.block.length > 0) {
                                var bwidth = 0;
                                for (var i = 0; i < back.block.length; i++) {
                                    bwidth += back.block[i].width;
                                }
                                if (Math.abs(bwidth - _check.width) >= 1) {
                                    for (var i = 0; i < back.block.length; i++) {
                                        list.push(back.block[i]);
                                    }
                                    add(intem, _check);
                                    return;
                                }
                            }
                            back.block.push(intem);
                            var _tempw = parseInt(_check.width / back.block.length);
                            for (var i = 0; i < back.block.length - 1; i++) {
                                back.block[i].width = _tempw;
                                back.block[i].left = back.block[i].width * i + _check.left;
                            }
                            back.block[back.block.length - 1].width = _check.width - (back.block.length - 1) * _tempw;
                            back.block[back.block.length - 1].left = _check.left + (back.block.length - 1) * _tempw;
                            //计算空格
                            //check.merge;back.block 整合计算
                            //生成全序纵轴
                            var xlist = $.extend(true, [], _check.list).concat(back.block);
                            var sortlist = [];

                            function sort() {
                                if (xlist.length == 0)return;
                                var min = xlist[0].left;
                                var index = 0;
                                for (var i = 0; i < xlist.length; i++) {
                                    if (xlist[i].left < min) {
                                        min = xlist[i].left;
                                        index = i;
                                    }
                                }
                                if (sortlist.length === 0) {
                                    sortlist.push(min);
                                } else {
                                    if (min > sortlist[sortlist.length - 1]) {
                                        sortlist.push(min);
                                    }
                                }
                                xlist.splice(index, 1);
                                if (xlist.length > 0) {
                                    sort();
                                }
                            }

                            sort();
                            sortlist.push(_check.width + _check.left)
                            //格子计算
                            xlist = sortlist;
                            var arr = [];
                            for (var i = 0; i < xlist.length - 1; i++) {
                                var left = xlist[i];
                                var width = xlist[i + 1] - left;
                                //计算顶部底部位置
                                var space;
                                var block;
                                for (var k = 0; k < _check.list.length; k++) {
                                    if (left >= _check.list[k].left && left < _check.list[k].left + _check.list[k].width) {
                                        space = _check.list[k];
                                        break;
                                    }
                                }
                                for (var k = 0; k < back.block.length; k++) {
                                    if (left >= back.block[k].left && left < back.block[k].left + back.block[k].width) {
                                        block = back.block[k];
                                        break;
                                    }
                                }
                                //计算顶部底部格子
                                if (space.bottom < block.bottom) {
                                    arr.push({
                                        bottom: space.bottom,
                                        top: block.bottom,
                                        width: width,
                                        left: left
                                    })
                                }
                                if (space.top > block.top) {
                                    arr.push({
                                        bottom: block.top,
                                        top: space.top,
                                        width: width,
                                        left: left
                                    })
                                }
                            }
                            back.space = _check.arr.concat(arr);
                            stack.push(back);
                            creatBlock()

                        } else {
                            for (var i = 0; i < back.block.length; i++) {
                                list.push(back.block[i]);
                            }
                            goback();
                        }
                    }

                    goback();
                }
            }
        }

    }

    return {
        render: function (data) {
            $(element).html("");
            list = data;
            creatBlock();
            for (var i = 0; i < stack.length; i++) {
                for (var j = 0; j < stack[i].block.length; j++) {
                    var block = stack[i].block[j]
                    var _div = $("<div>");
                    _div.css("left", block.left + "px");
                    _div.css("top", ($(element).height() - block.top) + "px");
                    _div.css("width", block.width + "px");
                    _div.height(block.top - block.bottom);
                    _div.attr("id", block.id);
                    _div.attr("title", "top:" + block.top + "--" + "bottom:" + block.bottom);
                    $(element).append(_div);
                }
            }
        }
    }
}
