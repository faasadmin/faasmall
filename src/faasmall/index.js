import store from '@/faasmall/store';
//-----------------集成工具类---------------------------
import tool from './common/tool'
import platform from '@/faasmall/utils/platform';
// #ifdef H5
import wxsdk from '@/faasmall/common/wechat/sdk'
// #endif
import {
    uniShowToast,
    successToast,
    loadingToast,
    uniHideToast,
    uniShowModal,
    uniNavigator,
    uniStartPullDownRefresh,
    uniStopPullDownRefresh,
    uniSetNavigationBarColor
} from './utils/uni_api'

import {isNotEmpty,isEmpty,routerTo} from "./utils/faasmall";
import { customizeRequest } from './common/http.js'
// 引入uView提供的对vuex的简写法文件
let vuexStore = require('./store/$u.mixin.js');

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');


const install = Vue => {
    // 平台判断
    Vue.prototype.$platform = platform;
    Vue.prototype.$tool = tool;
    Vue.prototype.$showToast = uniShowToast;
    Vue.prototype.$successToast = successToast;
    Vue.prototype.$loadingToast = loadingToast;
    Vue.prototype.$hideToast = uniHideToast;
    Vue.prototype.$showModal = uniShowModal;
    Vue.prototype.$navigator = uniNavigator;
    Vue.prototype.$startPullRefresh = uniStartPullDownRefresh;
    Vue.prototype.$stopPullRefresh = uniStopPullDownRefresh;
    Vue.prototype.$setNavigationBarColor = uniSetNavigationBarColor;
    Vue.prototype.$isNotEmpty = isNotEmpty;
    Vue.prototype.$routerTo = routerTo;
    Vue.prototype.$isEmpty = isEmpty;
    Vue.prototype.$customizeRequest = customizeRequest;
    Vue.mixin(vuexStore);
    Vue.mixin(mpShare);
    // #ifdef H5
    // 微信H5,sdk挂载
    Vue.prototype.$wxsdk = wxsdk;
    // #endif
}

export async function init(options) {
    // #ifdef H5
    platform.entry();
    // #endif
    await store.dispatch("faaSmallInit", options); // 加载商城基本信息
}

export default {
    install
}