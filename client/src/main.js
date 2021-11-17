import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
import 'splitpanes/dist/splitpanes.css'
import Vue from 'vue'
import App from './App.vue'
import "./assets/css/iconfont.css"
import "./screen.css"

Vue.use(ElementUI)

Vue.config.productionTip = false



new Vue({
  render: h => h(App),
}).$mount('#app')





