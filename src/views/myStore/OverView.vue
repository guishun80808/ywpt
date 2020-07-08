<template>
  <div class="overview-box">
    <div id="statistics" style="background-color:#19588c;margin-bottom:10px;">
      <div class="headerChild"></div>
      <Statistics></Statistics>
    </div>
    <div id="incidence" style="background-color:#19588c;margin-bottom:10px;">
      <div class="headerChild"></div>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card title="配置自动化覆盖率" :bordered="false" >
            <div ref="myChart1" :style="{height:'350px', width:'100%'}"></div>
          </a-card>
        </a-col>
        <a-col :span="18" class="left" >
          <a-card title="配置趋势" :bordered="false">
            <div class="config">
              <a-button v-bind:type="index === 1?'primary':''" @click="click(1)">1小时</a-button>
              <a-button v-bind:type="index === 12?'primary':''" @click="click(12)">12小时</a-button>
              <a-button v-bind:type="index === 24?'primary':''" @click="click(24)">24小时</a-button>
              <a-button v-bind:type="index === 7?'primary':''" @click="click(7)">7天</a-button>
              <a-button v-bind:type="index === 30?'primary':''" @click="click(30)">30天</a-button>
            </div>
            <div ref="myLine" :style="{height:'330px', width:'100%'}"></div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <div id="frequency" style="background-color:#19588c;margin-bottom:10px;">
      <div class="headerChild"></div>
      <Frequency></Frequency>
    </div>
    <div id="confInto" style="background-color:#19588c;margin-bottom:10px;">
      <div class="headerChild"></div>
      <ConfInto></ConfInto>
    </div>
  </div>
</template>

<script>
import { Anchor } from 'ant-design-vue';
import ConfInto from './overViewChild/ConfInto';
import Frequency from './overViewChild/Frequency';
import Statistics from './overViewChild/Statistics';
import { countAutodev, deviceCount } from '@/api/myDevice';
import moment from 'moment';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/pie';

export default {
  name: 'OverView',
  components: {
    'a-anchor': Anchor,
    'a-anchor-link': Anchor.Link,
    ConfInto,
    Frequency,
    Statistics
  },
  data () {
    return {
      index: 24,
      sumAutoFalse: 0,
      sumAutoTrue: 0,
      // 24h时参数
      parameter: {
        i: 8,
        startTime: moment().format('YYYY-MM-DD HH:mm:00'),
        endTime: '2010-02-20 11:23:00'
      },
      footerName: [],
      autoTrueData: [],
      autoFalseData: [],
      option: {}
    };
  },
  mounted () {
    deviceCount().then((res) => {
      this.sumAutoFalse = res.data.sumautofalse;
      this.sumAutoTrue = res.data.sumautotrue;
      this.drawLine();
    });
    countAutodev({
      startTime: moment().subtract('hours', 24).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      i: 8
    }).then((res) => {
      this.makeData(res.data);
      this.mountMyLine();
    });
  },
  methods: {
    makeData (data) {
      data.forEach((item) => {
        this.footerName.push(item.endtime);
        this.autoTrueData.push(item.sumautotrue);
        this.autoFalseData.push(item.sumautofalse);
      });
    },
    click (time) {
      this.footerName = [];
      this.autoTrueData = [];
      this.autoFalseData = [];
      this.index = time;
      let i = null;
      let text = null;
      if (time === 24) {
        i = 8;
        text = 'hours';
      } else if (time === 1) {
        i = 6;
        text = 'hours';
      } else if (time === 12) {
        i = 6;
        text = 'hours';
      } else if (time === 7) {
        i = 7;
        text = 'days';
      } else if (time === 30) {
        i = 15;
        text = 'days';
      }
      this.parameter = {
        i,
        startTime: moment().subtract(text, time).format('YYYY-MM-DD HH:mm:00'),
        endTime: moment().format('YYYY-MM-DD HH:mm:00')
      };
      this.getData(this.parameter);
    },
    getData (parameter) {
      countAutodev(parameter).then((res) => {
        this.makeData(res.data);
        this.mountMyLine();
      });
    },
    drawLine () {
      const option = {
        color: ['#FFCC22', '#FF3333'],
        title: {
          left: 'center',
          top: 20,
          textStyle: {
            color: '#ccc'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '配置覆盖率',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            width: '80%',
            height: '100%',
            left: 'center',
            label: {
              normal: {
                show: true,
                position: 'center',
                formatter: function (param) {
                  return (param.name === '自动配置') ? param.name + ':' + param.percent + '%' : '';
                },
                textStyle: {
                  fontSize: 20,
                  color: '#fff'
                }
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: this.sumAutoFalse,
                name: '手动配置',
                itemStyle: {
                  color: '#FFCC22'
                }
              },
              {
                value: this.sumAutoTrue,
                name: '自动配置',
                itemStyle: {
                  color: '#FF3333'
                }
              }
            ]
          }
        ]
      };
      const myChart1 = echarts.init(this.$refs.myChart1);
      myChart1.setOption(option);
    },
    mountMyLine () {
      const option1 = {
        // 提升框，鼠标放在折线上时
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        // 配置legend区域颜色
        color: ['#2db7f5', '#ff6600'],
        legend: {
          right: 'right',
          data: ['手动入库', '自动入库'],
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          data: this.footerName,
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            name: '手动入库',
            data: this.autoFalseData,
            type: 'line',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#2db7f5'
                }
              }
            }
          },
          {
            name: '自动入库',
            data: this.autoTrueData,
            type: 'line',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#ff6600'
                }
              }
            }
          }
        ]
      };
      const myLine = echarts.init(this.$refs.myLine);
      myLine.setOption(option1);
      window.onresize = myLine.resize;
    }
  }
};
</script>

<style lang="less" scoped>
  .config {
    margin:0 auto;
    text-align:center;
    button {
      width: 100px;
      height: 40px;
    }
  }
</style>
<style scoped>
.confText{
  border-radius: 30px;
  font-size: 30px;
  text-align: center;
  height: 70px;
  line-height: 70px;
  background-color: #44cef6;
}
.count{
  border-radius: 30px;
  text-align: center;
  line-height: 150px;
  font-size: 80px;
}
.left{
  height: 404px;
}
.overview-box{
  padding: 10px;
  background-color: #19588C;
}
/deep/ .ant-anchor-wrapper .ant-anchor{
  display: flex;
}
/deep/ .ant-anchor-wrapper{
  background-color: rgb(25, 88, 140);
}
/deep/ .ant-anchor-link-title{
  color: #fff;
}
/deep/.ant-card {
  background: none;
}
/deep/.ant-card-head {
  color: #fff;
  font-size: 12px;
  background: #043c68;
  border-bottom: none;
  border-radius: 2px 2px 0 0;
}
/deep/.ant-card-body {
  padding: 0px;
  background: #1a507e;
}
</style>
