<template>
  <!-- 单个商品组件 -->
  <view class="goods-item" @click="goodsHandler">
    <!-- 商品图片 -->
    <view class="goods-image">
      <image :src="goods.goods_small_logo || defaultPic"></image>
    </view>
    <!-- 商品信息 -->
    <view class="goods-info">
      <text>{{goods.goods_name}}</text>
      <text class="goods-price">￥{{goods.goods_price | tofixed}}</text>
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
      // 调用父组件绑定的点击事件
      goodsHandler(){
        this.$emit('click')
      }
    }
	}
</script>

<style lang="scss">
.goods-item{
  width: 100%;
  border: 1px solid #D3D3D3;
  box-shadow: 1px 1px 2px #D3D3D3;
  margin: 5px 0;
  display: flex;
  .goods-image{
    margin-right: 5px;
    image{
      width: 180rpx;
      height: 180rpx;
    }
  }
  .goods-info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 28rpx;
    .goods-price{
      font-size: 30rpx;
      color: #c00000;
    }
  }
}
</style>
