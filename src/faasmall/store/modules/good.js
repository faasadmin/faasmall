import {addFootPrint} from "@/faasmall/api/footprint";
import {addCollect,goodCollectExist} from "@/faasmall/api/collect";

const state = {
    goodInfo: {}
}


const getters = {
    goodInfo: state => state.goodInfo,
}


const mutations = {

}

const actions = {
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
