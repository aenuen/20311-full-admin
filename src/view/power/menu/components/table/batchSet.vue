<template>
  <Form ref="postForm" :model="localItem" :label-width="80">
    <FormItem label="请求类型">
      <Select v-model="localItem.method" style="width:200px">
        <Option value="post">POST</Option>
        <Option value="get">GET</Option>
        <Option value="delete">DELETE</Option>
        <Option value="update">UPDATE</Option>
      </Select>
    </FormItem>
    <FormItem label="资源类型">
      <Select v-model="localItem.type" style="width:200px">
        <Option value="api">接口</Option>
        <Option value="btn">按钮</Option>
      </Select>
    </FormItem>
    <FormItem>
      <Button type="primary" class="mr1" @click="ok">确定</Button>
      <Button type="default" class="mr1" @click="no">取消</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  props: {
    showBatchUpdate: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      localItem: {
        method: '',
        type: ''
      }
    }
  },
  methods: {
    ok () {
      const result = {}
      for (const key of Object.keys(this.localItem)) {
        if (this.localItem[key] !== '') {
          result[key] = this.localItem[key]
        }
      }
      this.$emit('batchSetUploadResource', result)
    },
    no () {
      this.$refs.postForm.resetFields()
      this.$emit('closeBatchSet', false)
      this.$Message.info('取消批量设置资料操作')
    }
  }
}
</script>
