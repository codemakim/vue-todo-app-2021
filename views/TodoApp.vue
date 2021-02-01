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

import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
import _cloneDeep from 'lodash/cloneDeep'
import TodoCreator from '~/components/TodoCreator'
import TodoItem from '~/components/TodoItem'

export default {
  components: {
    TodoCreator,
    TodoItem
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
