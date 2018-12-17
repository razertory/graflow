// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import "babel-polyfill"
import axios from 'axios'
import 'jsoneditor/dist/jsoneditor.css'
import '@/assets/font/start/iconfont.css'

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
    render: h => h(App)
}).$mount('#app');