<template>
  <div class="page-bgbox">
    <header class="contentHeader">{{$route.meta.title}}</header>
    <div class="page-content">
      <div class="collection-box">
        <div style="width:100%;margin-bottom:10px;">
          <div class="category">{{ this.$route.query.name }}</div>
          <a-form :form="form">
            <a-select v-model="queryParam.timestr" style="width: 180px;margin-right: 20px;" @change="handleChangeTime">
              <a-select-option v-for='item in timestrData' :key="item.value">{{ item.name }}</a-select-option>
            </a-select>
            <a-radio-group :default-value="1" v-model="queryParam.status" @change="handleChangeStatus">
              <a-radio v-for='item in statusPageData' :key="item.value" :value="item.value">{{ item.name }}</a-radio>
            </a-radio-group>
          </a-form>
        </div>
        <div style="width:100%;height:80px;background:#163e6b;">
          <ve-histogram
            :xAxis="xAxis"
            :yAxis="yAxis"
            :series="series"
            :tooltip="tooltip"
            :grid="grid"
            height="80px"
            v-if="series[0].data.length > 0"/>
          <span
            style="color:#4990c4;height:80px;display:block;background:#163e6b;text-align:center;line-height:80px;"
            v-if="series[0].data.length < 0">暂无数据</span>
        </div>
        <div class="page-tabs">
          <ul class="collection-circle">
            <li><span style="background-color: #ff522a;box-shadow: 0 0 5px #ff522a;"></span><p>紧急 ({{ level3 }})</p></li>
            <li><span style="background-color: #ffae2f;box-shadow: 0 0 5px #ffae2f;"></span><p>错误 ({{ level2 }})</p></li>
            <li><span style="background-color: #fadc23;box-shadow: 0 0 5px #fadc23;"></span><p>警告 ({{ level1 }})</p></li>
          </ul>
          <a-tabs default-active-key="1" style="width:100%;" :tabBarStyle="{background:'#183e68'}" type="card" @change="callback">
            <!-- 列表 -->
            <a-tab-pane key="1">
              <span slot="tab">
                <a-icon type="bars"/>列表
              </span>
              <div class="page-personalized">
                <div class="page-custom">
                  <!-- 告警处理 -->
                  <a-button style="width:100px;margin-right:10px;" @click="handleDisposal" :disabled="queryParam.status===1?false:true">告警处理</a-button >
                  <a-modal
                    title="告警处置"
                    :visible="visible"
                    :confirm-loading="confirmLoading"
                    @ok="handleOk"
                    @cancel="handleCancel">
                    <a-form :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                      <a-form-item label="处理人">
                        <a-cascader :options="optionData" :fieldNames='fieldNames' @change="onChange" v-decorator="['dealuser', { rules: [{ required: true, message: '请选择处理人!' }] }]" placeholder="请选择处理人"/>
                      </a-form-item>
                      <a-form-item label="处置信息">
                        <a-input type="textarea" v-decorator="['msg', { rules: [{ required: false, message: '请输入处置信息!' }] }]"/>
                      </a-form-item>
                    </a-form>
                  </a-modal>
                  <!-- 列定制 -->
                  <customColumns @getColumns="getColumnsVal"></customColumns>
                </div>
              </div>
              <!-- 列表 -->
              <s-table
                ref="table"
                :columns="columns"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                :row-key="data => data.id"
                :data="loadData"
                :scroll="{ x: 1400 }">
                <template slot="color" slot-scope="text">
                  <div :class="text.level===3?'emergency':(text.level===2?'error':'warning')" class="entire-circle"></div>
                </template>
                <template slot="name" slot-scope="text, record">
                  <a href="javascript:;" class="entire-name" @click="handleClickName(text, record)">{{ text }}</a>
                </template>
                <template slot="operation" slot-scope="text">
                  <a href="javascript:;" @click="handleClose(text.id,text.status)" class="entire-close" :class="text.status!==3?'allowed':'pointer'">关闭</a>
                </template>
              </s-table>
            </a-tab-pane>
            <a-tab-pane key="2">
              <span slot="tab">
                <a-icon type="setting"/>关联规则
              </span>
              <s-table
                ref="ruletable"
                :columns="rulesColumns"
                :row-key="data => data.key"
                :data="ruleData"
                :show-pagination="false">
              </s-table>
            </a-tab-pane>
          </a-tabs>
        </div>
        <!-- 告警详情 -->
        <alarmDetailData :title="title" :detailsVisible="detailsVisible" @handleCloseDrawer="handleCloseDrawer" ref="alarmDetailData"></alarmDetailData>
      </div>
    </div>
  </div>
