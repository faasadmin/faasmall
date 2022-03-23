/**
 * 会员相关接口
 */
import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';

//=================页面相关接口======================

/**获取主页scheme*/
export const getHomeScheme = () => {
    return http.get(setting.getApiUrl('/pages/home'))
}
