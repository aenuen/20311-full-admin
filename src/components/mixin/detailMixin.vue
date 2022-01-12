<script>
export default {
  name: 'MixinDetail',
  methods: {
    noFull () {
      this.$Message.error('需要填写的数据不完整，请注意检查')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
