$(document).ready(function() {
    //通知轮播
    var urlNotice="/act/notice";
    var urlListActivity = "/act/list";
    ajaxContact();
    noticeContact();
    $(".body").delegate(".item","click",function(){
        console.log($(this).find('.id').text());
        window.location.href = "../page/detail.html?id=" + $(this).find(".id").text(); //+ "&priceType=" +$(this).find(".price").text();
    });
    function noticeContact() {
        $.ajax({
            url:urlServer+urlNotice,
            success:function (data) {
                var code=data.code;
                if(code==200){
                    var data=data.data;
                    var k=0;
                    var strHtml="";
                    for(;k<data.length;k++) {
                         strHtml=strHtml+ '<div class="swiper-slide" '+'style="background: url(../../util/img/'+k+'.jpg)"><span class="notice">'+data[k].content+'</span><div class="notice">发布于'+data[k].pubDate+'</div></div> ';
                    }
                    if(k!=1){
                        strHtml=strHtml+ '<script>' +
                            "var swiper = new Swiper('.swiper-container', {" +
                            "autoplay: 2000,"+
                            "pagination: '.swiper-pagination'," +
                            'paginationClickable: true' +
                            '});' +
                            '</script>';
                    }
                    $('.swiper-wrapper').html(strHtml);


                }
            },
            error:function (error) {
                console.log(error);
                weui.alert("获取公告通知失败");
            }
        })
    }

    function ajaxContact() {

        $.ajax({
            url: urlServer + urlListActivity,
            type: "GET",
            // dataType: "json",
            success: function(data) {
                var code=data.code;
                if(code==200){
                    var list = data.data;
                    makeList(list);
                }
                if(code==500){
                    console.log(data);
                }

            },
            error: function(error) {
                alert('获取活动列表出错');
                console.log(error);
            }
        });
    }
    //一行
    function makeList(list) {
        var strHtml = '';
        for (var i = 0; i < list.length; i++) {
            var imgUrl="";
            if(list[i].img==''){
                imgUrl="../../util/img/background.jpg";
            }else{
                imgUrl=list[i].img;
            }
            var optionHtml = '<div class="item "><div class="tupian"><img src=' + imgUrl + '></div><div class="content"><div class="decoration">' +
                list[i].name + '</div><div class="time"><span class="ActivityTime"><span class="startTime">' + list[i].startActivityTime + '-' + list[i].endActivityTime + '</span></span>' +
                '<span class="endSign">报名截止:<span class="endSignTime">' + list[i].endSignTime + '</span></span></div>' + '<div class="addressContent"><span class="address">' + list[i].address + '</span></div><div class="idContent"><span class="id" >' + list[i].actId + '</span></div><div class="priceContent"><span class="price">';
            if(list[i].priceType=="0"){
                optionHtml=optionHtml+'免费</span></div></div></div></div>';
            }
            else{
                optionHtml=optionHtml+'收费</span></div></div></div></div>';
            }             

            strHtml = strHtml + optionHtml;
        }

        $("#listActivity .body").html(strHtml);
        

    }
    //两列
    // function makeList(list){
    //     var strHtml = '<div class="twocolom">';
    // $.each(list, function(i) {
    //     if (i % 2 == 0) {
    //         strHtml = strHtml + '<div class="colom"><div class="item">' + '<div class="tupian"><img src=' + list[i].img + '></div><div class="content"><div class="decoration">' +
    //             list[i].name + '</div><div class="time"><span class="ActivityTime"><span class="startTime">' + list[i].startActivityTime + '-' + list[i].endActivityTime + '</span></span>' +
    //             '<span class="endSign">报名截止:<span class="endSignTime">' + list[i].endSignTime + '</span></span></div>' + '<div class="addressContent"><span class="address">' + list[i].address + '</span></div><div class="idContent"><span class="id" >' + list[i].actId + '</span><span class="price">';
    //         if(list[i].priceType=="0"){
    //             strHtml=strHtml+'免费</span></div></div></div>';
    //         }
    //          else{
    //             strHtml=strHtml+'收费</span></div></div></div></div>';
    //         }      
    //     } else {
    //         strHtml = strHtml + '<div class="item"><div class="tupian"><img src=' + list[i].img + '></div><div class="content"><div class="decoration">' +
    //             list[i].name + '</div><div class="time"><span class="ActivityTime"><span class="startTime">' + list[i].startActivityTime + '-' + list[i].endActivityTime + '</span></span>' +
    //             '<span class="endSign">报名截止:<span class="endSignTime">' + list[i].endSignTime + '</span></span></div>' + '<div class="addressContent"><span class="address">' + list[i].address + '</span></div><div class="idContent"><span class="id" >' + list[i].actId + '</span><span class="price">';
    //         if(list[i].priceType=="0"){
    //             strHtml=strHtml+'免费</span></div></div></div>';
    //         }
    //          else{
    //             strHtml=strHtml+'收费</span></div></div></div></div>';
    //         }     
    //     }
    // });
    

    // $('#listActivity .body').html(strHtml);
    // }
})











