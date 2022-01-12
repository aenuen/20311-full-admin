<template>
  <div>
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="tableColumns"
        @on-row-edit="openDetailToUpdate"
        @on-row-remove="deleteEvent"
      />
      <Row type="flex" justify="space-between" align="middle" style="margin-top:10px">
        <Button type="primary" @click="openDetailToCreate">新建标签</Button>
        <Page
          v-if="total>0"
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
    <Modal v-model="isDetail" :title="`${updateStatus?'编辑':'新建'}标签`" :closable="false" footer-hide>
      <Detail
        :updateStatus="updateStatus"
        :currentItem="currentItem"
        @detailUnifyDispose="detailUnifyDispose"
        @closeDetail="closeDetail"
      />
    </Modal>
  </div>
</template>

<script>
import tableMixin from '_c/mixin/tableMixin'
import Tables from '_c/tables'
import Detail from './components/detail'
import { tableColumns } from './setting/tableColumns'
import { postDispatch } from '@/api/post'

export default {
  name: 'TagsTable',
  components: {
    Tables,
    Detail
  },
  mixins: [tableMixin],
  data () {
    return {
      tableColumns
    }
  },
  methods: {
    detailUnifyDispose () { // 创建后编辑后统一处理
      this.currentItem = {}
      this.isDetail = false
      this.updateStatus = false
      this.getList()
    },
    deleteEvent (row) { // 删除行事件
      this.$Modal.confirm({
        title: '删除标签',
        content: `确定要删除标签“${row.tagName}”吗`,
        onOk: () => {
          postDispatch.use('tagDelete', { tid: row._id }).then(({
            code,
            msg
          }) => {
            if (code === 200) {
              this.$Message.info(msg)
              this.tableData = this.tableData.filter((item) => item._id !== row._id)
            } else {
              this.$Message.info('删除失败！原因：' + msg)
            }
          }).catch((err) => {
            this.$Message.info('删除失败！原因：' + err)
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    getList () { // 标签列表
      postDispatch.use('tagList', {
        page: this.page - 1,
        limit: this.limit
      }).then((res) => {
        this.tableData = res.data
        this.total = res.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
