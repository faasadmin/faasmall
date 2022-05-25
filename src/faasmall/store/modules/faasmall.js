import {getAddressJson, getInit, getSubscribe} from "@/faasmall/api/common";
import {cacheKey} from "@/faasmall/common/constant";
import setting from "@/pages/common/tool/setting";

const faasmall = {
    //namespaced: true,
    state: {
        shop: {}, // 商城信息
        wechat: {}, // 微信信息
        share: {}, // 分享配置
        wallet: {}, //钱包信息
        //消息订阅
        subscribe:[],
        addressJson: [],
        pay: {
            payType:[],
            defPay:'wx',
        }, // 支付配置
        popup:{},// 弹窗数据
        store: {}, // 商城信息
        trade:{}, // 交易配置
        distributionBasis:{},//分销基础设置
        distributionRecruit:{},//分销招募设置
        distributionOther:{},//分销其他设置
    },
    mutations: {
        CONFIG(state, data) {
            Object.keys(data).forEach(k => {
                state[k] = data[k];
            })
        },
        subscribe: function (state, data) {
            state.subscribe = data;
        },
        addressJson: function (state, data) {
            state.addressJson = data;
        },
        shareData(state, shareInfo) {
            state.shareData = shareInfo;
        }
    },
    getters:{
        shopData: state => state.shop,
        wechatData: state => state.wechat,
        storeData: state => state.store,
        shareData: state => state.share,
        paymentData: state => state.pay,
        tradeData: state => state.trade,
        subscribeData:state => state.subscribe,
        addressJson:state => state.addressJson,
        walletData:state => state.wallet,
        popupData: state => state.popup,
        distributionBasisData:state => state.distributionBasis,
        distributionRecruitData:state => state.distributionRecruit,
        distributionOtherData:state => state.distributionOther,
    },
    actions: {
        // 初始化数据
        async faaSmallInit({
                          commit,
                          dispatch
                      }, options) {
            const result = await getInit();
            if (result.code === 0) {
                console.info(options?.query);
                commit('CONFIG', result.data);
                //url中不存在token,则自动登陆
                if (!options?.query?.token) {
                    dispatch('autoLogin');
                }
            }
            return false;
        },
        subscribeInit: function ({ commit }) {
            getSubscribe().then(function (response) {
                commit('subscribe', response);
            });
        },
        getAddress: function ({ commit }) {
            debugger
            if (uni.getStorageSync(cacheKey.ADDRESS_JSON)) {
                commit('addressJson', uni.getStorageSync(cacheKey.ADDRESS_JSON));
            } else {
                debugger
                getAddressJson().then(function (res) {
                    debugger
                    commit('addressJson', res.data);
                    uni.setStorageSync(cacheKey.ADDRESS_JSON, res.data);
                });
            }
        },
    }
}

export default faasmall
