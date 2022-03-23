
/**
 * 处理枚举json数据
 * 返回:
 * {
 *   emList: 对象数组    [{value:1,label:a},{value:2,label:b},{value:3,label:c}]
 *   emMap:  合并对象    {1:a,2:b,3:c}
 * }
 */
export function handleEmData(param) {
  let emList =  Object.values(param);
  let emMap={}
  emList.forEach((em)=>{
    emMap[em.value]=em.label
  })
  return {emList:emList,emMap:emMap};
}


/**
 * 警告弹框
 * @param {Object} title
 * @param {Object} content
 * @param {Object} successCb
 */
export function alert(title, content) {
	return new Promise((resolve, reject)=>{
		uni.showModal({
			title: title,
			content: content,
			showCancel: false,
			success(res) {
				if (res.confirm) {
					resolve(true)
				}
			}
		})
	})
	
}
