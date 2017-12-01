/**
 * Created by HGY on 2017/7/13.
 */
$(document).ready(function() {
    ajaxContact();
    var j=location.search.replace(/[^\d]/g, "");
    var i;
    var wwidth=window.screen.width;
    function ajaxContact() {
        $.ajax({
            url: urlServer+"/vote/get-vote-product-info",
            type: "GET",
            // dataType: "json",
            success: function(data) {
                var list = data.data;
                console.log(data);
                makeList(list);
            },
            error: function(error) {
                alert('获取作品信息出错');
                console.log(error);
            }
        });
    }
    function makeList(list) {
        for (i=0;i<list.length;i++){
            if (list[i].id==j){
                break;
            }
        }
        var strHtml = "";
        var result=list[i].productImgUrls.split("@@@");
        var length=result.length;
        // console.log(length);
        if(result[length-1]==""){
            length=length-1;
            // console.log(length);
        }
        var k=0;
        for(;k<length;k++) {
            var strHtml1 = '<div class="swiper-slide"><img src="'+result[k]+'"/></div> ';
            strHtml = strHtml + strHtml1;
        }
        if(k!=1){
             strHtml=strHtml+ '<script>' +
                "var swiper = new Swiper('.swiper-container', {" +
                "pagination: '.swiper-pagination'," +
                'paginationClickable: true' +
                '});' +
                '</script>';
        }
        $('.swiper-wrapper').html(strHtml);
        var strHtml2 = '<div class="content"><div class="id"><b>作品编号</b><span class="no1">' + list[i].id + '</span></div>' +
            '<div class="brandName"><b>作品名称</b><span class="name1">' + list[i].brandName+'</span></div>' +
            '<div class="name"><b>作品作者</b><span class="pname1">' + list[i].name+'</span></div>' +
            '<div class="intro"><b>作品简介</b><span class="intro1">' + list[i].intro + '</span></div></div>';
        $('.infor').html(strHtml2);
        $('.swiper-wrapper img').height(wwidth*3/4);
    }
})











