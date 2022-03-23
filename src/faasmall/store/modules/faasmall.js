import {getInit} from "@/faasmall/api/common";

const faasmall = {
    //namespaced: true,
    state: {
        shop: {}, // 商城信息
        wechat: {}, // 微信配置
        share: {}, // 分享配置
        pay: {
            payType:[],
            defPay:1,
        }, // 支付配置
        store: {}, // 商城信息
        trade:{}, // 交易配置
    },
    mutations: {
        CONFIG(state, data) {
            Object.keys(data).forEach(k => {
                state[k] = data[k];
            })
        },
    },
    getters:{
        shopData: state => state.shop,
        storeData: state => state.store,
        shareData: state => state.share,
        paymentData: state => state.pay,
        tradeData: state => state.trade,
    },
    actions: {
        // 初始化数据
        async faasmallInit({
                          commit,
                          dispatch
                      }, options) {
            const result = await getInit();
            if (result.code === 0) {
                commit('CONFIG', result.data);
                if (!options?.query?.token) {
                    //dispatch('autoLogin');
                }
                return result.data;
            }
            return false;
        },
    }
}

export default faasmall
