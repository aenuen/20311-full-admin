<template>
  <Form ref="postForm" :model="localItem" :label-width="100" :rules="ruleCreate">
    <FormItem label="电子邮箱" prop="email">
      <Input prefix="md-mail" v-model="localItem.email" placeholder="请输入电子邮箱" />
    </FormItem>
    <FormItem label="密码" prop="password">
      <Input prefix="md-lock" v-model="localItem.password" placeholder="请输入密码" />
    </FormItem>
    <FormItem label="角色" prop="roles">
      <Select v-model="localItem.roles" multiple>
        <Option v-for="(item, index) in currentRoles" :value="item.role" :key="'roles-' + index">
          {{ item.name }}
        </Option>
      </Select>
    </FormItem>
    <FormItem label="用户昵称" prop="nickname">
      <Input prefix="md-person" v-model="localItem.nickname" placeholder="请输入用户昵称" />
    </FormItem>
    <FormItem label="手机" prop="mobile">
      <Input v-model="localItem.mobile" placeholder="请输入用户手机号" />
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
    <FormItem label="所在城市">
      <Input prefix="md-pin" v-model="localItem.location" placeholder="请输入用户所在城市" />
    </FormItem>
    <FormItem label="性别">
      <RadioGroup v-model="localItem.status">
        <Radio label="0">男</Radio>
        <Radio label="1">女</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="个性签名">
      <Input type="textarea" v-model="localItem.signature" placeholder="请输入用户个性签名" />
    </FormItem>
    <FormItem>
      <Button type="primary" class="mr1" @click="ok">确定</Button>
      <Button type="default" class="mr1" @click="no">取消</Button>
    </FormItem>
  </Form>
</template>

<script>
import { ruleCreate } from '../setting/ruleCreate'
import { userDispatch } from '@/api/user'

export default {
  name: 'detail',
  props: {
    currentRoles: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      localItem: {
        nickname: '',
        email: '',
        password: '',
        roles: [],
        status: '0',
        integral: 100,
        gender: '',
        location: '',
        mobile: '',
        signature: '用户很懒，什么都没有留下~',
        isVip: '0'
      },
      ruleCreate
    }
  },
  methods: {
    ok () {
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          userDispatch.use('create', { ...this.localItem }).then(({
            code,
            msg
          }) => {
            if (code === 200) {
              setTimeout(() => {
                this.$refs.postForm.resetFields()
              }, 0)
              this.$Message.success(msg)
              this.$emit('created', { ...this.localItem })
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
      this.$emit('closeCreate')
      this.$Message.info('取消新建操作')
      setTimeout(() => {
        this.$refs.postForm.resetFields()
      }, 0)
    },
    noFull () {
      this.$Message.error('需要填写的数据不完整，请注意检查')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
