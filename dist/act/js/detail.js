$(document).ready(function() {
    var urlDetail = "/act/detail";
    var urlItem = "/act/detail-html";
    var urlSignedNumber = "/act/detail-signed-num";
    var urlIfSign = "/act/is-sign-up";
    var id;//获取活动id
    var username;//获取活动所属的系统管理员
    // 获取用户openid，用户授权
    var openId='yy';
    var options={
        url:urlYuming+"/act/page/detail.html?id="+getCookie("id"),
        urlServerauth:urlServer+"/user/do-auth",
        APPID:APPIDall
    }
    function callbackA(id) {
        openId=id;
        ajaxContact();
        signedNumberContact();
        htmlContact();
        ifSignContact();
        makeClickSign();
    }
    function cookieId() {
        if (getQueryString("id") != null) {
            id = getQueryString("id");
            var exp = new Date();
            exp.setTime(exp.getTime() + 10*60 * 1000);
            document.cookie = "id"+"=" + id + ";expires=" + exp.toGMTString();
        }
    }
    cookieId();
    ajaxContact();
    signedNumberContact();
    htmlContact();
    ifSignContact();
    makeClickSign();
    // getWeChatId(options,callbackA);

      // 获取用户openid，走接口判断用户是否已经报名
    function ifSignContact(){
        id = getQueryString("id");
        console.log("ifsign");
        $.ajax({
            url: urlServer + urlIfSign,
            type: "GET",
            data: {
                "openId": openId,
                "actId": id
            },
            success: function(data) {
                var code=data.code;
                if(code==200){
                    var result = data.data.result;
                    if (result == true) {
                        weui.alert("您已报名，请勿重复报名");
                        $("#click_Sign").attr("disabled", true);
                        $("#click_Sign").html("已报名");
                    }
                    if (document.getElementById("click_Sign").innerHTML=='报名') {
                        // alert('baomging ');
                        $("#click_Sign").on("click", function() {
                            var price = $("#price").html();
                            var limitNumber=$('#limitNumber').html();
                            var status=false;//false免费
                            if(price!=0){
                                status=true;
                            }
                            window.location.href = "../page/sign.html?id=" + id + "&price=" + price+"&username="+username+"&limitNumber="+limitNumber;
                        });
                    }
                }
            },
            error: function(error) {
                console.log(error);
                weui.alert("获取用户是否报名出错");
            }
        });
    }
//


    function ajaxContact() {
        console.log(id);
        $.ajax({
            url: urlServer + urlDetail,
            type: "GET",
            data: { "id": id },
            async: false,
            success: function(data) {
                console.log("ajaxcontact");
                username=data.data.username;
                var topImg ="";
                if(data.data.topImg==''){
                    topImg ="../../util/img/background.jpg";
                }else{
                    topImg = data.data.topImg;
                }
                var title = data.data.title;
                var startActivityTime = data.data.startActivityTime;
                var endActivityTime = data.data.endActivityTime;
                var endSignTime = data.data.endSignTime;
                var limitNumber = data.data.limitNumber;
                var address = data.data.address;
                var price = data.data.price;
                var face_obj=data.data.faceObj;
                makeTopImg(topImg);
                makeTitle(title);
                makeLimit(limitNumber);
                makeActivityTime(startActivityTime, endActivityTime);
                makeEndSign(endSignTime);
                makeAddress(address);
                makePrice(price);
                makeFaceObj(face_obj);
                document.cookie="endActivityTime="+endActivityTime;
                document.cookie="startActivityTime="+startActivityTime;

            },
            error: function(error) {
                console.log(error);
                weui.alert("获取活动基本信息false");
            }

        });
    }

    function makeTopImg(topImg) {
        var TopPicture = document.getElementById("topPicture");
        var strHtml = '<img src=' + topImg + ' alt="稍等片刻">';
        TopPicture.innerHTML = strHtml;
    }

    function makeTitle(title) {
        var Title = document.getElementById("title");
        var strHtml = title;
        Title.innerHTML = strHtml;
    }
    //人数上限
    function makeLimit(limitNumber) {
        var LimitNumber = document.getElementById("limitNumber");
        LimitNumber.innerHTML = limitNumber;
    }

    function makeActivityTime(startActivityTime, endActivityTime) {
        var StartTime = document.getElementById("startTime");
        var strHtml = startActivityTime + ' - ' + endActivityTime;
        StartTime.innerHTML = strHtml;
    }
    // 报名截止日期
    function makeEndSign(endSignTime) {
        var EndSignTime = document.getElementById("endSignTime");
        var strHtml = endSignTime;
        EndSignTime.innerHTML = strHtml;
    }

    function makeAddress(address) {
        var Address = document.getElementById("address");
        var strHtml = address;
        Address.innerHTML += strHtml;
    }

    function makePrice(price) {
        var Price = document.getElementById("price");
        Price.innerHTML += price;
    }

    function makeFaceObj(face_obj) {
        var FaceObj = document.getElementById("face_obj");
        if(face_obj=='0'){
            FaceObj.innerHTML += '顾客';
        }else if(face_obj=='1'){
            FaceObj.innerHTML += '商户';
        }
    }
    function htmlContact() {
        if(id==undefined){
            id=getQueryString("id");
        }
        $.ajax({
            url: urlServer + urlItem,
            type: "GET",
            data: { "id": id },
            success: function(data) {
                console.log("html");
                if (data == "出错") {
                    makeDetailItem("获取活动详细信息有误");
                } else {
                    makeDetailItem(data);
                }
            },
            error: function(error) {
                console.log(error);
                weui.alert("获取活动详细信息出错");
            }
        });
    }
    // 活动详情
    function makeDetailItem(data) {
        var DetailItem = document.getElementById("detailItem");
        DetailItem.innerHTML = data;
    }
    //获取已报名人数
    function signedNumberContact() {
        if(id==undefined){
            id=getQueryString("id");
        }
        $.ajax({
            url: urlServer + urlSignedNumber,
            type: "GET",
            dataType: "json",
            data: { "id": id },
            async:false,
            success: function(data) {
                console.log("number");
                var signedNumber = data.data.signedNumber;
                makeSignedNumber(signedNumber);
                var limitNumber =document.getElementById("limitNumber").innerHTML;
            },
            error: function(error) {
                console.log(error);
                weui.alert("报名人数出错");

            }
        });
    }

    function makeSignedNumber(signedNumber) {
        var SignedNumber = document.getElementById("signedNumber");
        SignedNumber.innerHTML = signedNumber;
    }
    // 超过活动报名时间，活动时间 无法进行报名 实际用的时候需要将此处函数中的注释删掉
    function makeClickSign() {
        //ios bujianrong genggaigeshi
        console.log("clicksign");
        var startActivityTime=getCookie("startActivityTime");
        var endActivityTime=getCookie("endActivityTime");
        var endSignTime = document.getElementById("endSignTime").innerHTML;
        var EndSignTime = Date.parse(endSignTime.replace(/-/g, '/'));
        var EndActivityTime = Date.parse(endActivityTime.replace(/-/g, '/'));
        var limitNumber = document.getElementById("limitNumber").innerHTML;
        var SignedNumber = document.getElementById("signedNumber").innerHTML;
        if (parseInt(SignedNumber) === parseInt(limitNumber) || parseInt(SignedNumber) > parseInt(limitNumber)) {
            $("#click_Sign").html('报名人数已达上限');
            $("#click_Sign").attr("disabled", true);
        }
        // var NowTime=new Date().getTime();
        // var EndSignTime=Date.valueOf(endSignTime);
        // var EndActivityTime=Date.valueOf(endActivityTime);
        var NowTime = Date.parse(new Date());
        if (NowTime > EndSignTime) {
            document.getElementById("click_Sign").innerHTML="活动报名截止";
            document.getElementById("click_Sign").setAttribute("disabled","disabled");
        }else if (NowTime > EndActivityTime) {
            $("#click_Sign").html('活动已结束');
            $("#click_Sign").attr("disabled", true);
        }else if(NowTime<startActivityTime){
            $('#click_Sign').html('活动尚未开始');
            $("#click_Sign").attr("disabled", true);
        }
    }

});
