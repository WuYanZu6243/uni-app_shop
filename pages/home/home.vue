<template>
	<view class="home-content">
    <!-- 搜索框 -->
    <view class="my-search-box">
      <my-search class='my-search' @click='skipSearch'></my-search>
    </view>
    <!-- 轮播图 -->
		<swiper :indicator-dots='true' :autoplay='true' :interval="3000" :circular='true' 
    indicator-active-color='#334'>
		  <swiper-item v-for="item in swiperList" :key="item.goods_id">
        <navigator :url="`/subpkg/goods_detail/goods_detail?id=${item.goods_id}`" 
        class="swiper-item">
          <image :src="item.image_src" class="swiper-img"></image>
        </navigator>
		  </swiper-item>
		</swiper>
    <!-- 导航 -->
    <view class="nav">
      <view class="nav-item" v-for="(item,index) in navList" :key='index'
      @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav-img" mode="widthFix"></image>
      </view>
    </view>
    <!-- 楼层 -->
    <view class="floor">
      <view class="floor-item" v-for="(item,i) in floorList" :key="i">
        <!-- 楼层标题 -->
        <view class="floor-item-title">
          <image :src="item.floor_title.image_src" mode="widthFix"></image>
        </view>
        <!-- 楼层图片 -->
        <view class="floor-item-img">
          <!-- 左边图片 -->
          <navigator class="floor-item-img-left" :url="item.product_list[0].navigator_url">
            <image :src="item.product_list[0].image_src" 
            :style="{width: item.product_list[0].image_width + 'rpx'}" 
            mode="widthFix"></image>
          </navigator>
          <!-- 右边图片 -->
          <view class="floor-item-img-right">
            <navigator v-for="(item2,i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.navigator_url">
              <image :src="item2.image_src" mode="widthFix"
              :style="{width: item2.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
// 导入自定义封装模块
import badgeMix from '../../mixins/abbar-badge.js'
  
	export default {
    // 混入
    mixins: [badgeMix],
    // 数据
		data() {
			return {
				// 轮播图数据列表
        swiperList:[],
        // 导航栏数据列表
        navList:[],
        // 楼层数据列表
        floorList:[]
			};
		},
    
    // 生命周期函数，页面加载
    onLoad() {
      // 调用获取轮播图数据方法
      this.getSwiperList()
      // 调用获取导航列表数据
      this.getNavList()
      // 调用获取楼层列表数据
      this.getFloorList()
    },
    
    // 方法
    methods:{
      // 获取轮播图列表数据
      async getSwiperList(){
        const {data:res} = await uni.$http.get('/api/public/v1/home/swiperdata') 
        // 请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        this.swiperList = res.message
      },
      // 获取导航栏列表数据
      async getNavList(){
        const {data:res} = await uni.$http.get('/api/public/v1/home/catitems')
        // 请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        this.navList = res.message
      },
      // 点击nav导航中的分类，跳转到Tabbar中的分类
      navClickHandler(item){
        // 判断点击的是否是分类
        if(item.name === '分类'){
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 获取楼层数据列表
      async getFloorList(){
        const {data:res} = await uni.$http.get('/api/public/v1/home/floordata')
        // 请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        // 对数据进行预处理，因为数据中的图片跳转地址和当前项目地址不同
        res.message.forEach(floor=>{
          floor.product_list.forEach(product=>{
            product.navigator_url = "/subpkg/goods_list/goods_list?" + product.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
      // 点击顶部搜索框，跳转到搜索页面
      skipSearch(){
        uni.redirectTo({
          url:'/subpkg/search/search'
        })
      }
    }
	}
</script>

<style lang="scss">
  // 轮播图
  swiper{
    height: 340rpx;
    .swiper-item,.swiper-img{
      width: 100%;
      height: 100%;
    }
  }
  // 导航
  .nav{
    display: flex;
    justify-content:space-around;
    margin-top: 10rpx;
    .nav-item{
      width: 20%;
      .nav-img{
        display: block;
        width:100%;
      }
    }
  }
  // 楼层
  .floor-item{
    margin: 20rpx 20rpx 0;
    .floor-item-title image{
      width: 100%;
      margin-left: 10rpx;
    }
    .floor-item-img{
      display: flex;
    }
    .floor-item-img-right{
      display: flex;
      justify-content:space-around;
      flex-wrap:wrap;
    }
  }
  // 搜索框
  .my-search-box{
    position: sticky;
    top: 0;
    z-index: 999;
  }
</style>
