import {login, mobilePassWordLogin} from '../../api/login'
import { getToken, setToken } from '../../utils/auth/auth'
import {cacheKey} from '@/faasmall/common/constant';
import jwt from '@/faasmall/utils/cache/jwt.js';

const user = {
    //namespaced: true,
    state: {
        token: jwt.getAccessToken(),
        isLogin: jwt.isLogin(), // 是否登陆
        identity:{
            //账号
            account: jwt.getAccount(),
            //密码
            password: jwt.getPassword(),
        },
        userInfo: jwt.getUser(), // 用户信息
        userData: {}, //用户其他相关信息
        authType: '' // smsLogin:手机号登录注册, accountLogin:密码登录, forgotPwd:忘记密码, changePwd:修改密码, bindMobile:绑定手机号
    },
    mutations: {
        token(state, payload) {
            state.token = payload;
            uni.setStorageSync(cacheKey.TOKEN, payload);
        },
        // 用户信息
        userInfo(state, data) {
            state.userInfo = data;
            uni.setStorageSync(cacheKey.USER_INFO, data);
        },
        USER_DATA(state, data) {
            state.userData = data;
        },
    },
    actions: {
        //通用登录
        Login({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo).then(res => {
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
        NamePassWordLogin({ commit }, userInfo) {
            const userName = userInfo.userName.trim();
            const password = userInfo.password;
            return new Promise((resolve, reject) => {
                mobilePassWordLogin(userName, password).then(res => {
                    debugger
                    res = res.data;
                    setToken(res.token)
                    commit('SET_TOKEN', res.token)
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
        SmsCodeLogin({ commit }, userInfo){
                const userName = userInfo.userName.trim();
                const password = userInfo.password;
                return new Promise((resolve, reject) => {
                    mobilePassWordLogin(userName, password).then(res => {
                        res = res.data;
                        setToken(res.token)
                        commit('SET_TOKEN', res.token)
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
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('SET_PERMISSIONS', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        },

    },
    getters:{
        token: state => state.token,
        isLogin: state => state.isLogin,
        userInfo: state => state.userInfo,
        authType: state => state.authType,
        identity: state => state.identity
    }
}

export default user
