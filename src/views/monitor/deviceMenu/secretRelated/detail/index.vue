<template>
  <a-row style="padding:10px;" class="device-detail">
    <a-affix :offset-top="60" class="affix">
      <a-button :class="['func-menu', currentDataDetail === obj ? 'active' : '']" type="primary" @click="switchMenu(obj)" v-for="(obj, index) in dataList" :key="index">
        {{obj.tab}}
      </a-button>
    </a-affix>
    <a-row style="margin-top: 10px;">
      <a-table
        v-if="currentDataDetail.showType === 'table'"
        :scroll="hasScroll ? { x: 'max-content' } : {}"
        :columns="currentDataDetail.column"
        :data-source="currentDataDetail.data"
        :show-header="currentDataDetail.showHeader"
        :pagination="false"
        :loading="loading"></a-table>
      <template v-if="currentDataDetail.showType === 'echarts' && currentDataDetail.data">
          <a-row  v-for="(val, key) of currentDataDetail.data" v-if="val" :gutter="20" style="margin-top: 20px;" :key="key">
            <a-col :md="24" :lg="6">
              <div class="system-status-col">
                <a-row type="flex" justify="center" style="margin-top:50px;" align="middle">
                  <span>{{val.leftTitle}}</span>
                  <img :src="require('@/assets/image/liantonglv.png')" style="margin-left:10px;height: 10px;width:auto;" alt="">
                </a-row>
                <ve-gauge v-if="key !== 'respTimeList'" :height="'330px'" :series="val.leftSeries"></ve-gauge>
                <a-row v-else style="height:330px;" type="flex" justify="center" align="middle">
                  <span class="data-block" v-for="(o, i) in val.leftSeries.data" :key="i">
                    {{o}}
                  </span>
                </a-row>
                <a-button style="position:absolute;bottom:40px;" :style="{backgroundColor: val.leftBtnBg}" block>{{val.leftBtn}}</a-button>
              </div>
            </a-col>
            <a-col :md="24" :lg="18" v-if="key !== 'memory'">
              <div type="flex" justify="center" class="system-status-col">
                <a-row style="margin-top:50px;">
                  <a-row style="padding-left:10px;" align="middle">
                    <span>{{val.rightTitle}}</span>
                    <img :src="require('@/assets/image/liantonglv.png')" style="margin-left:10px;height: 10px;width:auto;" alt="">
                  </a-row>
                </a-row>
                <ve-line :height="'330px'" :tooltip="val.rightTooltip" :xAxis="val.rightXAxis" :yAxis="val.rightYAxis" :series="val.rightSeries"></ve-line>
              </div>
            </a-col>
            <a-col :md="24" :lg="9" v-if="key === 'memory' && val.memRateList">
              <div type="flex" justify="center" class="system-status-col">
                <a-row style="margin-top:50px;">
                  <a-row style="padding-left:10px;" align="middle">
                    <span>{{val.memRateList.rightTitle}}</span>
                    <img :src="require('@/assets/image/liantonglv.png')" style="margin-left:10px;height: 10px;width:auto;" alt="">
                  </a-row>
                </a-row>
                <ve-line :height="'330px'" :tooltip="val.memRateList.rightTooltip" :xAxis="val.memRateList.rightXAxis" :yAxis="val.memRateList.rightYAxis" :series="val.memRateList.rightSeries"></ve-line>
              </div>
            </a-col>
            <a-col :md="24" :lg="9" v-if="key === 'memory' && val.swpRateList">
              <div type="flex" justify="center" class="system-status-col">
                <a-row style="margin-top:50px;">
                  <a-row style="padding-left:10px;" align="middle">
                    <span>{{val.swpRateList.rightTitle}}</span>
                    <img :src="require('@/assets/image/liantonglv.png')" style="margin-left:10px;height: 10px;width:auto;" alt="">
                  </a-row>
                </a-row>
                <ve-line :height="'330px'" :tooltip="val.swpRateList.rightTooltip" :xAxis="val.swpRateList.rightXAxis" :yAxis="val.swpRateList.rightYAxis" :series="val.swpRateList.rightSeries"></ve-line>
              </div>
            </a-col>
          </a-row>
        </template>
    </a-row>
  </a-row>
</template>

