<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
  </a-config-provider>
</template>

<script>
import { mapState } from 'vuex';
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import { AppDeviceEnquire } from '@/utils/mixin';

export default {
  components: {
    'a-config-provider': ConfigProvider
  },
  mixins: [AppDeviceEnquire],
  computed: {
    ...mapState({
      globalLoading: (state) => state.app.globalLoading,
      globalAlertVisible: (state) => state.app.globalAlertVisible,
      globalAlertMessage: (state) => state.app.globalAlertMessage
    })
  },
  data () {
    return {
      locale: zhCN
    };
  }
};
</script>
<style scoped>
  .spin{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 11111;
    background-color: rgba(0,0,0,0.5);
  }
</style>
