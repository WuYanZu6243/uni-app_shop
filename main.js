import Vue from 'vue'
import App from './App'

// 导入vue实例
import store from './store/index.js'

// 导入网络请求包
import { $http } from '@escook/request-miniprogram'
// 配置请求根路径
$http.baseUrl = 'https://www.uinav.com'
// 挂载请求到实例上
uni.$http = $http
// 请求拦截器
$http.beforeRequest = function (options) {
  uni.showLoading({
      title: '数据加载中...',
  })
}
// 响应拦截器
$http.afterRequest = function () {
  uni.hideLoading()
}

// 封装弹框提示
uni.$showMsg = function(title='数据请求失败!',duration=1500){
  uni.showToast({
    title,
    duration,
    icon:'none'
  })
}

// 设置全局过滤器
Vue.filter('tofixed',function(num){
  return Number(num).toFixed(2)
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
  // 将 store 挂载到 Vue 实例上
  store
})
app.$mount()
