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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
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
      'completedCount',
      'filteredTodos'
    ]),
    allDone: {
      get () {
        return this.total === this.completedCount && this.total > 0
      },
      set (checked) {
        this.completeAll(checked)
      }
    }
  },
  watch: {
    $route () {
      // state.filter = this.$route.params.id
      // helpers의 도움을 받지 않는 경우
      // this.$store.commit('todoApp/updateFilter', this.$route.params.id)
      // helpers의 도움을 받는 경우
      this.updateFilter(this.$route.params.id)
    }
  },
  created () {
    this.initDB()
  },
  methods: {
    ...mapActions([ // index.js에 작성한 actions를 사용하려는 경우
      'testFunction'
    ]),
    ...mapMutations('todoApp', [
      'updateFilter'
    ]),
    ...mapActions('todoApp', [
      'initDB',
      'completeAll',
      'clearCompleted'
    ]),
    scrollToTop () {
      scrollTo(0, 0, {
        ease: 'linear'
      })
    },
    scrollToBottom () {
      scrollTo(0, document.body.scrollHeight, {
        ease: 'linear'
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
