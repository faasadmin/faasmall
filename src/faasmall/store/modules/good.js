import {addFootPrint} from "@/faasmall/api/footprint";
import {addCollect,goodCollectExist} from "@/faasmall/api/collect";
import {getRecommendGood} from "@/faasmall/api/good";

const state = {
    goodInfo: {},
    recommendGood:[]
}


const getters = {
    goodInfo: state => state.goodInfo,
    recommendGood: state => state.recommendGood,
}


const mutations = {
    recommendGood: function (state, data) {
        state.recommendGood = data;
    }
}

const actions = {
    recommendGood({ getters, commit }){
        if (getters.recommendGood.length === 0) {
            getRecommendGood({isTask:0}).then(function (res) {
                debugger
                commit('recommendGood', res.data);
            });
        }
    },
    addFootPrint({commit,dispatch}, data){
        addFootPrint(data).then(res => {}).catch(err => {
            console.error(err);
        });
    },
    addCollect({commit,dispatch}, data){
        return new Promise((resolve, reject) => {
            addCollect(data).then(res => {
                resolve(res)
            }).catch(e => {
                reject(e)
            });
        })
    },
    collectExist({commit,dispatch}, data){
        return new Promise((resolve, reject) => {
            goodCollectExist(data).then(res => {
                resolve(res)
            }).catch(e => {
                reject(e)
            });
        })
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
