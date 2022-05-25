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
        var isLogin = jwt.getLogin();
        if (!isLogin) {
            next({
                name: 'login',
                params: {
                    msg: '登陆',
                },
                NAVTYPE: 'push'
            });
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
