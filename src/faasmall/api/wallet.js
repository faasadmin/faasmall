import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================余额======================


//余额列表分页
export const getBalanceLogPage = (param) => {
    return http.postJson(setting.getApiUrl('/member/wallet/balance-log-page'),param,{auth:true})
}

//提现日志分页
export const getWithdrawLogPage = (param) => {
    return http.postJson(setting.getApiUrl('/member/wallet/withdraw-log-page'),param,{auth:true})
}

//余额申请提现
export const balanceApplyWithdraw = (param) => {
    return http.postJson(setting.getApiUrl('/member/wallet/withdraw-apply'),param,{auth:true})
}