</template>
<script>
import { Radio } from 'ant-design-vue';
import { USER_INFO } from '@/store/mutation-types';
import { offAlarm, findAlarmByMapId, updateAlarm, pageFindRule, timeSerise } from '@/api/alarm';
import { getAllDepList } from '@/api/system';
import { timestrData, statusPageData, rulesColumns, removeDuplicates } from '../components/pageConstant';
import customColumns from '../components/customColumns.vue';
import alarmDetailData from '../components/alarmDetailData'; // 告警详情折叠面板组件
import { VeHistogram } from 'v-charts/lib';
export default {
  components: {
    VeHistogram,
    customColumns,
    alarmDetailData,
    'a-radio': Radio,
    'a-radio-group': Radio.Group
  },
  data () {
    return {
      associationRulesData: [],
      title: '', // 告警名称
      detailsVisible: false, // 告警详情
      rulesColumns, // 关联规则列
      timestrData, // 时间选择数据
      statusPageData, // 选择状态数据
      username: '', // 当前登录用户名
      dealuser: '', // 处理人
      activeKey: ['1'], // 折叠面板
      allInfo: [], // 所有的告警信息
      selectedRowKeys: [], // 选中的每一条告警id
      columns: [], // 列表项
      detailData: [], // 告警详情数据
      detailId: '', // 点击每一条告警信息的id
      visible: false, // 告警处置弹窗默认隐藏
      confirmLoading: false,
      level1: 0, // 警告总数据
      level2: 0, // 错误总数据
      level3: 0, // 紧急总数据
      optionData: [], // 处理人级联数据
      optionValue: [], // 处理人级联选中的数据
      options: [], // 处理人级联选中的一条数据
      loadData: (parameter) => findAlarmByMapId(Object.assign(parameter, this.queryParam))
        .then((res) => {
          this.level1 = res.level1;
          this.level2 = res.level2;
          this.level3 = res.level3;
          this.allInfo = res.data;
          return res;
        }),
      queryParam: {
        id: this.$route.query.id,
        timestr: '7d',
        status: 1
      },
      ruleData: (parameter) => pageFindRule(Object.assign(parameter, this.ruleParam))
        .then((res) => {
          const data = [];
          res.data.forEach((item) => {
            const obj = {};
            obj.key = item.type + item.typeName;
            obj.typeName = item.typeName;
            obj.time = '';
            obj.content = '';
            data.push(obj);
          });
          this.associationRulesData = removeDuplicates(data);
          this.associationRulesData.forEach((item) => {
            const childList = res.data.filter((obj) => obj.typeName === item.typeName);
            childList.forEach((item) => {
              item.key = item.id;
              item.typeName = '';
            });
            item.children = childList;
          });
          res.data = [];
          res.data = this.associationRulesData;
          res.count = res.data.length;
          return res;
        }),
      ruleParam: {
        id: this.$route.query.id
      },
      form: this.$form.createForm(this),
      fieldNames: {
        value: 'name',
        label: 'name',
        children: 'children'
      },
      // 柱状图
      xAxis: {
        type: 'category',
        show: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#4990c4'
          }
        },
        data: [],
        axisLabel: {
          boundaryGap: true,
          textStyle: {
            fontSize: 12,
            color: '#4990c4'
          }
        },
        axisTick: {
          show: true,
          alignWithLabel: true, // axisLabel.boundaryGap=true时有效
          interval: 0,
          length: 4// 长度
        }
      },
      yAxis: {
        type: 'value',
        show: false,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#4990c4'
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '告警时间: {b} <br/> 告警数量: {c}'
      },
      series: [
        {
          type: 'bar',
          barWidth: 15,
          color: '#14c3ff',
          data: []
        }
      ],
      grid: {
        left: '5%',
        right: '5%',
        bottom: '2%',
        top: '2%',
        containLabel: true
      }
    };
  },
  mounted () {
    this.username = this.$ss.get(USER_INFO).name;
    this.handleGetAllDepList();
    this.getTimeSerise();
  },
  methods: {
    // 查询时间线方法
    async getTimeSerise () {
      const params = {
        id: this.$route.query.id,
        timestr: this.queryParam.timestr,
        status: this.queryParam.status
      };
      const res = await timeSerise(params);
      if (res.code === 0) {
        const arr = [];
        for (const item in res.data) {
          arr.push(item.substring(2));
        }
        this.xAxis.data = arr;
        this.series[0].data = Object.values(res.data);
      }
    },
    // 选择时间段事件
    handleChangeTime () {
      this.$refs.table.refresh(true);
      this.getTimeSerise();
    },
    handleChangeStatus () {
      this.$refs.table.refresh(true);
      this.getTimeSerise();
    },
    callback (key) {
      if (key === '1') {
        this.$refs.table.refresh(true);
      } else {
        this.selectedRowKeys = [];
      }
    },
    onChange (value, options) { // 处理人级联选择
      this.optionValue = value;
      this.options = options;
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    getRefreshData () { // 刷新表格数据的方法
      this.$refs.table.refresh(true);
    },
    getColumnsVal (val) {
      this.columns = val;
    },
    // 点击告警名称查看告警详情
    handleClickName (text, record) {
      this.title = text;
      this.detailsVisible = true;
      this.$refs.alarmDetailData.$emit('sendId', record.id);
      this.$refs.alarmDetailData.getAlarmInfo();
    },
    handleCloseDrawer (val) {
      this.detailsVisible = val;
    },
    // 查询所有告警处理人
    async handleGetAllDepList () {
      const params = {
        page: 1,
        limit: 10000
      };
      const res = await getAllDepList(params);
      if (res.code === 0) {
        res.data = res.data.filter((item) => item.role !== 'auditadmin' && item.role !== 'secadmin');
        const map = {};
        res.data.forEach((item) => {
          map[item.orgid] = item;
        });
        const val = [];
        res.data.forEach(function (item) {
          if (!(item.type === 2 && item.parentid === '')) {
            const parent = map[item.parentid];
            if (parent) {
              (parent.children || (parent.children = [])).push(item);
            } else {
              val.push(item);
            }
          }
        });
        console.log('val', val);
        this.optionData = val;
      }
    },
    // 告警处置
    handleDisposal () {
      if (this.selectedRowKeys.length !== 1) {
        this.$message.warning('请选中一条修改');
        return;
      }
      this.visible = true;
    },
    handleOk (e) {
      if (this.options.length > 0) {
        if (this.options[this.options.length - 1].type !== 2) {
          this.$message.warning('请选择处理人');
          return;
        }
      }
      const that = this;
      e.preventDefault();
      this.form.validateFields(async (err, fieldsValue) => {
        if (err) {
          return false;
        } else {
          // 发请求，将参数传给后台，修改数据
          const params = {
            id: this.selectedRowKeys[0],
            dealuser: this.optionValue[this.optionValue.length - 1]
          };
          if (fieldsValue.msg === undefined) {
            params.msg = '';
          }
          console.log('params', params);
          const res = await updateAlarm(params);
          if (res.code === 0) {
            this.selectedRowKeys = [];
            this.$message.success('处理成功');
            this.form.resetFields();
            that.getRefreshData();
          } else {
            this.$message.error('处理失败');
          }
          this.confirmLoading = true;
          setTimeout(() => {
            this.visible = false;
            this.confirmLoading = false;
          }, 500);
        }
      });
    },
    handleCancel (e) {
      this.visible = false;
      this.form.resetFields();
      this.selectedRowKeys = [];
    },
    // 关闭报警操作
    handleClose (oId, oStatus) {
      const that = this;
      // 判断报警状态，如果是已解决才可以关闭
      if (oStatus !== 3) {
        this.$message.warning('非已解决状态不可关闭报警');
      } else {
      // 弹窗问是否确认关闭的
        this.$confirm({
          title: '你确认关闭吗?',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          async onOk () {
            const res = await offAlarm({ id: oId });
            if (res.code === 0) {
              that.$message.success('成功关闭报警');
              that.getRefreshData();
            } else {
              that.$message.error('关闭报警失败');
            }
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
li{
  list-style: none !important;
}
.allowed{
  cursor: not-allowed;
  color: #fff;
}
.pointer{
  cursor: pointer;
}
.ant-input[disabled] {
  background-color: #0A3D76;
  background-image: none;
  border: 1px solid rgba(1,84,190,1);
  color: #1890ff;
}
.ant-tabs-bar {
  margin: 0px 0 10px 0 !important;
}
.page-bgbox{
  min-height: 100%;
  // background-color: #163c67;
}
.page-content{
  min-height: 100%;
  height: 100%;
  padding: 14px;
}
.contentHeader {
  height: 40px;
  line-height: 35px;
  color: #89badd;
  font-size: 15px;
  background-color: #1d4676;
}
.emergency{
  background-color: #ff522a;
  box-shadow: 0 0 5px #ff522a;
}
.error{
  background-color: #ffae2f;
  box-shadow: 0 0 5px #ffae2f;
}
.warning{
  background-color: #fadc23;
  box-shadow: 0 0 5px #fadc23;
}
.entire-name{
  cursor: pointer;
  display: block;
}
.entire-circle{
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.collection-box{
  height: 100%;
  width: 100%;
  .category{
    background: rgba(0,0,0,.12);
    color: #fff;
    font-size:14px;
    text-align:center;
    float:left;
    overflow-x: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    max-width: 200px;
    border-radius: 50px;
    padding-left: 10px;
    padding-right: 10px;
    line-height: 32px;
    margin-right: 15px;
    font-size: 14px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .page-tabs{
    position:relative;
    background-color: #164779;
    .collection-circle{
    float: right;
    height: 44px;
    color: #4990c4;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 99;
    li{
    height: 24px;
    padding: 10px;
    float: left;
    margin-left: 10px;
    display: flex;
    line-height: 24px;
    span{
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-top: 7px;
      margin-right: 10px;
      background: chartreuse;
      p{
        line-height: 44px;
        font-size: 12px;
      }
     }
    }
   }
   .page-personalized{
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    .page-statistical{
      float: left;
      button{
        margin-right: 10px;
      }
    }
    .page-custom{
      float: right;
    }
  }
 }
}
// tabs的样式
/deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active:hover {
  color: #fff !important;
}
/deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  background: #183e68;
  border: none;
  border-bottom: 1px solid #217dc6;
  margin: 0 0 1px;
  font-size: 16px;
}
/deep/.ant-tabs {
  color: #fff;
  border-radius: 3px;
  margin-top: 15px;
  border: 1px solid #143b67;
}
/deep/.ant-tabs-bar {
  border-bottom: 2px solid #217dc6;
}
/deep/.ant-btn {
  background-color: #0d5990;
  border: 1px solid #297ebb;
  color: #7dbae6;
}
/deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  color: #fff !important;
  background: #217dc6 !important;
  border-color: #108ee9 !important;
  border-bottom: 1px solid #217dc6 !important;
}
// 禁用botton的样式
/deep/.ant-btn-disabled, .ant-btn.disabled, .ant-btn[disabled], .ant-btn-disabled:hover, .ant-btn.disabled:hover, .ant-btn[disabled]:hover, .ant-btn-disabled:focus, .ant-btn.disabled:focus, .ant-btn[disabled]:focus, .ant-btn-disabled:active, .ant-btn.disabled:active, .ant-btn[disabled]:active, .ant-btn-disabled.active, .ant-btn.disabled.active, .ant-btn[disabled].active {
  color: #fff !important;
  background-color: #2d98db !important;
  border: 1px solid #297ebb !important;
}
// 表格展开行的样式
/deep/.ant-table-row-expand-icon {
  color: #fff !important;
  background: #4082e6 !important;
  border: 1px solid #4082e6 !important;
}
</style>
