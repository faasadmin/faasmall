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
	return http.post(setting.getApiUrl('/member/info/base'),params,{auth:true})
}

/**获取会员其他数据*/
export const getMemberData = (params) => {
	return http.post(setting.getApiUrl('/member/info/other'),params,{auth:true})
}

/**获取会员优惠卷*/
export const getMemeberCouponList = (params) => {
	return http.postJson(setting.getApiUrl('/member/coupon/list'),params,{auth:true})
}

/**获取会员银行卡信息*/
export const getMemberBank = (params) => {
	return http.post(setting.getApiUrl('/member/info/bank'),params,{auth:true})
}

/**获取会员可用优惠卷*/
export const getMemeberAvailableCouponList = (params) => {
	return http.postJson(setting.getApiUrl('/member/coupon/available'),params,{auth:true})
}

/**分页获取会员优惠卷*/
export const getMemeberCouponPage = (params) => {
	return http.postJson(setting.getApiUrl('/member/coupon/page'),params,{auth:true})
}

/**更新会员**/
export const updateMember = (params)=>{
	return http.postJson(setting.getApiUrl('/member/info/update'),params,{dataType: 'application/json;charset=utf-8',auth:true})
}

/***领取优惠卷***/
export const receiveCoupon= (param) => {
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

/**获取会员等级信息*/
export const getMemberGradeInfo = () => {
	return http.post(setting.getApiUrl('/member/info/grade'),{auth:true})
}

/**获取会员等级列表*/
export const getMemberGradeList = () => {
	return http.post(setting.getApiUrl('/member/grade/list'),{auth:true})
}

/**会员重置密码*/
export const memberForgotPwd = (params) => {
	return http.postJson(setting.getApiUrl('/member/info/forgot-pwd'),params,{auth:true})
}

/**会员绑定手机号*/
export const memberBindMobile = (params) => {
	return http.postJson(setting.getApiUrl('/member/info/bind-mobile'),params,{auth:true})
}

/**会员更改密码*/
export const memberChangePwd = (params) => {
	return http.postJson(setting.getApiUrl('/member/info/change-pwd'),params,{auth:true})
}

/**获取会员第三方授权信息*/
export const getMemberThirdOauthInfo = () => {
	return http.post(setting.getApiUrl('/member/info/third-oauth-info'),{auth:true})
}
/**解绑会员第三方授权信息*/
export const unbindMemberThirdOauthInfo = (param) => {
	return http.post(setting.getApiUrl('/member/info/unbind-third-oauth'),param,{auth:true})
}
/**根据订单编号获取该订单下发放的优惠卷*/
export const getMemberCouponByOrderSn = (orderSn) => {
	return http.get(setting.getApiUrl('/member/coupon/order-sn?orderSn='+orderSn),{auth:true})
}
