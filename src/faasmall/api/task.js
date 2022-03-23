import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================任务======================


//任务列表
export const getTaskList = () => {
    return http.post(setting.getApiUrl('/task/list'),{auth:true})
}

//签到
export const signIn = () => {
    return http.post(setting.getApiUrl('/task/sign-in'),{auth:true})
}

//签到数据
export const signInInfo  = () => {
    return http.post(setting.getApiUrl('/task/sign-in-info'),{auth:true})
}

//领取积分
export const receive  = (taskId) => {
    return http.get(setting.getApiUrl('/task/receive?taskId=' + taskId),{auth:true})
}


//任务是否完成处理
export const taskFinishProcess  = (data) => {
    return http.postJson(setting.getApiUrl('/task/task-finish-process'),data,{auth:true})
}

export const testOne  = () => {
    return http.post(setting.getApiUrl('/task/add'))
}

export const testTwo  = () => {
    return http.post(setting.getApiUrl('/task/prt'))
}