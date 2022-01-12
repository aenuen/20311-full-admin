<template>
  <div>
    <Tables
      ref="tables"
      :columns="columns"
      v-model="localData"
      @on-row-edit="openDetailToUpdate"
      @on-row-remove="deleteRow"
      @on-selection-change="checkboxSelect"
    />
    <Row type="flex" justify="space-between" align="middle">
      <Col v-if="isEdit">
        <Button type="error" icon="md-trash" class="mt1 mr1" @click="deleteBatch">批量删除</Button>
        <Button type="warning" icon="md-build" class="mt1 mr1" @click="openBatchSet">批量设置</Button>
        <Button type="primary" icon="md-add" class="mt1 mr1" @click="openDetailToCreate">添加</Button>
      </Col>
      <Col>
        <Page
          v-if="total.length > 0"
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
    <Modal v-model="isDetail" :title="`${updateStatus?'编辑':'新建'}资源`" :closable="false" footer-hide>
      <Detail
        :updateStatus="updateStatus"
        :currentItem="currentItem"
        @closeDetail="closeDetail"
        @detailUploadResource="detailUploadResource"
      />
    </Modal>
    <Modal v-model="isBatchSet" title="批量设置资源" :closable="false" footer-hide>
      <BatchSet
        @closeBatchSet="closeBatchSet"
        @batchSetUploadResource="batchSetUploadResource"
      />
    </Modal>
  </div>
</template>

<script>
import tableMixin from '_c/mixin/tableMixin'
import Tables from '_c/tables'
import Detail from './table/detail'
import BatchSet from './table/batchSet'
import { tableColumns } from '../setting/tableColumns'

export default {
  name: 'resource',
  mixins: [tableMixin],
  components: {
    Tables,
    Detail,
    BatchSet
  },
  props: {
    currentData: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    currentData (nVal) {
      this.localData = nVal
    },
    localData () {
      this.$emit('resourceUpload', this.localData)
    }
  },
  data () {
    return {
      columns: tableColumns,
      localData: []
    }
  },
  methods: {
    openDetailToUpdate (row, index) { // 打开详情模态框-编辑
      if (!this.isEdit) {
        this.$Message.error('非编辑状态，无法进行编辑！')
      } else {
        this.isDetail = true
        this.updateStatus = true
        this.currentIndex = index
        this.currentItem = { ...row }
      }
    },
    detailUploadResource (item) { // 新建|编辑-localData发生变化会通过watch自动传递数据
      if (this.updateStatus) { // 编辑
        this.localData.splice(this.currentIndex, 1, item)
        this.updateStatus = false
      } else { // 新建
        this.localData.push(item)
      }
      this.isDetail = false // 关闭detail模态框
    },
    openBatchSet () { // 打开批量设置
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要批量设置的数据！')
      } else {
        this.isBatchSet = true
      }
    },
    batchSetUploadResource (settings) { // 批量设置-localData发生变化会通过watch自动传递数据
      const msg = this.selection.map((o) => o.name).join(',')
      this.$Modal.confirm({
        title: '批量设置资源',
        content: `确定要批量设置名称为“${msg}”的资源吗？`,
        onOk: () => {
          const arr = this.selection.map((o) => o.name)
          this.localData.map((item, index) => {
            const tmp = { ...item }
            if (arr.includes(tmp.name)) {
              for (const keys of Object.keys(settings)) {
                tmp[keys] = settings[keys]
              }
              this.$set(this.localData, index, tmp)
            }
          })
          this.$Message.success('批量设置资源成功！')
          this.isBatchSet = false
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    deleteRow (row, index) { // 删除资源
      if (!this.isEdit) {
        this.$Message.error('非编辑状态，无法进行删除！')
      } else {
        this.$Modal.confirm({
          title: '删除资源',
          content: `确定要删除名称为“${row.name}”（请求路径：${row.path}）的资源吗？`,
          onOk: () => {
            this.localData.splice(index, 1)
          },
          onCancel: () => {
            this.$Message.info('取消删除操作！')
          }
        })
      }
    },
    deleteBatch () { // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
      } else {
        const msg = this.selection.map((o) => o.name).join(',')
        this.$Modal.confirm({
          title: '批量删除资源',
          content: `确定要批量删除名称为“${msg}”的资源吗？`,
          onOk: () => {
            const arr = this.selection.map((o) => o.name)
            this.localData = this.localData.filter((item) => !arr.includes(item.name))
            this.$Message.success('批量删除成功！')
          },
          onCancel: () => {
            this.$Message.info('取消批量删除操作！')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
