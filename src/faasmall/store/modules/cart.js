import {addCart, getCartList, updateCart,deleteCart} from "@/faasmall/api/cart";

const state = {
    cartList: [],
    checkCart: {},
    allSelected: false,
    cartNum: 0,
}


const getters = {
    cartList: state => state.cartList,
    checkCart: state => state.checkCart,
    allSelected: state => state.allSelected,
    cartNum: state => state.cartNum,
    // 购物车数量和总价
    totalCount: state => {
        let totalNum = 0;
        let totalPrice = 0;
        state.cartList.filter(item => {
            if (item.checked) {
                totalNum += 1;
                totalPrice += item.number * (item.price ? item.price : 0);
            }
        })
        return {
            totalNum,
            totalPrice
        }
    },

    // 是否选择了商品
    isSel: state => {
        let isSel = false;
        state.cartList.map(item => {
            if (item.checked) {
                isSel = true
            }
        })
        return isSel
    },
}


const mutations = {
    // cart数据获取变动。
    CART_LIST(state, payload) {
        state.cartList = payload;
        let cartListNumber = payload.length;
        if (Number(cartListNumber)) {
            uni.setTabBarBadge({
                index: 2,
                text: String(cartListNumber)
            })
        } else {
            uni.removeTabBarBadge({
                index: 2
            })
        }
        state.cartNum = cartListNumber;
    },

    // 切换全选。
    changeAllSellect(state) {
        state.allSelected = !state.allSelected;
    },
    // 全选设置
    getAllSellectCartList(state, flag) {
        state.cartList.map(item => {
            item.checked = flag
        })
    },
    // 全选检测
    checkCartList(state) {
        let all = true;
        state.cartList.map(item => {
            if (!item.checked) {
                all = false
            }
        })
        state.allSelected = all;
    },
    // 是否购物车数据检测
    getCheckCart(state) {
        let obj = {};
        state.cartList.map(item => {
            obj[item.goods_id] = {
                num: item.goods_num,
                cartOrderId: item.id
            };
        });
        state.checkCart = obj;
    },
}

const actions = {
    //获取购物车数量
    getCartNumber: function ({}) {
        return new Promise((resolve, reject) => {
            getCartList().then(res => {
                if (res.code === 0) {
                    resolve(res.data.length);
                }
            }).catch(e => {
                reject(e)
            })
        });
    },
    // 购物车数据（查）
    getCartList({
                    commit
                }) {
        return new Promise((resolve, reject) => {
            getCartList().then(res => {
                if (res.code === 0) {
                    let cartData = res.data;
                    cartData.length && cartData.map(item => {
                        item.checked = true;
                    })
                    commit('CART_LIST', cartData);
                    commit('checkCartList');
                    commit('getCheckCart')
                }
            }).catch(e => {
                reject(e)
            })
        })
    },
    // 添加到购物车（增）
    addCartGoods({
                     dispatch
                 }, data) {
        return new Promise((resolve, reject) => {
            addCart(data).then(res => {
                res.code === 0 && dispatch('getCartList');
                resolve(res)
            }).catch(e => {
                reject(e)
            });
        })
    },
    updateCart({commit,dispatch}, data) {
        return new Promise((resolve, reject) => {
            updateCart(data).then(res => {
                res.code === 0 && dispatch('getCartList');
                commit('checkCartList');
                resolve(res)
            }).catch(e => {
                reject(e)
            });
        })
    },
    deleteCart({commit,dispatch}, data) {
        return new Promise((resolve, reject) => {
            deleteCart(data).then(res => {
                res.code === 0 && dispatch('getCartList');
                commit('checkCartList');
                resolve(res)
            }).catch(e => {
                reject(e)
            });
        })
    }

}

export default {
    state,
    mutations,
    actions,
    getters
}
