$(function() {
    /* 变量定义*/
    var openId='yy';
    var urlGetVoteNum='/vote/get-vote-num';
    var urlProductInfo="/vote/get-vote-product-info";
    var urlVoteParam="/vote/get-vote-param";
    //投票设置
    var actName;
    var begin;
    var end;
    var proNum;
    var voteNum;
    var shareNum;
    var voteMaxNum;
    var voteDecoration;
    var proApproved;//投票配置 proNum一次投多少个

    var actId=getQueryString("actId");
    var countff; //初始化为votenum
    /* 变量定义*/
    // 授权
    // var options={
    //     url:urlYuming+"/vote/index",
    //     urlServerauth:urlServer+"/user/do-auth",
    //     APPID:APPIDall
    // };
    function callbackA(id) {
        openId=id;
        // console.log(id);
    }
//        getWeChatId(options,callbackA);
    init();
    voteParamContact();
    voteNumContact();
    productInfoContact();
    function init() {
        if(getCookie("countff")!='null'&&getCookie("countff")!=null&&getCookie("countff")==0){
            $('#submit').html('已达投票上限');
            $('#submit').attr("disabled",true);
        }
    }
    function voteNumContact() {
        $.ajax({
            url:urlServer+urlGetVoteNum,
            async:false,
            data:{
                "openId":openId,
                "actId":actId
            },
            success:function (data) {
                var code=data.code;
                if(code==200){
                    var num=data.data;
                    if(num>=voteMaxNum){
                        $('#submit').html('已达投票上限');
                        $('#submit').attr("disabled",true);
                    }
                }
            },
            error:function (error) {
                console.log(error);
                weui.alert("获取当天投票数失败");
            }
        })
    }
    function voteParamContact() {
        $.ajax({
            url:urlServer+urlVoteParam,
            async:false,
            data:{
                "actId":actId
            },
            success:function (data) {
                var code=data.code;
                if(code==200){
                    actName=data.data.actName;
                    begin=data.data.begin;
                    end=data.data.end;
                    proNum=data.data.proNum;
                    voteNum=data.data.voteNum;
                    shareNum=data.data.shareNum;
                    voteMaxNum=data.data.voteMaxNum;
                    voteDecoration=data.data.voteDecoration;
                    proApproved=data.data.proApproved;
                    $('.title').html(actName);
                    setCookie_29("actName",actName);
                    if (getCookie("countff") == null || getCookie("countff") == "null") {
                        countff = voteNum;
                        setCookie_timedetail("countff", countff, '24:00:00');
                    }
                    countff = getCookie("countff");
                    weui.alert("您可投票" + countff + "次");
                    $('.c-join').html('请投票（选择'+proNum+'个）');
                }
            },
            error:function (error) {
                console.log(error);
                weui.alert("获取投票设置失败");
            }
        })
    }
    function productInfoContact(){
        $.ajax({
            url: urlServer + urlProductInfo,
            data: {
                "actId":actId,
            },
            async:false,
            success: function(data) {
                var code=data.code;
                if(code==200){
                    var str = "";
                    // var j1 = 0;
                    // var j2 = 1;
                    if (data == []) {
                        console.log("暂无数据");
                    } else {
                        var len=data.data.length;
                        var index=parseInt(Math.random()*len);
                        for(var i=0;i<len;i++){
                            data.data.push(data.data[index]);
                            data.data.splice(index,1);
                            len=data.data.length;
                            index=parseInt(Math.random()*len);
                        }
                        for(var i=0;i<data.data.length;i++){
                            var str1= '<div class="row">';
                            var str2='<div class="product">';
                            var str3='';
                            var str4='</div>';
                            var regItemlist = data.data[i].productInfo.split(";");
                            // i = (i + 1) % proApproved; //随机数
                            for (var j = 0; j < regItemlist.length; j++) {
                                var title = regItemlist[j].split("?")[0];
                                var val = regItemlist[j].split("?")[1];
                                if (val.indexOf('http:') >= 0) {
                                    var imgFirst = val.split("&")[0];
                                    str2 += '<p><img class="c-tablepic" src="' +
                                        imgFirst +
                                        '"></p><p class="smalltext">编号:<span class="num">' + data.data[i].id + '</span></p>';
                                }
                                else {
                                    str2 += '<p class="smalltext">' + title + ':<span class="text">' + val + '</span></p>';
                                }
                                if((i%2!=0)||(i%2==0&&i==data.data.length-1)){
                                    str3 = '<p><span class="check"><input type="checkbox" value="' +
                                        data.data[i].id +
                                        '" id="product' +
                                        i +
                                        '" name="' +
                                        data.data[i].id +
                                        '" style="zoom:180% " /><label ></label></span></p></div></div>';
                                }else if(i%2==0&&i<data.data.length-1) {
                                    str3 = '<p><span class="check"><input type="checkbox" value="' +
                                        data.data[i].id +
                                        '" id="product' +
                                        i +
                                        '" name="' +
                                        data.data[i].id +
                                        '" style="zoom:180% " /><label ></label></span></p></div>';
                                }
                            }
                            if((i%2==0&&i==data.data.length-1)||(i%2==0&&i<data.data.length-1)) {
                                str=str+str1+str2+str3;
                            }else if(i%2!=0) { //一行的第二个
                                str=str+str2+str3;
                            }
                        }
                        $('#products').html('');
                        $("#products").html(str);

                        //     num = Math.round((data.data.length-1)*Math.random())+1; //随机数 改为50
                        // num = parseInt(num);
                        // if (num % 2 == 0) num++;
                        //随机产生
                        // var i = num;
                        //
                        //     var str1= '<div class="row"><div class="product">';
                        //     var str2='';
                        //     var str3='';
                        //     var regItemlist = data.data[i].productInfo.split(";");
                        //     // i = (i + 1) % proApproved; //随机数
                        //     for (var j = 0; j < regItemlist.length; j++) {
                        //         var title = regItemlist[j].split("?")[0];
                        //         var val = regItemlist[j].split("?")[1];
                        //         if (val.indexOf('http:') >= 0) {
                        //             var imgFirst = val.split("&")[0];
                        //             // console.log(data.data[i].id);
                        //             str2 += '<p><img class="c-tablepic" src="' +
                        //                 imgFirst +
                        //                 '"></p><p class="smalltext">编号:<span class="num">' + data.data[i].id + '</span></p>';
                        //         }
                        //         else {
                        //             str2 += '<p class="smalltext">' + title + ':<span class="text">' + val + '</span></p>';
                        //         }
                        //         str3 = '<p><span class="check"><input type="checkbox" value="' +
                        //             data.data[i].id +
                        //             '" id="product' +
                        //             j1 +
                        //             '" name="' +
                        //             data.data[i].id +
                        //             '" style="zoom:180% " /><label ></label></span></p></div><div class="product">';
                        //     }
                        //         var regItemlist1 = data.data[++i].productInfo.split(";");
                        //         for (var j = 0; j < regItemlist.length; j++) {
                        //             var title1 = regItemlist1[j].split("?")[0];
                        //             var val1 = regItemlist1[j].split("?")[1];
                        //             if (val1.indexOf('http:') >= 0) {
                        //                 // console.log(i);
                        //                 var imgFirst1 = val1.split("&")[0];
                        //                 str4 += '<p><img class="c-tablepic" src="' +
                        //                     imgFirst1 +
                        //                     '"></p><p class="smalltext">编号:<span class="num">' + data.data[i].id + '</span></p>';
                        //             }
                        //             else {
                        //                 str4 += '<p class="smalltext">' + title1 + ':<span class="text">' + val1 + '</span></p>';
                        //             }
                        //             str5 = '<p><span class="check"><input type="checkbox" value="' +
                        //                 data.data[i].id +
                        //                 '" id="product' +
                        //                 j2 +
                        //                 '" name="' +
                        //                 data.data[i].id +
                        //                 '" style="zoom:180% " /><label ></label></span></p></div></div>';
                        //         }
                        //         j1 = j1 + 2;
                        //         j2 = j2 + 2;
                        //         i=i+1;
                        //         str=str+str1+str2+str3+str4+str5;

                            // var picheight=$('.c-tablepic ').height();
                            // $('.row').height(picheight+5.*$('.smalltext').height());
                            // var rowheight = $('div.row').height();
                            // $('.row .product').height(rowheight);
                            var wwidth=window.screen.width;
                            $('.c-tablepic').width(wwidth*0.45);
                            var picwidth = $('.c-tablepic ').width();
                            $('.c-tablepic ').height(picwidth * 0.75);
                            $('.product').width(wwidth*0.5);
                            $('.smalltext').width(wwidth*0.4);
                            $(".product").bind("click", function () {
                                var product = $(this).find("input");
                                if (product.attr("checked") == null) {
                                    product.attr("checked", "checked");
                                } else {
                                    product.removeAttr("checked");
                                }
                            });
                            //     if (i == 9) break;
                            // }
                    }
               }
            },
            error: function(error) {
                weui.alert("加载失败，请再试一次吧！");
            }
        });
    }

    $("#submit").click(function() {
        var num = 0;
        var str = "";
        var curTime=(new Date()).valueOf();
        for (var i = 0; i <= proApproved; i++) {
            if ($("#product" + i).attr("checked") != null) {
                num++;
                str += $("#product" + i).val() + ",";
            }
        }
        console.log(str);
        str=str+'@@@'+curTime;
        str=str+'@@@'+openId;
        console.log(str);
        if (num == proNum) {
            // str = str.substring(0, str.length - 1);
            console.log(str);
            var voteflag=false;
            if(voteflag==false){

                $.ajax({
                    url: urlServer + "/vote/post-vote-number-info",
                    type: "POST",
                    data: {
                        "str": str,
                        "actId":actId,
                    },
                    success: function(data) {
                        //后台控制投票次数，返回是否可以投票
                        var code=data.code;
                        if(code==200){
                            var result = data.data.result;
                            if (result == true) {
                                --countff;
                                console.log(countff);
                                setCookie_timedetail("countff", countff, '24:00:00');
                                $('#submit').attr("disabled", true);
                                $('#submit').html("已投票");
                                voteflag=true;
                                setTimeout(function(){
                                    location.href = "list.html?actId="+actId;
                                },1000);
                            } else if (result == false) {
                                voteflag=false;
                                var msg=data.data.msg;
                                weui.alert(msg);
                                $('#submit').html("投票并查看结果");
                            }
                        }

                    },
                    error: function(error) {
                        voteflag=false;
                        weui.alert("投票未成功，再来一次哟！");
                    }
                });
            }

        } else {
            weui.alert("您已选择"+num+"个，"+"请选择"+proNum+"个作品哟！");
        }
    });

});