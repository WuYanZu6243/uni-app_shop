// 模块化vuex，购物车数据
export default {
  // 开启命名空间
  namespaced: true,
  
  //准备mutations对象——修改state中的数据
  mutations : {
    // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
       uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 添加商品到购物车
    addToCart(state,goods){
      // 判断当前购物车中是否存在该商品：不存在=>添加商品，存在=>商品数量+1
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      if(!findResult){
        // 不存在该商品
        state.cart.push(goods)
      }else{
        // 存在该商品
        findResult.goods_count ++ 
      }
      // 调用 '将购物车中的数据持久化存储到本地' 方法，实现数据持久化存储
      // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
      this.commit('m_cart/saveToStorage')
    },
    // 购物车中的商品radio的勾选和取消勾选
    updateGoodsState(state, goods){
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      // 有对应的商品信息对象
      if (findResult) {
        // 更新对应商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
    
      if(findResult) {
        // 更新对应商品的数量
        findResult.goods_count = goods.goods_count
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    // 根据 Id 从购物车中删除对应的商品信息
    removeGoodsById(state, goods_id) {
      // 调用数组的 filter 方法进行过滤
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    // 更新所有商品的勾选状态,全选和取消全选
    updateAllGoodsState(state,newState){
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(item=>item.goods_state = newState)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    }
  },
  
  //准备state对象——保存具体的数据
  state : ()=>({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    // 从缓存中获取初始值
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  
  // vue中类似计算属性
  getters: {
    // 动态统计购物车中的商品数量
    total(state){
      // 把购物车中每一件商品的商品数量累加
      return state.cart.reduce((temp,item)=> temp + item.goods_count ,0)
    },
    // 动态计算当前购物车中已勾选的商品数量
    checkedCount(state){
      return state.cart
      .filter(goods=>goods.goods_state)
      .reduce((temp,item)=> temp + item.goods_count,0)
    },
    // 动态计算购物车中当前已勾选商品的总价钱
    checkedGoodsAmount(state){
      return state.cart
      .filter(goods=>goods.goods_state)
      .reduce((temp,item)=> temp + item.goods_count *  item.goods_price,0)
    }
  }
}