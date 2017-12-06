// require.ensure([],function(require){
    // var alert=require('../../util/js/alert.js');
    $(document).ready(function() {
        var urlVoteParam="/vote/get-vote-param";
        var urlProductInfo="/vote/get-vote-product-info";
        $('html').width(window.screen.width);
        $('html').css("overflow-x","hidden");
        var countff=getCookie("countff");//投票次数
        var countprize=getCookie("countprize");//抽奖次数
        var shareflagvote=getCookie("shareflagvote");//投票分享次数
        var shareflagprize=getCookie("shareflagprize");//抽奖分享次数
        var actName,begin,end,proNum,voteNum,shareNum,voteDecoration,proApproved;//抽奖配置
        var $searchBar = $('#searchBar'),
            $searchResult = $('#searchResult'),
            $searchText = $('#searchText'),
            $searchInput = $('#searchInput'),
            $searchClear = $('#searchClear'),
            $searchCancel = $('#searchCancel');
        var actId=getQueryString("id");
        if(shareflagprize=="null"||shareflagprize==null){
            var shareflagprize=1;
            setCookie_29("shareflagprize",shareflagprize);
        }
        if(shareflagvote=="null"||shareflagvote==null){
            var shareflagvote=1;
            setCookie_29("shareflagvote",shareflagvote);
        }
        if(countprize=="null"||countprize==null){
            var countprize=1;
            setCookie_29("countprize",countprize);
        }
        if (countff=="null"||countff==null) {
            var countff = 1;
            setCookie_29("countff",countff);
        }
        //投票规则
        $('#fixedlogo').on("click",function(){
            $('#dialog .weui_dialog_bd').html('1.输入序号，点击“搜索”查找作品，点击作品图片可查看作品详细介绍；<br>'+' 2.点击“投票”可进入投票页面；<br>'+
            '3.下拉选择5件心仪作品，确认后点击“投票并查看结果”；<br>'+'4.投票完毕，可参与“宾王158幸运大转盘”活动，丰厚奖品等着您。<br>');

            // +'注：转发此页面至朋友圈可增加1次抽奖机会，每人每天限抽3次。','“寻找造物主”优秀作品评选流程');
            var $dialog=$('#dialog');
            $dialog.show();
            $dialog.find('.weui_btn_dialog').on('click', function () {
                $dialog.hide();
            });
        })

        voteParamContact();
        productInfoContact();
        init();

        function voteParamContact() {
            $.ajax({
                url:urlServer+urlVoteParam,
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
                        voteDecoration=data.data.voteDecoration,
                        proApproved=data.data.proApproved;
                        $('#title').html(actName);
                    }
                },
                error:function (error) {
                    console.log(error);
                    weui.alert("获取投票设置失败");
                }
            })
        }
        function productInfoContact() {
            $.ajax({
                url: urlServer+urlProductInfo,
                data:{
                    "actId":actId
                },
                success: function(data) {
                    var list = data.data;
                    makeList(list);
                },
                error: function(error) {
                    weui.alert('获取作品列表出错');
                    console.log(error);
                }
            });
        }
