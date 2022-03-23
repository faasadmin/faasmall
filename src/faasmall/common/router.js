import {RouterMount, createRouter} from 'uni-simple-router';
import storage from '../utils/storage.js'
import {cacheKey} from './constant.js';
import jwt from '@/faasmall/utils/cache/jwt.js';
// 初始化
const router = createRouter({
    platform: process.env.VUE_APP_PLATFORM,
    routes: [...ROUTES]
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
    if (to.meta.auth) {
        //var isLogin = storage.isEmpty(cacheKey.IS_LOGIN);
        var isLogin = jwt.isNotLogin();
        //debugger
        if (isLogin) {
            //APP
            //#ifdef APP-PLUS
            next({
                name: 'app_login',
                params: {
                    msg: '我拦截了详情页面并重定向到了登录页面上',
                },
                NAVTYPE: 'push'
            });
            //#endif

            //H5
            //#ifdef H5
            next({
                name: 'h5_login',
                params: {
                    msg: '我拦截了详情页面并重定向到了登录页面上',
                },
                NAVTYPE: 'push'
            });
            //#endif

            //小程序
            //#ifdef MP-WEIXIN
            next({
                name: 'applets_login',
                params: {
                    msg: '我拦截了详情页面并重定向到了登录页面上',
                },
                NAVTYPE: 'push'
            });
            //#endif
        } else {
            next();
        }
    } else {
        next();
    }
})
// 全局路由后置守卫
router.afterEach((to, from) => {

})
export {
    router,
    RouterMount
}
