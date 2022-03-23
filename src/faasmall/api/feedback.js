import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";


//=================反馈======================

//获取反馈分类
export const getFeedBackCategory = () => {
    return http.get(setting.getApiUrl('feedback/category'),{auth:true})
}

//创建反馈
export const addFeedBack = (data) => {
    return http.postJson(setting.getApiUrl('feedback/add'),data,{auth:true})
}