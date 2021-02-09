// import { ContextExclusionPlugin } from "webpack"

export default {
  namespaced: true,
  state: () => ({
    a: 123,
    b: []
  }),
  getters: {
    someGetter1 (state, getters) {
      return state.a + 1
    },
    someGetter2 (state, getters) {
      return state.a + getters.someGetter1
    }
  },
  mutations: {
    someMutation (state, payload) {
      state.a = 789
      state.b.push(payload)
    }
  },
  actions: {
    // 첫번째 파라미터로 context를 받을 수 있는데, 아래 파라미터는 순서대로
    // context 객체 내부의 state, getters, mutaions, actions 를 사용하기 위한 변수임.
    someAction1 ({ state, getters, commit, dispatch }, payload) {
      // state.a = 789 - error
      // state.b.push(payload) - error
      commit('someMutation', payload)
    },
    someAction2 (context, payload) {
      context.commit('someMutaion')
      context.dispatch('someAction1', payload)
    }
  }
}
