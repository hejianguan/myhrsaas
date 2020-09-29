// 多语言初始化文件
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
// 以内ele的 中文包 英文包   这两个包只是用于显示的element的默认的语言包
import ElementEN from 'element-ui/lib/locale/lang/en'
import ElementZH from 'element-ui/lib/locale/lang/zh-CN'
import CustomEN from './en' // 常规语言包
import CustomZH from './zh'

Vue.use(VueI18n) // 全局注册i18n
// 实例化i18n

export default new VueI18n({
  // 选项 locale  设置当前的语言类型  该值是随便起的
  // en zh ja sp zh  zh-hk  zh
  // locale需要进行缓存
  locale: Cookies.get('locale') || 'en', // 当前的语言类型
  // 需要语言包  有几种语言，就需要几种语言包
  messages: {
    // 放置语言包  zh  en
    zh: {
      // 中文语言包
      ...ElementZH,
      ...CustomZH
    },
    en: {
      // 英文语言包
      ...ElementEN,
      ...CustomEN
    }
  }
})
// locale 是zh   t方法  就会去  zh里面找语言的值
// locale是en  t方法 就会去 en里面找语言的值
