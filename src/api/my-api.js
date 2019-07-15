import Vue from 'vue'
import Toast from '../components/toast/toast.vue'

function $createToast(config) {
  const instance = new Vue({
    render(createElement) {
      return createElement(Toast, {...config})
    },
  })
  instance.$mount()
  document.body.appendChild(instance.$el)
  return instance.$children[0]
}
Vue.prototype.$createToast = $createToast
