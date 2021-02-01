import Vue from 'vue'
import Vuex from 'vuex'

import todoApp from './todoApp'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // production일 때는 false
  // // Data
  // state: {

  // },
  // // Computed
  // getters: {

  // },
  // // Methods
  // // 실제 값(state)을 변경할 때 사용 (비동기 불가능)
  // mutations: {

  // },
  // // Methods
  // // 일반 로직 (비동기 가능) - 실제 값(state)을 변경하면 안됨.
  // actions: {

  // }
  modules: {
    todoApp
  }
})
