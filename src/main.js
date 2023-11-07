import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "@/plugin/CSS/index.min.css";

import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.baseURL = 'http://www.chenfuguo.cn:8899/api/private/v1';

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  let token_ = sessionStorage.getItem('token')
  if (token_) {
    config.headers['Authorization'] = token_
    // 在发送请求之前做些什么
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

Vue.use(VueAxios, axios)

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
