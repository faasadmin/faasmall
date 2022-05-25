import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";
import { customizeRequest } from '@/faasmall/common/http.js'

/**
 * 手机号密码登陆
 */
export function mobilePassWordLogin(params){
    //把接口传过去
    // return customizeRequest({
    //     //url:'/mobile/login',
    //     //url:'/login',
    //     url: '/mobile/login',
    //     method:'POST',
    //     data:params
    // })
    return http.post(setting.getApiUrl('/oauth/login/mobile-password-login'),params)
}

/**
 * 手机验证码登录方法
 */
export function mobileSmsCodeLogin(params) {
    return http.post(setting.getApiUrl('/oauth/login/mobile-sms-login'),params)
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
    return http.post(setting.getApiUrl('/api/common/check-token'),params)
}

/**
 * 退出
 */
export const logout = () => {
    return http.post(setting.getServerUrl('/admin-api/system/auth/logout'))
}

/**
 * 微信公众号网页静默登录
 */
export const mpAccountSilentLogin = () => {
    return http.post(setting.getApiUrl('/oauth/login/mp-account-silent-login'))
}

/**
 * 微信开放平台 登陆/绑定/刷新
 */
export const openPlatformOperate = (params) => {
    return http.post(setting.getApiUrl('/oauth/login/open-platform-operate'),params)
}

/**
 * 微信小程序静默授权登陆信息获取
 */
export const maProgramLoginInfo = (params) => {
    return http.post(setting.getApiUrl('/oauth/login/ma-program-login-info'),params)
}

/**
 * 微信小程序 登陆/绑定/刷新
 */
export const maProgramOperate = (params) => {
    return http.post(setting.getApiUrl('/oauth/login/ma-program-operate'),params)
}

export const forgotPwd = (params) => {
    return http.postJson(setting.getApiUrl('/oauth/login/forgot-pwd'),params,{auth:true})
}