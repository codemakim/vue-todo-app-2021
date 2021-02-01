<template>
  <div>
    <button @click="createTodo">추가</button>
    <input
      :value="title"
      :placeholder="placeholder"
      type="text"
      @input="title = $event.target.value"
      @keypress.enter="createTodo">
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      placeholder: '할 일을 추가하세요!'
    }
  },
  methods: {
    createTodo () {
      // 생성
      console.log(this.title)
      const validatedTitle = this.title && this.title.trim()
      if (!validatedTitle) {
        alert('유효하지 않은 제목입니다.')
        this.title = this.title.trim()
        return false
      }
      // 부모 컴포넌트의 createTodo 메서드를 실행한다.
      // this.$emit('create-todo', this.title)

      // store에 있는 dispatch를 호출하도록 수정
      this.$store.dispatch('todoApp/createTodo', this.title)
      this.title = ''
    }
  }
}
</script>

<style scoped>

</style>
