<template>
  <Form ref="postForm" :model="localItem" :label-width="80" :rules="ruleDetail">
    <FormItem label="角色名称" prop="name">
      <Input v-model="localItem.name" placeholder="请输入角色名称" />
    </FormItem>
    <FormItem label="角色编码" prop="role">
      <Input v-model="localItem.role" placeholder="请输入角色编码" />
    </FormItem>
    <FormItem label="角色描述">
      <Input v-model="localItem.description" placeholder="请输入角色描述" />
    </FormItem>
    <FormItem>
      <Button type="primary" class="mr1" @click="ok">确定</Button>
      <Button type="default" class="mr1" @click="no">取消</Button>
    </FormItem>
  </Form>
</template>

<script>
import detailMixin from '_c/mixin/detailMixin'
import ruleDetail from '../setting/rule_detail'
import { roleDispatch } from '@/api/role'

export default {
  name: 'detail',
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
      localItem: {
        name: '',
        role: '',
        description: ''
      },
      ruleDetail
    }
  },
  methods: {
    ok () {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          if (this.updateStatus) {
            roleDispatch.use('update', this.localItem).then(({
              code,
              data: { modifiedCount }
            }) => {
              if (code === 200 && modifiedCount > 0) {
                this.$emit('detailUpdated', { ...this.localItem })
                this.$Message.success('角色编辑成功！')
              } else {
                this.$Message.error('角色编辑失败！')
              }
            }).catch((err) => {
              this.$Message.error(`角色编辑失败，原因：${err}`)
            })
          } else {
            roleDispatch.use('create', this.localItem).then(({
              code,
              data
            }) => {
              if (code === 200 && data.name !== '') {
                this.$emit('detailCreated', data)
                this.$Message.success('角色新建成功！')
              } else {
                this.$Message.error('角色新建失败！')
              }
            }).catch((err) => {
              this.$Message.error(`角色编辑失败，原因：${err}`)
            })
          }
        } else {
          this.noFull()
        }
      })
    },
    no () {
      this.$emit('closeDetail')
      this.$Message.info(`取消${this.updateStatus ? '编辑' : '新建'}角色操作`)
      setTimeout(() => {
        this.$refs.postForm.resetFields()
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
