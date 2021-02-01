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
          해야 할 항목 ({{ activeCount }})
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
      <!-- <todo-item
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @update-todo="updateTodo"
        @delete-todo="deleteTodo"
        /> -->
      <todo-item
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
      />
    </div>
    <hr/>
    <!-- <todo-creator
      class="todo-app__creator"
      @create-todo="createTodo"
    /> -->
    <todo-creator
      class="todo-app__creator"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TodoCreator from '~/components/TodoCreator'
import TodoItem from '~/components/TodoItem'

export default {
  components: {
    TodoCreator,
    TodoItem
  },

  computed: {
    // Helpers state를 가져와서 매핑
    ...mapState('todoApp', [
      'todos'
    ]),
    // Helpers getters(computed)를 가져와서 매핑
    ...mapGetters('todoApp', [
      'total',
      'activeCount',
      'completedCount'
    ]),
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
