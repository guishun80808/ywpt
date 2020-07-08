<template>
<div>
 <div id="myChart" :style="{width: '500px', height: '500px'}"></div>
   <div style="background-color: #ececec; padding: 20px;">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="Card title" :bordered="false">
          <p>card content</p>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="Card title" :bordered="false">
          <p>card content</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</div>
</template>

<script>

export default {
  name: 'Test',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  },
  mounted () {
    this.drawLine();
  },
  methods: {
    drawLine () {
      // var xData = function () {
      //     var data = [];
      //     for (var i = 1; i < 15; i++) {
      //         data.push(i + "");
      //     }
      //     return data;
      // };
      // eslint-disable-next-line no-unused-vars
      const option1 = {
        title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      };
      const option = {
        legend: {
          x: '4%',
          top: '11%',
          textStyle: {
            color: '#90979c'
          },
          'data': ['老用户', '新用户', '总']
        },
        title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '老用户',
            type: 'bar',
            stack: '总量',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              'normal': {
                'color': 'rgba(255,144,128,1)',
                'label': {
                  'show': true,
                  'textStyle': {
                    'color': '#fff'
                  },
                  'position': 'insideTop',
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            data: [
              42.25,
              42.02,
              46.66,
              41.85,
              42.65,
              43.88,
              43.27,
              43.04,
              41.96,
              42.95,
              42.69,
              39.65
            ]
          },

          {
            'name': '新用户',
            'type': 'bar',
            'stack': '总量',
            'itemStyle': {
              'normal': {
                'color': 'rgba(0,191,183,1)',
                'barBorderRadius': 0,
                'label': {
                  'show': true,
                  'position': 'top',
                  formatter: function (p) {
                    return p.value > 0 ? (p.value) : '';
                  }
                }
              }
            },
            'data': [
              15.50,
              14.29,
              17.97,
              14.11,
              15.44,
              16.46,
              16.41,
              14.02,
              15.76,
              13.08,
              14.58,
              10.41
            ]
          }
        ]
      };
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'));
      myChart.setOption(option);
    }
  }
};
</script>

<style scoped>
</style>
