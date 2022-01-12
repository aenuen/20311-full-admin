<template>
  <div>
    <Row type="flex" align="middle" justify="center">
      <ButtonGroup class="abbott-btn-group" :class="{ editing: isEdit }">
        <Button size="small" :disabled="isEdit">
          <Dropdown @on-click="createMenu">
            <a href="javascript:void(0)">
              <Icon type="md-add" />
              <span class="abbott-dropdown">新增</span>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="bro">兄弟节点</DropdownItem>
              <DropdownItem name="child" :disabled="menuData.length === 0">子节点</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Button>
        <Button size="small" icon="ios-create" type="primary" @click="updateMenu()" :disabled="isEdit">修改</Button>
        <Button size="small" icon="md-trash" type="error" @click="deleteMenu()" :disabled="isEdit">删除</Button>
      </ButtonGroup>
    </Row>
    <Tree ref="tree" :data="menuData" @on-select-change="selectMenu" />
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    menu: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectNode: []
    }
  },
  methods: {
    createMenu (type) {
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.$emit('createMenuEvent', type)
      } else {
        this.$Message.error('请选择菜单节点后再添加！')
      }
    },
    updateMenu () {
      if (this.selectNode.length > 0) {
        this.$emit('updateMenuEvent', { ...this.selectNode[0] })
      } else {
        this.$Message.error('请选择菜单节点后再编辑！')
      }
    },
    selectMenu (item) {
      this.selectNode = item
      this.$emit('selectMenuEvent', item)
    },
    deleteMenu () {
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.$Modal.confirm({
          title: '确定删除吗？',
          content: `删除${this.selectNode[0].title}的菜单项吗？`,
          onOk: () => {
            this.$emit('deleteMenuEvent', this.selectNode[0])
            this.selectNode = []
          }
        })
      } else {
        this.$Message.error('请选择菜单节点后再进行删除！')
      }
    }
  },
  computed: {
    menuData () {
      return this.menu
    }
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1200px) {
  .abbott-btn-group {
    .ivu-icon {
      & + span {
        display: none;
      }
    }

    .abbott-dropdown {
      display: none;
    }
  }
}

.abbott-btn-group {
  .ivu-icon {
    & + span {
      margin-left: 0;
    }
  }

  &.editing {
    a {
      color: #dcdee2;
    }

    .ivu-btn-primary {
      border-color: #dcdee2 !important;
    }

    button:first-child {
      border-right: 0;
    }
  }
}
</style>
