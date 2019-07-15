<template>
  <div v-if="isVisible" class="toast">{{text || '请稍后'}}</div>
</template>

<script>
export default {
  props: {
    text: String
  },
  data() {
    return {
      isVisible: false
    }
  },
  methods: {
    show() { this.isVisible = true },
    hide() { this.isVisible = false }
  }
}
</script>

<style>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  padding: 0 10px;
  min-width: 60px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: rgba(153, 153, 153, 0.267);
  border-radius: 4px;
}

</style>
