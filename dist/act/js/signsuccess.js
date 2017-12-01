$(document).ready(function(){
	// var status=2;
	var status=getQueryString("status");
    // var num=getQueryString("id");
    // $('#num').html(num);
	if(status==0){
		$('#content h1 #status').html('报名成功');
	}else if(status==2){
        $('#content h1 #status').html('您尚未支付');
	}
	$("#myActivity").click(function(){
		window.location.href="../../personal/page/prooflist.html";
	});
	$("#return").click(function(){
		window.location.href="../page/listActivity.html";
	});
})