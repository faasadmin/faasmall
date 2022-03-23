import Vue from 'vue'
import App from './App'
import faasmall from "@/faasmall";
import uView from "uview-ui";
import store from '@/faasmall/store';

//-----------------集成uni-simple-router--------------------------
import {router,RouterMount} from './faasmall/common/router.js'  //路径换成自己的
// 公共函数
import globalFunc from './faasmall/utils/common.js'
//-----------------i18n部分的配置------------------------
// 引入语言包，注意路径
import Chinese from './faasmall/common/vue-i18n/locales/zh.js';
import English from './faasmall/common/vue-i18n/locales/en.js';
// VueI18n
import VueI18n from './faasmall/common/vue-i18n/vue-i18n.min.js';
// VueI18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  // 默认语言
  locale: 'zh',
  // 引入语言文件
  messages: {
    'zh': Chinese,
    'en': English,
  }
});

async function start() {
  Vue.config.productionTip = false
  App.mpType = 'app'
  Vue.use(router);
  Vue.use(uView);
  Vue.use(faasmall);
  // 由于微信小程序的运行机制问题，需声明如下一行，H5和APP非必填
  Vue.prototype._i18n = i18n;
  const app = new Vue({
    i18n,
    store,
    ...App
  });
  Vue.use(globalFunc, app)
  //v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
  // #ifdef H5
  RouterMount(app,router,'#app')
  // #endif
  // #ifndef H5
  app.$mount(); //为了兼容小程序及app端必须这样写才有效果
  // #endif
}

start();