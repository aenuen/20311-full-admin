<template>
  <div>
    <Tables
      ref="tables"
      searchable
      search-place="top"
      v-model="tableData"
      :columns="tableColumns"
      @on-row-edit="openUpdate"
      @on-row-remove="deleteRow"
      @on-selection-change="checkboxSelect"
      @searchEvent="searchEvent"
    >
      <template v-slot:table-header>
        <Button @click="openCreate" class="search-btn ml1" type="primary">
          <Icon type="md-person-add" />
          新增用户
        </Button>
      </template>
    </Tables>
    <Row type="flex" justify="space-between" align="middle">
      <Col class="ctrl">
        <Button type="error" icon="md-trash" class="mr1" @click="deleteBatch">批量删除</Button>
        <Button type="warning" icon="md-build" class="mr1" @click="openBatchSet">批量设置</Button>
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">
          <Icon type="md-download" />
          导出表格
        </Button>
      </Col>
      <Col>
        <Page
          :total="total"
          :current="page"
          :page-size="limit"
          :page-size-opts="pageArr"
          show-elevator
          show-sizer
          show-total
          @on-change="pageChange"
          @on-page-size-change="limitChange"
        />
      </Col>
    </Row>
    <Modal v-model="isBatchSet" title="批量设置" :closable="false" footer-hide>
      <BatchSet
        :currentRoles="currentRoles"
        @beginBatchSet="beginBatchSet"
        @closeBatchSet="closeBatchSet"
      />
    </Modal>
    <Modal v-model="isUpdate" title="新建用户" :closable="false" footer-hide>
      <Update
        :currentItem="currentItem"
        :currentRoles="currentRoles"
        @closeUpdate="closeUpdate"
        @updated="updated"
      />
    </Modal>
    <Modal v-model="isCreate" title="新建用户" :closable="false" footer-hide>
      <Create
        :currentItem="currentItem"
        :currentRoles="currentRoles"
        @closeCreate="closeCreate"
        @created="created"
      />
    </Modal>
  </div>
</template>

<script>
import tableMixin from '_c/mixin/tableMixin'
import Tables from '_c/tables'
import Create from './components/create'
import Update from './components/update'
import BatchSet from './components/batchSet'
import { tableColumns } from './setting/tableColumns'
import { userDispatch } from '@/api/user'
import { roleDispatch } from '@/api/role'

export default {
  name: 'UserList',
  mixins: [tableMixin],
  components: {
    Tables,
    Create,
    Update,
    BatchSet
  },
  data () {
    return {
      tableColumns,
      currentRoles: []
    }
  },
  mounted () {
    this.getRoleNames()
  },
  methods: {
    deleteBatch () { // 批量删除用户
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
      } else {
        const msg = this.selection.map((o) => o.nickname).join(',')
        this.$Modal.confirm({
          title: '批量删除',
          content: `确定要删除昵称为“${msg}”的用户吗？`,
          onOk: () => {
            const arr = this.selection.map((o) => o._id)
            userDispatch.use('batchDel', { ids: arr }).then(({
              code,
              msg
            }) => {
              if (code === 200) {
                this.tableData = this.tableData.filter((item) => !arr.includes(item._id))
                this.$Message.success(msg)
              } else {
                this.$Message.error(msg)
              }
            }).catch((err) => {
              this.$Message.error(`批量删除失败，原因：${err}`)
            })
          },
          onCancel: () => {
            this.$Message.info('取消批量删除操作！')
          }
        })
      }
    },
    beginBatchSet (settings) {
      const msg = this.selection.map((o) => o.nickname).join(',')
      this.$Modal.confirm({
        title: '批量设置',
        content: `确定要设置昵称为“${msg}”的用户吗？`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          userDispatch.use('batchSet', {
            ids: arr,
            settings
          }).then(({
            code,
            msg
          }) => {
            if (code === 200) {
              this.tableData.map((item) => {
                if (arr.includes(item._id)) {
                  for (const keys of Object.keys(settings)) {
                    item[keys] = settings[keys]
                  }
                }
              })
              this.$Message.success(msg)
            } else {
              this.$Message.error(msg)
            }
            this.closeBatchSet()
          }).catch((err) => {
            this.$Message.error(`批量设置失败，原因：${err}`)
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    deleteRow (row, index) {
      this.$Modal.confirm({
        title: '删除用户',
        content: `确定要删除昵称为“${row.nickname}”的用户吗？`,
        onOk: () => {
          userDispatch.use('batchDel', { ids: [row._id] }).then(({
            code,
            msg
          }) => {
            if (code === 200) {
              this.tableData.splice(index, 1)
              this.$Message.success(msg)
            } else {
              this.$Message.error(msg)
            }
          }).catch((err) => {
            this.$Message.error(`删除失败，原因：${err}`)
          })
        },
        onCancel: () => {
          this.$Message.info('取消删除操作！')
        }
      })
    },
    created (item) { // 新建后处理
      this.tableData.splice(0, 0, item)
      this.isCreate = false
    },
    updated (item) { // 新建后处理
      this.isUpdate = false
      this.tableData.splice(this.currentIndex, 1, item)
    },
    getList () { // 获取用户列表
      userDispatch.use('list', {
        page: this.page - 1,
        limit: this.limit,
        options: this.option
      }).then(({
        data,
        total
      }) => {
        this.tableData = data
        this.total = total
      })
    },
    getRoleNames () { // 标签列表
      roleDispatch.use('roles').then(({
        code,
        data
      }) => {
        if (code === 200) {
          this.currentRoles = data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
