import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";


//=================优惠卷======================

//优惠卷列表
export const getCouponList = () => {
    return http.get(setting.getApiUrl('coupon/list'),{auth:true})
}

//优惠卷分页
export const getCouponPage = (param) => {
    return http.get(setting.getApiUrl('coupon/page'),param,{auth:true})
}

//优惠卷详情
export const getCoupon = (param) => {
    return http.get(setting.getApiUrl('coupon/get?id='+param.id),{auth:true})
}

