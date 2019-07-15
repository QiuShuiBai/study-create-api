# vue-create-api

vue-create-api 是 `cube-ui` 框架的核心之一，它可以让 Vue 组件通过 API 方式调用。
下面我们从无到有，来简单地实现一个 vue-create-api

## 1. 普通使用

当我们在使用 vue 模版进行开发时，常常会遇到这样一个问题：
有些组件，比如 dialog、toast，因为这种组件有很明显的独立性，写在模版里会略显奇怪。同时若有多个业务组件需要使用到这些功能组件，那无可避免的需要对 dialog、toast 等组件多次引入、注册、编写，就算在全局上注册好这写组件，但也只是少了引入、注册的步骤。

```js
// 引入
import MyToast from 'components/toast/toast.vue'
// 注册
export default {
  components: {
    MyToast
  }
}
```

```html
<template>
  <!-- 编写，假设需要 props 传递文本 -->
  <my-toast v-if="isVisible" :text="text || '请稍后'"></my-toast>
</template>
```

## 2. api 式使用

通过使用`cube-ui`和`element-ui`这两个框架，可以发现他们是把类似 toast、dialog 这些组件写成一个`api`，并把这个 api 注册在`Vue.prototype`原型对象上，通过这个 api 来得到组件的实例并把这个组件挂载在 body 元素上。

所以我们也来写一个 api 来实现 `api式` 调用 toast 组件吧。下面是粗略的 Vue 模版代码，省略了css
(切换分支至 A-my-api )

```html
  <template>
    <div v-if="isVisible">{{text || '请稍后'}}</div>
  </template>
```

```js
export default {
  data() {
    // 通过 isVisible 变量控制 显示、隐藏
    return { isVisible: false}
  },
  methods: {
    show() { this.isVisible = true },
    hide() { this.isVisible = false }
  }
}
```

组件已经有了，其中的 text 是需要暴露给调用方法，让其通过`props`来与组件 toast 组件通信。下面我们来写一些 js，生成一个可以在全局调用的 api

```js
import Vue from 'vue'
import Toast from 'components/toast/toast.vue'

function $createToast(config) {
  const instance = new Vue({
    render(createElement) {
      return createElement(Toast, config)
    },
  })
  instance.$mount() // 未在 new Vue 时指定 el 属性，手动开启编译
  document.body.appendChild(instance.$el) // $mount 时未指定挂载结点，手动挂载
  return instance.$children[0]
  // 这里返回的是$children[0]是因为 instance 是整个 Vue 实例，这个实例只有一个子组件实例 Toast。我们需要通过操作 Toast 实例的方法来做到控制 显示／隐藏
}
Vue.prototype.$createToast = $createToast
```

我们把 api 方法写好后，在入口文件（main.js）引入，这样我们 `Vue.prototype` 上便有了 $createToast 方法。让我们在某个组件里试一下这个方法。

```html
<template>
  <div id="app">
    <button calss="btn" @click="show"> 显示 </button>
    <button calss="btn" @click="hide"> 隐藏 </button>
  </div>
</template>
```

```js
// 就在 App.vue 里简单调用
export default {
  name: 'app',
  data() {
    return { text: '请稍后' }
  },
  methods: {
    show() {
      // 通过原型链，找到$createToast方法。运行这个方法后，把 Toast 组件实例赋值给 this.dialog
      // 通过 Loading 组件实例的 show 方法，改变组件内部的 isVisible 变量达到显示组件的目的
      this.toast = this.toast || this.$createToast({
        props: { text: this.text }
      })
      this.toast.show()
    },
    hide() { this.toast && this.toast.hide() }
  }
}
```

此时已经达到了最基础的目的，但是如果 `text` 属性改变后，我们的 toast 组件提示文案并不能变化，原因是生成 toast 组件时传递的 config 对象没有被 Vue 所劫持。现在让我们来让 toast 组件文案能根据 App.vue 组件中的 text 属性变化而变化。
