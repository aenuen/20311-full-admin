<template>
  <div>
    <Row :gutter="10">
      <Col span="5" :sm="24" :md="24" :lg="5">
        <Card :dis-hover="true" :shadow="true">
          <p slot="title">
            <Icon type="md-contacts" />
            角色列表
          </p>
          <a slot="extra" @click.prevent="openDetailToCreate" v-if="!isEdit">
            <Icon type="md-add" />
            新建
          </a>
          <ul class="abbott-card">
            <li
              v-for="(item, index) in roles"
              :key="'roles' + index"
              :class="{ selected: roleIndex === index }"
              class="flex"
              @click="selectRole(index)"
            >
              <div class="flex1 round">{{ item.name }}</div>
              <span>
                <Icon type="ios-create" size="16" @click.stop="openDetailToUpdate(item, index)" />
                <Icon type="md-build" size="16" color="#2d8cf0" @click.stop="deployRole(item, index)" />
                <Icon type="md-trash" size="16" color="#ed4014" @click.stop="deleteRole(item, index)" />
              </span>
            </li>
          </ul>
        </Card>
      </Col>
      <Col span="6" :sm="24" :md="8" :lg="6">
        <Card :dis-hover="true" :shadow="true" title="菜单权限" icon="md-menu">
          <div slot="extra">
            <ButtonGroup class="abbott-btn-group" v-if="isEdit">
              <Button size="small" icon="ios-create" type="primary" @click="ok()">确定</Button>
              <Button size="small" icon="md-trash" @click="no()">取消</Button>
            </ButtonGroup>
          </div>
          <Tree
            :data="menuData"
            show-checkbox
            @on-select-change="menuSelect"
            @on-check-change="menuCheck"
          />
        </Card>
      </Col>
      <Col span="13" :sm="24" :md="16" :lg="13">
        <Card title="资源分配" icon="md-exit" :dis-hover="true" :shadow="true">
          <Table
            :resourceData="tableData"
            :isEdit="isEdit"
            @on-change="resourceChange"
          />
        </Card>
      </Col>
    </Row>
    <Modal v-model="isDetail" :title="`${updateStatus?'编辑':'新建'}标签`" :closable="false" footer-hide>
      <Detail
        :updateStatus="updateStatus"
        :currentItem="currentItem"
        @detailCreated="detailCreated"
        @detailUpdated="detailUpdated"
        @closeDetail="closeDetail"
      />
    </Modal>
  </div>
</template>

<script>
import tableMixin from '_c/mixin/tableMixin'
import Detail from './components/detail'
import Table from './components/table'
import { menuDispatch } from '@/api/menu'
import { roleDispatch } from '@/api/role'
import { pmTree } from 'plugins-methods'

