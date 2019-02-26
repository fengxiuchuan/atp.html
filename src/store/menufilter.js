
import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/Home.vue'
// import Main from '../views/Main.vue'
import Member from '../views/Member.vue'
import Coach from '../views/Coach.vue'
import Gym from '../views/Gym.vue'
import Course from '../views/Course.vue'
import MemCharge from '../views/MemCharge.vue'
import Consume from '../views/ConsumeCourse.vue'

import SysMenu from '../views/menu.vue'
import SysRole from '../views/role.vue'
import SysUser from '../views/user.vue'

let CmpnArr = [
  {label: 'Home', value: Home},
  {label: 'Member', value: Member},
  {label: 'Coach', value: Coach},
  {label: 'Gym', value: Gym},
  {label: 'Course', value: Course},
  {label: 'MemCharge', value: MemCharge},
  {label: 'Consume', value: Consume},
  {label: 'SysMenu', value: SysMenu},
  {label: 'SysRole', value: SysRole},
  {label: 'SysUser', value: SysUser}
]

export default (routers, data) => {
  // 要重新遍历一下，是因为，通常我们动态路由的时候，
  // 是获取服务端数据，这个component属性是一个字符串转化成组件
  generaMenu(routers, data)
}
function generaMenu (routers, data) {
  data.forEach((item) => {
    let menu = getRoute(item)
    // 只添加菜单，过来掉按钮
    menu.component = menu.component
    if (item.children) {
      menu.children = []
      generaMenu(menu.children, item.children)
    }
    routers.push(menu)
  })
}
function getRoute (item) {
  let component = getComponentByName(item.component)

  let route = {
    path: item.path,
    component: component,
    name: item.name,
    iconCls: item.iconCls,
    children: []
  }
  return route
}

function getComponentByName (name) {
  if (!name) {
    return NotFound
  }
  for (var i = 0; i < CmpnArr.length; i++) {
    if (name === CmpnArr[i].label) {
      return CmpnArr[i].value
    }
  }
  return Home
}
