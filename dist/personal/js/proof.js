
$(document).ready(function(){
	var urlProof="/act/get/credential"
    // 获取用户openid
    var openId="yy",id;
    // 解析url参数 存入cookie
	id = getQueryString("id"); //活动所属id
    // openId=getCookie("openId",openId);
	ajaxContact();  
	$("#detailActivity").click(function(event) {
		window.location.href="../../act/page/detail.html?id="+id;
	});

function ajaxContact(){
	$.ajax({
		url:urlServer+urlProof,
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
				var status=data.data.status;
				var credCode=data.data.credCode;
				var sign=data.data.sign;
				makeName(name);
				makeActivityTime(startActivityTime,endActivityTime);
				makeAddress(address);
				makeStatus(status);
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
function makeStatus(status){
	var regstatus;
	if(status==0){
		regstatus="报名成功";
	}else if(status==2){
		regstatus="您尚未支付";
	}else if(status==1){
		regstatus="已取消报名";
	}
	$("span#status").html(regstatus);
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