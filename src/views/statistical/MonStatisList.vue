<template>
  <div :bordered="false" id="StatisList">
    <header class="contentHeader">{{$route.meta.title}}</header>
    <div class="out">
      <div class="left">
        <ul class="menus">
          <li :class="{active:chart1Show}" @click="chartTogel(1)">拓扑图使用配置分布图</li>
        </ul>
      </div>
      <div class="content" v-show="chart1Show">
        <div v-show="chartmon3Show" id="chartmon3">
          <span v-show="emptyData" class="empty" style="color: #fff">暂无拓扑图使用配置数据</span>
        </div>
        <div v-show="!chartmon3Show" id="chartmon6"></div>

      </div>
    </div>
  </div>
</template>
<script>
import { nodetop10 } from '@/api/myDevice';
import { drawChartMon3, drawChartMon6 } from './chart';
export default {
  data () {
    return {
      chart1Show: true,
      chartmon3Show: true,
      emptyData: false,
      chartData1: [],
      chartData: {
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
      const data = await nodetop10();
      if (data.data && Array.isArray(data.data)) {
        if (data.data.length === 0) {
          this.emptyData = true;
          return;
        }
        if (data.data.length > 5) {
          this.chartmon3Show = true;
          for (let index = 0; index < data.data.length; index++) {
            this.chartData.names.push(data.data[index].family);
            this.chartData.vals.push(data.data[index].count);
          }
          drawChartMon3(this.chartData);
        } else {
          this.chartmon3Show = false;
          for (let index = 0; index < data.data.length; index++) {
            this.chartData1.push({
              value: data.data[index].count, name: data.data[index].family
            });
          }
          drawChartMon6(this.chartData1);
        }
      } else {
        this.chartmon3Show = true;
        this.emptyData = true;
      }
    },
    chartTogel (id) {
      if (id === 1) {
        this.chart1Show = true;
      } else if (id === 2) {
        this.chart1Show = false;
      }
    },
    compare1 (property) {
      return function (a, b) {
        const value1 = a[property];
        const value2 = b[property];
        return value2 - value1;
      };
    }
  }
};
</script>
<style lang="less" scoped>
#StatisList{
  .empty{
    width: 85%;
    height: 500px;
    line-height: 500px;
    margin: 0 auto;
    text-align: center;
    display: inline-block;
  }
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
    ul {
      padding-left: 15px;
    }
    li {
      list-style: none;
      height: 30px;
      line-height: 30px;
      width: 220px;
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
  margin-right: 240px;
  button {
    position: absolute;
    left: 0;
    top: 15px;
  }
}
#chartmon3 {
  width: 85%;
  height: 500px;
  margin: 0 auto;
  margin-top: 30px;
  // float: left;
}
#chartmon6 {
  width: 500px;
  height: 500px;
  margin: 0 auto;
  margin-top: 30px;
  // float: left;
}
.icon-monitor:before {
    content: "\e8cd";
}
.icon-monitor:before {
    content: "\e8cd";
}
.icon-CMDB:before {
    content: "\e8ca";
}
</style>
