// 导入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'

// 导入购物车的 vuex 模块
import moduleCart from './cart.js'
import moduleUser from './user.js'

// 注册vuex
Vue.use(Vuex)

// 创建并导出Vuex实例
export default new Vuex.Store({
  // 模块化vuex
  modules:{
    // 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为 m_cart，例如：
    // 购物车模块中 cart 数组的访问路径是 m_cart/cart
    m_cart: moduleCart,
    m_user: moduleUser
  }
})
