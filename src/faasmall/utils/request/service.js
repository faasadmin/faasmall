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
    var pf = platform.get();
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
        //客户端标识
        platform: setting.PLATFORM
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
        //记录本次请求,刷新token后再次执行
        //是否刷新token中,防止重复刷新
        if (!isRefreshing) {
            debugger
            //修改刷新状态为true
            isRefreshing = true;
            console.log("开始刷新token");
            //#ifdef  H5
            console.log('H5账号密码自动登陆自动登录')
            var password = jwt.getPassword();
            var account = jwt.getAccount();
            if (isNotEmpty(password)) {
                isAutoLogin = true;
            } else {
                //清空token
                jwt.clearAccessToken();
                return Promise.reject('请登录后操作')
            }
            //判断是否记住自动登陆
            //#endif
            debugger
            if (isAutoLogin) {
                //重新登录保存新的token
                await silentLogin().then(function (res) {
                    let data = res.data;
                    let token = data.token;
                    jwt.setAccessToken(token);
                    jwt.refreshMemberInfo();
                }).catch(function (err) {
                    console.error('自动登录失败：' + err)
                    //清空登陆缓存
                    jwt.clearAccessToken();
                });
                console.log("刷新token成功");
                console.log("开始执行队列请求！" + requests.length);
                requests.forEach(cb => cb())
                console.log("执行完成");
                // 重试完了清空这个队列
                requests = [];
            }
            isRefreshing = false;
            isAutoLogin = false;
            //重新执行本次请求
            return http.request(config);
        } else {
            console.log("存入队列自动刷新token后再执行请求！");
            return new Promise((resolve) => {
                // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                requests.push(() => {
                    resolve(http.request(config))
                })
            })
        }
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
