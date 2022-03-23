import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================购物车======================


export const getCartList = () => {
    return http.get(setting.getApiUrl('cart/list'),{auth:true})
}

export const addCart = (data) => {
    return http.postJson(setting.getApiUrl('cart/add'),data,{auth:true})
}

export const updateCart = (data) => {
    return http.postJson(setting.getApiUrl('cart/update'),data,{auth:true})
}

export const deleteCart = (data) => {
    return http.postJson(setting.getApiUrl('cart/delete'),data,{auth:true})
}