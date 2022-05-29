<template>
  <view class="detail-content" v-if="goodsInfo.goods_name">
    <!-- 轮播图区域 -->
    <swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true"
      indicator-active-color='#334'>
      <swiper-item class="swiper-item" v-for="item,i in goodsInfo.pics" :key="item.pics_id">
        <image class="swiper-img" :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>

    <!-- 商品主要信息区域 -->
    <view class="goods-info">
      <!-- 商品价格 -->
      <view class="goods-price"><text>￥{{goodsInfo.goods_price | tofixed}}</text></view>
      <!-- 商品描述 -->
      <view class="goods-describe">
        <view class="goods-describe-name">{{goodsInfo.goods_name}}</view>
        <view class="goods-describe-collect">
          <uni-icons type="star" size="16" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="goods-freight"><text>快递:免运费</text></view>
    </view>

    <!-- 商品详情信息 -->
    <rich-text :nodes="goodsInfo.goods_introduce"></rich-text>

    <!-- 商品导航 -->
    <view class="goods-nav">
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  import {mapState,mapGetters,mapMutations} from 'vuex'
  export default {
    // 数据
    data() {
      return {
        // 商品详情对象
        goodsInfo: {},
        options: [{
          icon: 'shop',
          text: '店铺'
        }, {
          icon: 'cart',
          text: '购物车'
        }],
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#0066BE',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ff0000',
            color: '#fff'
          }
        ]
      }
    },
    // 计算属性
    computed:{
      ...mapGetters('m_cart',['total'])
    },
    // 监视属性
    watch:{
      // 监视vuex中getters中的total属性
      total: {
        // 设置页面初次加载完毕后立即调用
        immediate: true,
        // 处理函数
        handler(newVal) {
           const findResult = this.options.find(x => x.text === '购物车')
           if (findResult) {
              findResult.info = newVal
           }
        }
      }
    },
    // 生命周期
    onLoad(options) {
      // 获取商品id
      const goodsId = options.goods_id
      // 调用'获取商品详情信息'
      this.getGoodsInfo(goodsId)
    },
    // 方法
    methods: {
      // 便捷调用vuex中mutations的方法
      ...mapMutations('m_cart',['addToCart']),
      // 获取商品详情信息
      async getGoodsInfo(id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id: id
        })
        // 请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
        // 使用字符串的 replace() 方法，将 webp 的后缀名替换为 jpg 的后缀名
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(
          /webp/g, 'jpg')
        this.goodsInfo = res.message
      },
      // 轮播图中的图片预览
      preview(i) {
        // 调用 uni.previewImage() 方法预览图片
        uni.previewImage({
          current: i,
          urls: this.goodsInfo.pics.map(x => x.pics_big)
        })
      },
      // 导航栏左侧按钮的点击事件处理函数
      onClick(e) {
        if (e.content.text === '购物车') {
          // 切换到购物车页面
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      // 导航栏右侧按钮点击事件的处理函数
      buttonClick(e){
        // 判断是否点击的时‘加入购物车’按钮
        if (e.content.text === '加入购物车') {
          // 组织一个商品的信息对象
          const goods = {
             goods_id: this.goodsInfo.goods_id,       // 商品的Id
             goods_name: this.goodsInfo.goods_name,   // 商品的名称
             goods_price: this.goodsInfo.goods_price, // 商品的价格
             goods_count: 1,                           // 商品的数量
             goods_small_logo: this.goodsInfo.goods_small_logo, // 商品的图片
             goods_state: true                         // 商品的勾选状态
          }
          // 调用vuex中的‘添加商品到购物车’方法 addToCart
          this.addToCart(goods)
        }
      }
    }
  }
</script>

<style lang="scss">
  // 轮播图
  .swiper {
    height: 600rpx;
    .swiper-item {
      .swiper-img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  // 商品信息区域
  .goods-info {
    padding: 5px;
    
    
    .goods-price {
      font-size: 18px;
      color: #c00000;
      margin: 10px 0;
    }

    .goods-describe {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      .goods-describe-name {
        font-size: 14px;
        margin-right: 10px;
      }

      .goods-describe-collect {
        width: 120px;
        color: gray;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-left: 1px solid gray;
      }
    }

    .goods-freight {
      margin: 10px 0;
      font-size: 14px;
      color: gray;
    }
  }
  // 商品导航
  .goods-nav{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  // 给页面外层的容器，添加 50px 的内padding，
  // 防止页面内容被底部的商品导航组件遮盖
  .detail-content{
    padding-bottom: 50px;
  }
</style>
