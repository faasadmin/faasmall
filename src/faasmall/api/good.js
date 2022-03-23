import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================商品======================


//获取最新的商品
export const getGoodLatest = () => {
    return http.get(setting.getApiUrl('good/latest'))
}

//随机获取商品
export const getGoodRandom = () => {
    return http.get(setting.getApiUrl('good/random'))
}

//分页获取商品
export const getGoodPage = (param) => {
    return http.postJson(setting.getApiUrl('good/page'),param)
}

//商品详情页
export const getGoodInfo = (param) => {
    return http.get(setting.getApiUrl('good/info?id=' + param.id))
}
