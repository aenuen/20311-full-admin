<template>
  <Form ref="loginForm" :model="postForm" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="username">
      <Input v-model="postForm.username" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person" />
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="postForm.password" placeholder="请输入密码">
        <span slot="prepend"><Icon :size="14" type="md-lock" /></span>
      </Input>
    </FormItem>
    <FormItem prop="authCode">
      <Input class="scoped-login-input" maxlength="4" v-model="postForm.authCode" placeholder="请输入验证码">
        <span slot="prepend">
          <Icon :size="14" type="md-image" />
        </span>
        <span slot="append" class="login-code" v-html="authCode" @click="getCaptcha" />
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import { v4 as uuid } from 'uuid'
import { publicCaptcha } from '@/api/public'

export default {
  name: 'LoginForm',
  props: {
    usernameRules: {
      type: Array,
      default: () => {
        return [
          {
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '电子邮箱格式不正确',
            trigger: 'blur'
          }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            max: 20,
            message: '密码为6-20个字符',
            trigger: 'blur'
          }
        ]
      }
    },
    authCodeRules: {
      type: Array,
      default: () => {
        return [
          {
            required: true,
            message: '验证码不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            len: 4,
            message: '验证码为4个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  data () {
    return {
      postForm: {
        username: 'aenuen@qq.com',
        password: 'ee123123',
        authCode: '',
        sid: ''
      },
      authCode: ''
    }
  },
  computed: {
    rules () {
      return {
        username: this.usernameRules,
        password: this.passwordRules,
        authCode: this.authCodeRules
      }
    }
  },
  mounted () {
    if (localStorage.getItem('sid')) {
      this.postForm.sid = localStorage.getItem('sid')
    } else {
      this.postForm.sid = uuid()
      localStorage.setItem('sid', this.postForm.sid)
    }
    this.$store.commit('setSid', this.postForm.sid)
    this.getCaptcha()
  },
  methods: {
    getCaptcha () {
      publicCaptcha({
        sid: this.$store.state.sid,
        width: 130,
        height: 28,
        fontSize: 40
      }).then(({
        code,
        data
      }) => {
        if (code === 200) {
          this.authCode = data
        }
      })
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', { ...this.postForm })
        }
      })
    }
  }
}
</script>
<style lang="less">
.scoped-login-input {
  .ivu-input-group-append {
    padding: 0;
  }

  .ivu-input-group-prepend {
    width: 32px;
  }
}

.login-code {
  display: inline-block;
  padding: 0;
  height: 28px;
  overflow: hidden;

  svg {
    width: 120px;
    position: relative;
  }
}
</style>
