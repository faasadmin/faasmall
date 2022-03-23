import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================余额======================

export const getBalancePage = (param) => {
    return http.post(setting.getApiUrl('balance/page'),param,{auth:true})
}