/**
 * 此文件可选:部分配置项会被编译配置覆盖
 * 具体参考: https://uniapp.dcloud.io/collocation/vue-config
 * 版本支持: HBuilderX 2.6.8+
 */
const TransformPages = require('uni-read-pages')
const path = require("path");
const {webpack} = new TransformPages()
module.exports = {
	css: {
		loaderOptions: {
			// 给 less-loader 传递 Less.js 相关选项
			less: {}
		}
	},
	transpileDependencies: ['uview-ui'],
	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'less',
			patterns: [
				//这个是加上自己的路径，
				//注意：试过不能使用别名路径
				path.resolve(__dirname, './src/packages/common/style/theme.less')
			]
		}
	},
	// 配置路径别名
	configureWebpack: {
		devServer: {
			// 调试时允许内网穿透，让外网的人访问到本地调试的H5页面
			disableHostCheck: true
		},
		plugins: [
			new webpack.DefinePlugin({
				ROUTES: webpack.DefinePlugin.runtimeValue(() => {
					const tfPages = new TransformPages({
						includes: ['path', 'name', 'meta','aliasPath','title']
					});
					return JSON.stringify(tfPages.routes)
				}, true )
			})
		]
	},
	// webpack-dev-server 相关配置
	devServer: {
		proxy: {
			'/dev-api/': {
				//target: 'http://wxshop.vipgz4.idcfengye.com',
				target: 'http://127.0.0.1:8089',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/dev-api/': ''
				}
			},
		}
	},
}
