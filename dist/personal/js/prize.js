
$(document).ready(function(){
	var urlVeriCode="/luck/veri-code";//兑奖码
	var urlWinDetail="/luck/win-detail";
	var urlWinHandleUse='/luck/win-handle-use';
    // 获取用户openid
    var id;
    var actId;
    var openId="yy";
    var vericode="";
    // var openId=getCookie("openId",openId);
    // 解析url参数 存入cookie
    if ((id_yuanshi = getQueryString("id")) != null){        
        id = getQueryString("id"); //活动所属id
    }
    // function alertNew(content,title){
	// 	$('#alert .weui_dialog_title').html(title);
	// 	$('#alert .weui_dialog_bd').html(content);
	// 	var $alert=$('#alert');
	//     $alert.show();
	//     $alert.find('.weui_btn_dialog').on('click', function () {
	//         $alert.hide();
	//     });
	// }
	ajaxContact();
    codeContact();

 
	$('#click_ShopIn').on("click",function(){
		weui.confirm(' <input type="text" class="weui-input" style="border: 1px solid gainsboro" name="" id="code" value="" />',
			function () {
                var code=$('#code').val();
                console.log(code);
                if(code!=''&&code==vericode){
                    var inputflag=false;
                    if(inputflag==false){
                        inputflag=true;
                        $.ajax({
                            url:urlServer+urlWinHandleUse,
                            type:"post",
                            data:{
                                "id":id
                            },
                            success:function(data){
                                var code=data.code;
                                if(code==200){
                                    var result=data.data.result;
                                    inputflag=false;
                                    if(result==true){
                                        $('#isUse').html('已使用');
                                        $('#isUse').css("color","#04be02");
                                        alert("兑奖成功");
                                        $('.js_dialog').fadeOut(200);
                                        $('#click_ShopIn').attr("disabled",true);
                                    }
                                }
                            },
                            error:function(error){
                                inputflag=false;
                                console.log(error);
                               	alert("核销奖券出错");
                                // sleep(300);
                                // $('#dialogs').on('click', '.weui-dialog__btn', function(){
                                //     $(this).parents('.js_dialog').fadeOut(200);
                                // });
                            }
                        });
                    }

                }else if(code!=''&&code!=vericode||code==''){
                    alert("兑奖码输入有误");
                }
        }, function () {
                console.log('no');
            },{
            title: '请输入兑奖码'
        })
		// $('#Dialog').fadeIn(200);
	});

	function codeContact() {
		$.ajax({
			url:urlServer+urlVeriCode,
			data:{
				id:actId
			},
			success:function (data) {
				var code=data.code;
				if(code==200){
					vericode=data.data;
					console.log(vericode);
				}
            }
		})
    }
	function ajaxContact() {
	    $.ajax({
	        url: urlServer + urlWinDetail,
	        data: {
	            "id":id
	        },
			async:false,
	        success: function(data) {
	            var code = data.code;
	            if (code == 200) {
	            	actId=data.data.relationId;
	                makeItem(data);
	            }
	        },
	        error: function(error) {
	            weui.alert('获取奖券列表出错');
	            console.log(error);
	        }
	    });
	}

    function makeItem(data) {
        var strHtml = '';
        // var prize=["一等奖","二等奖","三等奖","幸运奖"];
        var ifUse=["未使用","已使用"];
        var strHtml = '<div class="item " style="cursor:pointer"><div class="content">'+
        '<div class="yanZhengMaContent"><div class="yanZhengMa ">'+
        '<div class="name"><span id="name">'+data.data.name+'</span></div>'+
        '<span id="tex">奖品代码：</span><span id="yanZhengMa">'+data.data.code+'</span></div></div>'+
        '<div class="type proof-margin"><span class="black">奖项类别: </span>'+data.data.type+'</div>'+
        '<div class="info proof-margin"><span class="black">奖项说明: </span>'+data.data.info+'</div>' + 
        '<div class="duiTime proof-margin"><span class="black">兑奖时间: </span><span id="duiTime">'+data.data.duijiangTime+'</span></div>'+
        '<div class="duiAddress proof-margin"><span class="black">兑奖地点：</span>'+data.data.duijiangLoc+'</div>'+
        '<div class="isUse proof-margin"><span class="black">有效性：</span><span id="isUse">'+ifUse[data.data.isUse]+'</span></div>'+
        '<div class="idContent proof-margin"><span class="id" >' + data.data.prizeId + '</span></div></div></div>';
        console.log(strHtml);
        $("#prize .body").html(strHtml);
        if(data.data.isUse==1){
        	$('#click_ShopIn').attr("disabled",true);
        }


    }
})
// $('#click_queding').on("click",function(){
//
// })
// $('#click_quxiao').on("click",function(){
//     $(this).parents('.js_dialog').fadeOut(200);
// })
// function ajaxContact(){
// 	$.ajax({
// 		// url:urlServer+urlProof,	
// 		url:"../json/prize.json",	
// 		type:"GET",
// 		dataType: 'json',  
// 		// data:{
// 		// 	"openId":openId,
// 		// 	"actId":id
// 		// },
// 		success:function(data){
// 		console.log(data);			
// 			var code=data.code;
// 			// console.log(code);
// 			if(code==200){
// 				var name=data.data.name;
// 				var info=data.data.info;
// 				var address=data.data.address;			
// 				var credCode=data.data.credCode;
// 				var hasUse=data.data.hasUse;
// 				makeName(name);
// 				makeInfo(info);
// 				makeAddress(address);
// 				makeYanZhengMa(credCode);
// 				makeHasUse(hasUse);
// 			}			
// 		},
// 		error:function(error){
// 			console.log(error);
// 			alert("获取凭证信息出错");
// 		}
// 	});
// }
// function makeName(name){
// 	$("span#name").html(name);
// }
// function makeInfo(info){
// 	$('span#info').html(info);
// }
// function makeAddress(address){
// 	$("span#address").html(address);
// }
// function makeYanZhengMa(yanZhengMa){
// 	$("span#yanZhengMa").html(yanZhengMa);
// }
// function makeHasUse(hasUse){
// 	if(hasUse==0){
// 		$("span#hasUse").html("未使用");
// 	}
// 	else if(hasUse==1){
// 		$("span#hasUse").html("已使用");
// 	}
// }

// })