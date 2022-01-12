<template>
  <Row :gutter="10">
    <Col span="6" :xs="24" :sm="24" :md="9" :lg="6">
      <Card :dis-hover="true" :shadow="true">
        <Tree
          :isEdit="isEdit"
          :menu="menuData"
          @createMenuEvent="createMenuEvent"
          @updateMenuEvent="updateMenuEvent"
          @deleteMenuEvent="deleteMenuEvent"
          @selectMenuEvent="selectMenuEvent"
        />
      </Card>
    </Col>
    <Col span="18" :xs="24" :sm="24" :md="15" :lg="18">
      <Card :dis-hover="true" :shadow="true" title="菜单选项" icon="ios-options" style="margin-bottom: 10px">
        <FormData
          :isEdit="isEdit"
          :formData="formData"
          :selectNode="selectNode"
          @cancel="initForm"
          @submit="formSubmit"
        />
      </Card>
      <Card :dis-hover="true" :shadow="true" title="资源选项">
        <Resource
          :isEdit="isEdit"
          :currentData="tableData"
          @resourceUpload="resourceUpload"
        />
      </Card>
    </Col>
  </Row>
</template>

<script>
import Tree from './components/tree'
import FormData from './components/formData'
import Resource from './components/table'
import { formDataItem } from './setting/formDataItem'
import { pmArray, pmTree } from 'plugins-methods'
import { menuDispatch } from '@/api/menu'

export default {
  name: 'Menu',
  components: {
    Tree,
    FormData,
    Resource
  },
  data () {
    return {
      menuData: [],
      selectNode: [],
      isEdit: false,
      formData: formDataItem,
      tableData: [],
      type: ''
    }
  },
  mounted () {
    this.getMenuTree()
  },
  methods: {
    createMenuEvent (type) { // 点击菜单-创建
      this.initForm()
      this.type = type
      this.isEdit = true
    },
    updateMenuEvent (select) { // 点击菜单-编辑
      this.isEdit = true
      this.formData = select
      this.tableData = [...select.operations]
    },
    deleteMenuEvent (select) { // 点击菜单-删除
      const parent = pmTree.treeNodeTop(this.menuData, select)
      if (parent.nodeKey !== select.nodeKey) { // 判断是删除一级菜单 还是删除子菜单，nodeKey不等则为子菜单
        // 删除子菜单
        const parse = JSON.parse(JSON.stringify(parent))
        const data = pmTree.treeDeleteChildren(parse, 'children', '_id', select._id)
        menuDispatch.use('update', data).then((res) => {
          if (res.code === 200) {
            this.$Message.success('删除子菜单成功！')
          }
        })
      } else {
        // 删除一级菜单
        menuDispatch.use('delete', { _id: parent._id }).then((res) => {
          if (res.code === 200) {
            this.$Message.success('删除菜单成功！')
          }
        })
      }
      this.menuData = pmTree.treeNodeDelete(this.menuData, select)
    },
    selectMenuEvent (item) { // 菜单选中
      if (item.length !== 0) {
        if (!this.isEdit) { // 非编辑状态
          this.selectNode = item
          this.formData = item[0]
          this.tableData = [...item[0].operations]
        } else {
          this.$Message.error('当前为编辑状态，请取消编辑后查看！')
        }
      }
    },
    formSubmit (data) { // 提交
      let parent = pmTree.treeNodeTop(this.menuData, this.selectNode[0])
      if (this.tableData.length > 0) {
        data.operations = this.tableData
      } else {
        data.operations = []
      }
      if (this.type === 'bro') { // 兄弟节点
        if (this.menuData.length === 0) { // 没有任何菜单的情况下
          menuDispatch.use('create', data).then(({
            code,
            data
          }) => {
            if (code === 200) {
              this.menuData.push(data)
              this.$Message.success('添加菜单成功！')
              this.menuData = pmTree.treeNodeSort([...this.menuData])
              this.initForm()
            }
          })
        } else { // 在有其它菜单的情况下
          const selectNode = this.selectNode[0]
          if (parent.nodeKey === selectNode.nodeKey) { // 可能是一级节点的兄弟节点
            menuDispatch.use('create', data).then((res) => {
              if (res.code === 200) {
                this.menuData = pmTree.treeNodeInsert(this.menuData, selectNode, res.data)
                this.menuData = pmTree.treeNodeSort([...this.menuData])
                this.$Message.success('添加菜单成功！')
              }
            })
          } else { // 可能是二级节点的兄弟节点
            parent = pmTree.treeNodeTop(this.menuData, selectNode)
            parent.children.push(data)
            menuDispatch.use('update', parent).then((res) => {
              if (res.code === 200) {
                this.$Message.success('添加菜单成功！')
                this.menuData = pmTree.treeNodeSort([...this.menuData])
              }
            })
          }
        }
      } else if (this.type === 'child') { // 子节点
        if (typeof this.selectNode[0].children === 'undefined') {
          this.$set(this.selectNode[0], 'children', [data])
        } else {
          let arr = [...this.selectNode[0].children, data]
          arr = pmArray.arrayOrderByField(arr, 'sort') // 排序
          this.$set(this.selectNode[0], 'children', arr)
        }
        parent = pmTree.treeNodeTop(this.menuData, this.selectNode[0])
        menuDispatch.use('update', parent).then((res) => { // 更新操作
          if (res.code === 200) {
            this.menuData = pmTree.treeNodeSort([...this.menuData])
            this.$Message.success('添加子菜单成功！')
          }
        })
      } else { // 更新菜单节点
        this.menuData = pmTree.treeNodeUpdate(this.menuData, data)
        this.$set(this.selectNode, 0, data)
        parent = pmTree.treeNodeTop(this.menuData, this.selectNode[0])
        menuDispatch.use('update', parent).then((res) => { // 更新操作
          if (res.code === 200) {
            this.menuData = pmTree.treeNodeSort([...this.menuData])
            this.$Message.success('更新菜单成功！')
          }
        })
      }
    },
    resourceUpload (table) { // 资源上传，资源添加或编辑后刷新表格数据
      this.tableData = table
    },
    initForm () { // 重置表单
      this.isEdit = false
      this.type = ''
      this.formData = {
        title: '',
        name: '', // 组件名称
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        link: '',
        redirect: '',
        type: 'menu',
        operations: []
      }
      this.tableData = []
    },
    getMenuTree () { // 获取树形菜单
      menuDispatch.use('tree').then(({
        code,
        data
      }) => {
        if (code === 200) {
          this.menuData = this.treeNodeSort(data)
        }
      })
    },
    treeArraySort (arr, property) {
      return arr.sort((m, n) => m[property] - n[property])
    },
    treeNodeSort (tree, sort) {
      sort = sort || 'sort'
      tree = this.treeArraySort(tree, sort)
      for (let i = 0; i < tree.length; i++) {
        const child = tree[i]
        if (child.children && child.children.length > 0) {
          child.children = this.treeNodeSort(child.children, sort)
        }
        if (child.operations && child.operations.length > 0) {
          child.operations = this.treeNodeSort(child.operations, sort)
        }
      }
      return tree
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
