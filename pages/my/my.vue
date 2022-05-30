<template>
	<view class="my-content">
		<!-- 用户未登录时，显示登录组件 -->
    <my-login v-if="!token"></my-login>
    <!-- 用户登录后，显示用户信息组件 -->
    <my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
// 导入自定义封装模块
  import badgeMix from '../../mixins/abbar-badge.js'
  import { mapState } from 'vuex'
  
	export default {
    // 混入
    mixins: [badgeMix],
    // 数据
		data() {
			return {
				
			};
		},
    // 计算属性
    computed:{
      // 从 m_user 模块中导入需要的 token 字符串
      ...mapState('m_user', ['token']),
    }
	}
</script>

<style lang="scss">

</style>
