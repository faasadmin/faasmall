import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================通用======================

//获取初始化数据
export const getInit = () => {
    return http.get(setting.getApiUrl('common/init'))
}

//获取订阅模板
export const getSubscribe = () => {
    return http.get(setting.getApiUrl('common/subscribe'))
}

//获取行政区数据
export const getAddressJson = () =>{
    return http.get(setting.getApiUrl('common/address-json'))
}

//获取分销申请数据
export const getDistributionApplySetting = () =>{
    return http.get(setting.getApiUrl('common/distribution-apply-setting'))
}

//获取指定配置数据
export const getConfig = (key) =>{
    return http.get(setting.getApiUrl('common/get-config?key='+key))
}

