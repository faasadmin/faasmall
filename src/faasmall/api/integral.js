import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";


//=================积分======================

//积分分页
export const getIntegralLogPage = (param) => {
    return http.postJson(setting.getApiUrl('integral/log-page'),param,{auth:true})
}

//积分兑换
export const getExchangePage = (param) => {
    return http.postJson(setting.getApiUrl('integral/exchange-page'),param,{auth:true})
}