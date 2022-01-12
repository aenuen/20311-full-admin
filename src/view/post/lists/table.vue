<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="tableColumns"
        @on-row-edit="openDetailToUpdate"
        @on-row-remove="deleteRow"
        @on-selection-change="checkboxSelect"
        @searchEvent="searchEvent"
      />
      <Row type="flex" justify="space-between" align="middle">
        <Col>
          <Button type="error" icon="md-trash" class="mr1" @click="deleteBatch">批量删除</Button>
          <Button type="warning" icon="md-build" class="mr1" @click="openBatchSet">批量设置</Button>
          <Button style="margin: 10px 0;" type="primary" @click="exportExcel">
            <Icon type="md-download" />
            导出表格
          </Button>
        </Col>
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
      </Row>
    </Card>
    <Modal v-model="isBatchSet" title="批量设置" :closable="false" footer-hide>
      <BatchSet
        :currentTag="tagsList"
        @beginBatchSet="beginBatchSet"
        @closeBatchSet="closeBatchSet"
      />
    </Modal>
    <Modal v-model="isDetail" :title="`${updateStatus?'编辑':'新建'}标签`" :closable="false" footer-hide>
      <Detail
        :updateStatus="updateStatus"
        :currentItem="currentItem"
        :currentTags="tagsList"
        @detailUpdated="detailUpdated"
        @closeDetail="closeDetail"
      />
    </Modal>
  </div>
</template>

<script>
import tableMixin from '_c/mixin/tableMixin'
import Tables from '_c/tables'
import { tableColumns } from './setting/tableColumns'
import Detail from './components/detail'
import BatchSet from './components/batchSet'
import { publicPostList } from '@/api/public'
import { postDispatch } from '@/api/post'

export default {
  name: 'PostTable',
  mixins: [tableMixin],
  components: {
    Tables,
    Detail,
    BatchSet
  },
  data () {
    return {
      tableColumns,
      tagsList: []
    }
  },
  mounted () {
    this.getTagList()
  },
  methods: {
    deleteRow (row, index) { // 删除帖子
      this.$Modal.confirm({
        title: '删除帖子',
        content: `确定要删除第${index + 1}条数据（标题："${row.title}"）吗？`,
        onOk: () => {
          postDispatch.use('batchDel', { ids: [row._id] }).then((res) => {
            if (res.code === 200) {
              this.$Message.success('成功删除！')
              this.tableData = this.tableData.filter((item) => item._id !== row._id)
            }
          }).catch((err) => {
            this.$Message.error('删除失败，原因：' + err)
          })
        },
        onCancel: () => {
          this.$Message.info('取消删除操作')
        }
      })
    },
    deleteBatch () { // 打开批量删除帖子
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
      } else {
        const msg = this.selection.map((o) => o.title).join(',')
        this.$Modal.confirm({
          title: '批量删除',
          content: `确定要删除标题 为“${msg}”的帖子吗？`,
          onOk: () => {
            const arr = this.selection.map((o) => o._id)
            postDispatch.use('batchDel', { ids: arr }).then(({
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
              this.$Message.error('批量删除失败，原因：' + err)
            })
          },
          onCancel: () => {
            this.$Message.info('取消批量删除操作')
          }
        })
      }
    },
    beginBatchSet (settings) { // 开始批量设置
      const msg = this.selection.map((o) => o.title).join(',')
      this.$Modal.confirm({
        title: '批量设置',
        content: `确定批量设置标题为“${msg}”的帖子吗？`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          postDispatch.use('batchSet', {
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
            this.$Message.error('批量设置失败，原因：' + err)
          })
        },
        onCancel: () => {
          this.$Message.info('取消批量设置操作')
        }
      })
    },
    detailUpdated (item) { // 帖子编辑
      this.tableData.splice(this.currentIndex, 1, item)
      this.isDetail = false
      this.updateStatus = false
      this.currentItem = {}
      this.currentIndex = 0
    },
    getList () { // 帖子列表
      publicPostList({
        page: this.page - 1,
        limit: this.limit,
        ...this.option
      }).then(({
        data,
        total
      }) => {
        this.tableData = data
        this.total = total
      })
    },
    getTagList () { // 标签列表
      postDispatch.use('tagList').then(({
        code,
        data
      }) => {
        if (code === 200) {
          this.tagsList = data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
