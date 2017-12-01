var serverUrl = "123.57.46.160:8080";

function VPoint(x, y, floorIndex, color) {
    var type = "point";
    var dColor = color || "red";

    this.x = parseInt(x * 1000) / 1000;
    this.y = parseInt(y * 1000) / 1000;
    this.floorIndex = floorIndex;

    this.color = function() {
        return dColor;
    };
    this.type = function() {
        return type;
    }
}

function VPosition(left, top) {
    this.left = left;
    this.top = top;
}

function Vsize(width, height) {
    this.width = width;
    this.height = height;
}

function VPolyline(vpoints, lineWidth, lineColor, lineId) {
    var points = null;
    var floorIndex = null;
    var color = "rgba(138,43,226,0.5)";
    var width = 2;
    var type = "line";
    var id = null;
    if (vpoints === null) {
        return undefined;
    } else {
        points = vpoints;
        floorIndex = points[0].floorIndex;
    }
    if (lineWidth) {
        width = lineWidth;
    }
    if (lineColor) {
        color = lineColor;
    }
    if (lineId) {
        id = lineId;
    }
    this.type = function() {
        return type;
    };
    this.color = function() {
        return color;
    };
    this.points = function() {
        return points;
    };
    this.floorIndex = function() {
        return floorIndex;
    };
    this.width = function() {
        return width;
    }
}

function VCircle(vpoint, vradius, lineWidth, lineColor, lineId) {
    var point = null;
    var floorIndex = null;
    var color = "red";
    var width = 2;
    var type = "circle";
    var id = null;
    var radius = 0;
    if (vpoint === null) {
        return undefined;
    } else {
        point = vpoint;
    }
    if (lineWidth) {
        width = lineWidth;
    }
    if (lineColor) {
        color = lineColor;
    }
    if (lineId) {
        id = lineId;
    }
    if (vradius === null) {
        return undefined;
    } else {
        radius = vradius;
    }

    this.type = function() {
        return type;
    };
    this.color = function() {
        return color;
    };
    this.point = function() {
        return point;
    };
    this.floorIndex = function() {
        return point.floorIndex;
    };
    this.width = function() {
        return width;
    };
    this.radius = function() {
        return radius;
    }
}

//文字
function VText(vpoint, vcontent, vcolor, width) {
    var point = null;
    var color = "black";
    var type = "text";
    var content = "";
    var lineWidth = 1;
    if (vpoint === null) {
        return undefined;
    } else {
        point = vpoint;
    }
    if (vcolor !== null) {
        color = vcolor;
    }
    if (width !== null) {
        lineWidth = width;
    }
    if (vcontent === null || vcontent === "") {
        return undefined;
    } else {
        content = vcontent;
    }

    this.type = function() {
        return type;
    };
    this.color = function() {
        return color;
    };
    this.lineWidth = function() {
        return lineWidth;
    };
    this.point = function() {
        return point;
    };
    this.floorIndex = function() {
        return point.floorIndex;
    };
    this.content = function() {
        return content;
    }
}

//标记点
function VMarker(vpoint, id, offset) { //id可以传入1,2或者有效的图片url
    //默认偏移
    var defaultLeft = -26;
    var defaultTop = -50;
    //是否为隐藏
    var hidden = false;
    //类型
    var type = "marker";
    //位置
    var point = null;
    //链接
    var url = null;
    //是否有位置
    if (vpoint) {
        point = vpoint;
    } else {
        return undefined;
    }
    //构建dom
    var marker = document.createElement("div");
    marker.style.position = "absolute";
    var img = document.createElement("img");
    img.style.position = "absolute";
    marker.appendChild(img);
    //图片的位置
    if (id == 1) { //id=1代表普通标记点
        img.src = "./img/marker.png";
        url = "./img/marker.png";
    } else if (id == 2) { //id=2代表用户手指点击操作打上去的点
        img.src = "./img/tap.png";
        url = "./img/tap.png";
    } else {
        img.src = id;
        url = id;
    }

    //对齐图片的偏移量
    if (offset) {
        $(img).css({
            left: offset.left + 15 + "px",
            top: offset.top + 23 + "px",
            width: 23 + "px",
            height: 25 + "px",
            "z-index": 10,
            "text-align": "center"
        })
    } else {
        $(img).css({
            left: defaultLeft + 15 + "px",
            top: defaultTop + 23 + "px",
            width: 23 + "px",
            height: 25 + "px",
            "text-align": "center",
            "z-index": 10
        })
    }

    //方法
    //隐藏
    function hide(t) {
        if (t === null) {
            t = 0;
        }
        $(marker).hide(t, function() {
            hidden = true;
        })
    }
    //显示
    function show(t) {
        if (t === null) {
            t = 0;
        }
        $(marker).show(t, function() {
            hidden = false;
        })
    }

    function isHidden() {
        return hidden;
    }

    function getPosition() {
        return point;
    }

    function setPosition(p) {
        $(marker).css({
            left: p.left + "px",
            top: p.top + "px"
        });
        point = p;
    }

    function getImgUrl() {
        return url;
    }

    function setImgUrl(newUrl) {
        url = newUrl;
        img.src = url;
    }

    function getZIndex() {
        return $(marker).css("zIndex");
    }

    function setZIndex(zindex) {
        $(marker).css("zIndex", zindex);
    }

    function enableMarkerClick(mallId) {
        $(marker).on("click", function() {
            markerClickHandler(mallId);
        });
    }

    function unableMarkerClick() {
        $(marker).off("click");
    }

    function markerClickHandler(mallId) { //这里的ajax功能可以考虑动态传入的函数回调，实现点击后的不同效果
        //console.log(getPosition());
        var p = getPosition();
        var x = p.x,
            y = p.y,
            floor = p.floorIndex;
        var url = "http://" + serverUrl + "/beacon/position!pos2add?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&x=" + x + "&y=" + y + "&floor=" + floor + "&place=" + mallId + "&jsoncallback=?";
        $.getJSON(
            url,
            function(result) {
                if (!result.success) return;
                var data = result.rows[0];
                var name = data.unit_name;
                var parent_name = data.parent_name;
                alert("标记信息：" + name);
            }
        );
    }
    //函数指针指向
    this.show = show;
    this.hide = hide;
    this.isHidden = isHidden;
    this.getPosition = getPosition;
    this.setPosition = setPosition;
    this.getImgUrl = getImgUrl;
    this.setImgUrl = setImgUrl;
    this.getZIndex = getZIndex;
    this.setZIndex = setZIndex;
    this.dom = marker;
    this.enableMarkerClick = enableMarkerClick;
    this.unableMarkerClick = unableMarkerClick;

    this.type = function() {
        return type;
    };

    this.floorIndex = function() {
        return point.floorIndex;
    };
    this.point = function() {
        return point;
    };
    this.click = null;
}