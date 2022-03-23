import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================搜索======================

//获取搜索信息
export const getSearchInfo = () => {
    return http.get(setting.getApiUrl('/search/info'),{auth:true})
}

//清除搜索记录
export const cleanSearchHistory = () => {
    return http.get(setting.getApiUrl('/search/history-clean'),{auth:true})
}