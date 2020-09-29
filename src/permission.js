// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
// 路由的前置守卫
router.beforeEach(async function(to, from, next) {
  NProgress.start() // 开启进度条
  //  首先判断有无token
  if (store.getters.token) {
    //   如果有token 继续判断是不是去登录页
    if (to.path === '/login') {
      //  表示去的是登录页
      next('/') // 跳到主页
    } else {
      // 只有在用户拥有token的情况下 并且 直接放行的情况下
      // 先判断之前有没有获取过
      if (!store.getters.userId) {
        // 如果没有id这个值 才会调用 vuex的获取资料的action
        const { roles } = await store.dispatch('user/getUserInfo')
        // 为什么要写await 因为我们想获取完资料再去放行
        //  roles.menus  是权限标识 它要去和路由模块做对应 进行筛选 筛选的得到的权限 进行 addRoutes  并且写入到vuex的state中
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes就是该用户所拥有的动态路由数组
        // 将得到的动态路由添加到路由表中
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        // 如果进行了addRoutes 请用next(to.path) 否则会导致 刷新路由权限失效 这是一个已知缺陷
        next(to.path)
      } else {
        next() // 直接放行
      }
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})
