$(document).ready(function() {
    var urlList = "/luck/list/win-detail";
    // 获取用户openid，用户授权
    var openId="yy";
    // var options={
    //     url:urlYuming+"/personal/page/prizelist",
    //     urlServerauth:urlServer+"/user/do-auth",
    //     APPID:APPIDall
    // }
    function callbackA(id) {                
        openId=id;
        // alert("ss");
        ajaxContact();
    }
    ajaxContact();
    // getWeChatId(options,callbackA);
     // 苹果手机只可用此委托
    $(".body").delegate(".item","click",function(){
        window.location.href = "../page/prize.html?id=" + $(this).find("#id").text();// + "&priceType=" +$(this).find(".price").text();
    })
   
    function ajaxContact() {
        $.ajax({
            url: urlServer + urlList,
            data: {
                "openId": openId
            },
            success: function(data) {
                var code = data.code;
                if (code == 200) {
                    // console.log(data);
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
        // var prize=["一等奖","二等奖","三等奖","幸运奖"];
        var ifUse=["未使用","已使用"];
        for (var i = 0; i < list.length; i++) {
            var optionHtml = '<div class="item" style="cursor:pointer">'+
            '<div class="tupian"><img src="../resource/img/prize2.jpg"></div>'+
            '<div class="content">'+
            '<div class="type">奖项类别:'+list[i].type+'</div>'+
            '<div class="name">奖项名称:<span class="PrizeName">'+list[i].name+'</span></div>'+
            // '<div class="info">奖项说明:'+list[i].info+'</div>' + 
            // '<div class="duiTime">兑奖时间:'+list[i].duijiangTime+'</div>'+
            // '<div class="duiAddress">兑奖地点：'+list[i].duijiangLoc+'</div>'+
            // '<div class="code">兑奖码：'+list[i].code+'</div>'+
            '<div class="isUseContent right"><span class="isUse">'+ifUse[list[i].isUse]+'</span></div>'+
            '<div class="idContent"><span class="id" >' + list[i].prizeId + '</span><span class="id" id="id">'+list[i].id+'</span></div></div></div>';

            strHtml = strHtml + optionHtml;
        }
        // console.log(strHtml);
        if(list.length>0){
            $('.footest').css("display","none");
        }        
        $("#prizelist .body").html(strHtml);


    }
  
    
   
    

})
