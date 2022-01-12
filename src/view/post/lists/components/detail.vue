<template>
  <Form ref="postForm" :model="localItem" :rules="detailRules" :label-width="80">
    <FormItem label="标题" prop="title">
      <Input v-model="localItem.title" placeholder="请输入帖子标题" />
    </FormItem>
    <FormItem label="分类">
      <Select v-model="localItem.catalog">
        <Option v-for="(item,index) in catalogs" :key="`catalogs_${index}`" :value="item.value">
          {{ item.key }}
        </Option>
      </Select>
    </FormItem>
    <FormItem label="是否结束">
      <RadioGroup v-model="localItem.isEnd">
        <Radio label="0">未结束</Radio>
        <Radio label="1">已结贴</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="回复状态">
      <RadioGroup v-model="localItem.status">
        <Radio label="0">打开回复</Radio>
        <Radio label="1">禁止回复</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="是否置顶">
      <RadioGroup v-model="localItem.isTop">
        <Radio label="0">未置顶</Radio>
        <Radio label="1">已置顶</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="帖子积分">
      <Slider v-model="formatIntegral" show-input :step="10" />
    </FormItem>
    <FormItem label="标签">
      <Select v-model="formatTags" multiple>
        <Option v-for="(item, index) in tagsList" :value="item.tagName" :key="'editTags-' + index">
          {{ item.tagName }}
        </Option>
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
import { catalogs } from '../setting/catalogs'
import { detailRules } from '../setting/detailRules'
import { postDispatch } from '@/api/post'

export default {
  name: 'PostDetail',
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
    },
    currentTags: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    currentItem (nVal) {
      this.localItem = { ...nVal }
    },
    currentTags (nVal) {
      this.tagsList = nVal
    }
  },
  computed: {
    formatIntegral: {
      get () {
        return parseInt(this.localItem.integral)
      },
      set (value) {
        this.localItem.integral = value
      }
    },
    formatTags: {
      get () {
        if (this.localItem.tags) {
          return this.localItem.tags.map((o) => o.name)
        } else {
          return [{
            class: '',
            name: ''
          }]
        }
      },
      set (value) {
        const arr = this.tagsList.filter((item) => value.indexOf(item.tagName) !== -1)
        this.localItem.tags = arr.map((o) => {
          return {
            class: o.tagClass,
            name: o.tagName
          }
        })
      }
    }
  },
  data () {
    return {
      detailRules,
      catalogs,
      tagsList: [],
      localItem: {
        tid: '',
        uid: '',
        title: '',
        content: '',
        created: '',
        catalog: '',
        fav: 0,
        isEnd: '0',
        reads: 0,
        answer: 0,
        status: '0',
        isTop: '0',
        sort: 'created',
        tags: []
      }
    }
  },
  methods: {
    ok () {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          postDispatch.use('updatePid', this.localItem).then(({
            code,
            msg
          }) => {
            if (code === 200) {
              this.$Message.success(msg)
              this.$emit('detailUpdated', this.localItem)
              setTimeout(() => {
                this.$refs.postForm.resetFields()
              }, 0)
            } else {
              this.$Message.error(msg)
            }
          }).catch((err) => {
            this.$Message.error(`编辑失败，原因：${err}`)
          })
        } else {
          this.noFull()
        }
      })
    },
    no () {
      this.$emit('closeDetail')
      this.$Message.info('取消编辑操作')
      setTimeout(() => {
        this.$refs.postForm.resetFields()
      }, 0)
    }
  }
}
</script>
