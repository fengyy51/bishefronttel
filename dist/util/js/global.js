    //新AJAX封装
    function AjaxNEW(type, url, data, success, withCredentials, failed) {
        // 创建ajax对象
        var xhr = null;

        if(window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP')
        }
        var type = type.toUpperCase();
        // 用于清除缓存
        var random = Math.random();

        if(typeof data == 'object') {
            var str ='';

            for(var key in data) {
                str += key+'='+data[key]+'&';
            }
            data = str.replace(/&$/, '');
        }
        xhr.withCredentials = withCredentials;
        xhr.responseType ="text";

        if(type == 'GET') {
            if(data) {
                xhr.open('GET', url + '?' + data, true);
            }
            else {
                xhr.open('GET', url + '?t=' + random, true);
            }
            xhr.send();
        }
        else if(type == 'POST') {
            xhr.open('POST', url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(data);
        }
        // 处理返回数据
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    success(xhr.responseText);
                }
                else {
                    if(failed) {
                        failed(xhr.status);
                    }
                }
            }
        }
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
    function setCookie_29(argunment,val) {
            var day = 29;
            var exp = new Date();
            exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
            document.cookie = argunment+"=" + val + ";expires=" + exp.toGMTString()+";path=/";
            // console.log(document.cookie);
    }
    // 2*60秒
    function setCookie(argunment,val) {          
            var exp = new Date();
            exp.setTime(exp.getTime() + 2*60 * 1000);
            document.cookie = argunment+"=" + val + ";expires=" + exp.toGMTString()+";path=/";
            // console.log(document.cookie);
    }
    function setCookie_time(argument,val,time){
            var exp = new Date();
            exp.setTime(exp.getTime() + time * 1000);
            document.cookie = argument+"=" + val + ";expires=" + exp.toGMTString()+";path=/";
            // console.log(document.cookie);
    }
    function convertTime(nowDate,Deadline){
    	var dateArr=Deadline.split(':');
    	var hours=parseInt(dateArr[0]);
    	var minutes=parseInt(dateArr[1]);
    	var seconds=parseInt(dateArr[2]);
    	nowDate.setHours(hours);
    	nowDate.setMinutes(minutes);
    	nowDate.setSeconds(seconds);
    	return nowDate;
//  	var result=Date.parse(nowDate);
//  	return result;
    }
    function setCookie_timedetail(argument,val,time){
    	var curDate=new Date();
    	var curTime=curDate.getTime();
    	console.log(curTime);
    	var endTime=convertTime(curDate,time);
    	console.log(endTime);
//  	var disTime=endTime-curTime;
//  	console.log(disTime);
//  	var exp=new Date();
//  	exp.setTime(exp.getTime()+disTime); //24*60*60*1000);
//  	console.log(exp);
    	document.cookie = argument+"=" + val + ";expires=" + endTime.toGMTString()+";path=/";
        console.log(document.cookie);
    }
    function getCookie(argument,val){
    	var cookie = document.cookie;
        var cookieContent = cookie.split("; ");
        for (var i = 0; i < cookieContent.length; i++) {
            var arr = cookieContent[i].split("=");
            if (argument == arr[0]) {
                val = arr[1];
                return decodeURI(val);
            }
        }
        return null;
    }
    function delCookie(name)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
    // "http://fbinwang.liuhongnan.com/page/sign.html"
    function getUserId(url) {
        // 查看是否为第一次登录，如果是第一次登录，则先获取code值，如果不是第一次登录，则通过cookie获取。
           
            if (getQueryString("code")== null) {
                getCode();
            }
            if ((code = getQueryString("code")) != null) {
                getopenId(code);                
            }
         
        // 获取code
        function getCode() {
            var APPID = APPIDall;
            var REDIRECT_URI = encodeURI(url);
            var SCOPE = "snsapi_userinfo";
            var STATE = "1";           
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code" + "&scope=" + SCOPE + "&state=" + STATE + "#wechat_redirect";

        }

        // 通过code获取openId 
        function getopenId(code_get) {
            $.ajax({
                url: urlServer + "/user/do-auth",
                type: "GET",
                dataType: "json",
                data: {
                    "code": code_get
                },
                success: function(data) {
                    var code_re = data.code;
                    openId = data.data.openId;
                    // alert("doAuth");
                    console.log(code_re);
                    console.log(code_get);
                    console.log(openId);
                    if (code_re == 200) {
                        // cookie保存30天的openId 
                        setCookie_29("openId",openId);
                    }
                },
                error: function(error) {
                    console.log(error);
                    alert("getOpenId失败");
                }
            });
        }
    }