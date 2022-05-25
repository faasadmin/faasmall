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

//是否开通分销
export const getDistributionOpen = () => {
    return http.post(setting.getApiUrl('/distribution/center/open'),{auth:true})
}

//申请条件是否满足
export const applySatisfyCondition = () => {
    return http.post(setting.getApiUrl('/distribution/center/apply-satisfy-condition-check'),{auth:true})
}


//获取申请拒绝原因
export const getReason = () => {
    return http.post(setting.getApiUrl('/distribution/center/reason'),{auth:true})
}

//分销中心等级
export const getDistributionCenterLevelList = () => {
    return http.post(setting.getApiUrl('/distribution/center/level'),{auth:true})
}

//分销商申请提交
export const applySubmit = (params) => {
    return http.postJson(setting.getApiUrl('/distribution/center/apply-submit'),params,{auth:true})
}

//分销商招募
export const recruit = (params) => {
    return http.postJson(setting.getApiUrl('/distribution/center/recruit'),params,{auth:true})
}