//微信分享接口
$(function(){
    var urlPrizeParam="/luck/get-prize-param";
    var request_url = urlServer+"/common/js-sdk-config?url="+encodeURIComponent(location.href);
    var countprize=getCookie("countprize");//抽奖次数
    var shareflagvote=getCookie("shareflagvote");//投票分享次数
    //抽奖设置
    var name;
    var begin;
    var end;
    var prizeNum;
    var shareNum;
    var prizeMaxNum;
    var prizeDecoration;

    var id=getQueryString("id");
    prizeParamContact();
    function prizeParamContact() {
        $.ajax({
            url:urlServer+urlPrizeParam,
            async:false,
            data:{
                "id":id
            },
            success:function (data) {
                var code=data.code;
                if(code==200){
                    name=data.data.name;
                    begin=data.data.begin;
                    end=data.data.end;
                    prizeNum=data.data.prizeNum;
                    shareNum=data.data.shareNum;
                    prizeMaxNum=data.data.prizeMaxNum;
                    prizeDecoration=data.data.prizeDecoration;
                    //初始化投票抽奖次数，初始均为voteNum，，
                    if(shareflagprize==null||shareflagprize=="null"){
                        var shareflagprize=0;
                        setCookie_timedetail("shareflagprize",prizeNum,'24:00:00');
                    }
                    if(countprize==null||countprize=="null"){
                        var countprize=0;
                        setCookie_timedetail("countprize",prizeNum,'24:00:00');
                    }
                }
            },
            error:function (error) {
                console.log(error);
                weui.alert("获取抽奖设置失败");
            }
        })
    }

    $.getJSON(
        request_url,
        function(data){
            var list=data.data;
            var AppID=list.appId;
            var nonceStr = list.nonceStr;
            var timestamp = list.timestamp;
            var signature = list.signature;
            // console.log(list);
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: AppID, // 必填，公众号的唯一标识,binwang
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                signature: signature,// 必填，签名，见附录1
                jsApiList: [// 必填，需要使用的JS接口列表
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage'
                ]
            });
            wx.ready(function(){
                wx.onMenuShareTimeline({//分享到朋友圈
                    title:$('.title').html(),
                    // title: $('.left').text(), // 分享标题
                    // title: '寻找造物主，投票赢大奖', // 分享标题
                    link: window.location.href, // 分享链接
                    imgUrl: 'http://binwang.oss-cn-hangzhou.aliyuncs.com/fimg/1.jpg', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        weui.alert('分享成功');
                        var shareflagprize=getCookie("shareflagprize");
                        var countprize=getCookie("countprize");
                        if(shareNum==true||shareNum=='true'){
                            if(shareflagprize<prizeMaxNum){
                                countprize++;
                                shareflagprize++;
                            }
                        }
                        setCookie_timedetail("countprize",countprize,'24:00:00');
                        setCookie_timedetail("shareflagprize",shareflagprize,'24:00:00');
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareAppMessage({//分享给朋友
                    title: $('.title').text(), // 分享标题
                    // title: '寻找造物主，投票赢大奖', // 分享标题
                    // desc: '描述测试', // 分享描述
                    link: window.location.href, // 分享链接
                    imgUrl: 'http://binwang.oss-cn-hangzhou.aliyuncs.com/fimg/1.jpg', // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        alert('分享成功');
                        var shareflagprize=getCookie("shareflagprize");
                        var countprize=getCookie("countprize");
                        console.log(shareNum);
                        if(shareNum==true||shareNum=='true'){
                            if(shareflagprize<=prizeMaxNum){
                                countprize++;
                                shareflagprize++;
                            }
                        }
                        setCookie_timedetail("countprize",countprize,'24:00:00');
                        setCookie_timedetail("shareflagprize",shareflagprize,'24:00:00');

                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
            wx.error(function(){});
        }
    );


})