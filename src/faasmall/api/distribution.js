import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";


//=================分销======================

//我的分销订单
export const getDistributionOrderPage = (param) => {
    return http.postJson(setting.getApiUrl('/distribution/order/page'),param,{auth:true})
}

//我的下线数据汇总
export const getDistributionOfflineCollect = (param) => {
    return http.postJson(setting.getApiUrl('/distribution/offline/collect'),param,{auth:true})
}

//我的下线数据分页
export const getDistributionOfflinePage = (param) => {
    return http.postJson(setting.getApiUrl('/distribution/offline/page'),param,{auth:true})
}

//分销中心数据
export const getDistributionCenterInfo = () => {
    return http.post(setting.getApiUrl('/distribution/center/info'),{auth:true})
}

//分销中心等级
export const getDistributionCenterLevelList = () => {
    return http.post(setting.getApiUrl('/distribution/center/level'),{auth:true})
}