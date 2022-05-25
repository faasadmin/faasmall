import $platform from "@/faasmall/utils/platform";
import store from "@/faasmall/store";
import {cacheKey} from "@/faasmall/common/constant";
import setting from '@/faasmall/common/config.js';
import {maProgramLogin, maProgramLoginInfo, maProgramOperate, openPlatformOperate} from "@/faasmall/api/login";
export default {
	eventMap(action) {
		let map = "";
		switch (action) {
			case "login":
				map = "登录中...";
				break;
			case "refresh":
				map = "更新中...";
				break;
			case "bind":
				map = "绑定中...";
				break;
		}
		return map;
	},

	async login() {
		let token = "";
		// #ifdef MP-WEIXIN
		token = await this.wxMaProgramOauth("login");
		return token;
		// #endif
		// #ifdef H5
		if($platform.get() === "wx_mp_account"){
			this.wxMpAccountLogin("login");
		}
		// #endif
		// #ifdef APP-PLUS
		token = await this.wxOpenPlatformOauth("login");
		return token;
		// #endif
	},
	async refresh() {
		let token = "";
		// #ifdef MP-WEIXIN
		token = await this.wxMaProgramOauth("refresh");
		return token;
		// #endif
		// #ifdef H5
		this.wxMpAccountLogin("refresh");
		// #endif
		// #ifdef APP-PLUS
		token = await this.wxOpenPlatformOauth("refresh");
		return token;
		// #endif
	},
	async bind() {
		let token = "";
		// #ifdef MP-WEIXIN
		token = await this.wxMaProgramOauth("bind");
		return token;
		// #endif
		// #ifdef H5
		this.wxMpAccountLogin("bind");
		// #endif
		// #ifdef APP-PLUS
		token = await this.wxOpenPlatformOauth("bind");
		return token;
		// #endif
	},

	// #ifdef H5
	// 微信公众号网页 登陆/绑定/刷新
	wxMpAccountLogin(action = "login") {
		if ($platform.get() !== "wx_mp_account") {
			uni.showToast({
				title: "请在微信浏览器中打开",
				icon: "none"
			});
			throw false;
		}
		let host = $platform.host();
		let paramObject = {
			lesseeId: setting.LESSEE_ID,
			appId: setting.APP_ID,
			platform: $platform.get(),
			host: host,
			action: action,
			sessionId: (action !== "login" && store.getters.isLogin) ? uni.getStorageSync(cacheKey.TOKEN) : ""
		};
		let param = encodeURIComponent(JSON.stringify(paramObject));
		let domain = setting.getApiUrl('/oauth/login/mp-account-operate');
		debugger
		let redirect_uri = encodeURIComponent(`${domain}?param=${param}`);
		let oauthUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + store.getters.wechatData.mpAppId +
			`&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=1`;
		console.info('公众号登陆跳转到：' + window.location.href);
		console.info(store.getters.wechatData);
		console.info(store.getters.shopData?.domain);
		uni.setStorageSync("lastPage", store.getters.shopData?.domain + '/pages/tabbar/main/index');
		window.location = oauthUrl;
	},
	// #endif

	// #ifdef APP-PLUS
	// 微信开放平台 登陆/绑定/刷新
	wxOpenPlatformOauth(action = "login") {
		debugger
		let that = this;
		return new Promise((resolve, reject) => {
			uni.login({
				provider: "weixin",
				success: function(loginRes) {
					if (loginRes.errMsg === "login:ok") {
						let authResult = loginRes.authResult;
						// authResult 包含access_token，expires_in，openid，unionid等信息
						//这里只需要把这些数据传递给后台，让后台去请求微信的接口拿到用户信息就可以了，
						let token = (action !== "login" && store.getters.isLogin) ? uni.getStorageSync(cacheKey.TOKEN) : "";
						openPlatformOperate({action:action,sessionId:token,authData:authResult}).then(res => {
							if (res.code === 0) {
								resolve(res.data.token);
							} else {
								resolve(false);
							}
						});
					}
				},
				fail: function(res) {
					uni.showToast({
						title: "登录失败,请稍后再试"
					});
					resolve(false);
					console.info(res);
				},
				complete: function(res) {}
			});
		});
	},
	// #endif

	// #ifdef MP-WEIXIN
	// 微信小程序静默登录,获取会话ID
	async getWxMiniProgramSessionId(autoLogin = true) {
		let sessionStatus = false;
		return new Promise((resolve, reject) => {
			uni.checkSession({
				success(res) {
					if (res.errMsg === "checkSession:ok") sessionStatus = true;
				},
				complete() {
					if (uni.getStorageSync(cacheKey.SESSION_ID) && sessionStatus && !autoLogin) {
						resolve(uni.getStorageSync(cacheKey.SESSION_ID));
					} else {
						uni.login({
							success: function(info) {
								let code = info.code;
								//微信小程序静默授权登陆
								maProgramLoginInfo( {
									code: code,
									autoLogin: autoLogin
								}).then(res => {
									if (res.code === 0) {
										uni.setStorageSync(cacheKey.SESSION_ID, res.data.sessionId);
										if (autoLogin) {
											if (res.data.token) {
												resolve(res.data.token);
											} else {
												resolve(false);
											}
										}
										resolve(res.data.sessionId);
									} else {
										reject(res.msg);
									}
								});
							}
						});
					}
				}
			});
		});
	},

	// 微信小程序获取用户信息 登陆/绑定/刷新
	wxMaProgramOauth(action = "login") {
		let that = this;
		let sessionId = uni.getStorageSync(cacheKey.SESSION_ID);
		uni.showLoading({
			title: that.eventMap(action)
		});
		return new Promise((resolve, reject) => {
			uni.getUserProfile({ // 必须手动确认触发
				desc: "完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: res => {
					if (res.errMsg === "getUserProfile:ok") {
						debugger
						maProgramOperate({
							action:action,
							sessionId:sessionId,
							encryptedData: res.encryptedData,
							iv: res.iv,
							signature: res.signature,
						}).then(res => {
							debugger
							console.log(res)
							if (res.code ===0) {
								resolve(res.data.token);
							} else {
								uni.removeStorageSync(cacheKey.SESSION_ID);
								that.getWxMiniProgramSessionId(false);
								resolve(false);
							}
						});
					}
				},
				complete: res => {
					uni.hideLoading();
				}
			});
		});

	},

	// 小程序更新
	checkMiniProgramUpdate() {
		if (uni.canIUse("getUpdateManager")) {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function() {
						uni.showModal({
							title: "更新提示",
							content: "新版本已经准备好，是否重启应用？",
							success: function(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});
					});
					updateManager.onUpdateFailed(function() {
						// 新的版本下载失败
						uni.showModal({
							title: "已经有新版本了哟~",
							content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
						});
					});
				}
			});
		}
	},
	// #endif


};
