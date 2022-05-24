<template>
	<view class="cate-content">
		<!-- 滚动列表 -->
    <view class="scroll">
      <!-- 左边滚动列表 -->
      <scroll-view class="left-scroll" :style="{ height: wh + 'px'}" scroll-y>
        <block v-for="(item,i) in cateList" :key='item.cat_id'>
          <view :class="['left-scroll-item',i===active?'active':'']"
          @click="toggleActive(i)">
          {{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <!-- 右边滚动列表 -->
      <scroll-view class="right-scroll" :style="{ height: wh + 'px'}" scroll-y :scroll-top="distanceTop">
        <!-- 二级分类 -->
        <view class="cate-l2" v-for="item in cateListLv2" :key='item.cat_id'>
          <!-- 二级分类标题 -->
          <view class="cate-l2-title">/ {{item.cat_name}} /</view>
          <!-- 三级分类 -->
          <view class="cate-l3">
            <view class="cate-l3-item" v-for="item2 in item.children" :key='item2.cat_id' 
            @click="skipDoodsList(item2)">
              <!-- 三级分类图片 -->
              <image :src="item2.cat_icon" mode=""></image>
              <!-- 三级分类标题 -->
              <text>{{item2.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
	</view>
</template>

<script>
	export default {
    // 数据
		data() {
			return {
				// 当前屏幕的可用高度
        wh:0,
        // 分类数据列表
        cateList:[],
        // 当前选中的一级标题
        active:0,
        // 二级分类列表数据
        cateListLv2:[],
        // 距离屏幕距离(使切换一级标题，页面回到顶部)
        distanceTop:0
			};
		},
    // 生命周期函数
    onLoad(){
      // 调用获取当前屏幕高度的方法
      this.getVh()
      // 调用获取分类列表数据
      this.getCateList()
    },
    // 方法
    methods:{
      // 获取当前屏幕的高度
      getVh(){
        const sysInfo = uni.getSystemInfoSync()
        this.wh = sysInfo.windowHeight
      },
      // 获取分类数据列表
      async getCateList(){
        const {data:res} = await uni.$http.get('/api/public/v1/categories')
        // 请求失败
        if(res.meta.status !== 200 ) return uni.$showMsg()
        // 请求成功
        this.cateList = res.message
        // 根据分类列表数据，获得二级分类数据列表
        this.cateListLv2 = this.cateList[this.active].children
      },
      // 切换当前选中的一级标题
      toggleActive(i){
        // 切换active颜色给指定一级标题
        this.active = i
        // 更新二级分类数据列表
        this.cateListLv2 = this.cateList[this.active].children
        // 让右侧滚动区域回到顶部
        this.distanceTop = this.distanceTop === 0 ? 1 : 0
      },
      // 点击三级标题跳转到商品列表
      skipDoodsList(item2){
        uni.redirectTo({
          url:'/subpkg/goods_list/goods_list?cid='+ item2.cat_id 
        })
      }
    }
	}
</script>

<style lang="scss">
  // 滚动列表
  .scroll{
    display: flex;
    .left-scroll{
      width:120px;
      .left-scroll-item{
        line-height: 50px;
        text-align: center;
        background-color: #f7f7f7;
        font-size: 14px;
        &.active{
          background-color: #fff;
          position: relative;
          &::before{
            content: '';
            display: block;
            width: 3px;
            height: 35px;
            background-color: #0066BE;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
  // 二级分类标题
  .cate-l2-title{
    font-size: 16px;
    text-align: center;
    padding: 10px 0;
    font-weight: bold;
  }
  // 三级分类
  .cate-l3{
    font-size: 12px;
    display: flex;
    flex-wrap: wrap;
    .cate-l3-item{
      width: 33.3%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      image{
        width: 60px;
        height: 60px;
      }
    }
  }
</style>
