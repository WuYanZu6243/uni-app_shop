<template>
	<view class="goods-list-content">
    <!-- 商品列表 -->
    <view class="goods-list">
      <!-- 循环生成多个商品组件 -->
      <view class="my-goods-margin" v-for="item in goodsList" :key="item.goods_id">
        <my-goods :goods="item" @click='skipDetail(item)'></my-goods>
      </view>
    </view>
    <!-- 提示当前已加载全部数据 -->
    <view class="isAllDataHint" v-show="isAllData">没有更多数据了...</view>
	</view>
</template>

<script>
	export default {
    // 数据
		data() {
			return {
				// 数据请求参数
        queryInfo:{
          query:'',
          cid:'',
          pagenum:1,
          pagesize:10
        },
        // 商品列表数据
        goodsList:[],
        // 商品列表商品总数
        total:0,
        // 节流阀,是否正在发送请求
        isLoading : false,
        // 当前是否为最后一页
        isLastPage : false,
        // 当前已加载全部数据
        isAllData : false
			};
		},
    // 生命周期钩子
    onLoad(options){
      // 将页面参数转存到数据中
      this.queryInfo.query = options.query || ''
      this.queryInfo.cid = options.cid || ''
      // 调用‘获取商品信息列表’方法
      this.getGoodsList()
    },
    // 上拉触底事件
    onReachBottom(){
      // 加载下一页数据
      // 判断是否请求完所有数据
      if (this.isAllData) return;
      // 判断当前能不能发送请求
      if(this.isLoading) return
      // 页码+1
      this.queryInfo.pagenum += 1 
      // 重新发送请求获取商品列表数据
      this.getGoodsList()
    },
    // 下拉刷新事件
    onPullDownRefresh(){
      // 重置参数
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = 10
      this.goodsList = []
      this.total = 0
      this.isLoading = false,
      this.isLastPage = false,
      this.isAllData = false
      // 重新发送数据请求
      this.getGoodsList(()=>uni.stopPullDownRefresh())
    },
    // 方法
     methods:{
      // 获取商品信息列表
      async getGoodsList(cb){
        // 设置请求阀状态，表示当前正在发送请求
        this.isLoading = true
        // 计算当前是否为最后一页：如果为最后一页，设置isLastPage为true、更改请求参数queryInfo.pagenum
        if(this.queryInfo.pagenum === Math.ceil(this.total / this.queryInfo.pagesize)){
          this.isLastPage = true
          this.queryInfo.pagesize = this.total - (this.queryInfo.pagenum-1) * this.queryInfo.pagesize
        }
        // 发送请求
        const {data:res} = await uni.$http.get('/api/public/v1/goods/search',this.queryInfo)
        // 请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        this.goodsList = [...this.goodsList,...res.message.goods]
        this.total = res.message.total
        // 判断是否加载完所有数据
        if(this.isLastPage) this.isAllData = true
        // 设置请求阀状态，表示当前不在发送请求
        this.isLoading = false
        // cb是作用为让下拉框关闭的的函数
        cb && cb()
      },
      // 数据页数相关操作
      // 跳转到详情页面
      skipDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
     }
	}
</script>

<style lang="scss">
  .goods-list{
    padding: 5px;
  }
  .isAllDataHint{
    font-size: 14px;
    color: #c3c3c3;
    text-align: center;
    margin-bottom: 10px;
  }
  .my-goods-margin{
    margin: 5px 0;
  }
</style>
