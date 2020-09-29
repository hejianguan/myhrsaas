// 检查权限的方法  返回一个true或者false
// 检查 用户的权限点中有没有 对应的标识 有这个标识 就返回true  没有标识就返回false
// 可以将方法混入到所有的组件中
// 导出混入对象
import store from '@/store'
export default {
  methods: {
    // key是用来检查的标识
    checkPermission(key) {
      // 获取vuex数据
      const { roles } = store.state.user.userInfo
      if (roles && roles.points && roles.points.length) {
        return roles.points.some(item => item === key)
      }
      return false
    }
  }
}
