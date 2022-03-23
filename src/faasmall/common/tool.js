import Clipboard from 'clipboard'
import storage from '../utils/storage.js'
import {cacheKey} from './constant.js';
import {checkToken, login} from '../api/login';
import store from "../store";

console.log(login)

function showLoading(title) {
    uni.showLoading({
        title: title
    });
}

function showToast(title) {
    uni.showToast({
        title: title,
        mask: false,
        duration: 2000,
        icon: "none"
    });
}

// 空格截取
function trim(value) {
    if (value == null) {
        return "";
    }
    return value.toString().replace(/(^\s*)|(\s*$)|\r|\n/g, "");
}

// 判断字符串是否为空
function isEmpty(value) {
    if (value == null || this.trim(value) == "" || value == "undefined") {
        return true;
    }
    return false;
}

// 判断一个字符串是否为非空串
function isNotEmpty(value) {
    return !this.isEmpty(value);
}

function handleClipboard(text, event, onSuccess, onError) {
    event = event || {}
    const clipboard = new Clipboard(event.target, {
        text: () => text
    })
    clipboard.on('success', () => {
        onSuccess()
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
    })
    clipboard.on('error', () => {
        onError()
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
    })
    clipboard.onClick(event)
}

function saveFile(url) {
    var oA = document.createElement("a");
    oA.download = '';
    oA.href = url;
    document.body.appendChild(oA);
    oA.click();
    oA.remove(); // 下载之后把创建的元素删除
}

function logout() {
    uni.removeStorageSync('cacheData');
    uni.removeStorageSync('vuex_user');
    uni.removeStorageSync('vuex_token');
}

function formatTime(time) {
    let unixtime = time
    let unixTimestamp = new Date(unixtime * 1000)
    let Y = unixTimestamp.getFullYear()
    let M = ((unixTimestamp.getMonth() + 1) > 10 ? (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1))
    let D = (unixTimestamp.getDate() > 10 ? unixTimestamp.getDate() : '0' + unixTimestamp.getDate())
    let toDay = Y + '-' + M + '-' + D
    return toDay
}

/**
 * 剩余时间格式化
 * @param {Number} t - 剩余多少秒
 * @return {Object}  format - 格式后的天时分秒对象
 */
function format(t) {
    let format = {
        d: '00',
        h: '00',
        m: '00',
        s: '00'
    };
    if (t > 0) {
        let d = Math.floor(t / 86400);
        let h = Math.floor((t / 3600) % 24);
        let m = Math.floor((t / 60) % 60);
        let s = Math.floor(t % 60);
        format.d = d < 10 ? '0' + d : d;
        format.h = h < 10 ? '0' + h : h;
        format.m = m < 10 ? '0' + m : m;
        format.s = s < 10 ? '0' + s : s;
    }
    return format;
}

function updateTitle(title) {
    uni.setNavigationBarTitle({
        title: title
    });
}

function authNavigator(url, type = 'navigateTo', args = {}) {
    console.log('是否登录', checkLogin())
    if (this.checkLogin()) {
        uniNavigator(url, type, args = {})
    } else {
        //autoAuth()
    }
}

// 登录 授权之后执行
function toLogin(data, callback) {
    const {
        type
    } = data;
    let that = this;
    //小程序登陆
    let request = login(data);
    request.then(res => {
        let data = res.data;
        let token = data.token;
        // #ifdef  MP
        // 小程序授权信息
        updateToken(token, data, true)
        setTimeout(() => {
            callback(data)
        }, 500)
        console.log('当前为小程序环境')
        // #endif
    }).catch(err => {
        console.log('login', err)
    })
}

module.exports = {
    updateTitle,
    authNavigator,
    toLogin,
	formatTime,
    format,
	logout,
	saveFile,
	handleClipboard,
	isNotEmpty,
	isEmpty,
	trim,
	showLoading,
	showToast
}