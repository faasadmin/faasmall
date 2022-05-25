//=================说明================================
/**
 * 命名规范:首字母小写,驼峰命名,值为全大写下划线
 */

/**
 * 通用常量
 */
export const commonConstant = {
    //默认头像
    avatar :'http://fendotk.oss-cn-beijing.aliyuncs.com/file/1/2022/04/18/6e5cfb05827c56b95adf9963c94107ab.png',
}


//====================详情==============================
/**
 * 网络状态码
 */
export const httpCode = {
    /** 成功 */
    SUCCESS: 0,
    /** 警告 */
    WARN: 301,
    /**
     * jwt验证失败
     */
    JWTFAIL: 409,
    /**
     * jwt过期重新请求用户的身份认证
     */
    JWTEXPIRE: 401,
    /** 错误 */
    ERROR: 500,
};

export const platformType = {
    H5: "h5",
    APP: "app",
    WX_MA_PROGRAM: "wx_ma_program",
    WX_MP_ACCOUNT: "wx_mp_account",
    ZFB_MINI_PROGRAM: "zfb_mini_program",
}

/**
 * request请求参数
 */
export const httpContentType = {
    URL_ENCODED: "application/x-www-form-urlencoded; charset=utf-8",
    JSON: "application/json;charset=utf-8",
}

/**
 * 缓存key
 */
export const cacheKey = {
    //===============缓存键的定义===============
    ACCOUNT: "account",
    PASSWORD: "password",
    IS_LOGIN: "is_login",
    TOKEN: "token",
    SESSION_ID: "session_id",
    MEMBER_INFO: "member_info",
    MEMBER_DATA: "member_data",
    MEMBER_OPEN_ID: "user_open_id",
    ADDRESS_JSON: 'address_json',
}

/**
 * 余额日志类型
 */
export const BalanceLogTypeEnum = {
    RECHARGE: {
        status: 1,
        name: '充值'
    },
    HANDSEL: {
        status: 2,
        name: '赠送'
    },
    CONSUME: {
        status: 3,
        name: '消费'
    },
    WITHDRAW: {
        status: 4,
        name: '提现'
    },
    BACKSTAGE: {
        status: 5,
        name: '后台操作'
    }
}
