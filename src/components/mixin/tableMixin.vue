<script>
export default {
  name: 'MixinTable',
  data () {
    return {
      page: 1, // 当前页
      limit: 10, // 每页显示
      total: 0, // 总页数
      updateStatus: false, // 是否编辑状态
      options: {}, // 搜索条件
      isDetail: false, // 详情模态框状态
      isBatchSet: false, // 批量设置模态框状态
      isCreate: false, // 创建模态框状态
      isUpdate: false, // 编辑模态框状态
      currentIndex: -1, // 当前index
      currentItem: {}, // 当前item
      pageArr: [10, 20, 30, 50, 100], // 每页显示条数选项
      tableData: [], // 表格数据
      selection: [] // 选中的数组内容[0]:Object
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    openDetailToCreate () { // 打开详情创建模态框
      this.isDetail = true
      this.updateStatus = false
      this.currentIndex = -1
      this.currentItem = {}
    },
    closeDetail () { // 关闭详情操作模态框
      this.isDetail = false
    },
    openCreate () {
      this.isCreate = true
      this.currentIndex = -1
      this.currentItem = {}
    },
    closeCreate () {
      this.isCreate = false
    },
    openUpdate (row, index) {
      this.isUpdate = true
      this.currentIndex = index
      this.currentItem = { ...row }
    },
    closeUpdate () {
      this.isUpdate = false
    },
    openDetailToUpdate (row, index) { // 打开详情编辑模态框
      this.isDetail = true
      this.updateStatus = true
      this.currentIndex = index
      this.currentItem = { ...row }
    },
    openBatchSet () { // 打开批量设备模态框
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要编辑的数据！')
      } else {
        this.isBatchSet = true
      }
    },
    closeBatchSet () { // 关闭批量设备模态框
      this.isBatchSet = false
    },
    deleteRow () { // 删除行事件
    },
    deleteBatch () { // 批量删除事件
    },
    pageChange (page) { // 翻页页码改变
      this.page = page
      this.getList()
    },
    limitChange (size) { // 每页条数改变
      this.limit = size
      this.getList()
    },
    checkboxSelect (selection) { // 选中复选框
      this.selection = selection
    },
    checkboxClean () { // 清除复选框
      this.selection = []
    },
    searchEvent (value) { // 搜索事件
      if ((this.option && typeof this.option.search !== 'undefined' && value.search !== this.option.search) || this.option === {}) {
        this.page = 1 // 从1开始
      }
      this.option = value
      this.getList()
    },
    getList () {
    },
    exportExcel () { // 导出
      const { exportCsv } = this.$refs.tables
      exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
