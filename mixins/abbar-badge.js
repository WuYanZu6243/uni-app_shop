  import {mapGetters} from 'vuex'
	export default {
    // 计算属性
    computed:{
      // 便捷获取vue中getters中的数据
      ...mapGetters('m_cart',['total'])
    },
    // 监视属性
    watch:{
      // 监视vuex中getters中的total属性
      total(){
        this.setBadge()
      }
    },
    // 声明周期函数：页面展示时触发
    onShow(){
      // 调用 ‘设置数字徽标’ 方法,设置徽标
      this.setBadge()
    },
    // 方法
    methods:{
      // 设置数字徽标
      setBadge() {
        // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
        uni.setTabBarBadge({
           index: 2, // 索引
           text: this.total + '' // 注意：text 的值必须是字符串，不能是数字
        })
      }
    }
	}