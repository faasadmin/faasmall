import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================支付======================

//预支付
export const prepay = (data) => {
    return http.postJson(setting.getApiUrl('/shop/pay/prepay'),data)
}

//支付
export const pay = (data) => {
    return http.postJson(setting.getApiUrl('/shop/pay/pay'),data,{auth:true})
}