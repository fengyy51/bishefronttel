$(document).ready(function() {
    // var countff = getCookie("countff", countff);
    // alertNew(countff);
    // if(countff==0)
    // {
    //  $('#go').css("display",'none');
    // }
    var actName=getCookie("actName");
    var actId=getQueryString("actId");
    $('.title').html(actName);
    $('#vote').click(function () {
        window.location.href="../goods/page/listWork.html?id="+actId;
    });
    $.ajax({
        url: urlServer + "/vote/get-vote-number-info",
        type: "GET",
        data:{
            "actId":actId
        },
        success: function(data) {
            var str = "";
            var len = data.data.length;
            var max=0;
            for(var i=0;i<len;i++){
                if(data.data[i].voteNum>max){
                    max=data.data[i].voteNum;
                }
            }
            var base=0;
            if(max<10){
                base=10;
            }else if(max<100){
                base=100;
            }else if(max<1000){
                base=1000;
            }else if(max<10000){
                max=Math.round(max/1000)+1;
                base=max*1000;
            }else if(max<100000){
                max=Math.round(max/10000)+1;
                base=max*10000;
            }else if(max<1000000){
                max=Math.round(max/100000)+1;
                base=max*100000;
            }
            console.log(max);
            console.log(base);
            for(var i=0;i<data.data.length;i++){
                var regItemlist=data.data[i].productInfo.split(";");
                for(var j=0;j<regItemlist.length;j++) {
                    var title = regItemlist[j].split("?")[0];
                    var val = regItemlist[j].split("?")[1];
                    if (val.indexOf('http:') >= 0) {
                        var imgFirst = val.split("&")[0];
                        str += '<div class="c-table"><p><img class="c-tablepic-list" src="' + imgFirst +
                            '"><span style=" padding-top:2%;font-size: 1rem;padding-right:3%;width:8%;">' +
                            data.data[i].itemId +
                            '</span>' +
                            // '<span class="skillbar clearfix " data-percent="'+0.2+'><span class="skillbar-bar" style="background: #04be02;"></span><span class="skill-bar-percent">'+0.2+'</span></span>'
                            '<span class="skillbar clearfix " data-percent="' +
                            // data.data[i].voteNum+
                            data.data[i].voteNum / base * 100 +
                            '%""><span class="skillbar-bar" style="background: #04BE02;"></span></span><span class="skill-bar-percent" id="bar" style="float: right; padding-top:2%;margin-right: 1%;">' +
                            data.data[i].voteNum +
                            '票</span></p>';
                    }
                }
                $("#products").html(str);
                setCookie_timedetail("votestatus",true,'24:00:00');
            }
            $('.skillbar').each(function() {
                // console.log($(this));
                $(this).find('.skillbar-bar').animate({
                    width: $(this).attr('data-percent')
                }, 1000);
            });

            // var numlen=1;
            // var barwidth=$('#bar').width();
            // console.log(barwidth);
            // for(var i=0;i<len;i++){
            //     var num=data.data[i].voteNum;
            //     var numlennew=num.toString().length;
            //     if(numlen<numlennew){
            //         numlen=numlennew;
            //     }
            // }
            // $('#bar').css("font-size",barwidth/(numlen+2)+'px');

        },
        error: function(error) {
            weui.alert("加载失败，请再试一次吧！");
        }
    });
});