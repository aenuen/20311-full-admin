/**
 * 删除键值
 * @param node
 * @param property
 * @returns {*}
 */
export const deleteKey = (node, property) => {
  if (node.children && node.children.length > 0) {
    node.children.forEach((item) => {
      delete item[property]
      if (item.children && item.children.length > 0) {
        deleteKey(item.children, property)
      }
    })
  }
  return node
}

/**
 * 获取节点的父级节点（一级节点）
 * @param arr
 * @param node
 * @returns {*}
 */
export const getNode = (arr, node) => {
  for (let i = 0; i < arr.length; i++) {
    const currentNode = arr[i]
    // 当前的循环中是否有该节点
    if (currentNode.nodeKey === node.nodeKey) {
      if (!currentNode.parent) {
        deleteKey(currentNode, 'parent') // 删除子节点上的parent属性
        return currentNode
      } else {
        return true
      }
    } else {
      if (currentNode.children && currentNode.children.length > 0) { // 判断子节点中是否有该节点？
        currentNode.children.map((o) => {
          o.parent = currentNode
        })
        if (getNode(currentNode.children, node)) { // 当前循环中是否有该节点
          // 删除子节点上的parent属性
          deleteKey(currentNode, 'parent')
          return currentNode
        }
      }
    }
  }
}

/**
 * 菜单排序
 * @param tree
 * @returns {*}
 */
export const sortMenus = (tree) => {
  tree = sortObj(tree, 'sort')
  if (tree.children && tree.children.length > 0) {
    tree.children = sortMenus(tree.children)
  }
  if (tree.operations && tree.operations.length > 0) {
    tree.operations = sortMenus(tree.operations)
  }
  return tree
}

/**
 * 插入节点
 * @param parent
 * @param select
 * @param data
 * @returns {Array|*}
 */
export const insertNode = (parent, select, data) => {
  // 1. 遍历parent -> select push
  // 2. children -> push child
  // 3. return parent
  for (let i = 0; i < parent.length; i++) {
    const item = parent[i]
    // 去重
    if (item.nodeKey === select.nodeKey) {
      // 排序
      parent.push(data)
      parent = sortObj(parent, 'sort')
      return parent
    } else {
      if (item.children && item.children.length > 0) {
        insertNode(item.children, select, data)
      }
    }
  }
  return parent
}

/**
 * object排序
 * @param {Array} arr
 * @param {String} property
 * @returns {array}
 */
export const sortObj = (arr, property) => {
  return arr.sort((m, n) => m[property] - n[property])
}

/**
 * 更新节点
 * @param tree
 * @param node
 * @returns {*}
 */
export const updateNode = (tree, node) => {
  for (let i = 0; i < tree.length; i++) {
    const currentNode = tree[i]
    if (currentNode.nodeKey === node.nodeKey) {
      tree.splice(i, 1, node)
      return tree
    } else {
      if (currentNode.children && currentNode.children.length > 0) {
        updateNode(currentNode.children, node)
      }
    }
  }
  return tree
}

/**
 * 删除节点
 * @param tree
 * @param node
 * @returns {*}
 */
export const deleteNode = (tree, node) => {
  for (let i = 0; i < tree.length; i++) {
    const currentNode = tree[i]
    if (currentNode.nodeKey === node.nodeKey) {
      tree.splice(i, 1)
      return tree
    } else {
      if (currentNode.children && currentNode.children.length > 0) {
        deleteNode(currentNode.children, node)
      }
    }
  }
  return tree
}

/**
 *
 * @param tree
 * @param nodes
 * @param property
 * @param flag
 * @returns {*}
 */
export const modifyNode = (tree, nodes, property, flag) => {
  for (let i = 0; i < tree.length; i++) {
    // 遍历整个树
    const currentNode = tree[i]
    if (nodes && nodes.length > 0) {
      // 传递了需要设置的节点（权限 ）
      if (nodes.includes(currentNode._id)) {
        const tmp = { ...currentNode }
        tmp[property] = flag
        tree.splice(i, 1, tmp)
      }
    } else {
      // 无节点，无需要特别设置的节点权限，统一去设置整个树形菜单
      const tmp = { ...currentNode }
      tmp[property] = flag
      tree.splice(i, 1, tmp)
    }
    if (currentNode.children && currentNode.children.length > 0) {
      modifyNode(currentNode.children, nodes, property, flag)
    }
    // _checked 或者 _selected 参考：https://www.iviewui.com/components/table 说明
    if (currentNode.operations && currentNode.operations.length > 0) {
      modifyNode(currentNode.operations, nodes, '_' + property, flag)
    }
  }
  return tree
}

export const deleteChildren = (ary, id) => {
  return ary
}
