//=================说明================================
/**
 * 命名规范:首字母小写,驼峰命名,值为全大写下划线
 */
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
    H5: "H5",
    app: "app",
    wxMiniProgram: "wxMiniProgram",
    wxOfficialAccount: "wxOfficialAccount",
    alipayMiniProgram: "alipayMiniProgram",
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
    USER_INFO: "user_info",
    USER_OPEN_ID: "user_open_id"
}
