<template>
  <div style="background-color: #19588c; padding: 20px;">
    <!-- <h1>配置自动化覆盖率</h1> -->
    <a-row :gutter="16" >
      <a-col :span="6">
        <a-card title="配置统计" :bordered="false" >
          <div ref="myChart1" :style="{height:'350px', width:'100%'}"></div>
        </a-card>
      </a-col>
      <a-col :span="18" class="left" >
        <a-card title="配置总数" :bordered="false">
          <div style="margin: '0 auto'; text-align:center; box-sizing:border-box; height: 20px">
            <a-button v-bind:type="index === 1?'primary':''" @click="click(1)">1h</a-button>
            <a-button v-bind:type="index === 12?'primary':''" @click="click(12)">12h</a-button>
            <a-button v-bind:type="index === 24?'primary':''" @click="click(24)">24h</a-button>
            <a-button v-bind:type="index === 7?'primary':''" @click="click(7)">7d</a-button>
            <a-button v-bind:type="index === 30?'primary':''" @click="click(30)">30d</a-button>
          </div>
          <div>
            <div ref="myLine" :style="{height:'330px', width:'100%'}"></div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { countAutodev, deviceCount } from '@/api/myDevice';
import moment from 'moment';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/pie';
const echarts = require('echarts/lib/echarts');

export default {
  // 配置自动化覆盖率
  name: 'Incidence',
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
      autoFalseData: []
    };
  },
  mounted () {
    deviceCount().then((res) => {
      this.sumAutoFalse = res.data.sumautofalse;
      this.sumAutoTrue = res.data.sumautotrue;
      this.drawLine();
    });
    countAutodev({
      startTime: moment().subtract('hours', 24).format('YYYY-MM-DD HH:mm:00'),
      endTime: moment().format('YYYY-MM-DD HH:mm:00'),
      i: 8
    }).then((res) => {
      this.makeData(res.data);
      this.mountMyLine();
    });
  },
  methods: {
    makeData (data) {
      data.forEach((item) => {
        this.footerName.push(item.starttime);
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
      if (time === 24) {
        i = 8;
      } else if (time === 1) {
        i = 6;
      } else if (time === 12) {
        i = 6;
      } else if (time === 7) {
        i = 7;
      } else if (time === 30) {
        i = 15;
      }
      this.parameter = {
        i,
        startTime: moment().subtract('days', time).format('YYYY-MM-DD HH:mm:00'),
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
        backgroundColor: '#0A3D76',
        title: {
          // text: 'Customized Pie',
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
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
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
              // { value: this.sumAutoFalse, name: '手动配置' },
              // { value: this.sumAutoTrue, name: '自动配置' }
              { value: this.sumAutoFalse, name: '手动配置', itemStyle: { color: '#FFCC22' } },
              { value: this.sumAutoTrue, name: '自动配置', itemStyle: { color: '#FF3333' } }
            ]
          }
        ]
      };
      const myChart1 = echarts.init(this.$refs.myChart1);
      myChart1.setOption(option);
      window.onresize = myChart1.resize;
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
<style scoped>
</style>
