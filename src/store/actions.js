 // Action 可以包含任意异步操作。
  // Action 通过 store.dispatch 方法触发：

 import * as types from './mutation-types'

 function findIndex(list, music) {
   return list.findIndex(item => {
     return item.id === music.id
   })
 }

 // 设置播放列表
 export const setPlaylist = function({ commit }, { list }) {
   commit(types.SET_PLAYLIST, list)
   commit(types.SET_ORDERLIST, list)
 }

 // 选择播放（会更新整个播放列表）
 export const selectPlay = function({ commit }, { list, index }) {
   commit(types.SET_PLAYLIST, list)
   commit(types.SET_ORDERLIST, list)
   commit(types.SET_CURRENTINDEX, index)
   commit(types.SET_PLAYING, true)
 }
