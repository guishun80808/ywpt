<template>
  <div :bordered="false" id="StatisList">
    <header class="contentHeader">{{$route.meta.title}}</header>
    <div class="out">
      <div class="left">
        <ul class="menus">
          <li :class="{active:chart1Show}" @click="chartTogel(1)">配置类型统计（top10）</li>
          <li :class="{active:!chart1Show}" @click="chartTogel(2)">配置类型变更次数统计</li>
        </ul>
      </div>
      <div class="content" v-show="chart1Show">
        <a-button style="margin-left: 20px" type="primary" @click="exportConfig">导出Excle</a-button>
        <div id="chartmon"></div>
      </div>
      <div class="content" v-show="!chart1Show">
        <a-button style="margin-left: 20px" type="primary" @click="exportConfig">导出Excle</a-button>
        <div id="chartmon2"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { getSelectByfimaly, findChMonBYfamily, exportConfig } from '@/api/myDevice';

import { downFile } from '@/utils/util';
import { drawChartMon, drawChartMon2 } from './chart';
export default {
  data () {
    return {
      chart1Show: true,
      chartData: {
        names: [],
        vals: []
      },
      chartData1: {
        names: [],
        vals: []
      }
    };
  },
  mounted () {
    this.getSelectByfimaly();
  },
  methods: {
    async getSelectByfimaly () {
      this.chartData = {
        names: [],
        vals: []
      };
      const data = await getSelectByfimaly();
      if (data.data && Array.isArray(data.data)) {
        for (let index = 0; index < data.data.length; index++) {
          if (index < 10) {
            this.chartData.names.push(data.data[index].family);
            this.chartData.vals.push(data.data[index].count);
          }
        }
        drawChartMon(this.chartData);
      }
    },
    async getSelectByfimaly1 () {
      this.chartData1 = {
        names: [],
        vals: []
      };
      const data = await findChMonBYfamily();
      if (data.data && Array.isArray(data.data)) {
        for (let index = 0; index < data.data.length; index++) {
          if (index < 10) {
            this.chartData1.names.push(data.data[index].family);
            this.chartData1.vals.push(data.data[index].countc);
          }
        }
        drawChartMon2(this.chartData1);
      }
    },
    chartTogel (id) {
      if (id === 1) {
        this.chart1Show = true;
        this.getSelectByfimaly();
      } else if (id === 2) {
        this.chart1Show = false;
        setTimeout(() => {
          this.getSelectByfimaly1();
        }, 500);
      }
    },
    exportConfig () {
      exportConfig().then(res => {
        downFile('配置列表', res);
      });
    }
  }
};
</script>
<style lang="less" scoped>
#StatisList{
  background: rgba(0,0,0,.1);
  width: 99.5%;
     .contentHeader {
    height: 40px;
    line-height: 30px;
    font-size: 16px;
    padding-left: 20px;
    color: #fff;
    background: #1d4676;
}
}
.out {
  width: 100%;
  height: 100%;
  padding-left: 220px;
  // background: rgba(8, 31, 64, 0.6);
  position: relative;
  .left {
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    width: 220px;
    padding-top: 15px;
    height: 100%;
    // background: #1a4372;
        border-right: 1px solid #1a4372;
    ul{
      padding-left: 15px;
    }
    li{
       list-style: none;
      height: 30px;
      line-height: 30px;
      width: 100%;
       padding-left: 20px;
       cursor: pointer;
        border-left: 5px solid transparent;
    }
    }
    li.active {
      padding-left: 20px;
      color: rgb(64, 158, 255);
      list-style: none;
      height: 30px;
      line-height: 30px;
      width: 100%;
      // color: #409eff;
      background-image: -webkit-gradient(
        linear,
        left top,
        right top,
        from(rgba(2, 163, 255, 0.4)),
        to(rgba(31, 59, 76, 0.1))
      );
      background-image: linear-gradient(90deg, rgba(2, 163, 255, 0.4), rgba(31, 59, 76, 0.1));
      border-left: 5px solid #02a3ff;
      margin-bottom: 10px;

  }
}
.content {
      width: 80%;
    height: 700px;
    margin: 0 auto;
    position: relative;
    padding-top: 40px;
  button {
    position: absolute;
    left: 0;
    top: 15px;
  }
}
#chartmon {
  width: 85%;
  height: 500px;
  margin: 0 auto;
  margin-top: 30px;
  // float: left;
}
#chartmon2 {
  width: 85%;
  height: 500px;
  margin: 0 auto;
  margin-top: 30px;
  // float: left;
}
</style>
