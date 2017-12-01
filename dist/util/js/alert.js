
function alertNew(content,title){
	$('.weui_dialog_title').html(title);
	$('.weui_dialog_bd').html(content);
}
function alertShow(){
	var $alert=$('#alert');
    $alert.show();
    $alert.find('.weui_btn_dialog').on('click', function () {
        $alert.hide();
    });
}
// module.exports.alertNew=function(content,title){
// 	$('.weui_dialog_title').html(title);
// 	$('.weui_dialog_bd').html(content);
// }
// module.exports.alertShow=function (){
// 	var $alert=$('#alert');
//     $alert.show();
//     $alert.find('.weui_btn_dialog').on('click', function () {
//         $alert.hide();
//     });
// }
