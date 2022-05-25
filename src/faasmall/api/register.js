import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";
import { customizeRequest } from '@/faasmall/common/http.js'

/**
 * 获取注册验证码
 */
export function getRegisterCode(mobile){
    return http.postJson(setting.getApiUrl('/oauth/register/send-sms-code'),mobile)
}

/**
 * 注册
 */
export function doRegister(data){
    return http.postJson(setting.getApiUrl('/oauth/register/mobile-code'),data)
}
