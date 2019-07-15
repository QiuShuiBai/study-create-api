<template>
  <div id="app">
    <button calss="btn" @click="show"> 显示 </button>
    <button calss="btn" @click="hide"> 隐藏 </button>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      text: '请稍等...'
    }
  },
  methods: {
    show() {
      this.toast = this.toast || this.$createToast({
        props: {
          text: this.text
        }
      })
      this.toast.show()
    },
    hide() {
      this.toast && this.toast.hide()
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html, body {
  height: 100%;
}
#app {
  overflow: hidden;
}
button {
  display: block;
  margin: 20px auto 0;
  border: 1px solid black;
  font-size: 20px;
  outline: none;
}
</style>
