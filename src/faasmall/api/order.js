import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================订单======================

//提交订单
export const submitOrders = (data) => {
    return http.postJson(setting.getApiUrl('/order/submit'),data,{auth:true})
}

//预下单
export const getPre = (data) => {
    return http.postJson(setting.getApiUrl('/order/pre'),data,{auth:true})
}

//校验是否需要支付
export const verifyPay = (param) => {
    return http.post(setting.getApiUrl('/order/verify-pay?id='+param.id),{auth:true})
}

//免支付
export const freePay = (param) => {
    return http.post(setting.getApiUrl('/order/free-pay?id='+param.id),{auth:true})
}

//订单详情
export const getOrderInfo = (param) => {
    return http.post(setting.getApiUrl('/order/info?id='+param.id),{auth:true})
}

//取消订单
export const cancelOrder = (param) => {
    return http.get(setting.getApiUrl('/order/cancel?id='+param.id),{auth:true})
}

//确定收货
export const receiptOrder = (param) => {
    return http.get(setting.getApiUrl('/order/receipt?id='+param.id),{auth:true})
}