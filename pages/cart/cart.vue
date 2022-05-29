<template>
	<view class="cart-content">
    <!-- 购物车有商品时展示 -->
    <view class="cart-container"  v-if="cart.length !== 0">
      <!-- 自定义选择地址组件 -->
      <my-address></my-address>
      
      <!-- 购物车中的商品列表 -->
      <view class="cart-list">
        <!-- 滑动组件，最外层包裹性质的容器 -->
        <uni-swipe-action>
          <view class="my-goods-margin" v-for="goods in cart" :key="goods.goods_id">
            <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 -->
            <uni-swipe-action-item class="uni-swipe-action-item" :options="options" @click="swipeActionClickHandler(goods)">
              <my-goods class="my-goods" :goods="goods" :isShowRadio="true" @radio-change="radioChangeHandler"
              :isShowNum="true"  @num-change="numberChangeHandler"></my-goods>
            </uni-swipe-action-item>
          </view>
        </uni-swipe-action>
      </view>
      
      <!-- 结算区域 -->
      <my-settle></my-settle>
    </view>
    
    <!-- 购物车里没有商品时展示 -->
    <view class="empty-cart" v-else>
      <image src="../../static/cart.png"></image>
      <text>空空如也~</text>
    </view>
	</view>
  
  
</template>

<script>
  import {mapState,mapGetters,mapMutations} from 'vuex'
  // 导入自定义封装模块
  import badgeMix from '../../mixins/abbar-badge.js'
  
	export default {
    // 混入
    mixins: [badgeMix],
    // 数据
		data() {
			return {
				// 滑动组件，按钮的配置信息
        options: [{
          text: '删除', // 显示的文本内容
          style: {
            backgroundColor: '#0066BE' // 按钮的背景颜色
          }
        }]
			};
		},
    // 计算属性
    computed:{
      // 便捷获取vue中state中的数据
      ...mapState('m_cart', ['cart'])
    },
    // 方法
    methods:{
      // 便携获取vuex中mutations的方法
      ...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById']),
      // 为my-goods组件绑定的自定义事件，用于检测radio的勾选和取消勾选
      radioChangeHandler(e){
        // 调用vuex中mutations中updateGoodsState方法，更新购物车中商品的勾选状态
        this.updateGoodsState(e)
      },
      // 为my-goods组件绑定的自定义事件，用于检测数量修改器值的变化
      numberChangeHandler(e){
        this.updateGoodsCount(e)
      },
      // 点击了滑动操作按钮
      swipeActionClickHandler(goods) {
        this.removeGoodsById(goods.goods_id)
      }
    }
	}
</script>

<style lang="scss">
  .my-goods-margin{
    margin: 5px 0;
  }
  .my-goods{
    width: 100%;
  }
  .cart-list{
    padding: 0px 5px;
  }
  .empty-cart{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 180px;
    image{
      display: block;
      width: 80px;
      height: 80px;
      margin-bottom: 5px;
    }
    text{
      font-size: 16px;
    }
  }
</style>
