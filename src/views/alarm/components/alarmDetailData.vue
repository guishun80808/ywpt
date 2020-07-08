<template>
<!-- 告警详情 -->
  <a-drawer
    :title="title"
    width="50%"
    :visible="detailsVisible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="告警详情" class="test">
        <a-collapse v-model="activeKey" :bordered="false" expand-icon-position="right" defaultActiveKey="1">
          <a-collapse-panel key="1">
            <div slot="header" style="color: #17A1E6;">基本信息</div>
            <p>告警名称：{{ detailData.name }}</p>
            <p>告警来源：{{ detailData.typeName }}</p>
            <p>IP：{{ detailData.ip }}</p>
            <p>告警内容：{{ detailData.content }}</p>
            <p>告警级别：{{ detailData.level }}</p>
            <p>监控类别：{{ detailData.indexName }}</p>
            <p>创建时间: {{ detailData.createtime }}</p>
            <p>最后发生: {{ detailData.lasttime }}</p>
            <p>告警次数: {{ detailData.alarmcount }}</p>
            <p>告警阈值: {{ detailData.alarmlevel }}</p>
            <p>告警实际值: {{ detailData.alarmvalue }}</p>
            <p>处理状态：{{ detailData.status }}</p>
            <p>处理人：{{ detailData.dealuser }}</p>
            <p>处理时间：{{ detailData.dealtime }}</p>
            <p>处理信息: {{ detailData.msg }}</p>
          </a-collapse-panel>
        </a-collapse>
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>
<script>
import { Drawer, Collapse } from 'ant-design-vue';
import ACollapsePanel from 'ant-design-vue/es/vc-collapse/src/Panel';
import { findAlarmById } from '@/api/alarm';
import { levelConstant, statusConstant } from '../components/pageConstant';
export default {
  name: 'alarmDetailData',
  components: {
    'a-drawer': Drawer,
    'a-collapse': Collapse,
    ACollapsePanel
  },
  props: ['title', 'detailsVisible'],
  data () {
    return {
      detailData: [], // 告警详情数据
      activeKey: ['1'], // 折叠面板
      detailId: ''
    };
  },
  mounted () {
    this.monitoring(); // 注册监听事件
  },
  methods: {
    monitoring () { // 监听事件
      this.$on('sendId', (res) => {
        this.detailId = res;
      });
    },
    async getAlarmInfo () {
      // 查询每条告警的详情
      const params = {
        id: this.detailId
      };
      const res = await findAlarmById(params);
      if (res.code === 0) {
        this.detailData = res.data[0];
        this.detailData.level = levelConstant(this.detailData.level);
        this.detailData.status = statusConstant(this.detailData.status);
      }
    },
    // 关闭抽屉-告警详情
    onClose () {
      this.$emit('handleCloseDrawer', false);
    }
  }
};
</script>
<style lang="less" scope>
/deep/.ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow {
  color: #17A1E6;
}
.ant-collapse-borderless .ant-collapse-item {
  border-bottom: none !important;
}
.ant-collapse .ant-collapse-item {
  border-bottom: none !important;
}
</style>
