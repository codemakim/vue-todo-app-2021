import _cloneDeep from 'lodash/cloneDeep'
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import cryptoRandomString from 'crypto-random-string'

export default {
  namespaced: true, // 전역적으로 사용하지 않고 해당 socpe에서 독립적으로 쓸 때 설정
  // Data
  state: () => ({
    db: null,
    todos: []
  }),
  // Computed
  getters: {
    total (state) {
      return state.todos.length
    },
    activeCount (state) {
      return state.todos.filter(todo => !todo.done).length
    },
    completedCount (state, getters) {
      return getters.total - getters.activeCount
    }
  },
  // Methods
  // 실제 값(state)을 변경할 때 사용 (비동기 불가능)
  mutations: {
    assignDB (state, db) {
      state.db = db
    },
    createDB (state, newTodo) {
      // DB 추가
      state.db
        .get('todos') // lodash
        .push(newTodo) // lodash
        .write() // lowdb
    },
    updateDB (state, { todo, value }) {
      state.db
        .get('todos')
        .find({
          id: todo.id
        })
        .assign(value) // todo 데이터를 전달받은 객체 값으로 갱신
        .write()
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    assignTodo (state, { foundTodo, value }) {
      _assign(foundTodo, value)
    },
    pushTodo (state, newTodo) {
      // 화면에 쓰이는 데이터 추가
      state.todos.push(newTodo)
    }
  },
  // Methods
  // 일반 로직 (비동기 가능) - 실제 값(state)을 변경하면 안됨.
  actions: {
    initDB ({ state, commit }) {
      const adapter = new LocalStorage('todo-app')

      // state.db = lowdb(adapter)
      commit('assignDB', lowdb(adapter))

      const hasTodos = state.db
        .has('todos') // lodash
        .value() // lodash

      if (hasTodos) {
        // todos 값이 있으면 실행
        // state.todos = _cloneDeep(state.db.getState().todos) // DB의 값을 참조하면 안되기 때문에 딮카피해서 할당한다.
        commit('assignTodos', _cloneDeep(state.db.getState().todos))
      }

      // Local DB 초기화
      state.db
        .defaults({
          todos: [] // Collection
        })
        .write()
    },
    createTodo ({ state, commit }, title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }
      commit('createDB', newTodo)
      commit('pushTodo', newTodo)
    }
  },
  updateTodo ({ state, commit }, { todo, value }) {
    commit('updateDB', { todo, value })
    const foundTodo = _find(state.todos, { id: todo.id })
    commit('assignTodo', { foundTodo, value })
  }
}
