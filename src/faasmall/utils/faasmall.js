import store from '../store'
import {
    router
} from '@/faasmall/common/router'

export function isNotEmpty(obj) {
    return !isEmpty(obj);
}

export function isEmpty(obj) {
    if (typeof obj === 'undefined' || obj == null || obj === '' || obj.length ===0) {
        return true;
    } else {
        return false;
    }
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
    id = id || 'id'
    parentId = parentId || 'parentId'
    children = children || 'children'
    rootId = rootId || Math.min.apply(Math, data.map(item => { return item[parentId] })) || 0
    //对源数据深度克隆
    const cloneData = JSON.parse(JSON.stringify(data))
    //循环所有项
    const treeData = cloneData.filter(father => {
        let branchArr = cloneData.filter(child => {
            //返回每一项的子级数组
            return father[id] === child[parentId]
        });
        branchArr.length > 0 ? father.children = branchArr : '';
        //返回第一层
        return father[parentId] === rootId;
    });
    return treeData !== '' ? treeData : data;
}

/**
 * 树转list
 */
export function treeToAppMenuList(tree){
    
    for(var i in tree){
        var node = tree[i];
        list = [];  //结果lsit
        if (node.children.length !== 0) {  //遍历树的第一层,只有一个根结点
            //第一层加入到list中,因为根结点模块设置为虚拟结点,所以不用加入
            /*list.push({
                id: node.id,
                name: node.title,
                parentId:node.parentId
            });*/
            this.toListDF(node.children, list, node.id);  //遍历子树,并加入到list中.
        }
    }
    return list;
}

/**
 * 深度优先遍历树
 * 一个递归方法
 * @params tree:要转换的树结构数据
 * @params list:保存结果的列表结构数据，初始传list = []
 * @params parentId:当前遍历节点的父级节点id，初始为null(因为根节点无parentId)
 **/
export function toListDF (tree, list, parentId) {
    for (var i in tree) { //遍历最上层
        //将当前树放入list中
        var node = tree[i];
        list.push({
            id: node.id,
            appName: node.appName,
            appPath: node.appPath,
            rootRouting: node.rootRouting,
            parentId:parentId
        });
        //如果有子结点,再遍历子结点
        if (node.children.length !== 0) {
            toListDF(node.children, list, node.id)  //递归
        }
    }
}

export function getSystemInfo(){
    return uni.getSystemInfoSync().platform;
}

/**
 * 跳转再封装,主要是为了兼容外链。
 * @param {String} path - 跳转路径
 * @param {isTabbar} isTabbar - 是否是底部导航
 */
export function routerTo(path, isTabbar) {
    if (path) {
        // 是否跳转外部链接
        if (~path.indexOf('http') || ~path.indexOf('www')) {
            // #ifdef H5
            window.location = path;
            // #endif
            // #ifndef  H5
            router.push({
                path: '/pages/public/webview',
                query: {
                    'webviewPath': path
                }
            })
            // #endif
            return false
        }
        if (isTabbar) {
            router.replaceAll(path)
        } else {
            path.includes('/pages/index') && !path.includes('/pages/index/view') ? router.replaceAll(path) : router
                .push(path)
        }
    } else {
        console.log(`%cerr:没有填写跳转路径`, 'color:green;background:yellow');
    }
}

//获取开始时间
export function getToDayBegin(){
    return format(new Date(new Date(new Date().toLocaleDateString()).getTime()),'yyyy-MM-dd HH:mm:ss');
}

//获取结束时间
export function getToDayEnd(){
    return format(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),'yyyy-MM-dd HH:mm:ss');
}

//获取当前日期
export function getToDay(){
    return format(new Date(),'yyyy年MM月dd日');
}

//获取当前月
export function getToMonth(){
    return format(new Date(),'yyyy年MM月');
}

//获取当前时间
export function getNowTime(){
    let dateTime
    let yy = new Date().getFullYear()
    let mm = new Date().getMonth() + 1
    let dd = new Date().getDate()
    let hh = new Date().getHours()
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes()
        :
        new Date().getMinutes()
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds()
        :
        new Date().getSeconds()
    dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    console.log(dateTime)
    return dateTime
}

/**
 * 格式化日期
 * @param date {Date} 日期
 * @param pattern {string} 格式，例："yyyy-MM-dd HH:mm:ss"
 * @returns {String} 返回格式化后的日期，如："2021-12-22 18:04:30"
 */
export function format (date, pattern) {
    var time = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "H+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S+": date.getMilliseconds()
    };
    if (/(y+)/i.test(pattern)) {
        pattern = pattern.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in time) {
        if (new RegExp("(" + k + ")").test(pattern)) {
            pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? time[k] : ("00" + time[k]).substr(("" + time[k]).length));
        }
    }
    return pattern;
}


/**
 * 将指定时间偏移几小时
 * @param time {String} 指定时间，例："2021-12-23 17:00"
 * @param offset {Number} 偏移量，正数代表加几小时，负数代表减几小时，例：1
 * @param pattern {String} 返回时间的格式，例："yyyy-MM-dd HH:mm"
 * @returns {String} 返回计算后的时间，如："2021-12-23 18:00"
 */
export function offsetHours (time, offset, pattern) {
    var date = new Date(Date.parse(time));
    var yyyy = date.getFullYear();
    var MM = date.getMonth();
    var dd = date.getDate();
    var HH = date.getHours() + offset;
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    return this.format(new Date(yyyy, MM, dd, HH, mm, ss), pattern);
}

/**
 * 将指定月份偏移几个月
 * @param month {String} 指定月份，例："2021-12"
 * @param offset {Number} 偏移量，负数代表上几个月，正数代表下几个月，例：1
 * @returns {String} 返回计算后的月份，如："2018-02"
 */
export function offsetMonths (month, offset) {
    var date = new Date(Date.parse(month));
    var year = date.getFullYear();
    var month = date.getMonth();
    var preOrNextMonth = month + offset;
    return this.format(new Date(year, preOrNextMonth), "yyyy-MM");
}

/**
 * 获取指定日期是星期几
 * @param date {String} 指定日期,例："2021-12-23"
 * @returns {Number} 返回星期几(1-7)，如：2
 */
export function dayOfWeek (date) {
    var time = new Date(Date.parse(date));
    var weekday=new Array(7);
    weekday[0]= 7;
    weekday[1]= 1;
    weekday[2]= 2;
    weekday[3]= 3;
    weekday[4]= 4;
    weekday[5]= 5;
    weekday[6]= 6;
    return weekday[time.getDay()];
}

/**
 * 获取指定月份有多少天
 * @param month {String} 指定月份：例"2022-12"
 * @returns {number} 返回指定月份有多少天，如：31
 */
export function daysInMonth (month) {
    var date = new Date(Date.parse(month));
    var year = date.getFullYear();
    var month = date.getMonth();
    if (month == 1) {
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
            return 29;
        else
            return 28;
    } else if ((month <= 6 && month % 2 == 0) || (month > 6 && month % 2 == 1))
        return 31;
    else
        return 30;
}

//获取本月第一天
export function getMonthFirstDay(){
    var now = new Date(); //当前日期
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getFullYear(); //当前年
    //本月的开始时间
    var monthStartDate = new Date(nowYear, nowMonth, 1);
    return format(monthStartDate,'yyyy-MM-dd');
}

//获取本月最后一天
export function getMonthLastDay(){
    var now = new Date(); //当前日期
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getFullYear(); //当前年
    //本月的结束时间
    var monthEndDate = new Date(nowYear, nowMonth+1, 0);
    return format(monthEndDate,'yyyy-MM-dd');
}