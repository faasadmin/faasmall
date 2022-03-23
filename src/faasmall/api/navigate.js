import {
    http
} from '../utils/request/service.js'
import setting from '../common/config.js';
import {httpContentType} from "../common/constant";

//=================导航栏/金刚区======================

export const getNavitageList = () => {
    return http.get(setting.getApiUrl('navigate/list'))
}