//一行
        function makeList(list) {
            var strHtml="";
            for(var i=0;i<list.length;i++){
                var strHtm2="";
                var regItemlist=list[i].productInfo.split(";");
                strHtm2='<div class="item">';
                for(var j=0;j<regItemlist.length;j++){
                    var title=regItemlist[j].split("?")[0];
                    var val=regItemlist[j].split("?")[1];
                    if(i<8){
                        if(val.indexOf('http:')>=0){
                            var imgFirst=val.split("&")[0];
                            console.log(imgFirst);
                            strHtm2+='<div class="tupian"><img data-original="" scr="'+imgFirst+'"/></div>';
                            console.log(strHtm2);
                        }
                        else{
                            strHtm2+='<div class="content" id='+title+'><b>'+title+'</b>:'+'<span class="content-span">'+val+'</span></div>';
                        }
                        strHtm2+='</div></div>';

                    }else{
                        if(val.indexOf('http:')>=0){
                            var imgFirst=val.split("&")[0];
                            strHtm2+='<div class="tupian"><img src="" data-original='+imgFirst+'></div>';
                        }
                        else{
                            strHtm2+='<div class="content" id='+title+'><b>'+title+'</b>:'+'<span class="content-span">'+val+'</span></div>';
                        }
                        strHtm2+='</div></div>';
                    }
                }
                strHtml=strHtml+strHtm2;
                // console.log(regItem);
            }
            //
            // for (var i = 0; i < list.length; i++) {
            //     if(i<8){
            //         var strHtm2 = '<div class="item"><div class="tupian"><img data-original="" src=' + list[i].productFirst + '></div>' +
            //             '<div class="content"><div id="'+list[i].id+'" class="no"><b>作品编号</b>：<span class="no1">' + list[i].id + '</span></div>' +
            //             '<div class="name"><b>作品名称</b>：<span class="name1">' + list[i].brandName+'</span></div>' +
            //             '<div class="intro"><div class="intro1"><b>作品简介</b>：' + list[i].intro + '</div></div></div></div>';
            //     }else{
            //         var strHtm2 = '<div class="item"><div class="tupian"><img data-original=' + list[i].productFirst + ' src=""></div>' +
            //             '<div class="content"><div id="'+list[i].id+'" class="no"><b>作品编号</b>：<span class="no1">' + list[i].id + '</span></div>' +
            //             '<div class="name"><b>作品名称</b>：<span class="name1">' + list[i].brandName+'</span></div>' +
            //             '<div class="intro"><div class="intro1"><b>作品简介</b>：' + list[i].intro + '</div></div></div></div>';
            //     }
            //
            //     strHtml=strHtml+strHtm2;
            // }
            $('#listWork .body').html(strHtml);
            $('.intro1').width(window.screen.width*0.83-120);
            var wwidth=window.screen.width;
            $('#text').width(wwidth*0.46);
            $('#button1 a').width(wwidth*0.16);
            $('#button2 a').width(wwidth*0.16);
            $('div.item').height(wwidth*0.4*0.75);
            $('div.item .tupian').width(wwidth*0.4);
            $('div.item .tupian').height(wwidth*0.4*0.75);
            $('.tupian img').width(wwidth*0.4);
            $('.tupian img').height(wwidth*0.4*0.75);
            $('div.item .content').height(wwidth*0.4*0.75);
        }
        $(".body").delegate(".item","click",function() {
            window.location.href = "../page/dow.html?id=" + $(this).find('.no1').text();
        });
        //点击投票
        $("#button2").on("click",function() {
            window.location.href = "../../vote/list.html";
            var countff;
            countff=getCookie("countff");
            if (countff==0){
                weui.alert("您已投票");
                setTimeout(function(){
                    window.location.href = "../../vote/list.html";
                },1000);
            }
            else{
                window.location.href = "../../vote/index.html";
            }
        });


        function init(){
            var images=document.images;
            for(var i= 0,len=images.length;i<len;i++){
                var obj=images[i];
                if(obj.getBoundingClientRect().top<document.documentElement.clientHeight&&!obj.isLoad) {
                    obj.isLoad = true;
                    if (obj.dataset) {
                        imageLoaded(obj, obj.dataset.original);
                    } else {
                        imageLoaded(obj, obj.getAttribute("data-original"));
                    }
                }else{
                    break;
                }
            }
        }
        function imageLoaded(obj,src){
            var img=new Image();
            img.onload=function(){
                obj.src=src;
            };
            img.src=src;
        }
        $('body').scroll(function(){
            lazyload();
        });

        function lazyload() {
            var lazy = 0;
            var images = document.images;
            for (var i = 0, len = images.length; i < len; i++) {
                var obj = images[i];
                if (obj.getBoundingClientRect().top - lazy < document.documentElement.clientHeight && !obj.isLoad) {
                    obj.isLoad = true;
                    if (obj.dataset)
                        imageLoaded(obj, obj.dataset.original);
                    else
                        imageLoaded(obj, obj.getAttribute('data-original'));
                }
            }
        }



        //搜索功能实现开始
        $("#button1").on("click",function() {
            var searchText = $searchInput.val();//获取输入的搜索内容
            if (searchText== "") {
                $('#content_news_list').html("<li>not find</li>")
            }
            else{
                window.location.href = "#" + searchText;
            }
        });
        function hideSearchResult() {
            $searchResult.hide();
            $searchInput.val('');
        }
        function cancelSearch() {
            hideSearchResult();
            $searchBar.removeClass('weui-search-bar_focusing');
            $searchText.show();
        }
        $searchText.on('click', function() {
            $searchBar.addClass('weui-search-bar_focusing');
            $searchInput.focus();
        });
        $searchInput
            .on('blur', function() {
                if(!this.value.length) cancelSearch();
            })
            .on('input', function() {
                if(this.value.length) {
                    $searchResult.show();
                } else {
                    $searchResult.hide();
                }
            });
        $searchClear.on('click', function() {
            hideSearchResult();
            $searchInput.focus();
        });
        $searchCancel.on('click', function() {
            cancelSearch();
            $searchInput.blur();
        });
        //搜索功能实现结束
    })













