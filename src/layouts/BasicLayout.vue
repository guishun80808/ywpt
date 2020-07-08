<template>
  <a-layout style="min-height: 100vh;">
    <global-header ref="globalHeader" />
    <a-layout class="basic-layout" :style="{minHeight: contentHeight}">
      <a-layout-sider
        :style="{ overflow: 'auto', height: '100vh', position: 'fixed', width: '200px', left: 0 }"
        v-show="!showFucMenu">
        <left-nav-component :menus="menus" @click="menuClick" />
      </a-layout-sider>
      <a-layout-content style="background: #1d4676; padding: 10px 24px; min-height: 100%;" :style="{marginLeft: !showFucMenu ? '200px' : '0px'}">
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { Layout } from 'ant-design-vue';
import RouteView from './RouteView';
import GlobalHeader from '@/components/GlobalHeader';
import { LeftNavComponent } from '@/components/LeftNavComponent';

export default {
  name: 'BasicLayout',
  components: {
    RouteView,
    GlobalHeader,
    LeftNavComponent,
    'a-layout': Layout,
    'a-layout-content': Layout.Content,
    'a-layout-sider': Layout.Sider
  },
  computed: {
    showFucMenu () {
      return this.$route.name === 'zallHome' || this.$route.name === 'login';
    }
  },
  data () {
    return {
      menus: [],
      contentHeight: ''
    };
  },
  mounted () {
    const bodyStyle = document.body.getBoundingClientRect();
    this.contentHeight = bodyStyle.height - 55 + 'px';
  },
  beforeRouteEnter (from, to, next) {
    next(vm => {
      const { addRouters } = vm.$store.getters;
      const { fullPath } = vm.$route;
      const menus = [];
      const currentRouter = addRouters.find(item => fullPath.indexOf(item.path) > -1);
      if (currentRouter) {
        currentRouter.children.forEach(item => {
          if (!item.hidden) {
            const obj = Object.assign(item, { title: item.meta.title });
            obj.icon = item.meta.icon;
            menus.push(obj);
          }
        });
        vm.menus = menus;
      }
    });
  },
  methods: {
    menuClick (index) {
      this.$router.push(this.menus[index]);
    }
  }
};
</script>
<style lang="less">
.page-transition-enter {
  opacity: 0;
}
.page-transition-leave-active {
  opacity: 0;
}
.page-transition-enter .page-transition-container,.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
<style lang="less" scoped>
  @import url(~@/assets/style/less/theme-color.less);
  .basic-layout {
    margin-top: 55px;
    background: radial-gradient(50% 50%, #2065ac, #1c385e);
  }
</style>
