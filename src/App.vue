<script>
  import wechat from '@/faasmall/common/wechat/wechat';
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		async onShow(options) {
			console.log('App Show')
      // 获取商城设置
      this.$store.dispatch('faaSmallInit',options);
      this.$store.dispatch('subscribeInit');
      // #ifdef MP-WEIXIN
      await wechat.getWxMiniProgramSessionId(false);
      // #endif
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
@import "uview-ui/index.scss";
@import 'src/static/css/index';
@import 'src/static/css/coupon';
@import 'static/fonts/iconfont.css';
page{
  background: $mszf-background-color; //设置背景大小
  width: 100%;
  //height: 100%;
  min-height: 100%;
}
</style>
