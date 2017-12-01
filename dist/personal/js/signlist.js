$(document).ready(function() {
    // var urlList = "/act/personal-list";
    // 获取用户openid，用户授权
    var openId;
    var options={
        url:urlYuming+"/personal/page/signlist.html",
        urlServerauth:urlServer+"/user/do-auth",
        APPID:APPIDall       
    }
    function callbackA(id) {                
        openId=id;
        ajaxContact();       
        function ajaxContact() {
        $.ajax({
            // url: urlServer + urlList,
            url:"../json/prizelist.json",
            type: "GET",
            // dataType: "json",
            // data: {
            //     "openId": openId
            // },
            success: function(data) {
                var code = data.code;
                if (code == 200) {
                    console.log(data);
                    // alert("huoqushujuchenggong");
                    var list = data.data.list;
                    makeList(list);
                }

            },

            error: function(error) {
                alert('获取奖券列表出错');
                console.log(error);
            }
        });
    }

    function makeList(list) {
        var strHtml = '';
        for (var i = 0; i < list.length; i++) {
            var optionHtml = '<div class="item" style="cursor:pointer"><div class="tupian"><img src="../resource/img/prize.jpg"></div><div class="content"><div class="PrizeName">'+list[i].name+'</div><div class="info">'+list[i].info+'</div>' + '<div class="idContent"><span class="id" >' + list[i].prizeId + '</span></div></div></div>';

            strHtml = strHtml + optionHtml;
        }
        console.log(strHtml);
        if(list.length>0){
            $('.footest').css("display","none");
        }        
        $("#prizelist .body").html(strHtml);


    }
    }    
    getWeChatId(options,callbackA);
    // $(document).on("touchstart", ".item", function() {
    //     window.location.href = "../page/proof.html?id=" + $(this).find(".id").text() + "&priceType=" +$(this).find(".price").text();
    // });
    // 苹果手机只可用此委托
    $(".body").delegate(".item","click",function(){
        window.location.href = "../page/prize.html?id=" + $(this).find(".id").text();// + "&priceType=" +$(this).find(".price").text();
    })
   
    

})
