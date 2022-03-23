import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================收藏======================

export const getCollectPage = () => {
    return http.get(setting.getApiUrl('collect/page'),{auth:true})
}

export const addCollect = (param) => {
    return http.postJson(setting.getApiUrl('collect/add'),param,{auth:true})
}

export const deleteCollect = (param) => {
    return http.post(setting.getApiUrl('collect/delete'),param,{auth:true})
}

export const goodCollectExist = (param) => {
    return http.get(setting.getApiUrl('collect/exist?id=' + param.id),{auth:true})
}