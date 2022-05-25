import setting from '../../common/config.js';
import {cacheKey, commonConstant, platformType} from '../../common/constant.js';
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
const setUserInfo = (user) => {
    try {
        uni.setStorageSync(cacheKey.MEMBER_INFO, user);
        return true;
    } catch (e) {
        return false;
    }
}
//获取userinfo
const getUserInfo = function () {
    try {
        return uni.getStorageSync(cacheKey.MEMBER_INFO) || {
            avatar: commonConstant.avatar
        };
        //return uni.getStorageSync(cacheKey.MEMBER_INFO);
    } catch (e) {
        return false;
    }
}
//清除userinfo
const clearMemberInfo = function () {
    try {
        uni.removeStorageSync(cacheKey.MEMBER_INFO)
    } catch (e) {
    }
}
//设置userData
const setUserData = (user) => {
    try {
        uni.setStorageSync(cacheKey.MEMBER_DATA, user);
        return true;
    } catch (e) {
        return false;
    }
}
//获取userData
const getUserData = function () {
    try {
        return uni.getStorageSync(cacheKey.MEMBER_DATA) || {
            commission:0
        };
    } catch (e) {
        return false;
    }
}
//清除userData
const clearMemberData = function () {
    try {
        uni.removeStorageSync(cacheKey.MEMBER_DATA)
    } catch (e) {
    }
}

//清除token
const clearSessionId = function () {
    try {
        uni.removeStorageSync(cacheKey.SESSION_ID);
    } catch (e) {
    }
}

//设置openId
const setOpenId = (openId) => {
    try {
        uni.setStorageSync(cacheKey.MEMBER_OPEN_ID, openId);
        return true;
    } catch (e) {
        return false;
    }
}
//获取openId
const getOpenId = function () {
    try {
        return uni.getStorageSync(cacheKey.MEMBER_OPEN_ID)
    } catch (e) {
        return false;
    }
}
//清除openId
const clearOpenId = function () {
    try {
        uni.removeStorageSync(cacheKey.MEMBER_OPEN_ID)
    } catch (e) {
    }
}


const getLogin = function () {
    try {
        return uni.getStorageSync(cacheKey.IS_LOGIN) || false;
    } catch (e) {
        return false;
    }
}
const setLogin = function (data) {
    try {
        uni.setStorageSync(cacheKey.IS_LOGIN, data)
    } catch (e) {
    }
}

const clearLogin = function () {
    try {
        uni.removeStorageSync(cacheKey.IS_LOGIN)
    } catch (e) {
    }
}

//验证是否需要登陆
const verifyLogin = function (){
    var flag = getLogin();
    if(!flag){
        uni.redirectTo({
            url: "pages/common/login/index"
        });
    }
}

//刷新用户信息
function refreshMemberInfo() {
    getMemberInfo().then((res)=>{
        setUserInfo(res.data);
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
    clearMemberData();
    clearMemberInfo();
    clearOpenId();
    clearAccount();
    clearPassword();
    clearLogin();
    //clearSessionId();
}

//获取登陆账号
function getAccount(){
    return uni.getStorageSync(cacheKey.ACCOUNT) || '';
}

//设置账号
function setAccount(data){
    return uni.setStorageSync(cacheKey.ACCOUNT,data);
}

function clearAccount(){
    try {
        uni.removeStorageSync(cacheKey.ACCOUNT)
    } catch (e) {
    }
}


//获取密码
function getPassword(){
    return uni.getStorageSync(cacheKey.PASSWORD) || '';
}

//设置密码
function setPassword(data){
    return uni.setStorageSync(cacheKey.PASSWORD,data);
}

function clearPassword(){
    try {
        uni.removeStorageSync(cacheKey.PASSWORD)
    } catch (e) {
    }
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
    getUserInfo,
    setUserInfo,
    clearMemberInfo,
    getUserData,
    setUserData,
    clearMemberData,
    setOpenId,
    getOpenId,
    clearOpenId,
    verifyLogin,
    checkTokenValid,
    refreshMemberInfo,
    logout,
    getAccount,
    getPassword,
    setPassword,
    setAccount,
    autoLogin,
    getLogin,
    clearLogin,
    setLogin
}
