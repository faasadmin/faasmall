import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";
import { customizeRequest } from '@/faasmall/common/http.js'


/**
 * 统一登录入口
 */
export function login (params){
    /*H5登录*/
    // #ifdef H5
    return h5Login(params);
    // #endif
    /*微信小程序*/
    // #ifdef MP-WEIXIN
    return appletsLogin(params);
    // #endif
    // #ifdef APP-PLUS
    return appLogin(params);
    // #endif
}

/**
 * h5登录
 */
export function h5Login(params){
    return mobilePassWordLogin(params);
}

/**
 * 小程序登录
 */
export function appletsLogin(params){
    return codeAuthorizeLogin(params);
}

/**
 * APP登录
 */
export function appLogin(params){
    return smsCodelogin(params);
}

/**
 * 手机号密码登陆
 */
export function mobilePassWordLogin(params){
    //return http.postJson('/mobile/login',params)
    //return http.postJson('/mobile/login',params)
    //调用封装好的API请求函数
    //把接口传过去
    return customizeRequest({
        //url:'/mobile/login',
        //url:'/login',
        url: '/mobile/login',
        method:'POST',
        data:params
    })
}

/**
 * 用户名密码登陆
 */
export function namePassWordLogin(params){
    //return http.postJson('/auth/login',params)
    return customizeRequest({
        url:'/auth/login',
        method:'POST',
        data:params
    })
}

/**
 * 验证码授权登录
 */
export function codeAuthorizeLogin(params){
    return http.postJson('/applets/code/login',params)
}

/**
 * 验证码登录方法
 */
export function smsCodelogin(params) {
    return http.postJson('/sms/login',params)
}

/**
 * 获取短信验证码
 */
export function getSmsCode(mobile){
    return http.postJson('/system/sms/login/smsCode',mobile)
}

/**
 * 校验token
 */
export const checkToken = (params) => {
    var apiUrl = setting.getApiUrl('/api/common/check-token');
    return http.post(apiUrl,params)
}