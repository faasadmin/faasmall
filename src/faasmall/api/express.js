import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//获取物流信息
export const getExpressInfo = (param) =>{
    return http.postJson(setting.getApiUrl('/express/info'),param,{auth:true})
}