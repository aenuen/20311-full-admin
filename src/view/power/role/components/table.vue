<template>
  <div>
    <tables
      ref="tables"
      v-model="localData"
      :columns="tableColumns"
      @on-selection-change="onSelectionChange"
    />
    <Row type="flex" justify="space-between" align="middle">
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
  </div>
</template>

<script>
import Tables from '_c/tables'
import tableMixin from '_c/mixin/tableMixin'
import { tableColumns } from '../setting/tableColumns'

export default {
  mixins: [tableMixin],
  components: {
    Tables
  },
  props: {
    resourceData: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    resourceData (nVal) {
      localStorage.setItem('localData', JSON.stringify(nVal))
      this.localData = nVal
    }
  },
  data () {
    return {
      tableColumns,
      localData: []
    }
  },
  methods: {
    onSelectionChange (selection) {
      this.selection = selection
      this.$emit('on-change', selection)
      if (!this.isEdit) {
        setTimeout(() => {
          const tmpData = localStorage.getItem('localData')
          if (typeof tmpData !== 'undefined') {
            this.localData = JSON.parse(tmpData)
          }
          this.$Message.warning('无法修改，请选择权限进行编辑！')
        }, 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
