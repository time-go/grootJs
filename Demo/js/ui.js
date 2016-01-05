/*通用弹出框*/
(function () {
    var $css3Transform = function (element, attribute, value) {
        var arrPriex = ["O", "Ms", "Moz", "Webkit", ""], length = arrPriex.length;
        for (var i = 0; i < length; i += 1) {
            element.css(arrPriex[i] + attribute, value);
        }
    }
    var game = {};
    game.zIndex = 12;//背景z-index
    game.stack = [];//弹出框 z-index栈
    game.stackPop = [];//弹出框对象
    game.showPop = function (element, callback, iClose) {
        if (window.parent !== window) {
            window.parent.groot.pop.showPop(element, callback, iClose);
            return;
        }
        var divgame = $("body");
        if (game.stack.length == 0) {
            divgame.append("<div id='pop-bg' class='pop-bg no-select'></div>");
            game.zIndex = 12;
            $("#pop-bg").css("zIndex", game.zIndex);
        } else {
            game.zIndex = game.stack[game.stack.length - 1] + 1;
            $("#pop-bg").css("zIndex", game.zIndex);
        }
        var pop = $("<div class='pop-container no-select'></div>");
        divgame.append(pop);
        var zPop = game.zIndex + 1;
        pop.css("zIndex", zPop);
        game.stack.push(zPop);
        game.stackPop.push(pop);
        element = $(element);
        pop.append(element);
        var move = element.find(".drag").css("cursor", "move");
        move.bind("mousedown", function (event) {
            var x0 = event.pageX;
            var y0 = event.pageY;
            var pop = $(this).parent().parent();
            var ex0 = pop.css("left").replace("px", "") * 1;
            var ey0 = pop.css("top").replace("px", "") * 1;
            move.bind("mousemove", function (e) {
                var x1 = e.pageX;
                var y1 = e.pageY;
                var mx = x1 - x0;
                var my = y1 - y0;
                var ex1 = ex0 + mx;
                var ey1 = ey0 + my;
                pop.css("left", ex1 + "px");
                pop.css("top", ey1 + "px");

            });
        });
        move.bind("mouseup", function () {
            move.unbind("mousemove");
        });
        move.bind("mouseleave", function () {
            move.unbind("mousemove");
        });
        if (typeof callback == "function") {
            if (callback(element[0], show) !== "wait") {
                show();
            }
            ;
        } else {
            show();
        }
        function show() {
            var w = pop.width();
            var h = pop.height();
            var wScreen = $(window).width();
            var hScreen = $(window).height();
            if (w > wScreen) {
                pop.width(wScreen);
                w = wScreen;
            }
            if (h > hScreen) {
                pop.height(hScreen);
                h = hScreen;
            }
            var x = (wScreen - w) / 2;
            var y = (hScreen - h) / 2;
            pop.css("left", x + "px");
            pop.css("top", y + "px");
            pop.removeClass("pop-container-animate");
            setTimeout(function () {
                pop.addClass("pop-container-animate");
                $css3Transform(pop, "Transform", "scale(1, 1)");
                $css3Transform(pop, "opacity", "1");
                setTimeout(function () {
                    pop.removeClass("pop-container-animate");
                    if (!((typeof iClose != "undefined") && iClose === false)) {
                        pop.addClass("iClose");
                    }
                    $("#pop-bg").unbind("click").bind("click", function () {
                        var element = game.stackPop[game.stackPop.length - 1];
                        if (element.hasClass("iClose")) {
                            game.closePop();
                        }
                    })

                }, 300);
            }, 30);
        }

    };
    game.closePop = function () {
        if (window.parent !== window) {
            window.parent.groot.pop.closePop();
            return;
        }
        var pop = game.stackPop.pop();
        game.stack.pop();
        if (game.stack.length == 0) {
            $("#pop-bg").remove();
            game.zIndex = 12;
        } else {
            game.zIndex = game.stack[game.stack.length - 1] - 1;
            $("#pop-bg").css("zIndex", game.zIndex);
        }
        pop.addClass("pop-container-animate");
        $css3Transform(pop, "opacity", "0");
        $css3Transform(pop, "Transform", "scale(0, 0)");
        setTimeout(function () {
            pop.remove();
        }, 300);
    }
    $(window).on("resize", function () {
        var pops = $(".pop-container");
        if (pops.length > 0) {
            pops.each(function () {
                var pop = $(this);
                var w = pop.width();
                var h = pop.height();
                var wScreen = $(window).width();
                var hScreen = $(window).height();
                var x = (wScreen - w) / 2;
                var y = (hScreen - h) / 2;
                pop.css("left", x + "px");
                pop.css("top", y + "px");
            });
        }
    });
    groot.pop = game;//弹出框通用组件

})()
    /*确认提示框*/
