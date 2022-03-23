/*
 * 登录方法
 */
import jwt from '@/faasmall/utils/cache/jwt.js';
import {http} from '../request/service.js';
import {codeAuthorizeLogin,mobilePassWordLogin} from '../../api/login.js';
import store from "../../store";
import storage from '../storage.js'
import {cacheKey} from "../../common/constant";
import {isEmpty} from "../faasmall";

export function setToken(token) {
    store.commit("LOGIN", {
        token
    });
}


/********************************登录*******************************/

/**
 * token过期后用户重新登录
 */
export const silentLogin = () => {
    return new Promise((resolve, reject) => {
        //#ifdef  H5
        console.log('H5账号密码自动登陆自动登录')
        //const { password, userName } = this.$store.state.vuex_user;
        //let se = storage.get(cacheKey.VUEX_USER);
        var password = jwt.getPassword();
        var account = jwt.getAccount();
        if(isEmpty(password)){
            reject('密码为空');
            return;
        }
        mobilePassWordLogin({password:password,mobile:account}).then(res => {
            console.log('登陆响应：' + res)
            resolve(res);
        }).catch(err => {
            console.error(err);
            reject(err);
        });
        //判断是否记住自动登陆
        //#endif

        //#ifdef MP-WEIXIN
        uni.login({
            success(res) {
                console.log('自动登录,返回数据：', res);
                codeAuthorizeLogin(res)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        console.error(err);
                        reject(err);
                    });
            },
            fail(err) {
                console.log('自动登录失败：' + err)
                reject(err);
            }
        });
        //#endif
    })
}
/**
 * 通过openId登录
 */
export const loginByOpenIdApi = (openId) => {
    return http.post('/patient/anon/loginByOpenId', {
        openId
    })
}

/**
 * 通过code获取OpenId
 */
export const codeToOpenidApi = (code) => {
    console.log(code);
    return http.post('/anon/txmp/auth/codeToOpenid', {
        code
    })
}



/**获取codeUrl*/
export const getOAuth2CodeUrlApi = async () => {
    let redirectUrl = 'http://xlznwx.ftnet225.cn/xlznmp/'
    let {
        oAuth2CodeUrl
    } = await http.post('/anon/txmp/auth/snsApiBase', {
        redirectUrl
    })
    window.location.href = oAuth2CodeUrl
}

const currentPageKey = 'CURRENT_PAGE'

//设置CurrentPage
export const setCurrentPage = () => {
    try {
        let pathObj = getCurrentPagePath()
        console.log(pathObj);
        uni.setStorageSync(currentPageKey, pathObj);
        return true;
    } catch (e) {
        return false;
    }
}
//获取CurrentPage后立即清除
export const getAndRemoveCurrentPage = function () {
    try {
        let pathObj = uni.getStorageSync(currentPageKey)
        uni.removeStorageSync(currentPageKey)
        return pathObj
    } catch (e) {
        return false;
    }
}

export const getCurrentPagePath = () => {
    let pages = getCurrentPages()
    let len = pages.length
    let curParam = pages[len - 1].options //获取当前页面参数
    return {url: '/' + pages[len - 1].route, params: curParam}
}


