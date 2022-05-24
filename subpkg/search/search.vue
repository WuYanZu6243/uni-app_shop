<template>
	<view class="search-content">
		<!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar radius=20 :cancelButton='false' @input="input"></uni-search-bar>
    </view>
    <!-- 搜索结果列表 -->
    <view class="search-list" v-if='searchList.length !== 0'>
      <view class="search-list-item" v-for="item,i in searchList" :key="i" @click="skipDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="forward" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史记录 -->
    <view class="search-history" v-else>
      <!-- 标题 -->
      <view class="search-history-title">
        <text>历史记录</text>
        <uni-icons type="trash" size="16" @click='emptySearchHistory'></uni-icons>
      </view>
      <!-- 列表 -->
      <view class="search-history-list">
        <uni-tag :text="item" v-for="item,i in historys" :key="i" @click="skipGoodsList(item)"></uni-tag>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
    // 数据
		data() {
			return {
				// 输入框防抖处理
        timer:null,
        // 当前输入的关键词
        keyword:'',
        // 根据关键词查询到的商品列表
        searchList:[],
        // 搜素历史列表
        searchHistoryList:[]
			};
		},
    // 计算属性
    computed:{
      // 将搜素历史列表倒叙，因为最后一个数据才是最新的关键词
      historys(){
        return [...this.searchHistoryList].reverse()
      }
    },
    // 生命周期函数
    onLoad(){
      // 从缓存中获取搜索历史，赋值到数据中
      this.searchHistoryList = JSON.parse(uni.getStorageSync('searchHistoryList') || '[]')
    },
    // 方法
    methods:{
      // 搜索框输入
      input(e){
        // 防抖处理，清楚上一个定时器
        clearTimeout(this.timer)
        // 防抖处理，开启0.5秒延迟定时器
        this.timer = setTimeout(()=>{
          // 保存关键词
          this.keyword = e.value.trim()
          // 调用根据关键词获取商品列表数据列表方法
          this.getSearchList()
        },500)
      },
      // 根据关键词获取商品列表
      async getSearchList(){
        // 判断关键词是否为空，为空：不发送请求，清空‘根据关键词查询到的商品列表’
        if(this.keyword === '') return this.searchList = []
        // 关键词不为空，发送请求获取数据
        const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.keyword})
        // 请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        this.searchList = res.message
        // 调用'将搜索关键词保存到搜索的历史记录'方法
        this.saveSearchHistory()
      },
      // 点击搜索列表的某项，跳转到对应的详情页面
      skipDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      // 将搜索关键词保存到搜索的历史记录
      saveSearchHistory(){
        console.log(this.keyword)
        // 将搜索列表数组转化为集合，集合可以确保里面的数据的唯一性
        const set = new Set(this.searchHistoryList)
        // 先删除后添加，为了使最先搜索到数据放在第一位
        set.delete(this.keyword)
        set.add(this.keyword)
        // 将集合转化会数组
        this.searchHistoryList = Array.from(set)
        // 将数据保存到浏览器缓存中
        uni.setStorageSync('searchHistoryList',JSON.stringify(this.searchHistoryList))
      },
      // 点击清空历史记录
      emptySearchHistory(){
        // 清空数据列表
        this.searchHistoryList = []
        // 清空缓存中的数据
        uni.setStorageSync('searchHistoryList','[]')
      },
      // 点击历史记录中的某个tab，跳转到相应的商品列表页面
      skipGoodsList(item){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?query=' + item
        })
      }
    }
	}
</script>

<style lang="scss">
// 搜索框
.search-box{
  position: sticky;
  top:0;
  z-index: 999;
}
// 搜索结果列表
.search-list{
  padding: 5px;
  .search-list-item{
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    font-size: 14px;
    border-bottom: 1px solid #D3D3D3;
    .goods-name{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 5px;
    }
  }
}
// 搜索历史记录
.search-history{
  padding: 0 5px;
  .search-history-title{
    font-size: 14px;
    line-height: 30px;
    border-bottom: 1px solid #D3D3D3;
    display: flex;
    justify-content: space-between;
  }
  .search-history-list{
    display: flex;
    flex-wrap: wrap;
    .uni-tag{
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
