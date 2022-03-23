import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";


//=================积分======================

//积分分页
export const getIntegralPage = (param) => {
    return http.get(setting.getApiUrl('integral/page'),param,{auth:true})
}