// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import routes from './router/routes.js'
import Api from './api/api.js'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import Pageination from './components/pagination'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/icon/iconfont.css'
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.config.productionTip = false

const router = new VueRouter({
  routes
})
// 如果不使用原型，将会报错

Vue.prototype.$http = Api
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
