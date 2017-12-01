/* form */
// 约定正则
var regexp = {
    regexp: {
        NAME:/^([\u4e00-\u9fa5]){2,7}$/,
        IDNUM: /(?:^\d{15}$)|(?:^\d{18}$)|^\d{17}[\dXx]$/,
        EMAIL:/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
        NULL:/^\S+|\S+$/,
        VCODE: /^.{4}$/
    }
};

// 失去焦点时检测
weui.form.checkIfBlur('#form', regexp);


/* 图片自动上传 */
var uploadCount = 0, uploadList = [];
var uploadCountDom = document.getElementById("uploadCount");
weui.uploader('#uploader', {
    url: urlServer + '/common/upload/img',
    auto: true,
    type: 'file',
    fileVal: 'file',
    compress: {
        width: 1600,
        height: 1600,
        quality: .8
    },
    onBeforeQueued: function(files) {
        if(["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0){
            weui.alert('请上传图片');
            return false;
        }
        if(this.size > 10 * 1024 * 1024){
            weui.alert('请上传不超过10M的图片');
            return false;
        }
        if (files.length > 5) { // 防止一下子选中过多文件
            weui.alert('最多只能上传5张图片，请重新选择');
            return false;
        }
        if (uploadCount + 1 > 5) {
            weui.alert('最多只能上传5张图片');
            return false;
        }

        ++uploadCount;
        uploadCountDom.innerHTML = uploadCount;
    },
    onQueued: function(){
        uploadList.push(this);
        // console.log(this);
    },
    onBeforeSend: function(data, headers){
        // console.log(this, data, headers);
        // $.extend(data, { test: 1 }); // 可以扩展此对象来控制上传参数
        // $.extend(headers, { Origin: 'http://127.0.0.1' }); // 可以扩展此对象来控制上传头部

        // return false; // 阻止文件上传
    },
    onProgress: function(procent){
        // console.log(this, procent);
    },
    onSuccess: function (ret) {
        document.cookie="uploadCount="+uploadCount;
        console.log(this, ret);
        title=getCookie("img");
        var cookieText="";
        if(getCookie(title)!=undefined&&getCookie(title)!=null){
            cookieText=title+"="+getCookie(title)+"&"+ret.data.url;
        }else {
            cookieText=title+"="+ret.data.url;
        }
        console.log(cookieText);
        document.cookie=cookieText;
    },
    onError: function(err){
        console.log(this, err);
    }
});

// 缩略图预览
document.querySelector('#uploaderFiles').addEventListener('click', function(e){
    var target = e.target;

    while(!target.classList.contains('weui-uploader__file') && target){
        target = target.parentNode;
    }
    if(!target) return;

    var url = target.getAttribute('style') || '';
    var id = target.getAttribute('data-id');

    if(url){
        url = url.match(/url\((.*?)\)/)[1].replace(/"/g, '');
    }
    var gallery = weui.gallery(url, {
        className: 'custom-name',
        onDelete: function(){
            weui.confirm('确定删除该图片？', function(){
                --uploadCount;
                uploadCountDom.innerHTML = uploadCount;
                for (var i = 0, len = uploadList.length; i < len; ++i) {
                    var file = uploadList[i];
                    if(file.id == id){
                        if(file.url!=''&&file.url!=undefined) {
                            $.ajax({
                                url: urlServer + '/common/delete/img',
                                type: "POST",
                                data: {
                                    "path": file.url
                                },
                                success: function (data) {
                                    var code = data.code;
                                    if (code == 200) {
                                        var result = data.data.result;
                                        if (result == true) {
                                            alert("删除成功");
                                        }
                                    }
                                },
                                error: function (error) {
                                    console.log(error);
                                    alert("删除图片失败");
                                }
                            });
                        }
                        file.stop();

                        break;
                    }
                }
                target.remove();
                gallery.hide();
            });
        }
    });
});