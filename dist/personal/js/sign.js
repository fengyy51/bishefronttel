
$(document).ready(function(){
	var urlProof="/act/get/credential"
    // 获取用户openid
    var openId,id;
    // 解析url参数 存入cookie
    if ((id_yuanshi = getQueryString("id")) != null){        
        id = getQueryString("id"); //活动所属id
    }
    openId=getCookie("openId",openId);
    console.log(openId);
    console.log(id);
	ajaxContact();  
	$("#detailActivity").click(function(event) {
		// alert(id);
		window.location.href="../page/detail?id="+id;
	});

function ajaxContact(){
	$.ajax({
		url:urlServer+urlProof,		
		type:"GET",
		dataType: 'json',  
		data:{
			"openId":openId,
			"actId":id
		},
		success:function(data){
		console.log(data);			
			var code=data.code;
			// console.log(code);
			if(code==200){
				var name=data.data.name;
				var startActivityTime=data.data.startActivityTime;
				var endActivityTime=data.data.endActivityTime;
				var address=data.data.address;
				var mobile=data.data.mobile;
				var credCode=data.data.credCode;
				var sign=data.data.sign;
				makeName(name);
				makeActivityTime(startActivityTime,endActivityTime);
				makeAddress(address);
				makeTelephone(mobile);
				makeYanZhengMa(credCode);
				makeSign(sign);
			}			
		},
		error:function(error){
			console.log(error);
			alert("获取凭证信息出错");
		}
	});
}
function makeName(name){
	$("span#name").html(name);
}
function makeActivityTime(startActivityTime,endActivityTime){
	var strHtml=startActivityTime+'-'+endActivityTime;
	$("span#activityTime").html(strHtml);
}
function makeAddress(address){
	$("span#address").html(address);
}
function makeTelephone(telephone){
	$("span#telephone").html(telephone);
}
function makeYanZhengMa(yanZhengMa){
	$("span#yanZhengMa").html(yanZhengMa);
}
function makeSign(sign){
	if(sign==0){
		$("span#sign").html("未签到");
	}
	else if(sign==1){
		$("span#sign").html("已签到");
	}
}

})