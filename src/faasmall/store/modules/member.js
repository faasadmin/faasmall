import {login, logout, mobilePassWordLogin} from '../../api/login'
import { getToken, setToken } from '../../utils/auth/auth'
import {cacheKey} from '@/faasmall/common/constant';
import jwt from '@/faasmall/utils/cache/jwt.js';
import {getMemberData, getMemberInfo} from "@/faasmall/api/member";
import wechat from '@/faasmall/common/wechat/wechat'
const member = {
    //namespaced: true,
    state: {
        token: jwt.getAccessToken(),
        isLogin: jwt.getLogin(), // 是否登陆
        identity:{
            //账号
            account: jwt.getAccount(),
            //密码
            password: jwt.getPassword(),
        },
        memberInfo: jwt.getUserInfo(), // 会员信息
        memberData: jwt.getUserData(), //会员其他相关信息
        authType: '' // forgotPwd:忘记密码, changePwd:修改密码, bindMobile:绑定手机号
    },
    mutations: {
        AUTH_TYPE(state, data) {
            data ? uni.hideTabBar() : uni.showTabBar();
            state.authType = data;
        },
        IS_LOGIN(state, data) {
            state.isLogin = data;
            uni.setStorageSync(cacheKey.IS_LOGIN, data);
        },
        TOKEN(state, payload) {
            state.token = payload;
            uni.setStorageSync(cacheKey.TOKEN, payload);
        },
        // 用户信息
        MEMBER_INFO(state, data) {
            state.memberInfo = data;
            uni.setStorageSync(cacheKey.MEMBER_INFO, data);
        },
        MEMBER_DATA(state, data) {
            state.memberData = data;
            uni.setStorageSync(cacheKey.MEMBER_DATA, data);
        },
    },
    actions: {
        // 获取用户信息
        async getMemberInfo({
                        commit,
                        dispatch,
                        getters,
                        state
                    }, token = '') {
            return new Promise((resolve, reject) => {
                token && commit('TOKEN', token);
                getMemberInfo().then(res => {
                    if (res.code === 0) {
                        commit('MEMBER_INFO', res.data);
                        commit('IS_LOGIN', true);
                        resolve(res.data)
                    }
                }).then(() => {
                    // 只有在登录的时候请求购物车信息，订单信息，获取登录信息之后。
                    token && dispatch('getCartList');
                    token && dispatch('getMemberData');
                }).catch(e => {
                        reject(e)
                    })
            })
        },
        // 用户其他相关信息
        getMemberData({   commit,
                          dispatch,
                          getters,
                          state
                      }) {
            return new Promise((resolve, reject) => {
                debugger
                getMemberData().then(res => {
                    commit('MEMBER_DATA', res.data);
                    resolve(res)
                }).catch(e => {
                    reject(e)
                })
            })
        },
        showAuthModal({
                          commit
                      }, type = 'forgotPwd') {
            commit('AUTH_TYPE', type);
        },
        // 自动登录
        async autoLogin({
                            getters,
                            dispatch
                        }) {
            console.info(getters.wechatData?.autoLogin);
            console.info(!getters.isLogin);
            //后台配置了自动登陆以及当前用户没有登陆
            if (getters.wechatData?.autoLogin && !getters.isLogin) {
                let token = '';
                // #ifdef H5
                wechat.login();
                // #endif
                debugger
                token && await dispatch('getMemberInfo', token);
                debugger
            } else if (getters.isLogin) { // 已经登录，直接获取用户信息
                await dispatch('getMemberInfo');
            }
            //share.setShareInfo();
            // 初始化小程序session_key
            // #ifdef MP-WEIXIN
            if (!getters.wechatData?.autoLogin) {
                await wechat.getWxMiniProgramSessionId(false);
            }
            // #endif
        },
        //通用登录
        Login({ commit }, memberInfo) {
            return new Promise((resolve, reject) => {
                login(memberInfo).then(res => {
                    //const user = res.user
                    //res = res.data;
                    //const avatar = user.avatar === "" ? require("@/assets/images/profile.jpg") : user.avatar;
                    //commit('SET_NAME', user.userName)
                    //commit('SET_AVATAR', avatar)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            });
        },
        // 用户名密码登录
        NamePassWordLogin({ commit }, memberInfo) {
            const userName = memberInfo.userName.trim();
            const password = memberInfo.password;
            return new Promise((resolve, reject) => {
                mobilePassWordLogin(userName, password).then(res => {
                    debugger
                    res = res.data;
                    setToken(res.token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 手机号密码登录
        MobilePassWordLogin(){

        },
        // code授权登录
        CodeAuthorizeLogin(){

        },
        //验证码登录
        SmsCodeLogin({ commit }, memberInfo){
                const userName = memberInfo.userName.trim();
                const password = memberInfo.password;
                return new Promise((resolve, reject) => {
                    mobilePassWordLogin(userName, password).then(res => {
                        res = res.data;
                        setToken(res.token)
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                })
        },
        // 退出系统
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
    },
    getters:{
        token: state => state.token,
        isLogin: state => state.isLogin,
        memberInfo: state => state.memberInfo,
        memberData: state => state.memberData,
        authType: state => state.authType,
        identity: state => state.identity
    }
}

export default member
