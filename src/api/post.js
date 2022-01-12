import Dispatch from '../libs/dispatch'

export const postDispatch = new Dispatch({
  batchDel: ['/post/batchDel', 'post'], // 批量删除
  batchSet: ['/post/batchSet', 'post'], // 批量编辑
  updatePid: ['/post/updatePid', 'post'], // 编辑
  tagCreate: ['/post/tagCreate', 'post'], // 标签新建
  tagUpdate: ['/post/tagUpdate', 'post'], // 标签编辑
  tagDelete: ['/post/tagDelete', 'post'], // 标签删除
  tagList: ['/post/tagList', 'get'] // 标签列表
})
