<template>
  <Form ref="postForm" :model="localItem" :label-width="80" :rules="ruleUpdate">
    <FormItem label="用户昵称" prop="name">
      <Input v-model="localItem.nickname" placeholder="请输入用户昵称" />
    </FormItem>
    <FormItem label="电子邮箱" prop="email">
      <Input v-model="localItem.email" placeholder="请输入电子邮箱" />
    </FormItem>
    <FormItem label="密码" prop="password">
      <Input type="password" v-model="localItem.password" placeholder="若有输入密码，则修改密码" />
    </FormItem>
    <FormItem label="角色" prop="roles">
      <Select v-model="localItem.roles" multiple>
        <Option v-for="(item, index) in currentRoles" :value="item.role" :key="'roles-' + index">
          {{ item.name }}
        </Option>
      </Select>
    </FormItem>
    <FormItem label="是否禁用">
      <RadioGroup v-model="localItem.status">
        <Radio label="0">否</Radio>
        <Radio label="1">是</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="是否是VIP">
      <RadioGroup v-model="localItem.isVip">
        <Radio label="0">否</Radio>
        <Radio label="1">是</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="用户积分" prop="integral">
      <Input v-model="localItem.integral" style="width: 120px;" />
    </FormItem>
    <FormItem>
      <Button type="primary" class="mr1" @click="ok">确定</Button>
      <Button type="default" class="mr1" @click="no">取消</Button>
    </FormItem>
  </Form>
</template>

<script>
import detailMixin from '_c/mixin/detailMixin'
import { ruleUpdate } from '../setting/ruleUpdate'
import { validateEmail } from '../setting/validateEmail'
import { userDispatch } from '@/api/user'

export default {
  name: 'update',
  mixins: [detailMixin],
  props: {
    currentItem: {
      currentRoles: {
        type: Object,
        default: () => {
        }
      }
    },
    currentRoles: {
      type: Array,
      default: () => []
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
        _id: '',
        nickname: '',
        email: '',
        password: '',
        roles: [],
        status: '0',
        integral: 0,
        gender: '',
        location: '100',
        mobile: '',
        signature: '用户很懒，什么都没有留下~',
        isVip: '0'
      },
      ruleUpdate
    }
  },
  mounted () {
    this.ruleUpdate.email = [
      {
        validator: (rule, value, callback) => {
          if (this.currentItem.email === this.localItem.email) {
            callback()
          } else {
            validateEmail(rule, value, callback)
          }
        },
        trigger: 'blur'
      }
    ]
  },
  methods: {
    ok () {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          userDispatch.use('update', { ...this.localItem }).then(({
            code,
            msg
          }) => {
            if (code === 200) {
              this.$emit('updated', { ...this.localItem })
              setTimeout(() => {
                this.$refs.postForm.resetFields()
              }, 0)
              this.$Message.success(msg)
            } else {
              this.$Message.error((msg))
            }
          }).catch((err) => {
            this.$Message.error(`新建失败，原因：${err}`)
          })
        } else {
          this.noFull()
        }
      })
    },
    no () {
      this.$emit('closeUpdate')
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
