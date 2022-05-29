<template>
  <!-- 单个商品组件 -->
  <view class="goods-item" @click="goodsHandler">
    <!-- 商品图片 -->
    <view class="goods-image">
      <!-- 勾选框 -->
      <radio :checked="goods.goods_state" color="#0066BE" v-if="isShowRadio" @click="radioChangeHandler"></radio>
      <!-- 图片 -->
      <image :src="goods.goods_small_logo || defaultPic"></image>
    </view>
    <!-- 商品信息 -->
    <view class="goods-info">
      <!-- 商品名 -->
      <view class="goods-name">
        <text>{{goods.goods_name}}</text>
      </view>
      <!-- 商品价格和数量 -->
      <view class="goods-priceAndQuantity">
        <!-- 价格 -->
        <text class="goods-price">￥{{goods.goods_price | tofixed}}</text>
        <!-- 数量 -->
        <uni-number-box :min="1" :value="goods.goods_count" v-if="isShowNum" @change="numberChangeHandler"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
	export default {
    // 父组件的传参
    props:{
      // 商品对象信息
      goods:{
        type:Object,
        defaul: {}
      },
      // 是否显示左侧的radio
      isShowRadio:{
        type:Boolean,
        defaul:false
      },
      // 是否展示数量添加、减少器uni-number-box
      isShowNum:{
        type:Boolean,
        defaul:false
      }
    },
    // 数据
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
    // 方法
    methods:{
      // 调用父组件绑定的click事件
      goodsHandler(){
        this.$emit('click')
      },
      // 点击勾选框，触发父组件为自己绑定的自定义事件
      radioChangeHandler(){
        // 触发自定义事件，并把切换勾选状态商品的id和最新的勾选状态值返回给父组件
        this.$emit('radio-change',{
          goods_id:this.goods.goods_id,
          goods_state:!this.goods.goods_state
        })
      },
      // 数量修改器中的值发生改变，触发父组件为自己绑定的自定义事件
      numberChangeHandler(val){
        // 触发自定义事件，并把数量发生变化的商品的id和最新的商品数量返回给父组件
        this.$emit('num-change',{
          goods_id:this.goods.goods_id,
          // +val只是把字符串变数字
          goods_count:+val
        })
      }
    }
	}
</script>

<style lang="scss">
.goods-item{
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #D3D3D3;
  box-shadow: 1px 1px 2px #D3D3D3;
  // margin: 5px 0;
  display: flex;
  .goods-image{
    display: flex;
    margin-right: 5px;
    justify-content: center;
    align-items: center;
    padding-left: 5px;
    image{
      width: 180rpx;
      height: 180rpx;
    }
  }
  .goods-info{
    width: 100%;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 28rpx;
    .goods-priceAndQuantity{
      padding-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .goods-price{
        font-size: 30rpx;
        color: #c00000;
      }
    }
  }
}
</style>
