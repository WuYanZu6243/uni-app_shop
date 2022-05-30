// 模块化vuex，购物车数据
export default {
  // 开启命名空间
  namespaced: true,
  
  //准备mutations对象——修改state中的数据
  mutations : {
    // 将address持久化存储到本地缓存
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    // 更新收货地址
    updateAddress(state,address){
      state.address = address
      // 持久化缓存
      this.commit('m_user/saveAddressToStorage')
    }
  },
  
  //准备state对象——保存具体的数据
  state : ()=>({
    // 收货地址,从本地缓存获取该数据
    address : JSON.parse(uni.getStorageSync('address') || '{}'),
    // 登录成功之后的 token 字符串
    token: '',
  }),
  
  // vue中类似计算属性
  getters: {
    // 详细地址
    detailAddress(state){
      // 地址为空的情况 
      if (!state.address.provinceName) return ''
      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}