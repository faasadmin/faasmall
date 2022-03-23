import setting from '../../common/config.js';
import {cacheKey, platformType} from '../../common/constant.js';
import {isNotEmpty,isEmpty} from "@/faasmall/utils/faasmall";
import platform from "@/faasmall/utils/platform";
import storage from "@/faasmall/utils/storage";
import {checkToken} from "@/faasmall/api/login";
import {getMemberInfo} from '@/faasmall/api/member.js';
import {silentLogin} from "@/faasmall/utils/auth/auth";

//===============缓存方法的定义===============
// 获取token
const getAccessToken = function () {
    let token = '';
    try {
        if (setting.WX_ENV) {
            token = uni.getStorageSync(cacheKey.TOKEN) || "";
        } else {
            token = setting.TEST_TOKEN;
        }
    } catch (e) {
    }
    return token;
}
// 设置token
const setAccessToken = (access_token) => {
    try {
        uni.setStorageSync(cacheKey.TOKEN, access_token);
        return true;
    } catch (e) {
        return false;
    }
}
//清除token
const clearAccessToken = function () {
    try {
        uni.removeStorageSync(cacheKey.TOKEN);
    } catch (e) {
    }
}
//设置userinfo
const setUser = (user) => {
    try {
        uni.setStorageSync(cacheKey.USER_INFO, user);
        return true;
    } catch (e) {
        return false;
    }
}
//获取userinfo
const getUser = function () {
    try {
        return uni.getStorageSync(cacheKey.USER_INFO) || {
            commission:0
        };
    } catch (e) {
        return false;
    }
}
//清除userinfo
const clearUser = function () {
    try {
        uni.removeStorageSync(cacheKey.USER_INFO)
    } catch (e) {
    }
}

//设置openId
const setOpenId = (openId) => {
    try {
        uni.setStorageSync(cacheKey.USER_OPEN_ID, openId);
        return true;
    } catch (e) {
        return false;
    }
}
//获取openId
const getOpenId = function () {
    try {
        return uni.getStorageSync(cacheKey.USER_OPEN_ID)
    } catch (e) {
        return false;
    }
}
//清除openId
const clearOpenId = function () {
    try {
        uni.removeStorageSync(cacheKey.USER_OPEN_ID)
    } catch (e) {
    }
}

//是否登陆
const isLogin = function (){
    return !isNotLogin();
}

//是否没有登陆
const isNotLogin = function (){
    var accessToken = getAccessToken();
    if(isEmpty(accessToken)){
        return true;
    }
    return false;
}

//验证是否需要登陆
const verifyLogin = function (){
    var flag = isNotLogin();
    if(flag){
        var loginUrl = "pages/common/login/h5_model";
        var pf = platform.get();
        if(platformType.app === pf){
            loginUrl = "pages/common/login/app_model";
        }else if(platformType.wxMiniProgram === pf){
            loginUrl = "pages/common/login/applets_model";
        }else if(platformType.wxOfficialAccount === pf){
            loginUrl = "pages/common/login/app_model";
        }
        uni.redirectTo({
            url: loginUrl
        });
    }
}

//刷新用户信息
function refreshMemberInfo() {
    getMemberInfo().then((res)=>{
        setUser(res.data);
    }).catch(err=>{
        console.error(err)
    })
}

//校验token是否有效
function checkTokenValid() {
    let flag = false;
    const token = getAccessToken();
    checkToken(token).then(res => {
        if(res.code === 0){
            flag = true;
        }else {
            setAccessToken(null);
        }
    }).catch(err => {
        setAccessToken(null);
    })
    return flag;
}

//退出登陆
function logout(){
    clearAccessToken();
    clearUser();
}

//获取登陆账号
function getAccount(){
    return uni.getStorageSync(cacheKey.ACCOUNT) || '';
}

//设置账号
function setAccount(data){
    return uni.setStorageSync(cacheKey.ACCOUNT,data);
}


//获取密码
function getPassword(){
    return uni.getStorageSync(cacheKey.PASSWORD) || '';
}

//设置密码
function setPassword(data){
    return uni.setStorageSync(cacheKey.PASSWORD,data);
}


//自动登陆
function autoLogin(){
    var password = getPassword();
    if(isNotEmpty(password)){
        //重新登录保存新的token
        silentLogin().then(function (res) {
            let data = res.data;
            let token = data.token;
            setAccessToken(token);
            refreshMemberInfo();
        }).catch(function (err) {
            console.error('自动登录失败：' + err)
            //清空登陆缓存
            clearAccessToken();
        });
    }
}

export default {
    getAccessToken,
    setAccessToken,
    clearAccessToken,
    getUser,
    setUser,
    clearUser,
    setOpenId,
    getOpenId,
    clearOpenId,
    isLogin,
    isNotLogin,
    verifyLogin,
    checkTokenValid,
    refreshMemberInfo,
    logout,
    getAccount,
    getPassword,
    setPassword,
    setAccount,
    autoLogin
}
