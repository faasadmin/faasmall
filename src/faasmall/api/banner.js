import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================Banner======================

export const getBannerList = () => {
    return http.get(setting.getApiUrl('banner/list'))
}

export const getBannerPage = () => {
    return http.get(setting.getApiUrl('banner/page'))
}