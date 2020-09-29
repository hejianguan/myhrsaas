const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 在根级的getters上 开发子模块的属性给别人看 给别人用
  name: state => state.user.userInfo.username, // 开放user对象里面的 一个对象的属性给别人用
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立用户头像的映射
  companyId: state => state.user.userInfo.companyId, // 建立对于user模块的companyId的快捷访问
  routes: state => state.permission.routes // 将permission中的路由模块开放出来
  // 删除原来的user模块
}
export default getters
