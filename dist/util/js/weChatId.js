/*
options为：
    argunment:当前页面是否已调用getCode方法的标志，如果已经调用getCode方法，则将此标志存入cookie。
            例子：将argument设为"codeStatus_sign"
    url:用户授权时的回调url，此url应放在公众号指定的域名下
    urlServer:发送给后台服务器的openid请求地址
    APPID:微信公众号的唯一标识
    callback：处理ajax请求回调函数的方法 可以看下面的例子，在使用时先在callback函数中对openId赋值，
            之后在callback中走正常的逻辑。

使用举例说明：建立一个新的js文件，内容如下
$(document).ready(function() {
    var openId;
    function callbackA(id) {
        console.log("ss",id);
        openId=id;
        $.ajax({
            url:"",
            data:{
                "openId":openId
            },
            "type":"GET",
            success:function(data){
    
            },
            error:function(error){
                console.log(error);
            }
        })
    }
    var options={
        argunment:"codeStatus_Sign",
        url:"http://fbinwang.liuhongnan.com/collect/page/test.html",
        urlServer:"http://123.57.37.50:8085/user/do-auth",
        APPID:"wx859f2afeb6d618c3"
        
    }
    getWeChatId(options,callbackA);
    
});

*/
function getWeChatId(options,callback) {
    var url=options.url,
        urlServerauth=options.urlServerauth,
        APPID=options.APPID;
    var cookieIndex = document.cookie.indexOf("openId");
    // cookie中没有值初次登录
    if (cookieIndex == -1) {
        getUserId(url);
    } else {
        callback(getCookie("openId"));
    }

    function getCookie(argument) {
        var cookie = document.cookie;
        var cookieContent = cookie.split("; ");
        for (var i = 0; i < cookieContent.length; i++) {
            var arr = cookieContent[i].split("=");
            var re;
            if (argument == arr[0]) {
                re = arr[1];
                return re;
            }
        }
        return null;
    }
    // 解析url参数函数
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
    // 保存29天
    function setCookie_29(argunment, val) {
        var day = 29;
        var exp = new Date();
        exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
        document.cookie = argunment + "=" + val + ";expires=" + exp.toGMTString()+";path=/";
        // console.log(document.cookie);
    }
    // 2*60秒
    function setCookie(argunment, val) {
        var exp = new Date();
        exp.setTime(exp.getTime() + 2 * 60 * 1000);
        document.cookie = argunment + "=" + val + ";expires=" + exp.toGMTString()+";path=/";
        // console.log(document.cookie);
    }

    function getUserId(reurl) {
        // 查看是否为第一次登录，如果是第一次登录，则先获取code值，如果不是第一次登录，则通过cookie获取。
    
        if (getQueryString("code")== null) {
            getCode();
        }
        if ((code = getQueryString("code")) != null) {
            getopenId(code);
        }

        // 获取code
        function getCode() {
            var REDIRECT_URI = encodeURI(reurl);
            var SCOPE = "snsapi_userinfo";
            var STATE = "1";
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code" + "&scope=" + SCOPE + "&state=" + STATE +"#wechat_redirect";
        }

        // 通过code获取openId 
        function getopenId(code_get) {
            $.ajax({
                url: urlServerauth,
                type: "GET",
                dataType: "json",                
                data: {
                    "code": code_get
                },
                success: function(data) {
                    var code_re = data.code;
                    console.log(code_re);
                    // alert("doAuth");
                    // console.log(code_re);
                    // console.log(code_get);
                    // console.log(openId_get);
                    if (code_re == 200) {
                        openId_get = data.data.openId;
                        // cookie保存30天的openId 
                        setCookie_29("openId", openId_get);
                        openId=openId_get;
                        // alert("cg");
                        // openId = getCookie("openId");
                        // console.log("内部", openId_get);
                        callback(openId_get);
                        return;
                        // if(openId!=undefined&&openId!=null){
                        //     return openId;
                        // }
                    }
                },
                error: function(error) {
                    console.log(error);
                    alert("getOpenId失败");
                }
            });
        }

    }
}


