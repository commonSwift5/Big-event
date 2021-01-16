$(function() {
    // 初始化文章分类列表
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // 调用模板引擎
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 添加类别弹出层
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()

            })
        })
        // 通过代理的形式，为form-add表单绑定SUBMIT事件
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增分类失败！')
                    }
                    initArtCateList()
                    layer.msg('新增分类成功！')

                    // 根据索引关闭弹出层

                    layer.close(indexAdd)
                }
            })
        })
        // 为btn-edit 添加点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()

        })
        var id = $(this).attr('data-id')
            // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: "/my/article/cates/" + id,
            success: function(res) {

                form.val('form-edit', res.data)
            }
        })

    })
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据成功！')
                }
                layer.msg('更新分类数据成功！')
                initArtCateList()
                layer.close(indexEdit)
            }
        })
    })
    $('body').on('click', '.btn-delete', function(e) {

        e.preventDefault()
        var id = $(this).attr('data-id')
            // 弹出确认删除提示框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })


        });



    })


})