import {SET_MENU, REMOVE_MENU} from './mutations_type'

const changeMenu = {
  state: {
    menuState: false
  },
  getters: {
    getMenuState: state => {
      return state.menuState
    }
  },
  mutations: {
    [SET_MENU] (state, curState) {
      state.menuState = true
    },
    [REMOVE_MENU] (state, curState) {
      state.menuState = false
    }
  },
  actions: {
    set_menu ({commit}, curState) {
      commit(SET_MENU, curState)
    },
    remove_menu ({commit}, curState) {
      commit(REMOVE_MENU, curState)
    }
  }
}
export default changeMenu
