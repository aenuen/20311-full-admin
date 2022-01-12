<template>
  <div>
    <Form ref="postForm" :model="localItem" :label-width="80" :rules="ruleDetail">
      <FormItem label="资源名称" prop="name">
        <Input v-model="localItem.name" placeholder="请输入资源名称" />
      </FormItem>
      <FormItem label="资源路径" prop="path">
        <Input v-model="localItem.path" placeholder="请输入资源路径" />
      </FormItem>
      <FormItem label="请求类型" prop="method">
        <Select v-model="localItem.method" style="width:200px">
          <Option value="post">POST</Option>
          <Option value="get">GET</Option>
          <Option value="delete">DELETE</Option>
          <Option value="update">UPDATE</Option>
        </Select>
      </FormItem>
      <FormItem label="资源类型" prop="type">
        <Select v-model="localItem.type" style="width:200px">
          <Option value="api">接口</Option>
          <Option value="btn">按钮</Option>
        </Select>
      </FormItem>
      <FormItem label="资源描述">
        <Input type="textarea" v-model="localItem.description" placeholder="请输入资源描述" />
      </FormItem>
      <FormItem>
        <Button type="primary" class="mr1" @click="ok">确定</Button>
        <Button type="default" class="mr1" @click="no">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import detailMixin from '_c/mixin/detailMixin'
import { ruleDetail } from '../../setting/ruleDetail'

export default {
  name: 'MenuDetail',
  mixins: [detailMixin],
  props: {
    updateStatus: {
      type: Boolean,
      default: false
    },
    currentItem: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    currentItem (nVal) {
      this.localItem = { ...nVal }
    }
  },
  data () {
    return {
      ruleDetail,
      showStatus: false,
      localItem: {
        name: '',
        path: '',
        method: '',
        type: '',
        description: ''
      }
    }
  },
  methods: {
    ok () {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          this.$emit('detailUploadResource', { ...this.localItem })
          setTimeout(() => {
            this.$refs.postForm.resetFields()
          }, 0)
          this.$Message.info(this.message)
        } else {
          this.noFull()
        }
      })
    },
    no () {
      this.$refs.postForm.resetFields()
      this.$emit('closeDetail', false)
      this.$Message.info('取消编辑！')
    }
  }
}
</script>
