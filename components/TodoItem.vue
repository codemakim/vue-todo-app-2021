<template>
  <div
    :class="{done}"
    class="todo-item"
  >
    <div
      v-if="isEditMode"
      class="item__inner item--edit"
    >
      <input type="text"
        ref="titleInput"
        :value="editedTitle"
        @input="editedTitle = $event.target.value"
        @keypress.enter="editedTodo"
        @keypress.esc="offEditMode"
      >
      <div class="item__actions">
        <button
          key="completeBtn"
          @click="editedTodo"
        >완료</button>
        <button
          key="cancleBtn"
          @click="offEditMode"
        >취소</button>
      </div>
    </div>
    <div
      v-else
      class="item__inner item--normal">
      <input type="checkbox"
        v-model="done"
      />
      <div class="item__title-wrap">
        <div class="item__title">
          {{ todo.title }}
        </div>
        <div class="item__date">
          {{ date }}
        </div>
      </div>
      <div class="item__actions">
        <button
          key="updateBtn"
          @click="onEditMode"
        >수정</button>
        <button
          key="deleteBtn"
          @click="deleteTodo"
        >삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
// day.js 는 moment.js 와 유사한 문법을 가졌으나, 기능과 용량이 가벼운 모듈이다.
// moment.js의 다양한 기능이 필요 없다면, day.js를 고려하자.
import dayjs from 'dayjs'

export default {
  props: {
    todo: Object
  },
  data () {
    return {
      editedTitle: '',
      isEditMode: false
    }
  },
  computed: {
    done: {
      get () {
        return this.todo.done
      },
      set (done) {
        this.updateTodo({
          done
        })
      }
    },
    date () {
      const date = dayjs(this.todo.createdAt)
      const isSame = date.isSame(this.todo.updatedAt)
      if (isSame) {
        return date.format('YYYY년 MM월 DD일')
      } else {
        return `${date.format('YYYY년 MM월 DD일')} (edited)`
      }
    }
  },
  methods: {
    editedTodo () {
      // 수정이 끝났기에 DB 업데이트
      if (this.todo.title !== this.editedTitle) {
        this.updateTodo({
          title: this.editedTitle,
          updatedAt: new Date()
        })
      }
      this.offEditMode()
    },
    onEditMode () {
      this.isEditMode = true
      this.editedTitle = this.todo.title

      // 위에서 데이터가 변경된 후 그에 해당하는 페이지 렌더링이 완료된 후 포커스 함수를 실행하기 위해 nextTick을 씀.
      this.$nextTick(() => {
        this.$refs.titleInput.focus()
      })
    },
    offEditMode () {
      this.isEditMode = false
    },
    updateTodo (value) {
      this.$emit('update-todo', this.todo, value)
    },
    deleteTodo () {
      this.$emit('delete-todo', this.todo)
    }
  }
}
</script>

<style scoped>
  .todo-item {
    margin-bottom: 10px;
  }
  .todo-item.done .item__title {
    text-decoration: line-through;
  }
  .todo-item .item__inner {
    display: flex;
  }
  .todo-item .item__date {
    font-size: 12px;
  }
</style>
