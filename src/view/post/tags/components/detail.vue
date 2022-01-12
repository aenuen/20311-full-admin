<template>
  <Form ref="postForm" :model="localItem" :label-width="80" :rules="detailRules">
    <FormItem label="名称" prop="tagName">
      <Input v-model="localItem.tagName" placeholder="请输入标签名称" />
    </FormItem>
    <FormItem label="类名" prop="tagClass">
      <Select v-model="localItem.tagClass">
        <Option v-for="(item, index) in lists" :key="`tags_${index}`" :value="item">{{ item }}</Option>
      </Select>
    </FormItem>
    <FormItem>
      <Button type="primary" class="mr1" @click="ok">确定</Button>
      <Button type="default" class="mr1" @click="no">取消</Button>
    </FormItem>
  </Form>
</template>
<script>
import detailMixin from '_c/mixin/detailMixin'
import { detailRules } from '../setting/detailRules'
import { postDispatch } from '@/api/post'

export default {
  name: 'PostTagsDetail',
  mixins: [detailMixin],
  props: {
    updateStatus: {
      type: Boolean,
      default: false
    },
    currentItem: {
      type: Object,
      default: () => {
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
      detailRules,
      localItem: {
        tagName: '',
        tagClass: ''
      },
      lists: [
        'layui-bg-red',
        'layui-bg-orange',
        'layui-bg-green',
        'layui-bg-cyan',
        'layui-bg-blue',
        'layui-bg-black',
        'layui-bg-gray'
      ]
    }
  },
  methods: {
    ok () {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          if (this.updateStatus) {
            postDispatch.use('tagUpdate', { ...this.localItem }).then(({
              code,
              msg
            }) => {
              if (code === 200) {
                this.unify(msg)
              } else {
                this.$Message.error(msg)
              }
            }).catch((err) => {
              this.$Message.error(`编辑失败，原因：${err}`)
            })
          } else {
            postDispatch.use('tagCreate', { ...this.localItem }).then(({
              code,
              msg
            }) => {
              if (code === 200) {
                this.unify(msg)
              } else {
                this.$Message.error(msg)
              }
            }).catch((err) => {
              this.$Message.error(`新建失败，原因：${err}`)
            })
          }
        } else {
          this.noFull()
        }
      })
    },
    no () {
      this.$Message.info(`取消${this.updateStatus ? '编辑' : '新建'}操作`)
      this.$emit('closeDetail')
      setTimeout(() => {
        this.$refs.postForm.resetFields()
      }, 0)
    },
    unify (msg) {
      this.$refs.postForm.resetFields()
      this.$Message.success(msg)
      this.$emit('detailUnifyDispose')
    }
  }
}
</script>