;
(function () {
    groot.confrim = function (title, info, callback) {
        var html = "";
        html += "<div class='dialog open'>";
        html += "<div class='dialog-head drag'>";
        html += "<span class='close' title='关闭'></span><strong>" + title + "</strong>";
        html += "</div>";
        html += "<div class='dialog-body'>" + info + "</div>";
        html += "<div class='dialog-foot'>";
        html += "<button class='button cancel dialog-close'>取消</button>";
        html += "<button class='button ok bg-sub margin-left'>确认</button>";
        html += "</div>";
        html += "</div>";
        groot.pop.showPop($(html), function (element) {
            if (window == window.parent) {
                $(element).width($(window).width() / 2);
            } else {
                $(element).width($(window.parent).width() / 2);
            }
            $(element).find(".ok").on("click", function () {
                groot.pop.closePop();
                if (typeof callback == "function") callback();
            });
            $(element).find(".cancel").on("click", function () {
                groot.pop.closePop();
            });
            $(element).find(".close").on("click", function () {
                groot.pop.closePop();
            });
        }, false);
    }
    groot.alert = function (text, type) {//success,fail,warning
        var id = new Date() - 1;
        var html = "<div id='" + id + "' class=\"alert alert-green\" style='position: fixed;z-index: 1;display: none'>";
        if (type === "success") {
            html = "<div class=\"alert alert-green\">";
        } else if (type === "warning") {
            html = "<div class=\"alert alert-yellow\">";
        } else if (type === "fail") {
            html = "<div class=\"alert alert-red\">";
        }
        html += " <strong > 提示：</strong>";
        html += text;
        html += "</div>";
        if (window === window.parent) {
            $("body").append(html);
            var ale = $("#" + id);
            ale.css("left", (($(window).width() - ale.width()) / 2) + "px");
            ale.fadeIn();
            setTimeout(function () {
                ale.fadeOut(function () {
                    $(this).remove();
                });
            }, 3000);
        } else {
            $("body", parent.document).append(html);
            var ale = $("#" + id, parent.document);
            ale.css("left", (($(window.parent).width() - ale.width()) / 2) + "px");
            ale.fadeIn();
            setTimeout(function () {
                ale.fadeOut(function () {
                    $(this).remove();
                });
            }, 3000);
        }

    }
    /*图片裁剪*/
    groot.imcrop = function (file, url, title, cropw, croph, callback) {

        var html = "";
        html += "<div class='dialog open no-select'>";
        html += "<div class='dialog-head drag'>";
        html += "<span class='close' title='关闭'></span><strong>" + title + "</strong>";
        html += "</div>";
        html += "<div class='dialog-body imcrop'>"
        html += "<div class='middle'>";
        html += "<div class='imgbig0'>";
        html += "<img ondragstart='return false;' draggable='false' class='img1'>";
        html += "<div class='imgbig0-bg'></div>";
        html += "<div ondragstart='return false;' draggable='false' class='img2'>";
        html += "<img ondragstart='return false;' draggable='false'>";
        html += "<div class='rightup'></div>";
        html += "</div>";
        html += "</div>";
        html += "<div class='imgcrop-bg'>";
        html += "<div ondragstart='return false;' draggable='false' class='img3'>";
        html += "<img ondragstart='return false;' draggable='false'>";
        html += "</div>";
        html += "</div>";
        html += "</div>";
        html += "</div>";
        html += "<div class='dialog-foot'>";
        html += "<button class='button cancel dialog-close'>取消</button>";
        html += "<button class='button ok bg-sub margin-left'>确认</button>";
        html += "</div>";
        html += "<div>";
        groot.pop.showPop($(html), function (element) {
            var reader = new FileReader();
            reader.onload = putImage2Canvas;
            reader.readAsDataURL(file);
            function putImage2Canvas(evnt) {
                var img = new Image();
                var src = evnt.target.result;
                img.src = src;
                img.onload = function () {
                    var scale = 1;
                    var scale0 = 1;
                    var w = img.width;
                    var h = img.height;
                    if ((w / h) > 1) {
                        if (w > 278) {
                            scale = 278 / w;
                        }
                    } else {
                        if (h > 278) {
                            scale = 278 / h;
                        }
                    }
                    w = w * scale;
                    h = h * scale;
                    var x = (278 - w) / 2;
                    var y = (278 - h) / 2;
                    var _scropw = cropw;
                    var _scroph = croph;
                    if ((_scropw / _scroph) > (w / h)) {
                        _scropw = w;
                        _scroph = (w / cropw) * croph;
                    } else {
                        _scroph = h;
                        _scropw = (h / croph) * cropw;
                    }
                    var k = _scropw;
                    var x2 = (278 - _scropw) / 2 - 1;
                    var y2 = (278 - _scroph) / 2 - 1;
                    var img1 = $(element).find(".img1");
                    var img2 = $(element).find(".img2");
                    var img3 = $(element).find(".img3");
                    img1.width(w).height(h).css("left", x + "px").css("top", y + "px").attr("src", src);
                    img2.width(_scropw).height(_scroph).css("left", x2 + "px").css("top", y2 + "px");
                    img2.find("img").width(w).height(h).css("left", (x - x2 - 1) + "px").css("top", (y - y2 - 1) + "px").attr("src", src);
                    img3.width(_scropw).height(_scroph).css("left", x2 + "px").css("top", y2 + "px");
                    img3.find("img").width(w).height(h).css("left", (x - x2 - 1) + "px").css("top", (y - y2 - 1) + "px").attr("src", src);
                    var _x2 = x2;
                    var _y2 = y2;
                    img2.bind("mousedown", function (event) {
                        var mx0 = event.pageX;
                        var my0 = event.pageY;
                        img2.bind("mousemove", function (e) {
                            var mx1 = e.pageX - mx0;
                            var my1 = e.pageY - my0;
                            if (mx1 > 0) {
                                if (mx1 + x2 + _scropw > x + w - 1) {
                                    _x2 = x + w - 1 - _scropw;

                                } else {
                                    _x2 = mx1 + x2;
                                }
                            } else {
                                if (mx1 + x2 < x - 1) {
                                    _x2 = x - 1;
                                } else {
                                    _x2 = mx1 + x2;
                                }
                            }
                            if (my1 > 0) {
                                if (my1 + y2 + _scroph > y + h - 1) {
                                    _y2 = y + h - 1 - _scroph;

                                } else {
                                    _y2 = my1 + y2;
                                }
                            } else {
                                if (my1 + y2 < y - 1) {
                                    _y2 = y - 1;
                                } else {
                                    _y2 = my1 + y2;
                                }
                            }
                            img2.css("left", _x2 + "px").css("top", _y2 + "px");
                            img2.find("img").css("left", (x - _x2 - 1) + "px").css("top", (y - _y2 - 1) + "px");
                            img3.find("img").css("left", (x - _x2 - 1) * scale0 + "px").css("top", (y - _y2 - 1) * scale0 + "px");
                        });
                    });
                    img2.bind("mouseleave", function () {
                        x2 = _x2;
                        y2 = _y2;
                        img2.unbind("mousemove");
                    });
                    img2.bind("mouseup", function () {
                        x2 = _x2;
                        y2 = _y2;
                        img2.unbind("mousemove");
                    });
                    var _scropw0 = _scropw, _scroph0 = _scroph;
                    var rightup = $(element).find(".rightup")
                    rightup.bind("mousedown", function (event) {
                        event.stopPropagation();
                        var mx0 = event.pageX;
                        $(element).bind("mousemove", function (e) {
                            var mx1 = e.pageX - mx0;
                            _scropw0 = mx1 + _scropw;
                            _scroph0 = (mx1 + _scropw) * (_scroph / _scropw);
                            if (_scropw0 + x2 > x + w - 1) {
                                _scropw0 = x + w - 1 - x2;
                                _scroph0 = _scropw0 * (_scroph / _scropw);
                            }
                            if (_scroph0 + y2 > y + h - 1) {
                                _scroph0 = y + h - 1 - y2;
                                _scropw0 = _scroph0 * (_scropw / _scroph);
                            }
                            if (_scropw0 < 50) {
                                _scropw0 = 50;
                                _scroph0 = _scropw0 * (_scroph / _scropw);
                            }
                            img2.width(_scropw0).height(_scroph0);
                            scale0 = k / _scropw0;
                            var imgtemp = img2.find("img");
                            img3.find("img").width(imgtemp.width() * scale0).height(imgtemp.height() * scale0);
                            var t = imgtemp.css("top").replace("px", "") * scale0;
                            var l = imgtemp.css("left").replace("px", "") * scale0;
                            img3.find("img").css("left", l + "px").css("top", t + "px");
                        });
                    });
                    $(element).bind("mouseup", function () {
                        _scropw = _scropw0;
                        _scroph = _scroph0;
                        $(element).unbind("mousemove");
                    });
                    $(element).find(".ok").bind("click", function () {
                        //scale
                        var x = -img2.find("img").css("left").replace("px", "") / scale;
                        var y = -img2.find("img").css("top").replace("px", "") / scale;
                        var w = img2.width() / scale;
                        var h = img2.height() / scale;
                        var canvas = $('<canvas width="' + cropw + '" height="' + croph + '"></canvas>')[0],
                            ctx = canvas.getContext('2d');

                        ctx.drawImage(img, x, y, w, h, 0, 0, cropw, croph);
                        var data = canvas.toDataURL().split(',')[1];
                        $.ajax({
                            "url": url,
                            "type": "post",
                            "data": {"base64Code": data},
                            timeout: 10000,
                            dataType: "json",
                            beforeSend: function () {
                                $(element).append("<div class='post'></div>");
                                $(element).append("<div class='ptext'>图片上传中..</div>")
                            },
                            success: function (u) {
                                imcrop.closePop();
                                if (typeof callback == "function") {
                                    callback(u);
                                }
                            },
                            error: function (xhr, status, err) {
                                $(element).find(".ptext").html("图片上传失败");
                                $(element).find(".ptext").css("color", "red")
                                setTimeout(function () {
                                    $(element).find(".ptext").remove();
                                    $(element).find(".post").remove();
                                }, 1500)
                            }
                        })
                    });
                    $(element).find(".cancel").bind("click", function () {
                        groot.pop.closePop();
                    });
                }
            }

            $(element).find(".close").on("click", function () {
                groot.pop.closePop();
            });
        }, false)
    }
    var popid = (function () {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        return theRequest["popid"];
    })()
    groot.msg = {};
    groot.msg.send = function (result) {
        try {
            if (window.parent !== window) {
                window.parent[popid].callback(result);
            } else {
                window[popid].callback(result);
            }
        } catch (e) {
            console.log("不是弹窗打开")
        }
    }
    groot.msg.close = function () {
        try {
            if (window.parent !== window) {
                delete window.parent[popid];
                window.parent.groot.pop.closePop();
            } else {
                delete window[popid];
                window.groot.pop.closePop();
            }
        } catch (e) {
            console.log("不是弹窗打开")
        }
    }
    groot.msg.render = function () {
        try {
            if (window.parent !== window) {
                window.parent[popid].render();
            } else {
                window[popid].render();
            }
        } catch (e) {
            console.log("不是弹窗打开")
        }
    }
    groot.msg.show = function () {
        try {
            if (window.parent !== window) {
                window.parent[popid].show();
            } else {
                window[popid].show();
            }
        } catch (e) {
            console.log("不是弹窗打开")
        }
    }
    groot.page = function (title, url, rev) {
        var html = "";
        var mid = new Date() - 1;
        html += "<div class='dialog open'>";
        html += "<div class='dialog-head drag'>";
        html += "<span class='close' title='关闭'></span><strong>" + title + "</strong>";
        html += "</div>";
        html += "<div class='dialog-body' style='padding: 0'>";
        if (url.indexOf("?") > -1) {
            url = url + "&popid=" + mid;
        } else {
            url = url + "?popid=" + mid;
        }
        html += "<iframe src='" + url + "'></iframe>";
        html += "</div>";
        html += "</div>";
        var draw;
        if (window.parent !== window) {
            window.parent[mid] = {};
            if (rev !== undefined && typeof rev === "function") {
                window.parent[mid].callback = function (result) {
                    rev(result);
                }
            }
            window.parent[mid].render = function () {
                drawRender();
            }
        } else {
            window[mid] = {};
            if (rev !== undefined && typeof rev === "function") {
                window[mid].callback = function (result) {
                    rev(result);
                }
            }
            window[mid].render = function (callback) {
                drawRender(callback);
            }
        }
        function drawRender(show) {
            if (draw !== undefined) {
                var wScreen = $(window).width() - 20;
                var hScreen = $(window).height() - 100;
                var inframeW = draw.contentDocument.body.scrollWidth + 20;
                var iframeH = draw.contentDocument.body.scrollHeight;
                if (inframeW > wScreen)inframeW = wScreen;
                if (iframeH > hScreen)iframeH = hScreen;
                $(draw).width(inframeW);
                $(draw).height(iframeH);
                //$(draw).parents(".open").height(iframeH);
                var pops = $(".pop-container");
                if (pops.length > 0) {
                    pops.each(function () {
                        var pop = $(this);
                        var w = pop.width();
                        var h = pop.height();
                        var wScreen = $(window).width();
                        var hScreen = $(window).height();
                        var x = (wScreen - w) / 2;
                        var y = (hScreen - h) / 2;
                        pop.css("left", x + "px");
                        pop.css("top", y + "px");
                    });
                }
                if (show && typeof show === "function") {
                    show();
                }
            } else {
                setTimeout(function () {
                    drawRender();
                }, 10)
            }
        }

        groot.pop.showPop($(html), function (element, callback) {
            if (window[mid] !== undefined || window.parent[mid] !== undefined) {
                $(element).parent().attr("popmid", mid);
            }
            if (window.parent !== window) {
                window.parent[mid].show = function () {
                    callback();
                }
            } else {
                window[mid].show = function () {
                    callback();
                }
            }
            $(element).find("iframe").on("load", function () {
                draw = this;
                $(this.contentDocument.body).find(".element-remove").remove();
            })
            $(element).find(".close").click(groot.pop.closePop);
            return "wait"
        }, false);
    }
})();
/*日历组件*/
(function () {
    groot.widget["calendar"] = function (element, id, data, value, upParent) {
        var _html = ["<div class=\"input-group\">",
            "    <input gt-value=\"widgetvalue\" type=\"text\" readonly class=\"input input-auto\" size=\"30\"/>",
            "    <span class=\"addon icon-calendar\"></span>",
            "</div>",
            "<div class=\"dialog open\">",
            "    <div class=\"line\">",
            "        <span gt-click=\"prv\" class=\"x2 icon-arrow-left text-center\"></span>",
            "        <strong class=\"x8 text-center mouth\"></strong>",
            "        <span gt-click=\"next\" class=\"x2 icon-arrow-right text-center\"></span>",
            "    </div>",
            "    <div class=\"line weeks padding-top\">",
            "        <span>日</span>",
            "        <span>一</span>",
            "        <span>二</span>",
            "        <span>三</span>",
            "        <span>四</span>",
            "        <span>五</span>",
            "        <span>六</span>",
            "    </div>",
            "    <div class=\"line days\">",
            "        <span></span>",
            "    </div>",
            "    <div class=\"line padding-bottom timer\">",
            "        时间:",
            "        <select class=\"hh\">",
            "            <option value=\"00\">00</option>",
            "            <option value=\"01\">01</option>",
            "            <option value=\"02\">02</option>",
            "            <option value=\"03\">03</option>",
            "            <option value=\"04\">04</option>",
            "            <option value=\"05\">05</option>",
            "            <option value=\"06\">06</option>",
            "            <option value=\"07\">07</option>",
            "            <option value=\"08\">08</option>",
            "            <option value=\"09\">09</option>",
            "            <option value=\"10\">10</option>",
            "            <option value=\"11\">11</option>",
            "            <option value=\"12\">12</option>",
            "            <option value=\"13\">13</option>",
            "            <option value=\"14\">14</option>",
            "            <option value=\"15\">15</option>",
            "            <option value=\"16\">16</option>",
            "            <option value=\"17\">17</option>",
            "            <option value=\"18\">18</option>",
            "            <option value=\"19\">19</option>",
            "            <option value=\"20\">20</option>",
            "            <option value=\"21\">21</option>",
            "            <option value=\"22\">22</option>",
            "            <option value=\"23\">23</option>",
            "        </select>",
            "        :",
            "        <select class=\"mm\">",
            "            <option value=\"00\">00</option>",
            "            <option value=\"01\">01</option>",
            "            <option value=\"02\">02</option>",
            "            <option value=\"03\">03</option>",
            "            <option value=\"04\">04</option>",
            "            <option value=\"05\">05</option>",
            "            <option value=\"06\">06</option>",
            "            <option value=\"07\">07</option>",
            "            <option value=\"08\">08</option>",
            "            <option value=\"09\">09</option>",
            "            <option value=\"10\">10</option>",
            "            <option value=\"11\">11</option>",
            "            <option value=\"12\">12</option>",
            "            <option value=\"13\">13</option>",
            "            <option value=\"14\">14</option>",
            "            <option value=\"15\">15</option>",
            "            <option value=\"16\">16</option>",
            "            <option value=\"18\">18</option>",
            "            <option value=\"19\">19</option>",
            "            <option value=\"20\">20</option>",
            "            <option value=\"21\">21</option>",
            "            <option value=\"22\">22</option>",
            "            <option value=\"23\">23</option>",
            "            <option value=\"24\">24</option>",
            "            <option value=\"25\">25</option>",
            "            <option value=\"26\">26</option>",
            "            <option value=\"27\">27</option>",
            "            <option value=\"28\">28</option>",
            "            <option value=\"29\">29</option>",
            "            <option value=\"30\">30</option>",
            "            <option value=\"31\">31</option>",
            "            <option value=\"32\">32</option>",
            "            <option value=\"33\">33</option>",
            "            <option value=\"34\">34</option>",
            "            <option value=\"35\">35</option>",
            "            <option value=\"36\">36</option>",
            "            <option value=\"37\">37</option>",
            "            <option value=\"38\">38</option>",
            "            <option value=\"39\">39</option>",
            "            <option value=\"40\">40</option>",
            "            <option value=\"41\">41</option>",
            "            <option value=\"42\">42</option>",
            "            <option value=\"43\">43</option>",
            "            <option value=\"44\">44</option>",
            "            <option value=\"45\">45</option>",
            "            <option value=\"46\">46</option>",
            "            <option value=\"47\">47</option>",
            "            <option value=\"48\">48</option>",
            "            <option value=\"49\">49</option>",
            "            <option value=\"50\">50</option>",
            "            <option value=\"51\">51</option>",
            "            <option value=\"52\">52</option>",
            "            <option value=\"53\">53</option>",
            "            <option value=\"54\">54</option>",
            "            <option value=\"55\">55</option>",
            "            <option value=\"56\">56</option>",
            "            <option value=\"57\">57</option>",
            "            <option value=\"58\">58</option>",
            "            <option value=\"59\">59</option>",
            "        </select>",
            "    </div>",
            "    <div class=\"line btns\">",
            "        <span class=\"button button-small bg-sub float-right submit\">确定</span>",
            "        <span class=\"button button-small bg-blue-light float-right today\">今天</span>",
            "        <span class=\"button button-small float-right cancel\">取消</span>",
            "    </div>",
            "</div>"].join("");

        var timer = false;
        if (data !== null) {
            timer = data.timer;
        }
        groot.createElement(_html, id, element);

        var hh = $(element).find(".hh");
        var mm = $(element).find(".mm");
        var days = $(element).find(".days");
        var dialog = $(element).find(".dialog");
        var month = $(element).find(".mouth");
        var timershow = $(element).find(".timer");
        if (timer) {
            timershow.show();
        } else {
            timershow.hide();
        }
        $(element).find("input").attr("placeholder", data.title);
        var calendar = {
            curDate: value === "" ? new Date() : new Date(Date.parse(value)),//当前的date对象
            secDate: value === "" ? new Date() : new Date(Date.parse(value)),//当前的date对象
            // 增加月 可以是负数
            addMouth: function (n) {
                this.curDate.setMonth((this.curDate.getMonth() + n));
            },
            //获取当前月是星期几
            getWeek: function () {
                return new Date(this.curDate.getFullYear(), this.curDate.getMonth(), 1).getDay();
            },
            //获取当前月最大天数
            getMaxDays: function () {
                return new Date(this.curDate.getFullYear(), this.curDate.getMonth() + 1, 0).getDate();
            },
            render: function () {
                var week = this.getWeek();
                var maxDay = this.getMaxDays();
                var start = week === 0 ? 7 : week;
                var end = start + maxDay;
                var _html = "";
                for (var i = 0; i < 42; i++) {
                    var myd = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), (i - start + 1));
                    var day = myd.getDate();
                    if (i >= start && i < end) {
                        if (day === this.secDate.getDate() && myd.getFullYear() === this.secDate.getFullYear() && myd.getMonth() === this.secDate.getMonth()) {
                            _html += "<span class='other active' data-value='" + myd.getTime() + "'>" + day + "</span>";
                        } else {
                            _html += "<span class='other' data-value='" + myd.getTime() + "'>" + day + "</span>";
                        }
                    } else {
                        _html += "<span class='nomonth' data-value='" + myd.getTime() + "'>" + day + "</span>";
                    }
                }
                days.html(_html);
                month.html(this.curDate.getFullYear() + "年" + (this.curDate.getMonth() + 1) + "月");
            }
        }
        var moudle = groot.view(id, function (vm, ve) {
            var date;
            if (value === "") {
                vm.widgetvalue = "";
                date = new Date();
            } else {
                date = new Date(Date.parse(value));
                if (timer) {
                    vm.widgetvalue = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + vm.hh + ":" + vm.mm;
                } else {
                    vm.widgetvalue = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                }
            }
            ;
            hh.val(date.getHours() >= 10 ? date.getHours() + "" : "0" + date.getHours());
            mm.val(date.getMinutes() >= 10 ? date.getMinutes() + "" : "0" + date.getMinutes());
            calendar.curDate = new Date(date.getTime());//当前的date对象
            calendar.secDate = new Date(date.getTime());//当前的date对象

        });

        function dclick(e) {
            dialog.fadeOut("fast");
            $(document).off("click", dclick);
        }

        $(element).find(".input-group").on("click", function (e) {
            e.stopPropagation();
            if (dialog.is(":hidden")) {
                var date;
                if (moudle.widgetvalue === "") {
                    date = new Date();
                } else {
                    date = new Date(Date.parse(moudle.widgetvalue));
                }
                calendar.curDate = new Date(date.getTime());//当前的date对象
                calendar.secDate = new Date(date.getTime());//当前的date对象
                hh.val(date.getHours() >= 10 ? date.getHours() + "" : "0" + date.getHours());
                mm.val(date.getMinutes() >= 10 ? date.getMinutes() + "" : "0" + date.getMinutes());
                calendar.render();
                dialog.fadeIn("fast");
            } else {
                dialog.fadeOut("fast");
            }
            $(document).on("click", dclick);
        });

        $(element).find(".icon-arrow-left").on("click", function (e) {
            e.stopPropagation();
            calendar.addMouth(-1);
            calendar.render();
        });
        $(element).find(".icon-arrow-right").on("click", function (e) {
            e.stopPropagation();
            calendar.addMouth(1);
            calendar.render();
        });
        $(element).find(".days").on("click", "span", function (e) {
            e.stopPropagation();
            var d = new Date($(this).attr("data-value") * 1);
            calendar.secDate = d;
            days.find("span").removeClass("active")
            $(this).addClass("active");
        });
        $(element).find(".submit").on("click", function (e) {
            e.stopPropagation();
            if (timer) {
                moudle.widgetvalue = calendar.secDate.getFullYear() + "-" + (calendar.secDate.getMonth() + 1) + "-" + calendar.secDate.getDate() + " " + hh.val() + ":" + mm.val();
            } else {
                moudle.widgetvalue = calendar.secDate.getFullYear() + "-" + (calendar.secDate.getMonth() + 1) + "-" + calendar.secDate.getDate();
            }
            moudle.widgetvalueRender();
            upParent();
            dialog.fadeOut();
        });
        $(element).find(".today").on("click", function (e) {
            e.stopPropagation();
            var d = new Date();
            moudle.widgetvalue = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            if (timer) {
                moudle.widgetvalue = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + hh.val() + ":" + mm.val();
            } else {
                moudle.widgetvalue = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            }
            moudle.widgetvalueRender();
            upParent();
            dialog.fadeOut("fast");
        });
        $(element).find(".cancel").on("click", function (e) {
            e.stopPropagation();
            dialog.fadeOut("fast")

        });
        $(element).find(".dialog").on("click", function (e) {
            e.stopPropagation();

        })
    }
})()
;
/*分页组件*/
(function () {
    groot.paging = function (element, callback) {
        var _html = ["<ul class=\"pagination pagination-group pages\">",
            "</ul>"].join("");
        $(element).html(_html);
        return function (curPage, totalPage) {
            var list = getPages(curPage, totalPage);
            var page = [];
            if (curPage === 1) {
                page.push("<li class=\"firsPage disabled\">");
            } else {
                page.push("<li class=\"firsPage\" page=\"1\">");
            }
            page.push("<a>«</a>");
            page.push("</li>");
            for (var i = 0; i < list.length; i++) {
                if (list[i] === "..") {
                    page.push("<li class=\"disabled\">");
                } else if (list[i] === curPage) {
                    page.push("<li class=\"active\">");
                } else {
                    page.push("<li page=\"" + list[i] + "\">");
                }
                page.push("<a>" + list[i] + "</a>");
                page.push("</li>");
            }
            if (curPage == totalPage) {
                page.push("<li class=\"lastPage disabled\">");
            } else {
                page.push("<li class=\"lastPage\" page=\"" + totalPage + "\">");
            }
            page.push("<a>»</a>");
            page.push("</li>");
            $(element).find("ul").html(page.join(""));
            $(element).find("li[page]").on("click", function () {
                callback($(this).attr("page") * 1);
            })
        }
    }
    function getPages(p, totalPages) {
        var list = [];
        for (var i = 1; i < totalPages + 1; i++) {
            list.push(i)
        }
        if (totalPages - p > 4) {
            list = list.splice(0, p + 4);
            list.push("..");
        }
        if (p > 5) {
            list.splice(0, p - 5);
            list.unshift("..");
        }
        return list;
    }
})()
;
(function () {
    function isTel(str) {
        var reg = /^([0-9]|[\-])+$/g;
        if (str.length18) {
            return false;
        }
        else {
            return reg.exec(str);
        }
    }

    function isEmail(str) {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return reg.test(str);
    }

    function isMobile(mobile) {
        if (mobile.length == 0) {
            return false;
        }
        if (mobile.length != 11) {
            return false;
        }

        var myreg = /^(1\d{10})$/;
        if (!myreg.test(mobile)) {
            return false;
        }
    }

    function isIdCardNo(num) {
        num = num.toUpperCase();
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
            return false;
        } else {
            return false;
        }
    }

    groot.validation = {
        isTel: isTel,
        isEmail: isEmail,
        isMobile: isMobile,
        isIdCardNo: isIdCardNo,
        validate: function (element) {
            function v(doc) {
                var _name = $(doc).addClass("error").attr("validate-name");
                $("[error-name='" + _name + "']").show();
            }

            function vr(doc) {
                var _name = $(doc).removeClass("error").attr("validate-name");
                $("[error-name='" + _name + "']").hide();
            }

            $(element).find("input,textarea").on("input propertychange", function () {
                if ($(this).attr("validate") != undefined) {
                    var _v = $.parseJSON($(this).attr("validate"));
                    var _exp = _v.exp;
                    if (_exp === "tel") {
                        if (!isTel($(this).val())) {
                            if ($.trim($(this).val()) !== "") {
                                v(this);
                            } else {

                            }
                        }
                    } else if (_exp === "email") {
                        if (!isEmail($(this).val())) {
                            if ($.trim($(this).val()) !== "") {
                                v(this);
                            } else {

                            }
                        }
                    } else if (_exp === "mobile") {
                        if (!isMobile($(this).val())) {
                            if ($.trim($(this).val()) !== "") {
                                v(this, _tip);
                            } else {

                            }
                        }
                    }
                    else if (_exp === "card") {
                        if (!isIdCardNo($(this).val())) {
                            if ($.trim($(this).val()) !== "") {
                                v(this);
                            } else {

                            }
                        }
                    }
                }
            })
            return function () {
                var ele;

                function v(doc) {
                    var _name = $(doc).addClass("error").attr("validate-name");
                    $("[error-name='" + _name + "']").show();
                }

                $(element).find("input,textarea").each(function () {
                    if (ele != null) {
                        if ($(this).attr("validate") != undefined) {
                            var _v = $.parseJSON($(this).attr("validate"));
                            var _exp = _v.exp;
                            var _emp = _v.empt;
                            if (_exp === "tel") {
                                if (!isTel($(this).val())) {
                                    if (!($.trim($(this).val()) === "" && _emp === false)) {
                                        ele = this;
                                        v(this);
                                    }
                                }
                            } else if (_exp === "email") {
                                if (!isEmail($(this).val())) {
                                    if (!($.trim($(this).val()) === "" && _emp === false)) {
                                        ele = this;
                                        v(this);
                                    }
                                }
                            } else if (_exp === "mobile") {
                                if (!isMobile($(this).val())) {
                                    if (!($.trim($(this).val()) === "" && _emp === false)) {
                                        ele = this;
                                        v(this);
                                    }
                                }
                            }
                            else if (_exp === "card") {
                                if (!isIdCardNo($(this).val())) {
                                    if (!($.trim($(this).val()) === "" && _emp === false)) {
                                        ele = this;
                                        v(this);
                                    }
                                }
                            }
                        }
                    }
                })
                if (ele !== null) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
})
()