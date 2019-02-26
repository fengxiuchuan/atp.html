import Vue from 'vue'
import Vuex from 'vuex'
import addRoutes from './addRoutes'
import changeMenu from './changeMenuState'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    addRoutes: addRoutes,
    changeMenu: changeMenu
  }
})

export default store
