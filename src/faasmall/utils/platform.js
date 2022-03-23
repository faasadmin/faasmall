// #ifdef H5
// 微信H5
import wxsdk from '@/faasmall/common/wechat/sdk';
import {
	router
} from '@/faasmall/common/router';
// #endif
export default {

	// 获取当前运行平台
	get() {
		let platform = '';
		// #ifdef H5
		wxsdk.isWechat() ? (platform = 'wxOfficialAccount') : (platform = 'H5');
		// #endif
		// #ifdef APP-PLUS
		platform = 'app';
		// #endif
		// #ifdef MP-WEIXIN
		platform = 'wxMiniProgram';
		// #endif
		// #ifdef MP-ALIPAY
		platform = 'alipayMiniProgram';
		// #endif
		if (platform !== '') {
			uni.setStorageSync('platform', platform);
		} else {
			uni.showToast({
				title: '暂不支持该平台',
				icon: 'none'
			});
		}
		return platform;
	},
	set(platform) {
		uni.setStorageSync('platform', platform);
		return platform;
	},

	// 检测当前运行机型
	device() {
		return uni.getSystemInfoSync().platform;
	},

	// 获取前端真实主机
	host() {
		let host = location.origin;
		let basePath = router.$route.options.base;
		let mode = router.$route.options.mode;
		host += basePath;
		if (mode === 'hash') {
			host += '#/';
		}
		return host;
	},

	// 处理wechat jssdk 签名网址
	entry() {
		let that = this;
		var entryUrl = location.href;
		if (this.device() === 'ios') {
			if (typeof(location.entryUrl) !== 'undefined') {
				entryUrl = location.entryUrl;
			} else {
				location.entryUrl = entryUrl;
			}
		}
		return entryUrl;
	},


}
