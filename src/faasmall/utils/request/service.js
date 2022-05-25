/**
 * @version 3.0.5
 * @Author wz
 * @description 无痛刷新,请求拦截
 * 文档: https://www.quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: beat-3.0.4 alpha-3.0.4
 */

import Request from './luch-request'
import jwt from '../cache/jwt.js';
import {silentLogin} from '../auth/auth.js';
import {cacheKey, httpCode, httpContentType} from '../../common/constant.js';
import setting from '../../common/config.js';
import platform from '@/faasmall/utils/platform';
import {isNotEmpty} from "@/faasmall/utils/faasmall";
import store from '@/faasmall/store';

const http = new Request()
// 是否正在刷新的标记
let isRefreshing = false
let isAutoLogin = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

/**
 * 配置静态参数,仅在加载时执行一次
 */
http.setConfig((config) => {
    /* 设置全局配置 */
    config.baseURL = setting.HOST + setting.API_PATH
    let pf = platform.get();
    console.info('平台：' + pf);
    config.header = {
        ...config.header,
        'content-type': httpContentType.URL_ENCODED,
        'lesseeId': setting.LESSEE_ID,
        'appId': setting.APP_ID,
        'platform': pf,
        'appletId': setting.APPLET_ID,
        //后端判断请求来自于哪里
        "X-Requested-With": "XMLHttpRequest"
    }
    // 是否使用loading
    config.loading = true
    config.dataType = httpContentType.JSON
    return config
})

/**
 * 拦截器:请求之前拦截
 * 配置动态参数,每次请求都会执行一次
 * 可以使用async await 做异步操作
 */
http.interceptors.request.use((config) => {
    let token = jwt.getAccessToken();
    config.header = {
        ...config.header,
        //权限标识jwt
        [setting.TOKEN_KEY]: "Bearer " + token,
    }
    // 展示loading页面
    if (config.loading) {
        uni.showLoading();
    }
    return config
}, (config) => {
    uni.showToast({
        icon: 'none',
        position: 'bottom',
        title: '网络异常'
    })
    return Promise.reject(config)
})

/**
 * 拦截器:请求之后拦截
 * 配置动态参数,每次请求都会执行一次
 * 可以使用async await 做异步操作
 */
http.interceptors.response.use(async (resp) => {
    //解构出所需参数
    let {data, config, loading} = resp
    let {code, msg} = data
    // 隐藏loading页面
    if (loading) {
        uni.hideLoading()
    }
    //1.请求成功则返回结果
    if (code === httpCode.SUCCESS) {
        return data;
    }
    // 2请求失败:
    // 	2.1 token 过期或者为空则 code = 401 重新获取
    // 	2.2 其他需要提示错误信息
    if (code === httpCode.JWTEXPIRE) {
        debugger
        await store.dispatch("LogOut").then(res => {
            jwt.logout();
        })
        throw (`登录已过期或注销,已阻止此次API请求`);
    }
    //服务端返回的状态码不等于200 也不等于401，则reject() 返回错误信息
    if (!msg) {
        msg = '未知错误,请联系管理员'
    }
    //提示:信息
    uni.showToast({
        icon: "none",
        title: msg
    })
    return Promise.reject(data)
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
    uni.showToast({
        icon: 'none',
        position: 'bottom',
        title: '网络异常'
    })
    return Promise.reject(response)
})

export {
    http
}
