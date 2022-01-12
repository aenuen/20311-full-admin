<template>
  <div>
    <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top">
      <Select class="search-col" @on-select="handleSelect" clearable>
        <template v-for="(item, index) in columns">
          <Option v-if="!item.hidden" :key="`search-col-${item.key}`" :value="index">{{ item.title }}</Option>
        </template>
      </Select>
      <Search :value="searchValue" :item="chooseItem" @changeEvent="handleSearchInput" />
      <Button type="primary" icon="md-search" class="search-btn" @click="handleSearch">搜索</Button>
      <slot name="table-header" />
    </div>
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    >
      <slot name="header" slot="header" />
      <slot name="footer" slot="footer" />
      <slot name="loading" slot="loading" />
      <template slot-scope="{ row, index, column }" slot="action">
        <Icon
          v-if="!column.options || column.options.includes('edit')"
          type="md-build"
          size="22"
          style="cursor: pointer;margin-right: 5px;"
          @click.stop="editRow(row, index)"
        />
        <Icon
          v-if="!column.options || column.options.includes('delete')"
          type="md-trash"
          size="22"
          style="cursor: pointer"
          @click.stop="removeRow(row, index)"
        />
      </template>
    </Table>
    <div
      v-if="searchable && searchPlace === 'bottom'"
      class="search-con search-con-top"
    >
      <Select v-model="searchKey" class="search-col">
        <Option
          v-for="item in columns"
          :value="item.key"
          :key="`search-col-${item.key}`"
        >
          <template v-if="item.key !== 'handle'">{{ item.title }}</template>
        </Option>
      </Select>
      <Input placeholder="输入关键字搜索" class="search-input" v-model="searchValue" />
      <Button class="search-btn" type="primary">
        <Icon type="search" />
        搜索
      </Button>
    </div>
    <a id="hrefToExportTable" style="display: none;width: 0;height: 0;" />
  </div>
</template>

<script>
import TablesEdit from './edit.vue'
import Search from './search'
import handleBtn from './handle-btns'
import './index.less'

export default {
  name: 'Tables',
  components: {
    Search
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default () {
        return ''
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: 'top'
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data () {
    return {
      chooseItem: {
        type: 'input'
      },
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      searchValue: '',
      searchKey: ''
    }
  },
  methods: {
    handleSelect (index) {
      const idx = index.value
      this.chooseItem = this.columns[idx].search
      this.searchKey = this.columns[idx].key
      this.searchValue = ['select', 'date'].includes(this.chooseItem.type) ? [] : ''
    },
    supportEdit (item) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            input: (val) => {
              this.edittingText = val
            },
            'on-start-edit': (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`
              this.$emit('on-start-edit', params)
            },
            'on-cancel-edit': (params) => {
              this.edittingCellId = ''
              this.$emit('on-cancel-edit', params)
            },
            'on-save-edit': (params) => {
              this.value[params.row.initRowIndex][params.column.key] = this.edittingText
              this.$emit('input', this.value)
              this.$emit('on-save-edit', Object.assign(params, { value: this.edittingText }))
              this.edittingCellId = ''
            }
          }
        })
      }
      return item
    },
    supportHandle (item) {
      const options = item.options || []
      const insideBtn = []
      options.forEach((item) => {
        if (handleBtn[item]) {
          insideBtn.push(handleBtn[item])
        }
      })
      const btn = item.button ? [].concat(insideBtn, item.button) : insideBtn
      item.render = (h, params) => {
        params.tableData = this.value
        return h('div', btn.map((item) => item(h, params, this)))
      }
      return item
    },
    handleColumns (columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        if (res.editable) {
          res = this.supportEdit(res, index)
        }
        if (res.key === 'handle') {
          res = this.supportHandle(res)
        }
        return res
      })
    },
    setDefaultSearchKey () {
      this.searchKey = this.columns[0].key !== 'handle' ? this.columns[0].key : this.columns.length > 1 ? this.columns[1].key : ''
    },
    handleSearch () {
      this.$emit('searchEvent', {
        item: this.searchKey,
        search: this.searchValue
      })
    },
    handleSearchInput (item) {
      if (this.chooseItem.type === 'input') {
        this.searchValue = item.target.value // 取得Input组件中的数据
      } else {
        this.searchValue = item
      }
    },
    handleTableData () {
      this.insideTableData = this.value.map((item, index) => {
        const res = item
        res.initRowIndex = index
        return res
      })
    },
    exportCsv (params) {
      this.$refs.tablesMain.exportCsv(params)
    },
    clearCurrentRow () {
      const { clearCurrentRow } = this.$refs.tablesMain
      clearCurrentRow()
    },
    onCurrentChange (currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect (selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel (selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll (selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange (selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange (column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange (row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick (row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick (row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand (row, status) {
      this.$emit('on-expand', row, status)
    },
    editRow (row, index) {
      this.$emit('on-row-edit', row, index)
    },
    removeRow (row, index) {
      this.$emit('on-row-remove', row, index)
    }
  },
  watch: {
    columns (columns) {
      this.handleColumns(columns)
      this.setDefaultSearchKey()
    },
    value () {
      this.handleTableData()
    }
  },
  mounted () {
    this.handleColumns(this.columns)
    this.setDefaultSearchKey()
    this.handleTableData()
  }
}
</script>
