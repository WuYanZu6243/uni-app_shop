<template>
	<view class="my-address-content">
		<!-- 选择地址的盒子 -->
    <view class="select-address">
      <!-- 添加地址 -->
      <view class="add-address" v-if="JSON.stringify(address) === '{}'">
        <button type="primary" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
      </view>
      <!-- 渲染选择到的地址 -->
      <view class="address-info-box" @click="chooseAddress" v-else>
        <view class="row1">
          <view class="row1-left">
            <view class="username">收货人：<text>{{address.userName}}</text></view>
          </view>
          <view class="row1-right">
            <view class="phone">电话：<text>{{address.telNumber}}</text></view>
            <uni-icons type="forward" size="16"></uni-icons>
          </view>
        </view>
        <view class="row2">
          <view class="detail-address">详细地址：<text>{{detailAddress}}</text></view>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
  import {mapState,mapGetters,mapMutations} from 'vuex'
	export default {
    // 数据
		data() {
			return {
			};
		},
    // 计算属性：
    computed:{
      // 便捷调用vuex中state和getters的属性
      ...mapState('m_user',['address']),
      ...mapGetters('m_user',['detailAddress'])
    },
    // 方法
    methods:{
      // 便捷调用vue的mutations中的方法
      ...mapMutations('m_user',['updateAddress']),
      
      // 选择收货地址
      async chooseAddress(){
        // 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
        // 返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
        const [err,succ] = await uni.chooseAddress().catch(err=>err)
        // 用户成功选择了地址
        if(err === null && succ.errMsg === "chooseAddress:ok"){
          // 调用vue中的updateAddress方法,保存数据到vuex
          this.updateAddress(succ)
        }
        // 用户没有授权获取通信地址
        if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
          this.reAuth() // 调用 this.reAuth() 方法，向用户重新发起授权申请
        }
      },
      
      // 调用此方法，重新发起收货地址的授权
      async reAuth() {
        // 1 提示用户对地址进行授权
        const [err2, confirmResult] = await uni.showModal({
          content: '检测到您没打开地址权限，是否去设置打开？',
          confirmText: "确认",
          cancelText: "取消",
        })
        // 2 如果弹框异常，则直接退出
        if (err2) return
        // 3 如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
        if (confirmResult.cancel) return uni.$showMsg('您取消了地址授权！')
        // 4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
        if (confirmResult.confirm) return uni.openSetting({
          // 4.1 授权结束，需要对授权的结果做进一步判断
          success: (settingResult) => {
            // 4.2 地址授权的值等于 true，提示用户 “授权成功”
            if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
            // 4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
            if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
          }
        })
      }
    }
	}
</script>

<style lang="scss">
  .my-address-content{
    padding: 5px;
    // 添加地址按钮
    .btnChooseAddress{
      font-size: 15px;
      line-height: 35px;
      background-color: #0066BE;
    }
    // 地址信息
    .select-address{
      width: 100%;
      height: 100px;
      padding: 5px;
      box-sizing: border-box;
      border: 1px solid #C0C0C0;
      box-shadow: 1px 1px 2px #CCCCCC;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .address-info-box{
      width: 100%;
      .row1{
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        .row1-right{
          display: flex;
          .phone{
            margin-right: 5px;
          }
        }
      }
      .row2{
        font-size: 15px;
        overflow: hidden;
      }
    }
  }
</style>
