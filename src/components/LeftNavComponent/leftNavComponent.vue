<template>
  <div class="left-nav">
    <slot name="top"></slot>
    <a-menu
      @click="click"
      mode="inline"
      theme="dark"
      :selected-keys="customKeys.length ? customKeys : selectedKeys"
      :inline-collapsed="collapsed"
    >
      <a-menu-item v-for="(menu, index) in menus" :key="index">

        <a-row type="flex" justify="space-between" align="middle">
          <div>
            <a-icon v-if="menu.icon" :type="menu.icon" />
            <span>{{menu[titleKey]}}</span>
          </div>
          <a-popover overlay-class-name="custom-popover-class-name" placement="bottom" v-if="funcs && menu.hasAction">
            <a-row type="flex" style="flex-direction: column;" class="funcs-content" slot="content">
              <a v-for="(func, i) in funcs.menus" :key="i" @click="funcItemClick(menu, i)">{{func}}</a>
            </a-row>
            <a-icon :type="funcs.icon" />
          </a-popover>
        </a-row>
      </a-menu-item>
    </a-menu>
    <slot name="bottom"></slot>
  </div>
</template>
<script>
import { Popover } from 'ant-design-vue';
export default {
  components: {
    'a-popover': Popover
  },
  computed: {
    selectedKeys () {
      const { menus } = this.$props;
      const selectedKey = menus.findIndex(item => this.$route.name.startsWith(item.name));
      const selectedKeys = [];
      if (selectedKey > -1) {
        selectedKeys.push(selectedKey);
      }
      return selectedKeys;
    }
  },
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    customKeys: {
      type: Array,
      default: () => []
    },
    titleKey: {
      type: String,
      default: 'title'
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    funcs: {
      type: Object,
      default: null
    }
  },
  methods: {
    click (e) {
      this.$emit('click', e.key);
    },
    funcItemClick (menu, index) {
      this.$emit('funcItemClick', menu, index);
    }
  }
};
</script>
<style lang="less">
  .custom-popover-class-name {
    & > .ant-popover-content{
      & > .ant-popover-inner{
        .ant-popover-inner-content{
          padding: 0 !important;
          width: 70px;
          a {
            display:inline-block;
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            &:hover {
              background: #3693D6;
            }
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .left-nav {
    min-height: 100%;
    padding-top: 20px;
    position: relative;
    background: #1a4372;
    .ant-menu-dark {
      background: initial;
      color: #81c6f1;
      max-width: 200px;
      .ant-menu-sub {
        background: initial;
        color: #81c6f1;
      }
      .ant-menu-item{
        color: #81c6f1;
        &:hover {
          background: #286599;
          color: #fff;
        }
        &.ant-menu-item-selected {
          background: #286599;
          color: #fff;
        }
      }
      &.ant-menu-inline-collapsed {
        width: 80px;
      }
    }
  }
</style>
