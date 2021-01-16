$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
        // 初始化文本编辑器
    initEditor()
        // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
        // 4.点击选择图片
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click();

        })
        // 监听change事件 获取用户选择的文件
    $('#coverFile').on('change', function(e) {
        var files = e.target.files
            // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0]) // 文件路径
        $image.cropper('destroy').attr('src', newImgURL).cropper(options)
    })
    var art_state = "已发布"
    $('#btnSave2').on('click', function() {
            art_state = "草稿"
        })
        // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
            // 2.基于 form表单，快速创建一个FORMdata对象
        var fd = new FormData($(this)[0])
            // 3.将文章的发布状态，存到fd中
        fd.append('state', art_state)
            // 
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个Canvas画布
                width: 400,
                height: 200
            })
            .toBlob(function(blob) {
                fd.append('cover_img', blob)
                publishArticle(fd);
            })
            // 发起ajax请求

    })

    function initCate() {
        // 定义加载文章分类的方法
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                //调用模板引擎渲染
                var htmlStr = template('tpl-cate', res)

                $('[name=cate_id]').html(htmlStr);
                // 重新加载表单渲染页面
                form.render()
            }
        })
    }

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功！')
                location.href = '/article/art_list.html'
            }
        })
    }
})