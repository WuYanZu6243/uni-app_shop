<template>
	<view class="my-settle-content">
		<!-- 勾选框 -->
    <label class="my-settle-checkbox" @click="changeAllState">
      <radio :checked="isFullCheck" color="#0066BE">全选</radio>
    </label >
    <!-- 合计 -->
    <view class="my-settle-total">
      合计:<text class="my-settle-total-money">￥{{checkedGoodsAmount}}</text>
    </view>
    <!-- 结算 -->
    <view class="my-settle-account"  @click="settlement">
      结算({{checkedCount}})
    </view>
	</view>
</template>

<script>
  import {mapState,mapGetters,mapMutations} from 'vuex'
	export default {
    // 数据
		data() {
			return {
				
			};
		},
    // 计算属性
    computed:{
      ...mapGetters('m_cart',['total','checkedCount','checkedGoodsAmount']),
      ...mapState('m_user',['address','token']),
      // 计算当前是否是全选,判断全选的勾选框应不应该勾上
      isFullCheck(){
        return this.total === this.checkedCount
      }
    },
    // 方法
    methods:{
      ...mapMutations('m_cart',['updateAllGoodsState']),
      // 点击全选勾选框,全选和取消全选
      changeAllState(){
        // 调用vuex里的方法,进行全选和取消全选
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 点击了结算按钮
      settlement() {
        // 1. 先判断是否勾选了要结算的商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
      
        // 2. 再判断用户是否选择了收货地址
        if (!this.address) return uni.$showMsg('请选择收货地址！')
      
        // 3. 最后判断用户是否登录了
        if (!this.token) return uni.$showMsg('请先登录！')
      }
    }
	}
</script>

<style lang="scss">
.my-settle-content {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content:space-between;
  align-items: center;
  box-sizing: border-box;
  padding-left: 5px;
  // 勾选框
  .my-settle-checkbox{
    
  }
  // 合计
  .my-settle-total{
    .my-settle-total-money{
      color: #c00000;
    }
  }
  // 结算
  .my-settle-account{
    width: 100px;
    line-height: 50px;
    text-align: center;
    background-color: #0066BE;
    color: #fff;
  }
}
</style>
