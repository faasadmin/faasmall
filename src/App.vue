<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
      // 获取商城设置
      this.$store.dispatch('faasmallInit');
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
//@import 'static/css/icon.css';
//@import 'static/css/demo.css';
@import 'static/fonts/iconfont.css';
page{
  background: $mszf-background-color; //设置背景大小
  width: 100%;
  //height: 100%;
  min-height: 100%;
}
</style>
