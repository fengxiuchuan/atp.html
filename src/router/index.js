import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/Home.vue'
import Vue from 'vue'
import Router from 'vue-router'
import SysMenu from '../views/Menu.vue'

import Coach from '../views/Coach'
import ConsumeCourse from '../views/ConsumeCourse'
import Course from '../views/Course'
import Gym from '../views/Gym'
import Member from '../views/Member'
import MemCharge from '../views/MemCharge'

import Role	 from '../views/Role'
import User from '../views/User'
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
  {
    path: '/',
    component: Home,
    name: '首页',
    iconCls: 'el-icon-message',
    children: [
      { path: '/coach', component: Coach, name: '教练', hidden: true },
      { path: '/consumeCourse', component: ConsumeCourse, name: '销课列表' },
      { path: '/course', component: Course, name: '课程管理' },
      { path: '/gym', component: Gym, name: '场馆管理' },
      { path: '/member', component: Member, name: '会员管理' },
      { path: '/memCharge', component: MemCharge, name: '充值列表' },
      { path: '/menu', component: SysMenu, name: '菜单管理' },
      { path: '/role', component: Role, name: '角色管理' },
      { path: '/user', component: User, name: '用户管理' }
    ]
  }
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
