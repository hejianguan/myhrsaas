import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // 子模块   $store.state.app.
    // mapGetters([])
    app,
    settings,
    user,
    permission,
    tagsView // 名字必须交tagsView
  },
  getters // 根级的getters
})

export default store
