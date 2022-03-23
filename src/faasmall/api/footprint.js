import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";


//=================足迹======================

//我的足迹分页
export const getFootPrintPage = () => {
    return http.get(setting.getApiUrl('footprint/page'),{auth:true})
}

//添加足迹
export const addFootPrint = (param) => {
    return http.postJson(setting.getApiUrl('footprint/add'),param,{auth:true})
}