//分销提现订单
import {http} from "@/faasmall/utils/request/service";
import setting from "@/faasmall/common/config";


//获取提现列表
export const getWithdrawPage = (param) => {
    return http.postJson(setting.getApiUrl('/distribution/withdraw/page'),param,{auth:true})
}

//申请提现
export const applyWithdraw = (param) => {
    return http.postJson(setting.getApiUrl('/distribution/withdraw/apply'),param,{auth:true})
}
