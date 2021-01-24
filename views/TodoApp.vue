<template>
  <div class="todo-app">
    <div class="todo-app__actions">
      <div class="filters">
<!--
        <button
          :class="{ active: filter ==='all' }"
          @click="changeFilter('all')"
        >
          모든 항목 ({{total}})
        </button>
-->
        <router-link to="/todos/all" tag="button">
          모든항목 {{ total }}
        </router-link>
        <router-link to="/todos/active" tag="button">
          해야 할 항목 ({{activeCount}})
        </router-link>
        <router-link to="/todos/completed" tag="button">
          완료된 항목 ({{completedCount}})
        </router-link>
      </div>
      <div class="actions">
        <input
          v-model="allDone"
          type="checkbox"
        >
        <button @click="clearCompleted">
          완료된 항목 삭제
        </button>
      </div>
    </div>
    <div class="todo-app__list">
      <todo-item
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @update-todo="updateTodo"
        @delete-todo="deleteTodo"
        />
    </div>
    <hr/>
    <todo-creator
      class="todo-app__creator"
      @create-todo="createTodo"
    />
  </div>
</template>

<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
import TodoCreator from '~/components/TodoCreator'
import TodoItem from '~/components/TodoItem'
import cryptoRandomString from 'crypto-random-string'

export default {
  components: {
    TodoCreator,
    TodoItem
  },
  data () {
    return {
      db: null,
      todos: []
    }
  },
  computed: {
    filteredTodos () {
      switch (this.$route.params.id) {
        case 'all':
        default:
          return this.todos
        case 'active': // 해야 할 항목
          return this.todos.filter(todo => !todo.done)
        case 'completed': // 완료된 항목
          return this.todos.filter(todo => todo.done)
      }
    },
    total () {
      return this.todos.length
    },
    activeCount () {
      return this.todos.filter(todo => !todo.done).length
    },
    completedCount () {
      return this.total - this.activeCount
    },
    allDone: {
      get () {
        return this.total === this.completedCount && this.total > 0
      },
      set (checked) {
        this.completeAll(checked)
      }
    }
  },
  created () {
    this.initDB()
  },
  methods: {
    initDB () {
      const adapter = new LocalStorage('todo-app')
      this.db = lowdb(adapter)
      console.log(this.db)

      const hasTodos = this.db
        .has('todos') // lodash
        .value() // lodash

      if (hasTodos) {
        // todos 값이 있으면 실행
        this.todos = _cloneDeep(this.db.getState().todos) // DB의 값을 참조하면 안되기 때문에 딮카피해서 할당한다.
      }

      // Local DB 초기화
      this.db
        .defaults({
          todos: [] // Collection
        })
        .write()
    },
    createTodo (title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }
      // DB 추가
      this.db
        .get('todos') // lodash
        .push(newTodo) // lodash
        .write() // lowdb

      // 화면에 쓰이는 데이터 추가
      this.todos.push(newTodo)
    },
    updateTodo (todo, value) {
      this.db
        .get('todos')
        .find({
          id: todo.id
        })
        .assign(value) // todo 데이터를 전달받은 객체 값으로 갱신
        .write()

      const foundTodo = _find(this.todos, { id: todo.id })
      _assign(foundTodo, value)
    },
    deleteTodo (todo) {
      this.db
        .get('todos')
        .remove({ id: todo.id })
        .write()

      const foundIndex = _findIndex(this.todos, { id: todo.id })
      this.$delete(this.todos, foundIndex)
    },
    // changeFilter (filter) {
    //   this.filter = filter
    // },
    completeAll (checked) {
      // DB
      const newTodos = this.db
        .get('todos')
        .forEach(todo => {
          todo.done = checked
        })
        .write()
      // Local todos
      this.todos = _cloneDeep(newTodos)
    },
    clearCompleted () {
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
      _forEachRight(this.todos, todo => {
        if (todo.done) {
          this.deleteTodo(todo)
        }
      })
    }
  }
}
</script>

<style>
  button.active {
    font-weight: bold;
  }
  .filters button.router-link-active {
    background: royalblue;
    color:white;
  }
</style>
