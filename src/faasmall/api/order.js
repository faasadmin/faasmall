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

//分页获取会员售后订单
export const getOrderAfterPage = (params) =>{
    return http.postJson(setting.getApiUrl('/order/after/page'),params,{auth:true})
}

//整个订单售后申请
export const wholeOrderAfterApply = (params) =>{
    return http.postJson(setting.getApiUrl('/order/after/apply-whole'),params,{auth:true})
}

//订单单个商品售后申请
export const singleOrderAfterApply = (params) =>{
    return http.postJson(setting.getApiUrl('/order/after/apply-single'),params,{auth:true})
}

//获取售后订单
export const getAfterSaleOrder = (params) =>{
    return http.postJson(setting.getApiUrl('/order/after/get'),params,{auth:true})
}

//售后订单取消
export const afterSaleOrderCancel = (params) =>{
    return http.postJson(setting.getApiUrl('/order/after/cancel'),params,{auth:true})
}

//售后订单换货
export const afterSaleOrderExchange = (params) =>{
    return http.postJson(setting.getApiUrl('/order/after/exchange'),params,{auth:true})
}

//售后订单换货确认收货
export const afterSaleOrderReceived = (params) =>{
    return http.postJson(setting.getApiUrl('/order/after/received'),params,{auth:true})
}

//售后订单删除
export const orderAfterDelete = (id) =>{
    return http.post(setting.getApiUrl('/order/after/delete?id='+id),{auth:true})
}