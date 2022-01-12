<template>
  <Form ref="postForm" :model="localItem" :rules="batchSetRules" :label-width="80">
    <FormItem label="分类" prop="catalog">
      <Select v-model="localItem.catalog">
        <Option v-for="(item, index) in catalogs" :value="item.value" :key="'catalog-' + index">
          {{ item.key }}
        </Option>
      </Select>
    </FormItem>
    <FormItem label="标签">
      <Select v-model="localItem.tags" multiple>
        <Option v-for="(item, index) in tagsList" :value="item._id" :key="'tags-' + index">
          {{ item.tagName }}
        </Option>
      </Select>
    </FormItem>
    <FormItem label="是否结束">
      <RadioGroup v-model="localItem.isEnd">
        <Radio label="">不设置</Radio>
        <Radio label="0">否</Radio>
        <Radio label="1">是</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="关闭评论">
      <RadioGroup v-model="localItem.status">
        <Radio label="">不设置</Radio>
        <Radio label="0">打开回复</Radio>
        <Radio label="1">关闭回复</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="是否置顶">
      <RadioGroup v-model="localItem.isTop">
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
import { catalogs } from '../setting/catalogs'
import { batchSetRules } from '../setting/batchSetRules'

export default {
  name: 'PostBatchSet',
  mixins: [detailMixin],
  props: {
    currentTag: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    currentTag (nVal) {
      this.tagsList = nVal
    }
  },
  data () {
    return {
      catalogs,
      batchSetRules,
      showStatus: false,
      tagsList: [],
      localItem: {
        catalog: '',
        status: '',
        isEnd: '',
        isTop: '',
        tags: []
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
              this.tagsList.map((o) => {
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
      this.$Message.info('取消批量删除操作')
      setTimeout(() => {
        this.$refs.postForm.resetFields()
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
