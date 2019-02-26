import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/Home.vue'
import Vue from 'vue'
import Router from 'vue-router'
import SysMenu from '../views/menu.vue'

import ChargeSuc from '../views/ChargeSuc.vue'

Vue.use(Router)
// import Main from '../views/Main.vue'

let routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  {
    path: '/chargeSuc',
    component: ChargeSuc,
    hidden: true
  },
  // { path: '/main', component: Main },
  // {
  //   path: '/',
  //   component: Home,
  //   name: '导航一',
  //   iconCls: 'el-icon-message',//图标样式class
  //   children: [
  //     { path: '/main', component: Main, name: '主页', hidden: true },
  //     { path: '/table', component: Table, name: 'Table' },
  //     { path: '/form', component: Form, name: 'Form' },
  //     { path: '/user', component: user, name: '列表' },
  //   ]
  // },
  // {
  //   path: '/',
  //   component: Home,
  //   name: '导航二',
  //   iconCls: 'fa fa-id-card-o',
  //   children: [
  //     { path: '/page4', component: Page4, name: '页面4' },
  //     { path: '/page5', component: Page5, name: '页面5' }
  //   ]
  // },
  // {
  //   path: '/',
  //   component: Home,
  //   name: 'Charts',
  //   iconCls: 'fa fa-bar-chart',
  //   children: [
  //     { path: '/echarts', component: echarts, name: 'echarts' }
  //   ]
  // },

]
let router = new Router({
  routes: routes
})

export default router
