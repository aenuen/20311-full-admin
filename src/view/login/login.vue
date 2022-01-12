<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" />
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from './components/login-form'
import { mapActions } from 'vuex'

export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleSubmit (LoginForm) {
      this.handleLogin(LoginForm).then(({
        code,
        msg
      }) => {
        if (code === 200) {
          this.$Message.success(msg)
          this.$router.push({
            name: this.$config.homeName
          })
        } else {
          this.$Message.error(msg)
        }
      })
    }
  }
}
</script>

<style>

</style>
