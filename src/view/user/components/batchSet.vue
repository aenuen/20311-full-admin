<template>
  <Form ref="postForm" :model="localItem" :label-width="80" :rules="ruleBatchSet">
    <FormItem label="角色" prop="roles">
      <Select v-model="localItem.roles" multiple>
        <Option v-for="(item, index) in currentRoles" :value="item.role" :key="'roles-' + index">
          {{ item.name }}
        </Option>
      </Select>
    </FormItem>
    <FormItem label="是否禁用">
      <RadioGroup v-model="localItem.status">
        <Radio label="">不设置</Radio>
        <Radio label="0">否</Radio>
        <Radio label="1">是</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="是否是VIP">
      <RadioGroup v-model="localItem.isVip">
        <Radio label="">不设置</Radio>
        <Radio label="0">否</Radio>
        <Radio label="1">是</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem>
      <Button type="primary" class="mr1" @click="ok">确定</Button>
      <Button type="default" class="mr1" @click="no">取消</Button>
    </FormItem>
  </Form>
</template>

<script>
import detailMixin from '_c/mixin/detailMixin'
import { ruleBatchSet } from '../setting/ruleBatchSet'

export default {
  name: 'batchSet',
  mixins: [detailMixin],
  props: {
    currentRoles: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      ruleBatchSet,
      localItem: {
        status: '',
        isVip: '',
        roles: []
      }
    }
  },
  methods: {
    ok () {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          const result = {}
          for (const key of Object.keys(this.localItem)) {
            const tags = []
            if (key === 'tags' && this.localItem.tags.length > 0) {
              this.tags.map((o) => {
                if (this.localItem.tags.includes(o._id)) {
                  tags.push({
                    class: o.tagClass,
                    name: o.tagName
                  })
                }
              })
              this.localItem[key] = tags
            }
            if (this.localItem[key] !== '') {
              result[key] = this.localItem[key]
            }
          }
          this.$emit('beginBatchSet', result)
          setTimeout(() => {
            this.$refs.postForm.resetFields()
          }, 0)
        } else {
          this.noFull()
        }
      })
    },
    no () {
      this.$emit('closeBatchSet')
      this.$Message.info('取消新建操作')
      setTimeout(() => {
        this.$refs.postForm.resetFields()
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
