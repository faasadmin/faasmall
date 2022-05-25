import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================支付======================

//预支付
export const prepay = (data) => {
    return http.postJson(setting.getApiUrl('/pay/prepay'),data,{auth:true})
}

//支付
export const pay = (data) => {
    return http.postJson(setting.getApiUrl('/pay/pay'),data,{auth:true})
}