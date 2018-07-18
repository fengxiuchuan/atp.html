import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/Home.vue'
// import Main from '../views/Main.vue'
import Member from '../views/Member.vue'
import Coach from '../views/Coach.vue'
import Gym from '../views/Gym.vue'
import Course from '../views/Course.vue'
import MemCharge from '../views/MemCharge.vue'
import ChargeSuc from '../views/ChargeSuc.vue'
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
    hidden: true,
    component:ChargeSuc
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
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'el-icon-message',
    // leaf: fa, // 只有一个节点
    children: [
      { path: '/Member', component: Member, name: '会员管理' },
      { path: '/Coach', component: Coach, name: '教练管理' },
      { path: '/Gym', component: Gym, name: '场馆' },
      { path: '/Course', component: Course, name: '开设课程' },
      { path: '/MemCharge', component: MemCharge, name: '增值服务' }
    ]
  },
  // {
  //   path: '/',
  //   component: Home,
  //   name: 'Charts',
  //   iconCls: 'fa fa-bar-chart',
  //   children: [
  //     { path: '/echarts', component: echarts, name: 'echarts' }
  //   ]
  // },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  },
 
]

export default routes
