// 基础信息
const config = {
	NAME: '基础项目模板',
	// 版本号
	VERSION: '1.0.0',
	// 公众号授权方式snsapi_base或snsapi_userinfo
	WECHAT_SCOPE: 'snsapi_userinfo',
	// api路径
	API_PATH: '/api',
	// 应用ID
	APP_ID: 'faas-mall-addons',
	// 小程序ID
	APPLET_ID:'wx576d07b1e75d4269',
	// 租户ID
	LESSEE_ID:'1',
	// 接口主机
	HOST: process.env.VUE_APP_DOMAIN_URL,
	// 微信环境(正式：true，测试：false)
	WX_ENV: process.env.VUE_APP_WX_ENV,
	// 测试OPENID
	TEST_OPENID: process.env.VUE_APP_TEST_OPENID,
	// 测试token
	TEST_TOKEN: process.env.VUE_APP_TEST_TOKEN,
	// 请求Header中token的KEY
	TOKEN_KEY: process.env.VUE_APP_TOKEN_KEY,
	PLATFORM: process.env.VUE_APP_PLATFORM,
	// 加载动画持续时间(ms)
	LOADING_DELAY: process.env.VUE_APP_LOADING_DELAY
}
// 请求地址
config.getApiUrl = function(suffix, configId) {
	if (!configId) {
		configId = config.APP_ID;
	}
	if (suffix && !suffix.startsWith('/')) {
		suffix = '/' + suffix
	}
	return config.HOST + config.API_PATH + '/plugins/' + configId + config.API_PATH + suffix;
}
/**
 * 环境配置
 */
export default {...config}
