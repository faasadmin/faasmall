import {
	http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================用户收货地址======================

/**获取收货地址列表*/
export const getAddressList = () => {
	return http.get(setting.getApiUrl('/member/address/list'),{auth:true})
}

/**获取默认收货地址*/
export const getDefaultAddress = () => {
	return http.get(setting.getApiUrl('/member/address/default-address'),{auth:true})
}

/**获取地址信息*/
export const getAddress = (param) => {
	return http.get(setting.getApiUrl('/member/address/get?id='+ param.id),{auth:true})
}

/**新增地址信息*/
export const addAddress = (param) => {
	return http.postJson(setting.getApiUrl('/member/address/create'),param,{auth:true})
}

/**修改地址信息*/
export const updateAddress = (param) => {
	return http.postJson(setting.getApiUrl('/member/address/update'),param,{auth:true})
}

/**删除地址信息*/
export const deleteAddress = (param) => {
	return http.postJson(setting.getApiUrl('/member/address/delete?id=' + param.id),{auth:true})
}