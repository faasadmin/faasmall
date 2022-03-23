import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================通用======================

//获取初始化数据
export const getInit = () => {
    return http.get(setting.getApiUrl('common/init'))
}