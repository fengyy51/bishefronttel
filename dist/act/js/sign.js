$(document).ready(function() {
    var urlRegItem="/act/get-reg-item";//获取用户选择的报名项、活动题目、活动截止时间
    var urlDetailReg="/act/get-detail-reg";//获取自定义报名项具体内容
    var urlNumber = "/act/judge-signed-num"; //获取是否达到人数上限
    var urlXinXi = "/act/submit/free"; //免费活动信息传给后台信息
    var urlIfSign = "/act/is-sign-up";//是否已报名
    var postflag=true;//是否已投票
    var reg=[];
    var regItem=[];
    var username="binwang158";
    var postReg=new Array();
    var id;
    var price;
    var limitNumber;
    // 获取用户openid，用户授权
    var openId='yy';
    var options={
        url:urlYuming+"/act/page/detail.html?id="+getCookie("id")+"&price="+getCookie("price")+"&username="+getCookie("username")+"&limitNumber="+limitNumber,
        urlServerauth:urlServer+"/user/do-auth",
        APPID:APPIDall
    }
    function callbackA(id) {
        openId=id;
    }
    function cookieItem() {
        id = getQueryString("id");
        price=getQueryString("price");
        username=getQueryString("username");
        limitNumber=getQueryString("limitNumber");
        var exp = new Date();
        exp.setTime(exp.getTime() + 10*60 * 1000);
        document.cookie = "id"+"=" + id + ";expires=" + exp.toGMTString();
        document.cookie="price="+price+";expires="+exp.toGMTString();
        document.cookie="username="+username+";expires="+exp.toGMTString();
        document.cookie="limitNumber="+limitNumber+";expires="+exp.toGMTString();
    }
    //将id，price，status存入cookie
    cookieItem();
    //获取需要的必填报名项
    getRegItem();
    getDetailReg();
    ifSignContact();
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
                        $("#formSubmitBtn").html("已报名");
                        $("#formSubmitBtn").attr("disabled", true);
                    }
                }
            },
            error: function(error) {
                console.log(error);
                weui.alert("获取用户是否报名出错");
            }
        });
    }
    // getWeChatId(options,callbackA);
    function getRegItem() {
        id=getQueryString("id");
        // id=16;
        $.ajax({
            url:urlServer+urlRegItem,
            async:false,
            data:{
                "actId":id
            },
            success:function (data) {
                var code=data.code;
                if(code==200){
                    var title=data.data.title,
                        endSignTime=data.data.regDeadLine;
                    reg=data.data.reg.split("@@@");
                    regItem=data.data.regItem.split("@@@");
                    var reglen=reg.length;
                    var regItemlen=regItem.length;
                    var description=data.data.description; //活动规则

                    document.querySelector("#title").innerHTML+='<h2 ">'+
                        title+'报名表</h2><div class="info">活动将于<span class="time">'+
                        endSignTime+'</span>截止报名 </div></div>';
                    $('#description').html('规则说明:<br\>'+description);
                    var str="";
                    for(var i=0;i<reglen;i++){
                        var regCookieVal="";
                        if(getCookie(reg[i])!=undefined){
                            regCookieVal=getCookie(reg[i]);
                        }
                        if(reg[i]!="性别"){
                            str+='<div class="weui-cell">\n' +
                                '            <div class="weui-cell__hd"><label class="weui-label">'+reg[i]+'</label></div>\n' +
                                '            <div class="weui-cell__bd">\n';
                            if(reg[i]=="姓名"){
                                str+='<input class="weui-input" id="' +reg[i]+
                                    '" value="'+regCookieVal+'" type="text" required pattern="REG_NAME" maxlength="7"' +
                                    ' placeholder="输入您的姓名" emptyTips="请输入姓名" notMatchTips="请输入正确的姓名">';
                            }
                            else if(reg[i]=="联系电话"){
                                str+='<input class="weui-input" id="' +reg[i]+
                                    '" value="'+regCookieVal+'" type="tel" required pattern="^\\d{11}$" ' +
                                    'maxlength="11" placeholder="输入您现在的手机号" emptyTips="请输入手机号" ' +
                                    'notMatchTips="请输入正确的手机号">\n';
                            }
                            else if(reg[i]=="身份证"){
                                str+='<input class="weui-input" id="' +reg[i]+
                                    '" value="'+regCookieVal+'" type="text" required pattern="REG_IDNUM" ' +
                                    'maxlength="18" placeholder="输入您的身份证号码" emptyTips="请输入身份证号码"' +
                                    ' notMatchTips="请输入正确的身份证号码">\n';
                            }
                            else if(reg[i]=="邮箱"){
                                str+='<input class="weui-input" id="' +reg[i]+
                                    '" value="'+regCookieVal+'" type="text" required pattern="REG_EMAIL"' +
                                    '  placeholder="输入您的邮箱" emptyTips="请输入您的邮箱" notMatchTips="请输入正确的邮箱">\n';
                            }
                            else if(reg[i]=="备注"){
                                str+='<input class="weui-input" id="' +reg[i]+
                                    '" value="'+regCookieVal+'" type="hidden" data-val-maxlength="备注内容不能超过250个字"' +
                                    ' maxlength="250" placeholder="输入备注">\n' +'<div contenteditable="true"></div>\n';
                            }
                            else{
                                str+='<input class="weui-input" id="' +reg[i]+
                                    '" type="text" value="'+regCookieVal+'"' +
                                    ' required  pattern="REG_NULL" placeholder="输入您的'+reg[i]+'" emptyTips="请输入您的"'+reg[i]+
                                    'notMatchTips="请输入正确的" '+reg[i]+'">\n';
                            }
                            str+=
                                '</div>\n' +
                                '            <div class="weui-cell__ft">\n' +
                                '                <i class="weui-icon-warn"></i>\n' +
                                '            </div>\n' +
                                '        </div>';

                        }
                        else{
                            str+='<div class="weui-cell weui-cell_select weui-cell_select-after">\n' +
                                '            <div class="weui-cell__hd">\n' +
                                '                <label for="" class="weui-label">性别</label>\n' +
                                '            </div>\n' +
                                '            <div class="weui-cell__bd">\n' +
                                '                <select class="weui-select" name="sex" id="' +reg[i]+ '" value="'+regCookieVal+'">\n'+
                                '                    <option id="male" value="男"';
                            if(regCookieVal==='男'){
                                str+='selected';
                            }
                            str+= '>男</option>\n' +
                                '                    <option id="female" value="女"';
                            if(regCookieVal==='女'){
                                str+='selected';
                            }
                            str+='>女</option>\n' +
                                '                </select>\n' +
                                '            </div>\n' +
                                '        </div>';

                        }

                    }
                    $('#form').html(str);
                    //免费收费
                    var price=getQueryString("price");
                    // var price=10;
                    document.querySelector("#form").innerHTML+='<div class="weui-cell">'+
                                '<div class="weui-cell__hd"><label class="weui-label">收费</label></div>'+
                                ' <div class="weui-cell__bd">'+
                                '<input class="weui-input" type="text"  id="收费" disabled value="'+price+'元">'+
                                '</div>'+
                                '</div>';
                }

            }
        })
    }
    function getDetailReg() {
        username="binwang158";
        console.log(regItem);
        console.log(username);
        $.ajax({
            url:urlServer+urlDetailReg,
            data:{
                username:username
            },
            success:function (data) {
                var str="";
                for(var i=0;i<regItem.length;i++){
                    for(var j=0;j<data.data.length;j++){
                        if(data.data[j].title==(regItem[i])){
                            var title=data.data[j].title,
                                dtype=data.data[j].dtype,
                                options=data.data[j].options,
                                ifneed=data.data[j].ifneed;
                            var regCookieVal="";
                            if(getCookie(regItem[i])!=undefined){
                                regCookieVal=getCookie(regItem[i]);
                            }
                            str=makeDetailReg(title,dtype,ifneed,options,str,regCookieVal);
                            new_element=document.createElement('script');
                            new_element.setAttribute('type','text/javascript');
                            new_element.setAttribute('src','../js/upload.js');
                            document.body.appendChild(new_element);
                            new_element=document.createElement('script');
                            new_element.setAttribute('type','text/javascript');
                            new_element.setAttribute('src','../js/select.js');
                            document.body.appendChild(new_element);
                        }
                    }
                }
                $('#form').append(str);
            }
        })
    }
    function makeDetailReg(title,dtype,ifneed,options,str,regCookieVal) {
        if(dtype=="输入框"||dtype=="日期"||dtype=="数字"){
            str+= '<div class="weui-cell">\n' +
                '            <div class="weui-cell__hd"><label class="weui-label">'+title+'</label></div>\n' +
                '            <div class="weui-cell__bd">\n';
            if(dtype=="输入框"||dtype=="日期") {
                if (dtype == "输入框") {
                    str += '<input class="weui-input" id="' + title + '"type="text" placeholder="请输入文本" value="'+regCookieVal+'"';
                }
                else if (dtype == "日期") {
                    str += '<input class="weui-input" id="' + title + '"  type="date" value="'+regCookieVal+'"';
                }
                if (ifneed == 'true') {
                    str += 'required  pattern="REG_NULL" emptyTips="输入您的'+title  + '"';
                }
                str+='>';
            }
            if(dtype=="数字"){
                str+='<input class="weui-input" id="' + title + '" type="number" placeholder="请输入数字" value="'+regCookieVal+'"';
                if (ifneed == 'true') {
                    str += 'required  pattern="[0-9]*" emptyTips="请输入您的' + title + '" notMatchTips="请输入正确的' + title + '"';
                }
                str+='>';
            }
            str+=
                '</div>\n' +
                '            <div class="weui-cell__ft">\n' +
                '                <i class="weui-icon-warn"></i>\n' +
                '            </div>\n' +
                '        </div>';
        }
        if(dtype=="多文本"){
            str+='<div class="weui-cells__title" style="margin-bottom: 0;color:#888;background-color: #F0F0F0">'+title+'</div>';
            str+= '<div class="weui-cells weui-cells_form">\n' +
                     '<div class="weui-cell">' +
                '            <div class="weui-cell__bd">\n';
            str+='<textarea class="weui-textarea" id="' + title + '" placeholder="请输入文本" rows="3" ';
            if (ifneed == 'true') {
                str += 'required  pattern="REG_NULL" emptyTips="请输入您的' + title + '" notMatchTips="请输入正确的' + title + '"';
            }
            str+='>'+regCookieVal+'</textarea>';
            str+=
                '</div>\n' +
                '            <div class="weui-cell__ft">\n' +
                '                <i class="weui-icon-warn"></i>\n' +
                '            </div>\n' +
                '        </div>'+
                '        </div>';
        }
        if(dtype=="下拉"){
            if(options!=""){
                var option=options.split('@@@');
                str+='<div class="weui-cell weui-cell_select weui-cell_select-after">\n' +
                    '            <div class="weui-cell__hd">\n' +
                    '                <label for="'+title+i+'" class="weui-label">'+title+'</label>'+
                    '            </div>\n' +
                    '            <div class="weui-cell__bd">\n' +
                    '                <select class="weui-select" name="'+title+'" id="' +title+'" value="'+regCookieVal+'"';
                if (ifneed == 'true') {
                    str += 'required tips="请选择您的'+ title +'"';
                }
                str+= '>' ;
                for(var i=0;i<option.length;i++){
                    str=str+'<option value="'+option[i]+'"';
                    if(regCookieVal===option[i]){
                        str+='selected';
                    }
                    str+='>'+option[i]+'</option>';
                }
                str+='</select>';
                str+=
                    '</div>\n' +
                    '            <div class="weui-cell__ft">\n' +
                    '                <i class="weui-icon-warn"></i>\n' +
                    '            </div>\n' +
                    '        </div>'+
                    '        </div>';

            }

        }
        if(dtype=="多选"){
            if(options!=""){
                var option=options.split('@@@');
                str+='<div class="weui-cells"> <div class="weui-cells__title">'+title+'</div>'+
                    '<div class="weui-cells weui-cells_checkbox">'
                for(var i=0;i<option.length;i++){
                    str+='<label for="'+option[i]+'" class="weui-cell weui-check__label">'+
                        '<div class="weui-cell__hd">'+
                        '<input type="checkbox" class="weui-check" name="'+title+'" id="'+option[i]+'"'+'value="'+option[i]+'"';
                    if(ifneed=='true'){
                        str+='required pattern={1,} tips="请选择'+title+'"';
                    }
                    if(regCookieVal===option[i]){
                        str+='checked';
                    }
                    str+='>'+'<i class="weui-icon-checked"></i></div>'+
                        '<div class="weui-cell__bd">'+option[i]+'</div>';
                    str+='</label>';
                }

                str+='</div></div>';
            }
            setCookie_29(title,'select');
        }
        if(dtype=="单选"){
            if(options!=""){
                var option=options.split('@@@');
                str+='<div class="weui-cells"> <div class="weui-cells__title">'+title+'</div>'+
                    '<div class="weui-cells weui-cells_radio">'
                for(var i=0;i<option.length;i++){
                    str+='<label for="'+title+i+'" class="weui-cell weui-check__label">'+
                   '<div class="weui-cell__bd weui-cell_primary"><p>'+option[i]+'</p></div>'+
                        '<div class="weui-cell__ft">'+
                        '<input type="radio" class="weui-check"  name="'+title+'" id="'+title+i+'" value="'+option[i]+'"';
                    if(ifneed=='true'){
                        str+='required tips="请选择'+title+'"';
                    }
                    if(regCookieVal===option[i]){
                        str+='checked';
                    }
                    str+='><span class="weui-icon-checked"></span></div></label>';
                }

                str+=
                    '</div></div>\n';
            }
            setCookie_29(title,'radio');
        }
        if(dtype=="图片"){
            str+='<div class="weui-cell" id="uploader">\n' +
                '            <div class="weui-cell__bd">\n' +
                '                <div class="weui-uploader">\n' +
                '                    <div class="weui-uploader__hd">\n' +
                '                        <p class="weui-uploader__title">'+title+'</p>\n' +
                '                        <div class="weui-uploader__info"><span id="uploadCount">0</span>/5</div>\n' +
                '                    </div>\n' +
                '                    <div class="weui-uploader__bd">\n' +
                '                        <ul class="weui-uploader__files" id="uploaderFiles"><div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过20M</div></ul>\n' +
                '                        <div class="weui-uploader__input-box">\n' +
                '                            <input id="uploaderInput" class="weui-uploader__input" type="file" accept="image/*" capture="camera" multiple="" ';
            document.cookie="img="+encodeURI(title);
            document.cookie="uploadCount="+0;
            document.cookie="imgneed="+ifneed;
            if (ifneed == 'true') {
                str += ' required emptyTips="请上传您的' + title + '" notMatchTips="请上传正确的' + title + '"';
            }
            str+='></div>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>'
        }
     return str;
    }
    // 判断是否人数到达上限   之后需要发给服务器id limitNumber
    function panDuanNumber() {
        var limitNumber=getQueryString('limitNumber');
        var id=getQueryString('id');
        $.ajax({
            url: urlServer + urlNumber,
            type: "GET",
            data: {
                "limit": limitNumber,
                "actId": id
            },
            success: function(data) {
                if (data.code == 200) {
                    var result = data.data.result;
                    // 倒计时5秒，跳转到活动详情页 超过人数上限false
                    if (result == false) {
                        var sec = 5; //倒计时的秒数
                        var strHtml = '<div class="alert">当前报名人数已达到上限,将在<span id="sec">' + sec + '</span>秒后跳转到活动详情页</div>'
                        $("#form_Sign").append(strHtml);

                        setInterval(function() {
                            sec -= 1;
                            $("#sec").html(sec);
                            if (sec == 0) {
                                clearInterval();
                                window.location.href = "../page/detail.html";
                            }
                        }, 1000);

                    }
                    //true可以报名进入提交信息接口
                    else {
                        // alert("未达到人数上限");
                        console.log("renshu");
                        postForm();
                    }
                }
            }

        })
    }

    //提交表单开始
    // 表单提交
    document.querySelector('#formSubmitBtn').addEventListener('click', function () {
        weui.form.validate('#form', function (error) {
            console.log(error);
            if(getCookie("imgneed")=="true"&&getCookie("uploadCount")=='0'){
                weui.form.showErrorTips({
                    ele: document.getElementById("uploaderInput"),
                    msg: 'empty'
                 });
            }else{
                weui.form.hideErrorTips(document.getElementById("uploaderInput"));
                if (!error) {
                    panDuanNumber();
                }
            }
        }, regexp);
    });
    function postForm() {
        var loading = weui.loading('提交中...');
        postReg.splice(0,postReg.length);//清空数组
        var price=getQueryString("price");
        // var price=10;
        var chargeType,status;
        if(price==0){
            chargeType=0;//免费
            status=0;//报名成功
        }else {
            chargeType=1;
            status=2;//未支付
        }
        var imgtitle=getCookie("img");
        var imgurl=getCookie(imgtitle);
        console.log(imgtitle);
        console.log(imgurl);
        if((imgtitle!=null||imgtitle!=undefined||imgtitle!='undefined')&&(imgurl!=null||imgurl!=undefined)){
            postReg.push(imgtitle+"?"+imgurl);
            delCookie(imgtitle);
        }
        console.log(postReg);

        var reglen=reg.length;
        if(reglen!=0){
            for(var i=0;i<reglen;i++){
                if(reg[i]!=undefined){
                    postReg.push(reg[i]+"?"+$("#"+reg[i]).val());
                    setCookie_29(reg[i],$("#"+reg[i]).val());
                }
            }
        }
        // console.log(regItem);
        var regitemlen=regItem.length;
        console.log(regitemlen);
        if(regItem[0]!=""){
            for(var i=0;i<=regitemlen;i++){
                if(regItem[i]!=imgtitle&&regItem[i]!=undefined){
                    var selectTitle,radioTitle;
                    if( (selectTitle=getCookie(regItem[i]))=='select'){
                        var selectbox=document.getElementsByName(regItem[i]);
                        var selectarr=[];
                        for(var j=0;j<selectbox.length;j++){
                            if(selectbox[j].checked==true){
                                selectarr.push(selectbox[j].value);
                            }
                        }
                        var selectstr=selectarr.join('&');
                        postReg.push(regItem[i]+"?"+selectstr);

                        // setCookie_29(regItem[i],$("#"+regItem[i]).val());
                    }else if((radioTitle=getCookie(regItem[i]))=='radio'){
                        var radiobox=document.getElementsByName(regItem[i]);
                        // console.log(radiobox);
                        // console.log(radiobox.length);
                        var radioarr=[];
                        for(var j=0;j<radiobox.length;j++){
                            if(radiobox[j].checked==true){
                                radioarr.push(radiobox[j].value);
                            }
                        }
                        var radiostr=radioarr.join('&');
                        postReg.push(regItem[i]+"?"+radiostr);
                    }else{
                        postReg.push(regItem[i]+"?"+$("#"+regItem[i]).val());
                        setCookie_29(regItem[i],$("#"+regItem[i]).val());
                    }

                }
            }
        }
        var str=postReg.join(';');
        // console.log(str);

        if(postflag==true){
            $.ajax({
                url: urlServer + urlXinXi,
                type: "POST",
                data: {
                    "openId": openId,
                    "actId": id,
                    "chargeType":chargeType,
                    "status":status,
                    "postReg":str,
                },
                success: function(data) {
                    var code=data.code;
                    if(code==200){
                        var result = data.data.result;
                        if(result==true){
                            loading.hide();
                            postflag=false;
                            $("#formSubmitBtn").html("已报名");
                            $("#formSubmitBtn").attr("disabled", true);
                            window.location.href="../page/signsuccess.html?status="+status+"&id=" + id;
                        }

                        //
                        // 点击报名后，跳转到活动凭证页，将活动id 用户openid 粘在url中开始 放在校验等流程后

                        // window.location.href = "../page/proof?id=" + id + "&openId=" + openId;
                    }else{
                        loading.hide();
                        weui.toast('提交失败', 3000);
                    }
                },
                error:function (error) {
                    loading.hide();
                    weui.toast('提交失败', 3000);
                }
            });
        }

    }
});
    //提交表单结束



    // // 获取用户openid，用户授权
    // function callbackA(id) {
    //     openId=id;
    //     // alert(id);
    //     ifSignContact();
    // }
    // // getWeChatId(options,callbackA);
    // InfoContact();

    // 获取短信验证码
    // 校验手机号验证码格式
    // input_iphone.on("change", function() {
    //     // 十一位数字手机号格式组成，否则报错
    //     if (/^1[3|7|5|8]\d{9}$/.test(input_iphone.val())) {
    //         alert_iphone.html('');
    //         alert_iphone.removeClass('alert_show');
    //         alert_iphone.addClass('alert_hide');
    //     } else {
    //         alert_iphone.html('手机号格式错误,请重新输入');
    //         alert_iphone.removeClass('alert_hide');
    //         alert_iphone.addClass('alert_show');
    //     }
    //
    // });
    // 点击发送验证码，倒计时60秒
    // click_message.on("click", function() {
    //     var iphone_val = input_iphone.val();
    //     // if (iphone_val != "" && alert_iphone.html() == '') {
    //         $.ajax({
    //             url: urlServer + urlYanZhengMa,
    //             type: "GET",
    //             data: {
    //                 "mobile": iphone_val
    //             },
    //             success: function(data) {
    //
    //                 // 短信验证码已发送后的样式
    //                 if (data.code == "200") {
    //                     alert_iphone.html('短信验证码已发送');
    //                     alert_iphone.removeClass('alert_hide');
    //                     alert_iphone.addClass('alert_show');
    //                     click_message.css("backgroundColor", '#b4b2b3');
    //                     // 保存获取到的key值
    //                     key = data.data.verifyKey;
    //                     document.cookie = "key=" + key;
    //                     console.log(key);
    //                     click_message.attr("disabled", true);
    //                     //倒计时开始 60s
    //                     //下面就是实现倒计时的效果代码
    //                     var d = new Date();
    //                     d.setSeconds(d.getSeconds() + 59);
    //                     var m = d.getMonth() + 1;
    //                     var time = d.getFullYear() + '-' + m + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    //                     var id = "#click_message";
    //                     var end_time = new Date(Date.parse(time.replace(/-/g, "/"))).getTime(),
    //                         //月份是实际月份-1
    //                         sys_second = (end_time - new Date().getTime()) / 1000;
    //                     var timer = setInterval(function() {
    //                             if (sys_second > 1) {
    //                                 sys_second -= 1;
    //                                 var day = Math.floor((sys_second / 3600) / 24);
    //                                 var hour = Math.floor((sys_second / 3600) % 24);
    //                                 var minute = Math.floor((sys_second / 60) % 60);
    //                                 var second = Math.floor(sys_second % 60);
    //                                 var time_text = '';
    //                                 if (day > 0) {
    //                                     time_text += day + '天';
    //                                 }
    //                                 if (hour > 0) {
    //                                     if (hour < 10) {
    //                                         hour = '0' + hour;
    //                                     }
    //                                     time_text += hour + '小时';
    //                                 }
    //                                 if (minute > 0) {
    //                                     if (minute < 10) {
    //                                         minute = '0' + minute;
    //                                     }
    //                                     time_text += minute + '分';
    //                                 }
    //                                 if (second > 0) {
    //                                     if (second < 10) {
    //                                         second = '0' + second;
    //                                     }
    //                                     time_text += second + '秒';
    //                                 }
    //                                 $(id).val(time_text);
    //                             } else {
    //                                 clearInterval(timer);
    //                                 click_message.removeAttr("disabled");
    //                                 click_message.val('获取验证码');
    //                                 click_message.css("background-color", "#04BE02");
    //                                 alert_iphone.html('');
    //                             }
    //                         },
    //                         1000);
    //
    //                     //倒计时结束
    //
    //                 } else if (data.code == "500") {
    //                     alert_iphone.html('发送失败，请再试一次');
    //                     alert("发送短信频率到达上限");
    //                 }
    //
    //             },
    //             error: function(error) {
    //                 console.log(error);
    //                 alert("获取短信验证码失败");
    //             }
    //
    //         });
    //     // }