export default {
  name: 'RoleMain',
  mixins: [tableMixin],
  components: {
    Detail,
    Table
  },
  data () {
    return {
      menuData: [],
      roles: [],
      tableData: [],
      isEdit: false,
      roleIndex: '',
      selectNode: []
    }
  },
  mounted () {
    this.getMenuTree()
  },
  methods: {
    selectRole (value) { // 选中角色
      if (this.roleIndex === '' || this.roleIndex !== value) {
        this.roleIndex = value
        pmTree.treeNodeModify(this.menuData, null, 'checked', false)
        this.tableData = []
        if (this.roles[this.roleIndex].menu.length === 0) {
          return
        }
        // 修改右侧菜单树 + 权限列表的选中状态
        const tmpData = pmTree.treeNodeModify(this.menuData, this.roles[this.roleIndex].menu, 'checked', true)
        localStorage.setItem('menuData', JSON.stringify(tmpData))
        if (this.selectNode.length > 0 && this.selectNode[0].operations) {
          this.tableData = this.selectNode[0].operations
        }
      } else {
        pmTree.treeNodeModify(this.menuData, null, 'checked', false)
        this.tableData = []
        this.roleIndex = ''
      }
    },
    deployRole (item, index) { // 配置角色
      this.isEdit = true
      this.roleIndex = index
    },
    deleteRole (item, index) { // 删除角色
      this.$Modal.confirm({
        title: '删除角色',
        content: `确定要删除名称为“${item.name}”的角色吗？`,
        onOk: () => {
          roleDispatch.use('delete', { _id: item._id }).then(({
            code,
            data: { deletedCount }
          }) => {
            if (code === 200 && deletedCount === 1) {
              this.roles.splice(index, 1)
              this.$Message.success('删除角色成功！')
            } else {
              this.$Message.success('删除角色失败！')
            }
          }).catch((err) => {
            this.$Message.error(`角色编辑失败，原因：${err}`)
          })
        },
        onCancel: () => {
          this.$Message.info('取消删除角色操作！')
        }
      })
    },
    detailUpdated (data) { // 编辑角色-处理
      this.roles.splice(this.currentIndex, 1, data)
      this.isDetail = false
      this.updateStatus = false
      this.currentItem = {}
    },
    detailCreated (data) { // 新建角色-处理
      this.roles.push(data)
      this.isDetail = false
    },
    menuSelect (item) { // 菜单选中
      if (item.length > 0) {
        this.selectNode = item
        this.tableData = [...item[0].operations]
      }
    },
    menuCheck () { // 菜单打勾
      if (!this.isEdit) {
        const tmpData = localStorage.getItem('menuData')
        if (typeof tmpData !== 'undefined') {
          this.menuData = JSON.parse(tmpData)
        }
        this.$Message.warning('无法修改，请选择权限进行编辑！')
      }
    },
    ok () {
      this.isEdit = false
      localStorage.setItem('menuData', JSON.stringify(this.menuData))
      const menus = pmTree.treePropertyIds(this.menuData, ['children', 'operations'])
      const tmp = { ...this.roles[this.roleIndex] }
      tmp.menu = menus
      this.roles.splice(this.roleIndex, 1, tmp)
      roleDispatch.use('update', tmp).then(({
        code,
        data: { modifiedCount }
      }) => {
        if (code === 200 && modifiedCount === 1) {
          this.$Message.success('更新角色权限成功！')
        }
      })
    },
    no () {
      this.isEdit = false
      const tmpData = localStorage.getItem('menuData')
      if (typeof tmpData !== 'undefined') {
        this.menuData = JSON.parse(tmpData)
        this.tableData = []
        this.selectNode = []
      }
    },
    resourceChange (table) { // 资源选中
      const ids = table.map((o) => o._id)
      if (this.selectNode.length > 0 && this.selectNode[0].operations) {
        this.selectNode[0].operations.forEach((item) => {
          item._checked = ids.includes(item._id)
        })
      }
    },
    getMenuTree () { // 获取树形菜单
      menuDispatch.use('tree').then(({
        code,
        data
      }) => {
        if (code === 200) {
          this.menuData = data
          localStorage.setItem('menuData', JSON.stringify(this.menuData))
        }
      })
    },
    getList () {
      roleDispatch.use('roles').then(({
        code,
        data
      }) => {
        if (code === 200) {
          this.roles = data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.abbott-card {
  li {
    list-style: none;
    line-height: 24px;
  }

  span {
    display: none;

    i {
      margin-right: 5px;
    }
  }

  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-flow: row nowrap;

    &:hover {
      span {
        display: block;
      }

      .flex1 {
        background-color: #eaf4fe;
      }
    }

    &.flex1 {
      flex: 1;
    }

    &.selected {
      .flex1 {
        background-color: #d5e8fc;
      }
    }
  }

  .round {
    padding: 2px 3px;
    border-radius: 3px;
  }
}
</style>
<style lang="scss">
@media screen and (max-width: 1200px) {
  .abbott-btn-group {
    .ivu-icon {
      & + span {
        display: none;
      }
    }

    .abbott-btn-group {
      display: none;
    }
  }
}

.abbott-btn-group {
  .ivu-icon {
    & + span {
      margin-left: 0;
    }
  }

  &.editing {
    a {
      color: #dcdee2;
    }

    .ivu-btn-primary {
      border-color: #dcdee2 !important;
    }

    button:first-child {
      border-right: 0;
    }
  }
}
</style>
