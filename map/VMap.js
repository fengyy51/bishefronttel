/*dom, mallId, floorId为必填参数；
options为选填，目前支持可配置项：
    movex:加载地图时中心点x坐标
    movey:加载地图时中心点y坐标
    fontColor:地图文字颜色
    publicColor:公共设施颜色
    fontSize:商铺字体初始尺寸
    publicSize: 公共设施初始尺寸大小
*/

function Vmap(dom, mallId, floorId, options) {
  if (!dom || !mallId || !floorId ||
    Object.prototype.toString.call(mallId) !== "[object String]" ||  //精准判断对象类型，mallID和floorID必须全是string类型才可以
    Object.prototype.toString.call(floorId) !== "[object String]") {
    alert("初始化地图构造器参数错误");
    return;
  }
 /*
   * 因为将地图数据缓存到用户的localStorage内，如果地图数据更新后地图数据也需要对应进行更新
   * 设置一个一天的cookie,用户只调用一次来获取是否有更新
   * 实际上每天用户第一次进入系统都需要重新加载地图资源
   * */
  if(getCookie("isUpdate")!=null){
      console.log("cookie未过期,cookie:"+getCookie("isUpdate"));
      if(getCookie("isUpdate")=="true"){
        setCookie("isUpdate","false",0.5);
      }
  }else{
      console.log("cookie已过期,cookie:"+getCookie("isUpdate"));
      setCookie("isUpdate","true",0.5);
  }
  function getCookie(name) {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
  }
  //设置cookie
  function setCookie(c_name, n_value, expiredays){
      var exdate = new Date();
      exdate.setTime(exdate.getTime() + expiredays*24*60*60*1000);
      document.cookie = c_name + "=" + escape(n_value)+ ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
  }

  //dom属性
  var dom = dom;
  //信息属性
  //商场ID
  var mallId = mallId;
  //商场名字
  var mallName = null;
  //当前的楼层ID
  var currentFloorId = null;
  var serverUrl = "123.57.46.160:8080";
  //地图数据数据是否已经读取
  var isDataLoaded = false;
  //地图图片是否加载完成
  var isPicLoaded = false;
  //地图能否被更换
  var changeAble = true;
  //地图是否读取完成
  var isLoaded = false;
  //字体是否能被显示
  var isFontHide = false;
  //楼层信息
  var floor = [];
  //地图坐标转换 转换公式 当前地图上的位置 = 真实位置(数据服务器返回的位置)*rate/currentScale*zoomScale
  //rate = dpi*1000/25.4            svg dpi为96
  var rate = 150 * 1000 / 25.4;
  //当前地图的scale值（通过all_in_one接口获得，每张图的这个scale值是固定的）
  var currentScale = null;
  var publicSize = (options&&options.publicSize)?options.publicSize:25; //公共设施大小
  var fontSize = (options&&options.fontSize)?options.fontSize:15;//商铺字体的大小
  var OriginFontSize = (options&&options.fontSize)?options.fontSize:15;//保存商铺字体的原始大小
  var publicColor = "#372F2C"; //公共设施的颜色

  var START_X = 0;
  var START_Y = 0;

  var midX = 0;
  var midY = 0;

  var clientmidx = document.documentElement.clientWidth / 2;
  var clientmidy = document.documentElement.clientHeight / 2;

  var ticking = false;
  var transform;
  var eventflag = false;
  var bindFlag = false;

  var isScaleCtrlShow = false; //比例尺显示状态
  var moveMapWithTap = false; //地图显示中心位置是否随点击移动

  var initScale = 1;
  var initAngle = 0;
  var finalAngle = 0;
  var deviceAlpha = 0;

  //当前的缩放等级
  var zoomScale = 1;
  //每次缩放增数
  var defaultDeltaScale = 0.03;
  //默认最小缩放等级
  var defaultMinScale = 0.5;
  //默认最大缩放等级
  var defaultMaxScale = 1.6;
  //公共设施的点
  var publicPlace = []; //---->存公共设施，里面每个对象的font属性为$，#，%...
  var unitFont = [];
  //当前的公共设施显示类型
  var currentPublicType = null;

  //覆盖物
  //点标记
  var markers = [];
  //线标
  var lines = [];
  var lineColor,lineWidth;
  //圆
  var circles = [];
  //文字
  var texts = [];
  var puclicArr=[];

  //保存this指针
  var This = this;

  //重置dom的style
  dom.style.position = "absolute";

  //创建自己的div
  var floorDiv = document.createElement("div");
  floorDiv.style.position = "absolute";
  floorDiv.id = "floorDiv";
  floorDiv.style.left = 0;
  floorDiv.style.top = 0;

  //创建自己的canvas
  var floorCanvas = document.createElement("canvas");
  floorCanvas.style.position = "absolute";
  floorCanvas.style.left = "0";
  floorCanvas.style.top = "0";
  floorCanvas.id = "floorCanvas";
//在这个div里面画地图
  dom.appendChild(floorDiv);
  floorDiv.appendChild(floorCanvas);


  //地图比例尺
  var map_scaleCtrl = document.createElement("div");
  var map_scaleTxt = document.createElement("div");
  map_scaleCtrl.style.position = "absolute";
  map_scaleCtrl.style.bottom = "10px";
  map_scaleCtrl.style.left = "10px";
  map_scaleCtrl.style.zIndex = "10";
  map_scaleCtrl.style.top = "auto";
  map_scaleCtrl.style.right = "auto";
  map_scaleCtrl.style.width = "100px";
  map_scaleCtrl.style.height = "4px";
  map_scaleCtrl.style.textAlign = "center";
  map_scaleCtrl.style.lineHeight = "18px";
  map_scaleCtrl.style.borderBottom = "3px solid black";
  map_scaleCtrl.style.borderLeft = "4px solid black";
  map_scaleCtrl.style.borderRight = "4px solid black";
  map_scaleTxt.style.position = "absolute";
  map_scaleTxt.style.bottom = "5px";
  map_scaleTxt.style.width = "100%";
  map_scaleCtrl.appendChild(map_scaleTxt);


  //获得context对象
  var context = floorCanvas.getContext("2d");
  //开始画图
  var floorImg = new Image();
  floorImg.onload = draw;
  changeBuild(mallId, floorId);

  function draw(event, type, color, normalSize) {
    drawMap(zoomScale); //--->画图片      
    if (!isFontHide) {
      if (options && options.publicColor) drawFont(null, options.publicColor);
      else drawFont(); //----->画公共设施
      if (options && options.fontColor) drawUnitFont(zoomScale, options.fontColor);
      else drawUnitFont(zoomScale); //--->写商铺文字
    }
    if (!bindFlag) {
      if (options && options.movex && options.movey) {
        var delta = rate / currentScale * zoomScale;
        options.movex *= delta;
        options.movey *= delta;
        START_X = clientmidx - options.movex;
        START_Y = clientmidy - options.movey;
      }
      bindEvent(); //绑定手势操作
      bindFlag = true;
    }
    refreshOverLay(zoomScale);
    isPicLoaded = true;
  }

  //写商铺文字
  function drawUnitFont(scaleNum, color) {
    context.font = "400 "+fontSize+"px Microsoft YaHei,Arial,Helvetica,'黑体'";
    context.textAlign = "left";
    context.textBaseline = "top";
    if (color !== null && color !== "") context.fillStyle = color;
    else context.fillStyle = "#3E3030";
    var fontX = null;
    var fontY = null;
    zoomUnitFont();
    selectFonts();
    for (var i in unitFont) {
      var random=Math.random();
      if (unitFont[i].show == "1"&&(random-0.2)>0.0&&unitFont[i].name!="空铺") {
        fontX = unitFont[i].coord_x * rate / currentScale * scaleNum;
        fontY = unitFont[i].coord_y * rate / currentScale * scaleNum;

        context.save();
        context.translate(fontX, fontY);
        context.rotate(-Math.PI * 1 / 180 * finalAngle);

        context.fillText(unitFont[i].name, -unitFont[i].length / 2, -15);
        context.restore();
      }
    }
  }

   //画公共设施
  function drawFont(type, color, normalSize, scaleNum) {
    var scale = scaleNum || zoomScale;
    var fColor = publicColor;
    var size = publicSize;
    if (type) {
      currentPublicType = type;
    }
    if (currentPublicType === null) {
      currentPublicType = "all";
    }
    if (currentPublicType === "none") {
      return;
    }
    if (!!color) {
      fColor = color;
    }
    if (!!normalSize) {
      size = normalSize;
    }

	//如果要开启公共设施图标随手势缩放显隐，则打开下面两句注释，并在后面的for循环的if判断条件加一句publicPlace[i].show==1

    //开启公共设施随手势操作显隐
    zoomPublicPlace();
    selectPublicPlace();

    size = size * zoomScale;
    context.font = size + "px VMapPublic";
    context.textBaseline = "top";
    context.lineWidth = 0.2;
    context.fillStyle = fColor;
    context.strokeStyle = fColor;
    for (var i in publicPlace) {
      if (((currentPublicType === "all") || (currentPublicType === publicPlace[i].unit_type_eng)) &&
        (publicPlace[i].floor_id === currentFloorId) && publicPlace[i].show==1) {

        context.fillText(publicPlace[i].font,
          publicPlace[i].coord_x * rate / currentScale * scale - context.measureText(publicPlace[i].font).width / 2 - 1,
          publicPlace[i].coord_y * rate / currentScale * scale - context.measureText(publicPlace[i].font).width / 2 - 1);
        context.strokeText(publicPlace[i].font,
          publicPlace[i].coord_x * rate / currentScale * scale - context.measureText(publicPlace[i].font).width / 2 - 1,
          publicPlace[i].coord_y * rate / currentScale * scale - context.measureText(publicPlace[i].font).width / 2 - 1);
      }
    }
  }
  //绘制地图
  function drawMap(zoom) {
    context.clearRect(0, 0, floorCanvas.width, floorCanvas.height);
    floorCanvas.width = floorImg.width * zoom;
    floorCanvas.height = floorImg.height * zoom;
    //为了让文本更清晰，将2像素的渲染改成1像素的渲染
   // floorCanvas.style.width=floorCanvas.width/2+'px';
   // floorCanvas.style.height=floorCanvas.height/2+'px';

    floorDiv.style.width = floorCanvas.width + 'px';
    floorDiv.style.height = floorCanvas.height + 'px';

    dom.style.height = floorCanvas.height + 'px';
    dom.style.width = floorCanvas.width + 'px';

    midX = floorCanvas.width / 2;
    midY = floorCanvas.height / 2;
    
    context.drawImage(floorImg, 0, 0, floorImg.width * zoom, floorImg.height * zoom);
      
   /* var a = Math.PI / 180 * (finalAngle||0);
    var x = (document.getElementById("map").style.width/2- START_X - midX) * Math.cos(a) + (document.getElementById("map").style.height/2 - START_Y + getScrollTop() - midY) * Math.sin(a) + midX;
    var y = (document.getElementById("map").style.height/2 - START_Y + getScrollTop() - midY) * Math.cos(a) - (document.getElementById("map").style.width/2 - START_X - midX) * Math.sin(a) + midY;
    var tranformOrigin=Math.floor((x/floorCanvas.width)*100)+"% "+Math.floor((y/floorCanvas.height)*100)+"%";
    floorDiv.style.transformOrigin=tranformOrigin;
    alert(x+","+y+floorDiv.style.transformOrigin);*/
  }
  //切换楼层
  function changeFloor(floorId){
    zoomScale = 1;
    if(window.localStorage.getItem(floorId+"unitFont")!=null&&getCookie("isUpdate")=="false"){
      unitFont=JSON.parse(window.localStorage.getItem(floorId+"unitFont"));
    }else{
      getUnitFont(mallId, floorId, null);
    }
    if (changeAble === false) {
      return false;
    }
    changeAble = false;
    if (floorId === null) {
      return false;
    }
    if (typeof floorId === "number") {
      floorId = floor[floorId].floor_id;
    }
    isPicLoaded = false;
    if(window.localStorage.getItem(floorId)!=null&&getCookie("isUpdate")=="false"){
        for (var i = 0; i < floor.length; i++) {
          if (floor[i].floor_id == floorId) {
            currentScale = floor[i].scale;
            break;
          }
        }
        currentFloorId = floorId;
        floorImg.src = window.localStorage.getItem(floorId);
        changeAble = true;
        if (This.onFloorChange != null) {
          This.onFloorChange();
        }
        isLoaded = true;
    }else{
      console.log(floorId+" "+getCookie("isUpdate"));
      var imgUrl = "";
      imgUrl = "http://" + serverUrl + "/beacon/test!jsonPng?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&place=" + mallId + "&floor=" + floorId + "&jsoncallback=?";
      $.getJSON(imgUrl,
          function(result) {
            if (true === result.success) {
              for (var i = 0; i < floor.length; i++) {
                if (floor[i].floor_id == floorId) {
                  currentScale = floor[i].scale;
                  break;
                }
              }
              currentFloorId = floorId;
              floorImg.src = result.data;
              window.localStorage.setItem(floorId,result.data);
              changeAble = true;
              if (This.onFloorChange != null) {
                This.onFloorChange();
              }
              isLoaded = true;
            } else {
               alert("图片获取失败");
              changeAble = true;
            }
          }
      );
    }
  }
  //切换建筑
  function changeBuild(uId, floorId) {
    mallId = uId;
    if (!floorId) {
      floorId = null;
    }
    var dataUrl = "";
    dataUrl = "http://" + serverUrl + "/beacon/place!all_in_one?client=824&&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&place=" + mallId + "&jsoncallback=?";
    $.getJSON(dataUrl,
      function(result) {
        if (true === result.success) {
          //填充数据
          //获得当前商场的名字
          mallName = result.place[0].name;
          //获得当前商场每层楼对应多少张地图
          //picPerFloor = result.map[0].max_map_level;
          var i = null;
          var j = 0;

          //提取当前商场每层楼对应的png图片信息
          for (i in result.map) {
            if (result.map[i].map_path.indexOf("png-1_1") > -1) {
              floor[j++] = result.map[i];
              if (floorId === null) {
                if (result.map[i].floor_id === "Floor1") {
                  floorId = "Floor1";
                } else {
                  if (result.map[i].floor_id === "Floor0") {
                    floorId = "Floor0";
                  }
                }
              }
            }
          }

          //这里还没有填充楼层选择器！！
          getPublicPlace(uId, "", function() {
            changeFloor(floorId);
          });
        } else {
         alert("获取楼层数据失败");
        }
      });
  }
  //获取公共设施
  function getPublicPlace(uId, floorId, callback) {
    var textUrl = "http://" + serverUrl + "/beacon/place!facilities?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&place=" + uId;
    if (!!floorId) {
      textUrl += "&floor=" + floorId;
    }
    textUrl += "&jsoncallback=?";
    $.getJSON(textUrl,
      function(data) {
        if (!data.success) {
          alert("公共设施字体获取失败");
          return;
        }
        publicPlace = data.rows;
        //取字体符号后，适配ios进行调整,如果需要调整，字体文件也许替换为VMapPublic_stm.ttf
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        if(userAgent.indexOf('iPhone') > -1 ) {
          for (var i = 0; i < publicPlace.length; i++) {
            var facilityNum = publicPlace[i].font.charCodeAt(0);

            if ((facilityNum >= 37 && facilityNum <= 63) || (facilityNum >= 68 && facilityNum <= 107)) publicPlace[i].font = String.fromCharCode(facilityNum - 5);
            if(facilityNum>=108 && facilityNum<=109) publicPlace[i].font = String.fromCharCode(facilityNum - 6);
            if(facilityNum == 110) publicPlace[i].font = String.fromCharCode(118);
            if(facilityNum>=111 && facilityNum<=125) publicPlace[i].font = String.fromCharCode(facilityNum - 7);
            if (facilityNum >= 167 && facilityNum <= 193) publicPlace[i].font = String.fromCharCode(facilityNum - 6);
            if (facilityNum >= 165 && facilityNum <= 166) publicPlace[i].font = String.fromCharCode(facilityNum - 41);
            if (facilityNum == 34 ) publicPlace[i].font = String.fromCharCode(54-5);
            if (facilityNum == 35 ) publicPlace[i].font = String.fromCharCode(103-5);
            if (facilityNum == 36 ) publicPlace[i].font = String.fromCharCode(169-6);
            if (facilityNum == 200 ) publicPlace[i].font = String.fromCharCode(109-6);
            if (facilityNum == 164 ) publicPlace[i].font = String.fromCharCode(59-5);
            if (facilityNum == 162 ||  facilityNum==163) publicPlace[i].font = String.fromCharCode(123-7);
            if (facilityNum == 161 ) publicPlace[i].font = String.fromCharCode(100-5);
          }
        }
        if (!!callback) {
          callback();
        }
      }
    );
  }
  //字体
  function getUnitFont(uId, floorId, callback) {
    var textUrl = "http://" + serverUrl + "/beacon/place!all_spot?place=" + uId + "&floor=" + floorId + "&jsoncallback=?";
    $.getJSON(textUrl,
      function(data) {
        if (!data.success) {
          alert("UnitFont获取失败");
          return;
        }
        var temp = data.place;
        var obj = {};
        unitFont = [];
        for (var i in temp) {
          obj = {};
          obj.name = temp[i].name;
          context.font = fontSize*zoomScale + "px Arial,Helvetica,SimSun,sans-serif";
          obj.length = context.measureText(temp[i].name).width;
          obj.coord_x = temp[i].coord_x;
          obj.coord_y = temp[i].coord_y;
          obj.show = 1;
          unitFont.push(obj);
        }
        window.localStorage.setItem(floorId+"unitFont",JSON.stringify(unitFont));
        if (!!callback) {
          callback();
        }
      }
    );
  }


  //根据真实位置x,y获得点击的商铺信息
  function getInfo(uId, floorId, x, y) {
    var delta = rate / currentScale * zoomScale;
    var postUrl = "http://" + serverUrl + "/beacon/position!pos2add?client=824&vkey=FFE58998-B203-B44E-A95B-8CA2D6CBCD65&x=" + x / delta + "&y=" + y / delta + "&floor=" + floorId + "&place=" + uId + "&jsoncallback=?";
    $.getJSON(postUrl,
      function(data) {
        var obj = {};
        if (!data.success) {
          obj.message = false;
          obj.x = x;
          obj.y = y;
          obj.scale = zoomScale;
        } else {
          obj = data.rows[0];
          obj.message = true;
          obj.x = x;
          obj.y = y;
          obj.scale = zoomScale;
        }
        unBlockUI();
        if (This.onMapTap != null) {
          This.onMapTap(obj);
        }

      });
  }
  //获得滚动条高度
  function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  }

  //字体缩放
  function zoomUnitFont() {
    for (var i in unitFont) {
      unitFont[i].minX = unitFont[i].coord_x * rate / currentScale * zoomScale - unitFont[i].length / 2;
      unitFont[i].maxX = unitFont[i].coord_x * rate / currentScale * zoomScale + unitFont[i].length / 2;
      unitFont[i].minY = unitFont[i].coord_y * rate / currentScale * zoomScale - fontSize/2;
      unitFont[i].maxY = unitFont[i].coord_y * rate / currentScale * zoomScale + fontSize/2;
    }
  }

  //公共设施缩放
  function zoomPublicPlace() {
    for (var i in publicPlace) {
      publicPlace[i].minX = publicPlace[i].coord_x * rate / currentScale * zoomScale - publicSize/2;
      publicPlace[i].maxX = publicPlace[i].coord_x * rate / currentScale * zoomScale + publicSize/2;
      publicPlace[i].minY = publicPlace[i].coord_y * rate / currentScale * zoomScale - publicSize/2;
      publicPlace[i].maxY = publicPlace[i].coord_y * rate / currentScale * zoomScale + publicSize/2;
    }
  }

  //显示字体
  function selectFonts() {
   // console.log(unitFont)
    for (var i = unitFont.length - 1; i >= 0; i--) {
      unitFont[i].show = 1;
      var flag = true;
      for (var j = i - 1; j >= 0; j--) {

        if ((unitFont[i].minX >= unitFont[j].minX && unitFont[i].minX <= unitFont[j].maxX && unitFont[i].minY >= unitFont[j].minY && unitFont[i].minY <= unitFont[j].maxY) || 
          (unitFont[j].minX >= unitFont[i].minX && unitFont[j].minX <= unitFont[i].maxX && unitFont[j].minY >= unitFont[i].minY && unitFont[j].minY <= unitFont[i].maxY)) {
          flag = false;
          unitFont[i].show = 0;
        }

        if ((unitFont[i].minX >= unitFont[j].minX && unitFont[i].minX <= unitFont[j].maxX && unitFont[i].maxY >= unitFont[j].minY && unitFont[i].maxY <= unitFont[j].maxY) ||
          (unitFont[j].minX >= unitFont[i].minX && unitFont[j].minX <= unitFont[i].maxX && unitFont[j].maxY >= unitFont[i].minY && unitFont[j].maxY <= unitFont[i].maxY)) {
          flag = false;
          unitFont[i].show = 0;
        }

        if ((unitFont[i].maxX >= unitFont[j].minX && unitFont[i].maxX <= unitFont[j].maxX && unitFont[i].minY >= unitFont[j].minY && unitFont[i].minY <= unitFont[j].maxY) ||
          (unitFont[j].maxX >= unitFont[i].minX && unitFont[j].maxX <= unitFont[i].maxX && unitFont[j].minY >= unitFont[i].minY && unitFont[j].minY <= unitFont[i].maxY)) {
          flag = false;
          unitFont[i].show = 0;
        }

        if ((unitFont[i].maxX >= unitFont[j].minX && unitFont[i].maxX <= unitFont[j].maxX && unitFont[i].maxY >= unitFont[j].minY && unitFont[i].maxY <= unitFont[j].maxY) ||
          (unitFont[j].maxX >= unitFont[i].minX && unitFont[j].maxX <= unitFont[i].maxX && unitFont[j].maxY >= unitFont[i].minY && unitFont[j].maxY <= unitFont[i].maxY)) {
          flag = false;
          unitFont[i].show = 0;
        }

        if (!flag) break;
      }
    }
  }

  //显示或隐藏公共设施
  function selectPublicPlace() {
    for (var i = publicPlace.length - 1; i >= 0; i--) {
      publicPlace[i].show = 1;//开始全部显示公共设施
      var flag = true;
      for (var j = i - 1; j >= 0; j--) {//如果发生下面任意一种情况的交叠，那么就隐藏
        if ((publicPlace[i].minX >= publicPlace[j].minX && publicPlace[i].minX <= publicPlace[j].maxX && publicPlace[i].minY >= publicPlace[j].minY && publicPlace[i].minY <= publicPlace[j].maxY) ||
          (publicPlace[j].minX >= publicPlace[i].minX && publicPlace[j].minX <= publicPlace[i].maxX && publicPlace[j].minY >= publicPlace[i].minY && publicPlace[j].minY <= publicPlace[i].maxY)) {
          flag = false;
          publicPlace[i].show = 0;
        }

        if ((publicPlace[i].minX >= publicPlace[j].minX && publicPlace[i].minX <= publicPlace[j].maxX && publicPlace[i].maxY >= publicPlace[j].minY && publicPlace[i].maxY <= publicPlace[j].maxY) ||
          (publicPlace[j].minX >= publicPlace[i].minX && publicPlace[j].minX <= publicPlace[i].maxX && publicPlace[j].maxY >= publicPlace[i].minY && publicPlace[j].maxY <= publicPlace[i].maxY)) {
          flag = false;
          publicPlace[i].show = 0;
        }

        if ((publicPlace[i].maxX >= publicPlace[j].minX && publicPlace[i].maxX <= publicPlace[j].maxX && publicPlace[i].minY >= publicPlace[j].minY && publicPlace[i].minY <= publicPlace[j].maxY) ||
          (publicPlace[j].maxX >= publicPlace[i].minX && publicPlace[j].maxX <= publicPlace[i].maxX && publicPlace[j].minY >= publicPlace[i].minY && publicPlace[j].minY <= publicPlace[i].maxY)) {
          flag = false;
          publicPlace[i].show = 0;
        }

        if ((publicPlace[i].maxX >= publicPlace[j].minX && publicPlace[i].maxX <= publicPlace[j].maxX && publicPlace[i].maxY >= publicPlace[j].minY && publicPlace[i].maxY <= publicPlace[j].maxY) ||
          (publicPlace[j].maxX >= publicPlace[i].minX && publicPlace[j].maxX <= publicPlace[i].maxX && publicPlace[j].maxY >= publicPlace[i].minY && publicPlace[j].maxY <= publicPlace[i].maxY)) {
          flag = false;
          publicPlace[i].show = 0;
        }
        if (!flag) break;
      }
    }
  }

  //函数绑定
  var mc = null;

  function bindEvent() {
    var initStart=1;
   
    mc = new Hammer.Manager(floorCanvas);
    // create recognizers
    var Pan = new Hammer.Pan();
    var Rotate = new Hammer.Rotate();
    var Pinch = new Hammer.Pinch();
    var Tap = new Hammer.Tap({
        taps: 1
    });
    // use them together
    Rotate.recognizeWith([Pan]);
    Pinch.recognizeWith([Pan,Rotate]);
    // add the recognizers
    mc.add(Pan);
    mc.add(Rotate);
    mc.add(Pinch);
    mc.add(Tap);
    mc.on("panstart panmove", onPan);
    // mc.on("rotatestart rotatemove",onRotate); //旋转
    mc.on("pinchstart pinchmove", onPinch);
    mc.on("hammer.input", function(ev) {
        if (ev.isFirst) {
          
        }
        if (ev.isFinal){
            if (eventflag) {
                eventflag = false;
                START_X = START_X + ev.deltaX;
                START_Y = START_Y + ev.deltaY;
                var mx = midX;
                var my = midY;
                drawMap(1);
                midX = mx;
                midY = my;
                requestElementUpdate();
                if (options && options.publicColor) drawFont(null, options.publicColor, null, 1);
                else drawFont(null, null, null, 1);
                if (options && options.fontColor) drawUnitFont(1, options.fontColor);
                else drawUnitFont(1);
                refreshOverLay(1);
                if (This.onMapPinchEnd != null) {
                    This.onMapPinchEnd({
                        scale: 1,
                        angle: finalAngle
                    });
                }
            } else {
                START_X = START_X + ev.deltaX;
                START_Y = START_Y + ev.deltaY;
            }
        }
    });
    /*2017-01-05增加判断边界*/
    //移动地图函数,
    function onPan(ev) {
      var pos=floorDiv.getBoundingClientRect();
        //pos有四个属性，top，bottom，left，right，
        //right表示元素最右边距离窗口最左边的距离，当距离小于窗口宽度的时候，不移动地图即可
        if(pos.right<=window.innerWidth){//判断最右边
            var currentX;
            if(ev.deltaX>0){//向右移可以
                transform.translate = {
                  x: START_X + ev.deltaX,
                  y: START_Y + ev.deltaY
                };
                requestElementUpdate();
            }else{//向左X不发生变化
                if(currentX==undefined){
                    currentX=transform.translate.x;
                    START_X=currentX;
                    console.log("向左移动不发生变化");
                }else{
                    console.log("向左移动不发生变化");
                }
            }
        }else if(pos.top>0){//判断上方
            var currentY;
            if(ev.deltaY<0){//向上移可以
                transform.translate = {
                  x: START_X + ev.deltaX,
                  y: START_Y + ev.deltaY
                };
                requestElementUpdate();
            }else{//向下Y不发生变化
                if(currentY==undefined){
                    currentY=transform.translate.y;
                    START_Y=currentY;
                    console.log("向下移动不发生变化");
                }else{
                    console.log("向下移动不发生变化");
                }
            }
        }else if(pos.left>0){//判断左边
            var currentX;
            if(ev.deltaX<0){//左移可以
              transform.translate = {
                x: START_X + ev.deltaX,
                y: START_Y + ev.deltaY
              };
              requestElementUpdate();
            }else{//向左X不发生变化
              if(currentX==undefined){
                currentX=transform.translate.x;
                START_X=currentX;
                console.log("向右移动不发生变化");
              }else{
                console.log("向右移动不发生变化");
              }
            }
        }else if((window.innerHeight-pos.bottom)-(window.innerHeight-document.getElementById("sousuo").getBoundingClientRect().bottom)>=0){//向上移动判断
            var currentY;
            if(ev.deltaY>0){//向下移可以
                transform.translate = {
                  x: START_X + ev.deltaX,
                  y: START_Y + ev.deltaY
                };
                requestElementUpdate();
            }else{//向上Y不发生变化
                if(currentY==undefined){
                  currentY=transform.translate.y;
                  START_Y=currentY;
                  console.log("向上移动不发生变化");
                }else{
                  console.log("向上移动不发生变化");
                }
            }
        }else{
            transform.translate = {
              x: START_X + ev.deltaX,
              y: START_Y + ev.deltaY
            };
            requestElementUpdate();
        }
    }
    //红色弹窗div
    function alertDiv(msg){
      var div = document.createElement("div");
      div.id = "alertDiv";
      div.setAttribute("class","alert alert-danger pop-style");
      div.style.display="none";
      div.style.marginBottom=0;
      div.style.zIndex=1111;
      div.innerHTML=msg;
      document.body.appendChild(div);
      $("#alertDiv").show(1000);
      setTimeout(function(){
        $("#alertDiv").hide(1000,function(){
          document.body.removeChild(div);
        });
      },2500);
    }
    var zoomX=0;
    var zoomY=0;
    function onPinch(ev) {
        eventflag = true;
        if (ev.type == 'pinchstart') {
            initScale = zoomScale || 1;
        }else if(ev.type=='pinchend'){
        } else{
            if (initScale * ev.scale > defaultMaxScale) {
                transform.scale = defaultMaxScale;
                zoomScale = defaultMaxScale;
                alertDiv("已经达到最大缩放等级");
            } else if (initScale * ev.scale < defaultMinScale) {
                transform.scale = defaultMinScale;
                zoomScale = defaultMinScale;
                alertDiv("已经达到最小缩放等级");
            } else {
                transform.scale = initScale * ev.scale;
                zoomScale = initScale * ev.scale;
            }
        }
        zoomX=-(midX*zoomScale-midX);
        zoomY=-(midY*zoomScale-midY);
        updateScaleTxt();
        requestElementUpdate();
    }
    // function onRotate(ev) {
    //     if (ev.type == 'rotatestart') {
    //         var a = Math.PI / 180 * finalAngle;
    //         var testx = ev.center.x- START_X;
    //         var testy = ev.center.y- START_Y;
    //         var x = (testx- midX) * Math.cos(a) + (testy + getScrollTop() - midY) * Math.sin(a) + midX;
    //         var y = (testy + getScrollTop() - midY) * Math.cos(a) - (testx - midX) * Math.sin(a) + midY;
    //         var cx = testx-x;
    //         var cy = testy-y;
    //         transform.translate = {
    //             x: START_X + cx,
    //             y: START_Y + cy
    //         };
    //         START_X +=cx;
    //         START_Y +=cy;
    //         requestElementUpdate();
    //         var tranformOrigin=Math.floor((x/floorCanvas.width)*100)+"% "+Math.floor((y/floorCanvas.height)*100)+"%";
    //         floorDiv.style.transformOrigin=tranformOrigin;
    //         midX=floorCanvas.width * Math.floor((x/floorCanvas.width)*100)/100;
    //         midY=floorCanvas.height * Math.floor((y/floorCanvas.height)*100)/100;
    //         initAngle = finalAngle || 0;
    //         return;
    //     }
    //     transform.rz = 1;
    //     transform.angle = initAngle + ev.rotation;
    //     finalAngle = initAngle + ev.rotation;
    //     requestElementUpdate();
    // }
    resetElement();
  }

  // 移动设备中的地图处理函数 外部
  function resetElement() {
    finalAngle = 0;
    zoomScale = 1;
    transform = {
      translate: {
        x: START_X,
        y: START_Y
      },
      scale: 1,
      angle: 0,
      rx: 0,
      ry: 0,
      rz: 0
    };
    requestElementUpdate();
  }

  function updateElementTransform() {
    var value = [
      'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
      'scale(' + transform.scale + ', ' + transform.scale + ')',
      'rotate3d(' + transform.rx + ',' + transform.ry + ',' + transform.rz + ',' + transform.angle + 'deg)'
    ];
    value = value.join(" ");
    floorDiv.style.webkitTransform = value;
    floorDiv.style.mozTransform = value;
    floorDiv.style.transform = value;
    ticking = false;
  }
    
  function requestElementUpdate() {
    updateElementTransform();
}
  var reqAnimationFrame = (function() {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();
  //外部函数

  //放大
  function zoomIn() {
    var scale = zoomScale;
    if (isPicLoaded == false) {
      return false;
    }
    zoomScale += defaultDeltaScale;
    if (zoomScale > defaultMaxScale) {
      zoomScale = scale;
      alert('已经达到默认最大缩放等级');
      return false;
    }
    //fontSize = OriginFontSize * zoomScale;
    if(fontSize >= OriginFontSize)
      fontSize = OriginFontSize;
    updateScaleTxt();
    draw();
    event.preventDefault(); 
    return false;
  }
  //缩小
  function zoomOut() {
    var scale = zoomScale;
    zoomScale -= defaultDeltaScale;
    if (zoomScale < defaultMinScale) {
      zoomScale = scale;
      alert("已经达到默认最小缩放等级");
      return false;
    }
    //fontSize = OriginFontSize * (zoomScale-0.1);
    if(fontSize >= OriginFontSize)
      fontSize = OriginFontSize;
    updateScaleTxt();
    draw();
    event.preventDefault();
    return false;
  }

  //随手机旋转
  function deviceHandler(event) {
    if (Math.abs(event.alpha - deviceAlpha) > 5) {
      deviceAlpha = event.alpha;
      transform.rz = 1;
      transform.angle = Math.round(event.alpha);
      finalAngle = Math.round(event.alpha);
      requestElementUpdate();
      draw();
    }
  }

  function enableAutoRotate() {
    window.addEventListener("deviceorientation", deviceHandler, false);
    mc.off("rotatestart rotatemove");
  }

  function disableAutoRotate() {
    window.removeEventListener("deviceorientation", deviceHandler, false);
    mc.on("rotatestart rotatemove", onRotate);
  }

  function destory() {
    //是否需要将元素上的一系列事件删除，这样才不占用资源
    floorDiv.removeChild(floorCanvas);
    dom.removeChild(floorDiv);
    return false;
  }



  //添加覆盖物~
  function addOverlay(obj) {
    var delta = rate / currentScale * zoomScale;
    if (obj.type() === "marker") {
      markers[markers.length] = obj;
      var point = obj.point();
      $(obj.dom).css({
        left: point.x * delta + "px",
        top: point.y * delta + "px"
      });
      if (obj.floorIndex() !== currentFloorId) {
        obj.hide();
      }
      floorDiv.appendChild(obj.dom);
    }
    if (obj.type() === "line") {
      lines[lines.length] = obj;
      var points = obj.points();
      if (isPicLoaded === true) {
        context.beginPath();
        var l = points.length;
        var color = obj.color();
        var width = obj.width();
        context.lineCap = "round";
        context.lineWidth = width;
        context.strokeStyle = color;
        context.globalCompositeOperation = 'source-atop';
        //context.fillStyle = "red";
        for (var i = 0; i <= l - 2; i++) {
          if ((points[i].floorIndex === currentFloorId) && (points[i + 1].floorIndex === currentFloorId)) {
            context.moveTo(points[i].x * delta, points[i].y * delta);
            context.lineTo(points[i + 1].x * delta, points[i + 1].y * delta);
          }
        }
        context.stroke();
      }
    }
    //虚线
    if (obj.type() === "dashline") {
      lines[lines.length] = obj;
      var points = obj.points();
      if (isPicLoaded === true) {
        var l = points.length;
        context.imageSmoothingEnabled = true;
        var color = obj.color();
        lineColor=color;
        var width = obj.width();
        lineWidth=width;
        context.lineWidth = width;
        context.strokeStyle = color;
        for (var i = 0; i <= l - 2; i++) {
          if ((points[i].floorIndex === currentFloorId) && (points[i + 1].floorIndex === currentFloorId)) {
            context.dashedLineTo(points[i].x * delta, points[i].y * delta, points[i + 1].x * delta, points[i + 1].y * delta);
          }
        }
      }
    }

    if (obj.type() === "circle"){
      circles[circles.length] = obj;
      var point = obj.point();
      var radius = obj.radius();
      if (isPicLoaded === true) {
        context.beginPath();
        var color = obj.color();
        var width = obj.width();
        context.lineCap = "round";
        context.lineWidth = width;
        context.strokeStyle = color;
        if (point.floorIndex === currentFloorId) {
          context.arc(point.x * delta, point.y * delta, radius * delta, 0, 2 * Math.PI);
          context.stroke();
        }
      }
    }

    if (obj.type() === "text") {

      texts[texts.length] = obj;
      var point = obj.point();
      if (isPicLoaded === true) {
        var content = obj.content();
        var color = obj.color();
        var width = obj.lineWidth();
        context.lineWidth = width;
        context.fillStyle = color;
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.font = "italic bold 12px arial";
        if (point.floorIndex === currentFloorId) {
          context.fillText(content, point.x * delta, point.y * delta);
        }
      }
    }

  }

  function refreshOverLay(scaleNum) {
    var delta = rate / currentScale * scaleNum;
    for (var i = 0; i < markers.length; i++) {
      var mark = markers[i];
      var p = mark.point();
      $(mark.dom).css({
        left: p.x * delta + "px",
        top: p.y * delta + "px"
      });
      if (mark.floorIndex() !== currentFloorId) {
        mark.hide();
      } else {
        mark.show();
      }
    }
    //解决重绘地图时虚线会变成实线
    //2016-12-12By-zhoudy
    for (var i = 0; i < lines.length; i++) {
      var points = lines[i].points();
      if (isPicLoaded === true){
        context.beginPath();
        var l = points.length;
        context.imageSmoothingEnabled = true;
        context.lineWidth = lineWidth;
        context.strokeStyle = "#FF4509";
        for (var i = 0; i <= l - 2; i++) {
          if ((points[i].floorIndex === currentFloorId) && (points[i + 1].floorIndex === currentFloorId)) {
            context.dashedLineTo(points[i].x * delta, points[i].y * delta, points[i + 1].x * delta, points[i + 1].y * delta);
          }
        }
      }
      context.stroke();
    }
    for (var i = 0; i < circles.length; i++) {
      var point = circles[i].point();
      var radius = circles[i].radius();
      if (isPicLoaded === true) {
        context.beginPath();
        var color = circles[i].color();
        var width = circles[i].width();
        context.lineCap = "round";
        context.lineWidth = width;
        context.strokeStyle = color;
        if (point.floorIndex === currentFloorId) {
          context.arc(point.x * delta, point.y * delta, radius * delta, 0, 2 * Math.PI);
          context.stroke();
        }
      }
    }
    for (var i = 0; i < texts.length; i++) {
      var point = texts[i].point();
      if (isPicLoaded === true) {
        var color = texts[i].color();
        var width = texts[i].lineWidth();
        var content = texts[i].content();
        context.lineWidth = width;
        context.fillStyle = color;
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.font = "italic bold 12px arial";
        if (point.floorIndex === currentFloorId) {
          context.fillText(content, point.x * delta, point.y * delta);
        }
      }
    }

  }

  //清除覆盖物
  function clearOverlays() {
    for (var i = 0; i < markers.length; i++) {
      $(markers[i].dom).remove();
    }
    markers = [];
    lines = [];
    circles = [];
    texts = [];
    context.clearRect(0, 0, floorCanvas.width, floorCanvas.height);
    draw();
  }

  function getRealPoint(p) {
    var delta = rate / currentScale * zoomScale;
    return {
      x: p.x / delta,
      y: p.y / delta,
      floorIndex: p.floorIndex
    };
  }

  function transform(p) {
    var delta = rate / currentScale * zoomScale;
    return {
      x: p.x * delta,
      y: p.y * delta,
      floorIndex: p.floorIndex
    };
  }

  //上下楼的接口
  this.prevFloor = function() {
    var next = null;
    for (var i = 0; i < floor.length; i++) {
      if (floor[i].floor_id === currentFloorId) {
        if (i === 0) {
          return false;
        }
        next = floor[i - 1].floor_id;
        break;
      }
    }
    changeFloor(next);
    resetElement();
  };

  this.nextFloor = function() {
    var next = null;
    for (var i = 0; i < floor.length; i++) {
      if (floor[i].floor_id === currentFloorId) {
        if (i === floor.length - 1) {
          return false;
        }
        next = floor[i + 1].floor_id;
        break;
      }
    }
    changeFloor(next);
    resetElement();
  };

  //更换当前的公共设施显示
  function changePublicType(type) {
    draw(null, type);
  }

  //获取地图比例尺
  function getScaleCtrl() {
    isScaleCtrlShow = true;
    map_scaleTxt.innerHTML = Math.round(100 / this.getDelta()) + "米";
    return map_scaleCtrl;
  }
  //删除比例尺
  function removeScaleCtrl() {
    isScaleCtrlShow = false;
    $("body").find(map_scaleCtrl).remove();
  }

  //更新比例尺文字
  function updateScaleTxt() {
    if (isScaleCtrlShow) {
      map_scaleTxt.innerHTML = Math.round(100 / (rate / currentScale * zoomScale)) + "米";
    }
  }

  //打开标记点击功能
  function enableMarkerClick() {
    for (var i in markers) {
      markers[i].enableMarkerClick(mallId);
    }
  }
  //关闭标记点击功能
  function unableMarkerClick() {
    for (var i in markers) {
      markers[i].unableMarkerClick();
    }
  }

  //移动地图中心到某点
  function moveMapTo(x, y) {
    var delta = rate / currentScale;
    START_X = clientmidx - x*delta + 60;
    START_Y = clientmidy - y*delta - 250;
    resetElement();
  }
  //开启地图中心随点击位置移动
  function enableMoveWithTap() {
    moveMapWithTap = true;
  }
  //关闭地图中心随点击位置移动
  function unableMoveWithTap() {
    moveMapWithTap = false;
  }

  //设置地图缩放级别
  function setZoomScale(zs) {
    if(zs < 0.03) {
      alert('设置的缩放级别过小');
      return false;
    }
    if(zs > 2.8) {
      alert('设置的缩放级别过大');
      return false;
    }
    zoomScale = zs;
    updateScaleTxt();
    draw();
  }

  //callback函数指针
  this.onMapTap = null;
  this.onMapPinchEnd = null;
  this.onFloorChange = null;

  //将指针绑定为内部函数
  this.zoomIn = zoomIn;
  this.zoomOut = zoomOut;
  this.addOverlay = addOverlay;
  this.clearOverlays = clearOverlays;
  this.refreshOverLay = refreshOverLay;
  this.changeFloor = changeFloor;
  this.changeBuild = changeBuild;
  this.changePublicType = changePublicType;
  this.transform = transform;
  this.getRealPoint = getRealPoint;
  this.destory = destory;
  this.enableRotate = enableAutoRotate;
  this.disableRotate = disableAutoRotate;
  this.getScaleCtrl = getScaleCtrl;
  this.removeScaleCtrl = removeScaleCtrl;
  this.enableMarkerClick = enableMarkerClick;
  this.unableMarkerClick = unableMarkerClick;
  this.moveMapTo = moveMapTo;
  this.enableMoveWithTap = enableMoveWithTap;
  this.unableMoveWithTap = unableMoveWithTap;
  this.setZoomScale = setZoomScale;

  //补充接口
  //整个数据结构是否初始化完成
  this.isLoaded = function() {
    return isLoaded;
  };
  //获得楼层的id
  this.getMallId = function() {
    return mallId;
  };
  this.getMallName = function() {
    return mallName;
  };
  //获得当前楼层id
  this.getCurrentFloorId = function() {
    return currentFloorId;
  };
  //获得楼层列表
  this.getFloors = function() {
    return floor;
  };
  //获得最大楼层的id
  this.getMaxFloorId = function() {
    return floor[floor.length - 1].floor_id;
  };

  this.getZoomScale = function() {
    return zoomScale;
  };
  this.getMapWidth = function() {
    return floorImg.width * zoomScale;
  };
  this.getDelta = function() {
    return rate / currentScale * zoomScale;
  };

  this.getFacilities = function() {
    var facilityArray = [];
    for (var i = 0; i < publicPlace.length; i++) {
      if (publicPlace[i].floor_id === currentFloorId) {
        facilityArray.push(publicPlace[i]);
      }
    }
    return facilityArray;
  };

  this.getDivId = function() {
    return floorDiv.id;
  };
  this.getMarkers = function() {
    return markers;
  }
}