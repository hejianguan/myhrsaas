// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store' // 引入vuex的store实例
import { Message } from 'element-ui' // 单独的引入element的方法
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const TimeOut = 7200 // 定义两个小时的有效时间
const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
}) // 创建一个axios的实例
service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    // 如果存在token ,就有必要检查你的token是否超时了
    if (CheckTimeOut()) {
      // 如果进来，表示差距已经大于7200秒了
      // 调用登出的action
      store.dispatch('user/lgout') // 调用登出的action
      router.push('/login') // 回到登录页
      return Promise.reject(new Error('token超时了')) // 为了阻止继续往下走 要返回一个promise的reject
    }
    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
}) // 请求拦截器
// 两个参数 都是函数  一个是成功的时候执行 一个时候失败的时候执行
service.interceptors.response.use(response => {
  //  因为response实际上多加了一层data
  const { success, message, data } = response.data
  if (success) {
    //  如果成功 表示业务执行成功 直接返回data
    return data
  } else {
    // 表示没有执行成功先弹出错误消息 再reject
    Message.error(message) // 先提示错误
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error && error.response && error.response.data.code === 10002) {
    //  当状态码为10002时 表示后端告诉我 超时了
    store.dispatch('user/lgout') // 调用登出的action
    router.push('/login') // 回到登录页
    return Promise.reject(new Error('超时了')) // 返回错误
  } else {
  // 提示失败
    Message.error(error.message) // 提示错误
    return Promise.reject(error) // 返回错误
  }

  // $message 所有带$的属性都只能在组件中调用 因为这些属性都是Vue的原型方法
}) // 响应拦截器
// 检查超时的函数
const CheckTimeOut = function() {
  // 首先要获取缓存中的时间戳
  var currentTime = new Date().getTime() // 获取当前时间
  var timeStamp = getTimeStamp() ? getTimeStamp() : 0
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service // 导出axios实例
