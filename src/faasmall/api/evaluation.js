import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//商品评价
export const createEvaluate = (param) =>{
    return http.postJson(setting.getApiUrl('/evaluate/create'),param,{auth:true})
}

//评价统计
export const getEvaluateCount = (goodId) =>{
    return http.postJson(setting.getApiUrl('/evaluate/count?goodId='+goodId),{auth:true})
}

//评价分页
export const getEvaluatePage = (param) => {
    return http.postJson(setting.getApiUrl('/evaluate/page'),param,{auth:true})
}