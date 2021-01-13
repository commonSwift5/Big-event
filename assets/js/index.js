$(function() {
        getUserInfo()
            // 退出按钮的实现
        $('#btnLogout').on("click", function() {
            var layer = layui.layer;
            layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
                // do something
                // 1.清空本地存储中的token
                localStorage.removeItem('token')
                    // 2.重新跳转到登录页
                location.href = '/login.html'
                layer.close(index);
            });
        })





    })
    // 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        //  headers: {
        //         Authorization: localStorage.getItem('token') || ''
        //     },   
        success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败');
                }
                renderAvatar(res.data)
            }
            // 渲染用户头像
            // complete: function(res) {
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            //         localStorage.removeItem('token')
            //         location.href = '/login.html'
            //     }
            // }
    })
}

function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name)
        // 按需求渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img')
            .attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first).show()

    }

}