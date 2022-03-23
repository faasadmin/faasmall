import tool from '../common/tool';

function set(key, data, sync = true) {
	try {
		if (sync) {
			return uni.setStorageSync(key, data);
		} else {
			uni.setStorage({
				key,
				data,
				success: function(res) {

				}
			});
		}
	} catch (e) {
		return false;
	}
}

function get(key, sync = true) {
	try {
		if (sync) {
			return uni.getStorageSync(key);
		} else {
			let val = '';
			uni.getStorage({
				key,
				success: function(res) {
					val = res.data;
				}
			});
			return val;
		}
	} catch (e) {
		return false;
	}
}

/**
 * 值是否不为空
 * @param key    关键字
 * @param sync   是否异步
 * @returns {boolean}
 */
function isNotEmpty(key, sync = true) {
	var content = get(key,sync);
	if(tool.isNotEmpty(content)){
		return true;
	}
	return false;
}

/**
 * 值是否为空
 * @param key    关键字
 * @param sync   是否异步
 * @returns {boolean}
 */
function isEmpty(key, sync = true) {
	var content = get(key,sync);
	if(tool.isEmpty(content)){
		return true;
	}
	return false;
}

function info(sync = false) {
	try {
		if (sync) {
			return uni.getStorageInfoSync();
		} else {
			let val = '';
			uni.getStorageInfo({
				success: function(res) {
					val = res;
				}
			});
			return val
		}
	} catch (e) {
		return false;
	}
}

function remove(key, sync = true) {
	try {
		if (sync) {
			return uni.removeStorageSync(key);
		} else {
			uni.removeStorage({
				key: key
			});
		}
	} catch (e) {
		return false;
	}
}

function clear(sync = true) {
	try {
		if (sync) {
			return uni.clearStorageSync();
		} else {
			uni.clearStorage();
		}
	} catch (e) {
		return false;
	}
}

function has(key, sync = true) {
	try {
		if (sync) {
			return uni.getStorageSync(key) !== null;
		} else {
			let val = false;
			uni.getStorage({
				key: key,
				success: function(res) {
					val = res.data !== null;
				}
			});
			return val;
		}
	} catch (e) {
		return false;
	}
}

const storage = {
	isEmpty,
	isNotEmpty,
	get,
	set,
	info,
	remove,
	clear,
	has
}
export default storage;
