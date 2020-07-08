<template>
  <div :bordered="false" id="StatisList">
    <header class="contentHeader">{{$route.meta.title}}</header>
     <a-form layout="inline">
        <a-row :gutter="48">
           <a-col :md="18" :sm="18">
            <a-form-item label="告警时间" :labelCol="labelCol" :wrapperCol="wrapperCol" style="width:auto">
                <a-range-picker
                :allowClear="true"
                :value="createValue"
                :disabledDate="handleData"
                show-time
                dropdownClassName="ridatepicker"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
                @change="onChangeDate"
                v-decorator="['updatedAt']"
              />
            </a-form-item>
              <a-button type="primary" @click="saveTime">查询</a-button>
            <a-button type="primary" style="margin-left: 20px" @click="resetParams">重置</a-button>
            <a-button style="margin-left: 20px" type="primary" @click="exportAlert">导出</a-button>
          </a-col>
          <a-col :md="8" :sm="24" style="margin-left:60px;">
          </a-col>
            </a-row>
      </a-form>
    <div class="out">
      <div class="left">
        <ul class="menus">
           <li :class="{active:chart1Show}" @click="chartTogel(2)">告警来源统计</li>
          <li :class="{active:!chart1Show}" @click="chartTogel(1)">告警级别统计</li>
        </ul>
      </div>
      <div class="content" v-show="chart1Show">
        <div id="chartmon5"></div>
      </div>
      <div class="content" v-show="!chart1Show">
        <div id="chartmon4"></div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { findMonByLevel, findMonByType } from '@/api/myDevice';
import { exportAlarm } from '@/api/alarm';
import { drawChartMon4, drawChartMon5 } from './chart';
import { downFile } from '@/utils/util';
export default {
  data () {
    return {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      chart1Show: true,
      createValue: [],
      chartData: [],
      queryParam: {
        starttime: '',
        endtime: ''
      },
      chartData1: {
        names: [],
        vals: []
      }
    };
  },
  mounted () {
    setTimeout(() => {
      this.getSelectByfimaly();
      this.getSelectByfimaly1();
    }, 500);
  },
  methods: {
    handleData (time) {
      if (!time) {
        return false;
      } else {
        // 大于当前日期不能选
        return time > moment();
      }
    },
    onChangeDate (date, dateString) {
      this.createValue = date;
      this.queryParam.starttime = dateString[0];
      this.queryParam.endtime = dateString[1];
    },
    saveTime () {
      this.getSelectByfimaly();
      this.getSelectByfimaly1();
    },
    resetParams () {
      this.createValue = [];
      this.queryParam = {
        timestart: '',
        timeend: ''
      };
      this.getSelectByfimaly();
      this.getSelectByfimaly1();
    },
    async getSelectByfimaly () {
      this.chartData = [];
      const data = await findMonByLevel(this.queryParam);
      if (data.data && Array.isArray(data.data)) {
        for (let index = 0; index < data.data.length; index++) {
          if (index < 10) {
            this.chartData.push({
              value: data.data[index].count, name: data.data[index].level
            });
          }
        }
        drawChartMon4(this.chartData);
      }
    },
    async getSelectByfimaly1 () {
      this.chartData1 = {
        names: [],
        vals: []
      };
      const data = await findMonByType(this.queryParam);
      if (data.data && Array.isArray(data.data)) {
        for (let index = 0; index < data.data.length; index++) {
          if (index < 10) {
            this.chartData1.names.push(data.data[index].type);
            this.chartData1.vals.push(data.data[index].count);
          }
        }
      }
      drawChartMon5(this.chartData1);
    },
    chartTogel (id) {
      if (id === 1) {
        this.chart1Show = false;
        setTimeout(() => {
          this.getSelectByfimaly1();
        }, 500);
      } else if (id === 2) {
        this.chart1Show = true;
        setTimeout(() => {
          this.getSelectByfimaly1();
        }, 500);
      }
    },
    exportAlert () {
      exportAlarm(this.queryParam).then(res => {
        downFile('告警列表', res);
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
.ant-form{
   background: #1d4676;
   height: 50px;
   margin-top: 0px;
   margin-bottom: 0px;
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
  // background:rgba(8, 31, 64,.8);
  position: relative;
  padding-top: 40px;
  button {
    position: absolute;
    left: 0;
    top: 15px;
  }
}
#chartmon4 {
  width: 600px;
  //  width: 85%;
  height: 500px;
  // margin: 0 auto;
  // margin-left: 200px;
  margin-top: 30px;
  margin-left: 12%;
  // float: left;
}
@media screen and (max-width: 1700px) {
  #chartmon4{
  margin-left: 6%;
}
}

#chartmon5 {
  width: 85%;
  height: 500px;
  margin: 0 auto;
  margin-top: 30px;
  // float: left;
}
</style>
