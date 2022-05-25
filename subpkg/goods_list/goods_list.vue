<template>
	<view class="goods-list-content">
    <!-- 商品列表 -->
    <view class="goods-list">
      <!-- 循环生成多个商品组件 -->
      <block v-for="item in goodsList" :key="item.goods_id">
        <my-goods :goods="item" @click='skipDetail(item)'></my-goods>
      </block>
    </view>
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
          pagesize:15
        },
        // 商品列表数据
        goodsList:[],
        // 商品列表商品总数
        total:[],
        // 节流阀,是否正在发送请求
        isLoading : false
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
      // 判断是否还有下一页数据
      if (this.queryInfo.pagenum * this.queryInfo.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
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
      this.goodsList = []
      this.total = 0
      this.isLoading = false
      // 重新发送数据请求
      this.getGoodsList(()=>uni.stopPullDownRefresh())
    },
    // 方法
     methods:{
      // 获取商品信息列表
      async getGoodsList(cb){
        // 设置请求阀状态，表示当前正在发送请求
        this.isLoading = true
        // 发送请求
        const {data:res} = await uni.$http.get('/api/public/v1/goods/search',this.queryInfo)
        // 请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        this.goodsList = [...this.goodsList,...res.message.goods]
        this.total = res.message.total
        // 设置请求阀状态，表示当前不在发送请求
        this.isLoading = false
        // cb是作用为让下拉框关闭的的函数
        cb && cb()
      },
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
</style>
