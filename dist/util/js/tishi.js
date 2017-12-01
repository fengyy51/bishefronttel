 // 设置提示框
yy_tishi = new function() {
	this.width = $(window).width() * 0.8;
	this.height = 172;

	// 关闭提示框
	this.close = function() {
		$('.win iframe').fadeOut();
		$('.win').fadeOut("fast");
		setTimeout(function() {
			$('.win iframe').remove();
			$('.win').remove();
		}, 200);
	};
	// 提示框信息构成
	function messageBox(html, title, message, type) {
		var jq = $(html);
		if(type == "toast") {
			jq.find(".window-panel").width(message.length * 20).css("margin-left", -message.length * 20 / 2).css("margin-top", -yy_tishi.height / 2);
		} else {
			jq.find(".window-panel").width(yy_tishi.width).css("margin-left", -yy_tishi.width / 2).css("margin-top", -yy_tishi.height / 2 - 36);
		}
		if(valempty(title)) {
			jq.find(".title").remove();
			jq.find(".window-panel .body-panel").css("border-radius", "4px");
		} else {
			jq.find(".title").find(":header").html(title);
		}
		jq.find(".content").html(message.replace('\r\n', '<br/>'));
		jq.appendTo('body').fadeIn("fast");
		$(".win .w-btn:first").focus();
	}
	this.alert = function(title, message, ico) {
		var icon = "";
		if(!valempty(ico)) {
			icon = '<p class="btns" style="margin-bottom:-15px;"><img width="70px" height="70px" src="../resource/fonts/' + ico + '.png"></p>';
		}
		var html = '<div class="win"><div class="mask-layer"></div><div class="window-panel"><iframe class="title-panel" frameborder="0" marginheight="0" marginwidth="0" scrolling="no"></iframe><div class="title"><h3></h3></div><div class="body-panel">' + icon + '<p class="content"></p><p class="btns"><button class="w-btn" tabindex="1" onclick="yy_tishi.close();">确定</button></p></div></div></div>';
		messageBox(html, title, message);
	}	
};
// 判断图片地址是否为空
function valempty(str) {
	if(str == "null" || str == null || str == "" || str == "undefined" || str == undefined || str == 0) {
		return true;
	} else {
		return false;
	}
}