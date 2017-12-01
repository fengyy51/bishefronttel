$(document).ready(function() {
    var urlList = "/act/personal-list";
    // 获取用户openid，用户授权
    var openId="yy";
    var codeStatus_prooflist;
    // openId = getCookie("openId");
    // var cookieIndex = document.cookie.indexOf("openId");
    // cookie中没有值初次登录
    // if (cookieIndex == -1) {
    //     getUserId(urlYuming+"/act/page/prooflist.html");
    // }
    ajaxContact();
    // $(document).on("touchstart", ".item", function() {
    //     window.location.href = "../page/proof.html?id=" + $(this).find(".id").text() + "&priceType=" +$(this).find(".price").text();
    // });
    // 苹果手机只可用此委托
    $(".body").delegate(".item","click",function(){
        window.location.href = "../page/proof.html?id=" + $(this).find(".id").text();// + "&priceType=" +$(this).find(".price").text();
    })
   
    function ajaxContact() {
        $.ajax({
            url: urlServer + urlList,
            type: "GET",
            // dataType: "json",
            data: {
                "openId": openId
            },
            success: function(data) {
                var code = data.code;
                if (code == 200) {
                    console.log(data);
                    // alert("huoqushujuchenggong");
                    var list = data.data;
                    makeList(list);
                }

            },

            error: function(error) {
                alert('获取活动列表出错');
                console.log(error);
            }
        });
    }

    function makeList(list) {
        var strHtml = '';
        for (var i = 0; i < list.length; i++) {
            var imgUrl="";
            if(list[i].img==''){
                imgUrl="../../util/img/background.jpg";
            }else{
                imgUrl=list[i].img;
            }
            var optionHtml = '<div class="item" style="cursor:pointer"><div class="tupian"><img src=' + imgUrl + '></div><div class="content"><div class="decoration">' +
                list[i].name + '</div><div class="time"><span class="ActivityTime"><span class="startTime">' + list[i].startActivityTime + '-' + list[i].endActivityTime + '</span></span></div><div class="addressContent"><span class="address">' + list[i].address + '</span></div>' + '<div class="idContent"><span class="id" >' + list[i].actId + '</span></div><div class="priceContent"><span class="price">';
            if (list[i].priceType == "0") {
                optionHtml = optionHtml + '免费</span></div></div></div>';
            } else {
                optionHtml = optionHtml + '收费</span></div></div></div>';
            }

            strHtml = strHtml + optionHtml;
        }
        if(list.length>0){
            $('.footest').css("display","none");
        }        
        $("#prooflist .body").html(strHtml);


    }
    function _click(){
        window.location.href = "../page/proof.html?id=" + $(this).find(".id").text() + "&priceType=" +$(this).find(".price").text();

    }
})
