import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================帮助======================

//获取所有文章
export const getArticlePage = (param) => {
    return http.get(setting.getApiUrl('article/page'),param,{auth:true})
}