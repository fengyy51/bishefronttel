/*
author: yh
date: 2016/05/01
 */
var $block = null;

function blockUI(msg) {
	$block = $("<div></div>");
	var $blockMsg = $(msg);

	$block.css({
		"position": "fixed",
		"top": "0",
		"width": "100%",
		"height": "100%",
		"background-color": "rgba(90,90,90,0.5)"
	});

	$blockMsg.css({
		"position": "absolute",
		"color": "white",
		"left": "50%",
		"top": "50%",
		"transform": "translate(-50%, -50%)"
	});
	$block.append($blockMsg);
	$("body").append($block);
}

function unBlockUI() {
	$block.remove();
}

