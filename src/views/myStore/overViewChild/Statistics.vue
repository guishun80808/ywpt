<template>
  <div style="background-color:#19588c;">
    <!-- <h1>配置统计</h1> -->
    <a-row :gutter="16">
      <a-col :span="6" class="left">
        <a-card title="配置总数" :bordered="false">
          <div class="count"><span style="line-height:340px">{{count}}</span></div>
        </a-card>
      </a-col>
      <a-col :span="18">
        <a-card title="配置统计" :bordered="false">
          <div ref="myChart" :style="{width: '100%', height: '340px'}"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { deviceCount } from '@/api/myDevice';
const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
export default {
  // 统计
  name: 'Statistics',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      count: '',
      typeNameArray: [],
      data1: [],
      data2: []
    };
  },
  mounted () {
    deviceCount().then((res) => {
      console.log('-------------------', res);
      this.count = res.data.all;
      this.typeNameArray = res.data.typeName;
      this.data1 = res.data.autoFalse;
      this.data2 = res.data.autoTrue;
      this.drawLine1();
    });
  },
  methods: {
    drawLine1 () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.myChart);
      // 绘制图表
      myChart.setOption({
        legend: {
          show: true,
          right: '10%',
          textStyle: {
            color: '#fff'
          }
        },
        title: {
          text: '',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {},
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: '#fff'
            }
          },
          data: this.typeNameArray
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            start: 0,
            end: 50
            // botton: '0px'
          }
        ],
        series: [
          {
            stack: '总量',
            name: '手动入库',
            type: 'bar',
            data: this.data1,
            barWidth: 30,
            itemStyle: {
              color: '#00DD77'
            },
            tooltip: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          {
            stack: '总量',
            name: '自动入库',
            type: 'bar',
            data: this.data2,
            barWidth: 30,
            itemStyle: {
              color: '#FF0000'
            },
            textStyle: {
              color: '#fff'
            }
          }
        ]
      });
      window.onresize = myChart.resize;
      // window.addEventListener('resize', function () {
      //   myChart.resize()
      // })
    }
  }
};
</script>

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
  #myChart{
    box-sizing: border-box;
  }
  /deep/ .ant-card {
    color: #fff;
  }
</style>
