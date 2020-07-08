<template>
  <div class="storelayout-box">
    <header class="contentHeader">{{key==='1'?'仓库配置':(key==='2'?'仓库总览':'变更记录')}}</header>
    <a-tabs :tabBarStyle="{margin:0,background:'#043c68'}" type="card" @change="callback" :style="{minHeight: contentHeight}">
      <a-tab-pane key="1" tab="仓库配置">
        <StoreConfig/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="仓库总览">
        <OverView/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="变更记录">
        <ChangeLog/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import StoreConfig from './storeConfig/StoreConfig';
import OverView from './OverView';
import ChangeLog from './ChangeLog';
export default {
  name: 'StoreLayout',
  components: {
    StoreConfig,
    OverView,
    ChangeLog
  },
  data () {
    return {
      key: '1',
      contentHeight: ''
    };
  },
  methods: {
    callback (key) {
      this.key = key;
    }
  },
  mounted () {
    const bodyStyle = document.body.getBoundingClientRect();
    this.contentHeight = bodyStyle.height - 55 + 'px';
  }
};
</script>
<style lang="less" scoped>
.storelayout-box {
  min-height: 100%;
}
.contentHeader {
  height: 30px;
  line-height: 25px;
  color: #89badd;
  font-size: 15px;
  // background-color: #1d4676;
}
/deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  background: #043c68;
  font-size: 12px;
  border: none;
  border-bottom: none !important;
  border-right: 1px solid #245690;
  margin-right: 0px;
}
/deep/.ant-tabs-bar {
  margin: 0 0 0px 0 !important;
}
/deep/.ant-tabs-bar {
  border-bottom: none !important;
}
/deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active:hover {
  color: #fff !important;
}
/deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  color: #fff !important;
  background: #236aa8 !important;
  border-bottom: none !important;
}
.ant-tabs{
  border: 1px solid #2a5f9c;
  background: #19588C;
}
</style>
