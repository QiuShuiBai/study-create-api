import Vue from 'vue'
import App from './App.vue'

// 引入编写好的 api
import './api/my-api'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
