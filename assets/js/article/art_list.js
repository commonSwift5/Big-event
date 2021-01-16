$(function() {
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个时间过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ":" + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }

    // 定义一个查询的参数对象，
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-table', res)

                $('tbody').html(htmlStr)
                    //调用分页的方法
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的方法
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎
                var htmlStr = template('tpl-cate', res)

                $('[name=cate_id]').html(htmlStr);
                // 重新渲染表单区域
                form.render();
            }
        })
    }
    // 
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name= state]').val()
            q.cate_id = cate_id
            q.state = state
            initTable()
        })
        // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器的ID
            count: total, //总共数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                // 通过first值 判断那种方式触发回调
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 
                if (!first) {
                    initTable()
                }
            }


        })
    }

    //实现删除功能 
    $('tbody').on('click', '.btn-delete', function() {
        // 询问用户是否要删除数据
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章列表失败！')
                    }
                    layer.msg('删除文章列表成功！')

                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    initTable()

                }

            })

            layer.close(index);
        });
    })
})