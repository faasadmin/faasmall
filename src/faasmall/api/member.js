/**
 * 会员相关接口
 */
import {
	http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================会员相关接口======================

/**获取会员信息*/
export const getMemberInfo = (params) => {
	return http.post(setting.getApiUrl('/member/info/get'),params,{auth:true})
}

/**获取会员优惠卷*/
export const getMemeberCouponList = (params) => {
	return http.postJson(setting.getApiUrl('/member/coupon/list'),params,{auth:true})
}

/**分页获取会员优惠卷*/
export const getMemeberCouponPage = (params) => {
	return http.postJson(setting.getApiUrl('/member/coupon/page'),params,{auth:true})
}

/**更新会员**/
export const updateMember = (params)=>{
	return http.postJson(setting.getApiUrl('/member/update'),params,{dataType: 'application/json;charset=utf-8',auth:true})
}

/***领取优惠卷***/
export const receiveCoupon= (param) => {
	debugger
	return http.get(setting.getApiUrl('member/coupon/receive?id='+param.id),{auth:true})
}

/**分页获取会员订单*/
export const getMemeberOrderPage = (params) => {
	return http.postJson(setting.getApiUrl('/member/order/page'),params,{auth:true})
}

/**获取会员订单详情*/
export const getMemeberOrder= (id) => {
	return http.get(setting.getApiUrl('/member/order/get?id=' + id),{auth:true})
}

/**分页获取会员售后订单*/
export const getMemberOrderAfterPage = (params) =>{
	return http.postJson(setting.getApiUrl('/member/order/after/page'),params,{auth:true})
}


/**获取会员等级信息*/
export const getMemberGradeInfo = () => {
	return http.post(setting.getApiUrl('/member/info/grade'),{auth:true})
}

/**获取会员等级列表*/
export const getMemberGradeList = () => {
	return http.post(setting.getApiUrl('/member/grade/list'),{auth:true})
}