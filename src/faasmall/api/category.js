import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================分类======================

export const getCategoryList = () => {
    return http.get(setting.getApiUrl('category/list'))
}

export const getLevelCategroy = (param) => {
    return http.postJson(setting.getApiUrl('category/level'),param,{dataType: 'application/json;charset=utf-8'})
}

