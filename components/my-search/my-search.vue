<template>
	<view class="search-content" :style="{'background-color':bgcolor}">
		<view class="search-box" @click="searchBoxHandler">
		  <uni-icons type="search" size="18"></uni-icons>
      <text>搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		// 接收外面父组件传参,增加灵活性，可以根据别人的传参自定义背景颜色
    props:{
      // 背景颜色
      bgcolor:{
        type: String,
        default: '#0066BE'
      },
      // 圆角边框
      radius:{
        type: Number,
        default: 15
      }
    },
    // 方法
    methods:{
      // 触发外部为自己绑定的自定义事件
      searchBoxHandler(){
        // 在组件上绑定click事件，会被认为是：绑定了一个自定义事件，名字为click。
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .search-content{
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    .search-box{
      width: 95%;
      height: 30px;
      background-color: #F8F8F8;
      border-radius: 15px;
      text-align: center;
      line-height: 30px;
      text{
        margin-left: 5px;
      }
    }
  }
</style>