<script>
import { Affix } from 'ant-design-vue';
import { dedicatedDeatil } from '@/api/monitor';
import { dedicatedDetailStaticInfoColumns,
  dedicatedDetailPartitionInfoColumns,
  dedicatedDetailNetInterInfoColumns,
  dedicatedDetailDynamicInfoColumns,
  dedicatedDetailProcessInfoColumns,
  dedicatedDetailDiskIOInfoColumns
} from '../columns';
import { dedicatedDetailStaticInfoKeyMap } from '../constantsMap';
import { VeGauge, VeLine } from 'v-charts/lib';
import { veGaugeChartSeries, xAxis, veLineChartSeries, pingRateRightTooltip, cpuRateTooltip, memRateTooltip, swpRateTooltip, respTimeTooltip } from './contant';
import _ from 'lodash.clonedeep';

export default {
  name: 'MonitorDeviceMenuSecretRelatedDetail',
  components: {
    VeGauge,
    VeLine,
    'a-affix': Affix
  },
  data () {
    return {
      dataList: [],
      currentDataDetail: {},
      hasScroll: false,
      loading: true
    };
  },
  methods: {
    objectToArr (obj) {
      if (!obj) {
        return;
      }
      const arr = [];
      Object.keys(obj).map((item) => {
        arr.push({
          name: dedicatedDetailStaticInfoKeyMap[item],
          content: obj[item]
        });
      });
      return arr;
    },
    handleData (systemStatus) {
      const keys = Object.keys(systemStatus);
      const object = {};
      for (let i = 0; i < keys.length; i++) {
        if (!systemStatus[keys[i]]) {
          break;
        }
        let objRateList = {
          leftTitle: '',
          leftBtn: '',
          leftBtnBg: '',
          rightTitle: '',
          leftSeries: _(veGaugeChartSeries),
          rightSeries: _(veLineChartSeries),
          rightXAxis: _(xAxis),
          rightYAxis: {
            type: 'value',
            axisLabel: {
              color: '#fff',
              formatter (value) {
                return value + '%';
              }
            }
          }
        };
        if (keys[i] === 'cpuRateList') { // 处理器信息
          objRateList = _(objRateList);
          objRateList.leftTitle = 'CPU利用率';
          objRateList.leftBtn = 'CPU信息';
          objRateList.leftBtnBg = 'rgb(122,92,206)';
          objRateList.rightTitle = 'CPU信息';
          objRateList.rightTooltip = cpuRateTooltip;
        } else if (keys[i] === 'pingRateList') { // 连通率
          objRateList = _(objRateList);
          objRateList.leftTitle = '连通率';
          objRateList.leftBtn = '实时连通率';
          objRateList.leftBtnBg = 'rgb(22,88,146)';
          objRateList.rightTitle = '连通率信息';
          objRateList.rightTooltip = pingRateRightTooltip;
        } else if (keys[i] === 'respTimeList') { // 响应时间
          objRateList = _(objRateList);
          objRateList.leftTitle = '响应时间';
          objRateList.leftBtn = '响应时间';
          objRateList.leftBtnBg = 'rgb(28,155,138)';
          objRateList.rightTitle = '响应时间信息';
          objRateList.rightTooltip = respTimeTooltip;
          objRateList.rightYAxis.axisLabel.formatter = (value) => {
            return value + 'ms';
          };
        } else if (keys[i] === 'memRateList') { // 物理内存
          if (!object.memory) {
            object.memory = {};
          }
          objRateList = _(objRateList);
          objRateList.rightTitle = '物理内存信息';
          objRateList.rightTooltip = memRateTooltip;
          object.memory.memRateList = _(objRateList);
        } else if (keys[i] === 'swpRateList') { // 交换内存
          if (!object.memory) {
            object.memory = {};
          }
          objRateList.rightTitle = '交换内存信息';
          objRateList.rightTooltip = swpRateTooltip;
          object.memory.swpRateList = _(objRateList);
        }
        const rateList = systemStatus[keys[i]];
        if (rateList && rateList.length) {
          const obj_ = rateList;
          const o = obj_[0];
          const oValues = Object.values(o);
          objRateList.leftSeries.data = [oValues[0]];
          const times = [];
          const values = [];
          rateList.map((i) => {
            const timeStamp = Object.keys(i)[0];
            const val = Object.values(i)[0];
            times.unshift(timeStamp);
            values.unshift(val);
          });
          objRateList.rightXAxis.data = times;
          objRateList.rightSeries.data = values;
          if (keys[i] === 'respTimeList') {
            let d = [];
            if (values.length) {
              d = Object.values(o)[0].toString().split('');
              d.push(...['m', 's']);
            }
            objRateList.leftSeries.data = d;
          }
          if (keys[i] === 'memRateList' || keys[i] === 'swpRateList') {
            if (!object.memory) {
              object.memory = {};
            }
            object.memory.leftTitle = '内存信息';
            object.memory.leftBtn = '内存信息';
            object.memory.leftBtnBg = 'rgba(192, 120, 88, 1)';
            object.memory.leftSeries = _(veGaugeChartSeries);
            object.memory.leftSeries.data = [systemStatus.currentMem];
            object.memory[keys[i]] = _(objRateList);
          } else {
            object[keys[i]] = objRateList;
          }
        }
      }
      return object;
    },
    async dedicatedDeatil (ip, chType) {
      const data = await dedicatedDeatil({
        ip,
        chType
      });
      this.dataList = [];
      this.loading = false;
      if (data.code === 0) {
        Object.keys(data.data).map((item) => {
          let tab = '';
          let column = [];
          let flag = false;
          let showHeader = true;
          let showType = 'table';
          switch (item) {
            case 'systemStatus':
              showType = 'echarts';
              tab = '系统状态';
              if (data.data[item]) {
                data.data.systemStatus = this.handleData(data.data.systemStatus);
              }
              break;
            case 'staticInfoList':
              tab = '静态信息';
              column = dedicatedDetailStaticInfoColumns;
              if (data.data[item] && data.data[item] instanceof Array && data.data[item].length) {
                data.data[item] = this.objectToArr(data.data[item][0]);
              }
              showHeader = false;
              break;
            case 'dynamicInfoList':
              tab = '动态信息';
              column = dedicatedDetailDynamicInfoColumns;
              break;
            case 'partitionInfoList':
              tab = '文件系统挂载信息';
              column = dedicatedDetailPartitionInfoColumns;
              break;
            case 'netInterInfoList':
              tab = '网络接口信息';
              flag = true;
              data.data[item].sort((a, b) => {
                return Number.parseInt(a.ifIndex) - Number.parseInt(b.ifIndex);
              });
              column = dedicatedDetailNetInterInfoColumns;
              break;
            case 'processInfoList':
              tab = '进程信息';
              column = dedicatedDetailProcessInfoColumns;
              break;
            case 'diskIOInfoList':
              tab = '磁盘IO信息';
              column = dedicatedDetailDiskIOInfoColumns;
              break;
          }
          if (tab) {
            if (data.data[item] && item !== 'systemStatus') {
              data.data[item].map((i, j) => {
                i.key = j;
                data.data[item][j] = i;
              });
              this.dataList.push({
                showType,
                tab,
                column,
                showHeader,
                flag,
                data: data.data[item]
              });
            } else if (item === 'systemStatus') {
              this.dataList.push({
                showType,
                tab,
                column,
                showHeader,
                flag,
                data: data.data[item]
              });
            }
          }
        });
        if (this.dataList.length) {
          this.switchMenu(this.dataList[0]);
        }
      }
    },
    async switchMenu (detail) {
      this.hasScroll = detail.flag;
      await this.$nextTick();
      this.currentDataDetail = detail;
    }
  },
  beforeRouteEnter: (to, from, next) => {
    const { ip, chType } = to.params;
    next((vm) => {
      vm.loading = true;
      vm.dedicatedDeatil(ip, chType);
    });
  }
};
</script>
<style lang="less">
  .device-detail {
    .affix {
      padding: 10px;
      .ant-affix {
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
      }
    }
  }
</style>
<style lang="less" scoped>
  .func-menu {
    margin-left: 10px;
    width: 150px;
    background: #1A4372;
    border-color: #286599;
    &.active {
      background: #286599;
    }
  }
  .system-status-col{
    position: relative;
    border: 1px dotted white;
    // display: flex;
    color: white;
    .ant-btn-block{
      width:80%;
      margin-left:10%;
      color: white;
      border: 1px dotted white;
      cursor: default;
    }
  }
  .data-block{
    display:inline-block;
    width: 25px;
    height:33px;
    line-height: 33px;
    color: white;
    background-color: rgb(0,57,136);
    text-align: center;
    margin-left: 5px;
  }
</style>
