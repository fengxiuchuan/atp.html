// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Api from './api/api.js'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
// 货币
import VueNumeric from 'vue-numeric'
import store from './store/store'
import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/icon/iconfont.css'
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueNumeric)

Vue.config.productionTip = false

// 如果不使用原型，将会报错

Vue.prototype.$http = Api
// 登录状态判断
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next()
  } else {
    if (!sessionStorage.getItem('user') && to.path !== '/login') {
      next({
        path: '/login'
      })
    } else {
      let curMenustate = store.getters.getMenuState
      // 用户手动刷新页面，这是路由会被重设，要重新新增
      if (sessionStorage.getItem('user') && !store.getters.getMenuState) {
        let routes = JSON.parse(sessionStorage.getItem('routes'))
        store.dispatch('add_Routes', routes)
        store.dispatch('set_menu', true)
        router.push('/')
        console.log(router)
      }
      next()
    }
  }
})/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
