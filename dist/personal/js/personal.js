
 $(document).ready(function() {
     var codeStatus; //false为未获取code
     var code,openId="yy";
     var urlGetId="/collect/personal-submit-result";
     // 点击我的活动，若未登录，提示信息，若已登录，跳转到活动凭证页面
    //  window.alert = function(name){
    //     var iframe = document.createElement("IFRAME");
    //     iframe.style.display="none";
    //     iframe.setAttribute("src", 'data:text/plain,');
    //     document.documentElement.appendChild(iframe);
    //     window.frames[0].window.alert(name);
    //     iframe.parentNode.removeChild(iframe);
    // }
// function alertNew(content,title){
//     $('#alert .weui_dialog_title').html(title);
//     $('#alert .weui_dialog_bd').html(content);
//      var $alert=$('#alert');
//     $alert.show();
//     $alert.find('.weui_btn_dialog').on('click', function () {
//         $alert.hide();
//     });
// }
     $("#click_Activity").on("click", function() {
         var topPicture_div = $('#topPicture div');
         if (topPicture_div.text() == "立即登录") {
             weui.alert("请您首先登录！")
            // alertNew("请您首先登录！");
             // yy_tishi.alertNew('提示信息', '请您首先登录！','alertNew_red');
         } else {
             window.location.href = "../page/prooflist.html";
         }
     });
     $("#click_Prize").on("click", function() {
         var topPicture_div = $('#topPicture div');
         if (topPicture_div.text() == "立即登录") {
            weui.alert("请您首先登录！");
             // yy_tishi.alertNew('提示信息', '请您首先登录！','alertNew_red');
         } else {
             window.location.href = "../page/prizelist.html";
         }
     });
     $("#click_Sign").on("click", function() {
        var postflag=getCookie("postflag");
        var topPicture_div = $('#topPicture div');
        if (topPicture_div.text() == "立即登录") {
            weui.alert("请您首先登录！");
        } else{
            openId=getCookie("openId",openId);
            console.log("click",openId);
            $.ajax({
                url:urlServer+urlGetId,
                data:{
                    "openId":openId,
                    "collectId":collectId
                },
                success:function(data){
                    var code=data.code;
                    if(code==200){
                        var id=data.data.id;                      
                        window.location.href = "../../collect/page/signSuccess?id=" + id;
                    }
                    else if(code==500){
                        weui.alert("您未报名！");
                    }
                },
                error:function(error){
                    console.log(error);
                    weui.alert("获取作品征集结果失败");
                }
            })
        
        }
     });
     
    // 查看是否为第一次登录，如果是第一次登录，则先获取code值，再获取个人信息，如果不是第一次登录，则通过cookie获取个人信息。
    // 获取用户openid，用户授权
        
    var cookieIndex=document.cookie.indexOf("openId");  
    var a = $('#click_denglu');           
     // cookie中没有值初次登录
    if (cookieIndex == -1) {
         a.on("click", function(){
            var urlRe=urlYuming+"/personal/page/personal";
            getCode(urlRe);
         });
        if(getQueryString("code")!=null){
            code=getQueryString("code");
            console.log(code);
            getopenId(code); 
        }          
    }
     // // 不是初次登录，通过openId获取用户信息
    else {
        if(getQueryString("code")!=null){
            code=getQueryString("code");
            console.log(code);
            getopenId(code); 
        }else{
            openId=getCookie("openId",openId);
            getUserInfo(openId);  
        }

    }
    // 获取code
        function getCode(urlRe) {
            console.log(urlRe);
            var APPID = APPIDall;
            var REDIRECT_URI = encodeURI(urlRe);
            var SCOPE = "snsapi_userinfo";
            var STATE = "1";
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code" + "&scope=" + SCOPE + "&state=" + STATE + "#wechat_redirect";

        }
     
     // 通过code获取openId 
     function getopenId(code_get) {
         $.ajax({
             url:urlServer+"/user/do-auth",
             type:"GET",
             dataType:"json",
             data:{
                 "code": code_get
             },
             success:function(data) {
                 var code_re = data.code;
                 openId = data.data.openId;
                 // alertNew("doAuth");
                 // alertNew("openid"+code_re);
                 console.log(code_get);
                 console.log(openId);
                 if (code_re == 200) {
                     // cookie保存29天的openId 
                     setCookie_29("openId",openId);
                     getUserInfo(openId);
                 } 
             },
             error:function(error) {
                 console.log(error);
                 weui.alert("getOpenId失败" );
             }
         });

     }
     function getUserInfo(openId) {
         $.ajax({
             url: urlServer+"/user/get-info",
             type:"GET",
             dataType:"json",
             data: {
                 "openId": openId
             },
             success: function(data) {
                 var code_re = data.code,
                    doAuth = data.data.doAuth;                 
                    console.log(code_re);
                 if (code_re == 200) {
                     // openid验证成功，accesstoken未失效
                     if (doAuth == false) {
                        var userInfo = data.data.userInfo,
                            user_nickname = userInfo.nickName,
                            user_headImgurl = userInfo.headImgUrl,
                            sex = userInfo.sex;
                        updateTopPicture(user_headImgurl, user_nickname);
                     }
                     // accesstoken已经失效，需要重新获取code
                     else {
                        getCode();
                     }
                 } 

             },
             error: function(error) {
                 console.log(error);
                 weui.alert("getUserInfo失败");
             }
         });
     }
     // updateTopPicture("../resource/img/prize2.jpg", "yy");
     function updateTopPicture(headimgurl, nickname) {
         var topPicture = $('#topPicture');
         // alertNew(nickname);
         var strHtml = '<a id="click_denglu" href="#"><img src=' + headimgurl + ' id="headimg"><div id="nickname">' + nickname + '</div></a>';
         topPicture.html(strHtml);
     }
 })
