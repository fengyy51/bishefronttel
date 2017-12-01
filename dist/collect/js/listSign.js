$(document).ready(function() {
    var urlInfo = "/collect/get-init-info";
    var urlifSign = "/collect/is-has-post"
    var urlpostInfo = "/collect/post-info";
    var nameInput = $('#NameInput');
    var alert_Name = $('#Name');
    // var weixinInput = $('#WeixinInput');
    var alert_Weixin = $('#Weixin');
    var telephoneInput = $('#TelephoneInput');
    var alert_Telephone = $('#Telephone');
    var brandNameInput = $('#BrandNameInput');
    var alert_BrandName = $('#BrandName');
    var unitInput=$('#UnitInput');
    var alert_Unit=$('#Unit');
    // var alert_BrandImg=$('#BrandImg');
    var alert_ProductImg=$('#ProductImg');
    var productDecorationInput = $('#ProductDecorationInput');
    var alert_ProductDecoration = $('#ProductDecoration');    
    var JiaoYanVal;
    var click_Sign = $('#click_Sign');
    var openId="yy";
    var options={
        url:urlYuming+"/collect/page/listSign.html",
        urlServerauth:urlServer+"/user/do-auth",
        APPID:APPIDall      
    }
    function callbackA(id) {                
        openId=id; 
        // alert(id);  
        ifSignContact();          
    }  
    // getWeChatId(options,callbackA);
    ifSignContact();
    InfoContact();    
    JiaoYan();  
    function InfoContact() {       
        $.ajax({
            url: urlServer + urlInfo,
            // url:"../json/info.json",
            type: "GET",
            data: {
                "collectId": collectId
            },
            success: function(data) {
                var code = data.code;
                if (code == 200) {
                    var name = data.data.name;
                    var description = data.data.description;
                    $('h2').html(name);
                    $('#Activitydecoration').html(description);
                }
            },
            error: function(error) {
                console.log(error);
                alert("获取报名信息出错");
            }
        })
    }

    function PostContact() {
        // console.log(ImgUrl);
        var ProductImgUrl="";
        for(var i=0;i<productImgUrl.length;i++){
            ProductImgUrl=ProductImgUrl+productImgUrl[i]+"@@@";
        }
        console.log(openId);
        $.ajax({
            url: urlServer + urlpostInfo,
            //url: "../json/post.json",
            type: "POST",
            data: {
                "collectId": collectId,
                "name": nameInput.val().trim(),
                "wechatId": "",
                "mobile": parseInt(telephoneInput.val()),
                "brandName": brandNameInput.val().trim(),
                "productImgUrls": ProductImgUrl,
                "intro": productDecorationInput.val().trim(),
                "brandImgUrl":"",
                "recUnit":unitInput.val().trim(),
                "openId":openId
                
            },
            success: function(data) {
                var code = data.code;
                if (code == 200) {
                    click_Sign.html("已报名");
                    click_Sign.attr("disabled",true);
                    var id = data.data.id;
                    console.log(openId);                    
                    window.location.href = "../page/signSuccess?id=" + id;

                }
            },
            error: function(error) {
                console.log(error);
                alert("提交报名信息出错");
            }
        })
    }

    function ifSignContact() {
        console.log(openId);
        $.ajax({
            url: urlServer + urlifSign,           
            type: "GET",
            data: {
                "collectId": collectId,
                "openId": openId
            },
            success: function(data) {
                var code = data.code;
                if (code == 200) {
                    var result = data.data.result;
                    // alert(result);
                    if (result == true) {
                        // alert_Weixin.html("您已报名，请勿重复报名！");
                        // alert_Weixin.removeClass('alert_hide');
                        // alert_Weixin.addClass('alert_show');
                        alert("您已报名，请勿重复报名！");
                        click_Sign.html("已报名");
                        click_Sign.attr("disabled", true);
                        JiaoYanVal = true;
                    } else {
                        alert_Weixin.html("校验成功！");
                        alert_Weixin.css("color", "#3080e8")
                        alert_Weixin.removeClass('alert_hide');
                        alert_Weixin.addClass('alert_show');
                        click_Sign.removeAttr('disabled');
                        JiaoYanVal = false;
                    }
                }
            },
            error: function(error) {
                console.log(error);
                alert("获取报名信息出错");
            }
        })
    }

    function JiaoYan() {
        nameInput.on("change", function() {
            if(nameInput.val() != ''){
                alert_Name.removeClass('alert_show');
                alert_Name.addClass('alert_hide');
            }           
        });
        // weixinInput.on("change", function() {
        //     alert_Weixin.removeClass('alert_show');
        //     alert_Weixin.addClass('alert_hide');
        // });
        // weixinInput.on("blur",function(){
         
        // })
        telephoneInput.on("change", function() {
            if(telephoneInput.val()!=''){
                alert_Telephone.removeClass('alert_show');
                alert_Telephone.addClass('alert_hide');
            }            
        });
        telephoneInput.on("blur", function() {
            if (/^1[3|7|5|8]\d{9}$/.test(telephoneInput.val())) {
                alert_Telephone.html('');
                alert_Telephone.removeClass('alert_show');
                alert_Telephone.addClass('alert_hide');
            } else {
                alert_Telephone.html('手机号格式错误,请重新输入');
                alert_Telephone.removeClass('alert_hide');
                alert_Telephone.addClass('alert_show');
            }
        });
        brandNameInput.on("change", function() {
            if(brandNameInput.val()!=''){
                alert_BrandName.removeClass('alert_show');
                alert_BrandName.addClass('alert_hide');
            }            
        });
        unitInput.on("change", function() {
            if(unitInput.val()!=''){
                alert_Unit.removeClass('alert_show');
                alert_Unit.addClass('alert_hide');
            }            
        });
        productDecorationInput.on("change", function() {
            if(productDecorationInput.val()!=''){
                alert_ProductDecoration.removeClass('alert_show');
                alert_ProductDecoration.addClass('alert_hide');
            }            
        });       

        click_Sign.on("click", function() {
            // alert("dd");
            if ($.trim(nameInput.val()).length==0) {
                alert_Name.removeClass('alert_hide');
                alert_Name.addClass('alert_show');
            }            
            if ($.trim(telephoneInput.val()).length==0) {
                alert_Telephone.html("请填写此项");
                alert_Telephone.removeClass('alert_hide');
                alert_Telephone.addClass('alert_show');
            } else if (/^1[3|7|5|8]\d{9}$/.test(telephoneInput.val())) {
                alert_Telephone.html('');
                alert_Telephone.removeClass('alert_show');
                alert_Telephone.addClass('alert_hide');
            } else {
                alert_Telephone.html('手机号格式错误,请重新输入');
                alert_Telephone.removeClass('alert_hide');
                alert_Telephone.addClass('alert_show');
            }
            if ($.trim(brandNameInput.val()).length==0) {
                alert_BrandName.removeClass('alert_hide');
                alert_BrandName.addClass('alert_show');
            }
            if ($.trim(unitInput.val()).length==0) {
                alert_Unit.removeClass('alert_hide');
                alert_Unit.addClass('alert_show');
            }
            // if(brandshangchuanflag==true){
            //     alert_BrandImg.html('正在上传中！');
            //     alert_BrandImg.removeClass('alert_hide');
            //     alert_BrandImg.addClass('alert_show');     
            // }else if(brandshangchuanflag==false){      
            //     alert_BrandImg.removeClass('alert_show');
            //     alert_BrandImg.addClass('alert_hide');       
            // }
            if(productImgUrl.length==0){                
                alert_ProductImg.html('请选择图片！');
                alert_ProductImg.removeClass('alert_hide');
                alert_ProductImg.addClass('alert_show');          
              
            }else if(productImgUrl.length!=0&&shangchuanflag==true){      
                alert_ProductImg.html('正在上传中！');
                alert_ProductImg.removeClass('alert_hide');
                alert_ProductImg.addClass('alert_show');       
            }else if(productImgUrl.length!=0&&shangchuanflag==false){      
                alert_ProductImg.removeClass('alert_show');
                alert_ProductImg.addClass('alert_hide');       
            }

            if ($.trim(productDecorationInput.val()).length==0) {
                alert_ProductDecoration.html("请填写此项");
                alert_ProductDecoration.removeClass('alert_hide');
                alert_ProductDecoration.addClass('alert_show');
            } 
            if (alert_Name.hasClass('alert_show')) {
                window.location.href = "#NameContent";
            } else {
                var alert = $('.alert');
                var i;
                for (i = 1; i < alert.length; i++) {
                    console.log(alert);
                    if ($(alert[i]).hasClass('alert_show')) {
                        window.location.href = "#" + $(alert[i]).attr("id") + "Content";
                        break;
                    }
                }
                if (i == alert.length) {
                    PostContact();
                }
            }



        });
    }





})
