import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './plugins/axios'
import './assets/css/common.css'
import './assets/css/x502.css'
import './plugins/highcharts.js'
import './plugins/authorization.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
