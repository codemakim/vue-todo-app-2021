import Vue from 'vue'
import lowdb from 'lowdb'
import _cloneDeep from 'lodash/cloneDeep'
import _findIndex from 'lodash/findIndex'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _forEachRight from 'lodash/forEachRight'
import LocalStorage from 'lowdb/adapters/LocalStorage'
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
    deleteDB (state, todo) {
      state.db
        .get('todos')
        .remove({ id: todo.id })
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
    },
    deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex)
    },
    updateTodo (state, { todo, key, value }) {
      todo[key] = value
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
  },
  deleteTodo ({ state, commit }, todo) {
    // Delete DB
    commit('deleteDB', todo)

    const foundIndex = _findIndex(state.todos, { id: todo.id })

    // Delete Client Todo
    commit('deleteTodo', foundIndex)
  },
  completeAll ({ state, commit }, checked) {
    // DB commit
    const newTodos = state.db
      .get('todos')
      .forEach(todo => {
        // todo.done = checked
        commit('updateTodo', {
          todo,
          key: 'done',
          value: checked
        })
      })
      .write()
    // Local todos
    state.todos = _cloneDeep(newTodos)
  },
  clearCompleted ({ state, dispatch }) {
    // 배열의 요소를 일괄적으로 제거할 땐, 해당 배열의 뒤부터 제거해야 한다.

    // 정상적으로 동작하지 않는 코드
    // this.todos.forEach(todo => {
    //   if (todo.done) {
    //     this.deleteTodo(todo)
    //   }
    // })

    // 뒤부터 제거하는 코드(네이티브 코드)
    // this.todos
    //   .reduce((list, todo, index) => {
    //     if (todo.done) {
    //       list.push(index)
    //     }
    //     return list
    //   }, [])
    //   .reverse()
    //   .forEach(index => {
    //     this.deleteTodo(this.todos[index])
    //   })

    // 뒤부터 제거하는 코드(라이브러리 활용 - lodash)
    _forEachRight(state.todos, todo => {
      if (todo.done) {
        // this.deleteTodo(todo)
        dispatch('deleteTodo', todo)
      }
    })
  }
}
