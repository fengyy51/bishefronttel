$(document).ready(function(){
	var num=getQueryString("id");
	$('#num').html(num);
	// $("#return").click(function(){
	// 	window.location.href="../page/listSign.html";
	// });
	// 解析url参数函数
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
})