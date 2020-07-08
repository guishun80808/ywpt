<template>
  <div class="entire-box">
    <div class="contentHeader">
      <div class="header-left">{{$route.meta.title}}</div>
      <div class="header-right">自动刷新
        <a-switch @change="onChangeSwitch"/>
      </div>
    </div>
    <div class="entire-content">
      <div class="entire-form">
        <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-row :gutter="48">
            <a-col :lg="8" :md="8" :sm="24">
              <cascadeLinkage @handleChange="handleType" ref="cascadeLinkage"></cascadeLinkage>
            </a-col>
            <a-col :lg="8" :md="8" :sm="24" v-show="judge">
              <a-form-item label="告警次数">
                <a-select v-model="queryParam.countnum" placeholder="请选择告警次数">
                  <a-select-option v-for='item in countnumData' :key="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="8" :sm="24">
              <a-form-item label="处理状态">
                <a-select v-model="queryParam.status" placeholder="请选择处理状态">
                  <a-select-option v-for='item in statusData' :key="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="8" :sm="24">
              <a-form-item label="告警级别">
                <a-select v-model="queryParam.level" placeholder="请选择告警级别">
                  <a-select-option v-for='item in levelData' :key="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="8" :sm="24">
              <a-form-item label="首次发生">
                <a-date-picker show-time v-model="queryParam.starttime" placeholder="请选择首次发生时间" style="width:100%;">
                </a-date-picker>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="8" :sm="24">
              <a-form-item label="最后发生">
                <a-date-picker show-time v-model="queryParam.endtime" placeholder="请选择最后发生时间" style="width:100%;">
                </a-date-picker>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="8" :sm="24">
              <a-form-item label="关键字">
                <a-input-group compact>
                  <a-select v-model="queryParam.keywordType" placeholder="请选择" style="width: 35%">
                    <a-select-option value="ip">IP</a-select-option>
                    <a-select-option value="name">告警名称</a-select-option>
                  </a-select>
                  <a-input v-model="queryParam.keyword" style="width: 65%" placeholder="请输入关键字" />
                </a-input-group>
              </a-form-item>
            </a-col>
            <a-col :push="push" :lg="8" :md="8">
              <a-form-item :wrapper-col="{span: 18}" style="text-align: right;">
                <a-button type="primary" style="background-color: #108ee9;border-color: #108ee9;color:#fff;" @click="handleSearch">搜索</a-button>
                <a-button type="primary" style="margin-left: 8px;background-color: #108ee9;border-color: #108ee9;color:#fff;" @click="handleClear">重置</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="entire-personalized">
        <div class="entire-statistical">
          共<span>{{ sum.level1+sum.level2+sum.level3 }}</span>个结果（紧急<span>{{ sum.level3 }}</span>个，错误<span>{{ sum.level2 }}</span>个，警告<span>{{ sum.level1 }}</span>个）
        </div>
        <!-- 列定制 -->
        <div class="entire-button">
          <a-button style="width:100px;margin-right:10px;" @click="handleDisposal">告警处理</a-button >
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
          <customColumns @getColumns="getColumnsVal"></customColumns>
        </div>
      </div>
      <!-- 列表 -->
      <s-table
      ref="table"
      :columns="columns"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :row-key="record => record.id"
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
      <alarmDetailData :title="title" :detailsVisible="detailsVisible" @handleCloseDrawer="handleCloseDrawer" ref="alarmDetailData"></alarmDetailData>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { Badge, Switch } from 'ant-design-vue';
import 'ant-design-vue/es/switch/style/css';
import { findAlarm, offAlarm, countAlarmSum, updateAlarm } from '@/api/alarm';
import { getAllDepList } from '@/api/system';
import customColumns from './components/customColumns'; // 列定制组件
import cascadeLinkage from './components/cascadeLinkage'; // type,content级联选择组件
import alarmDetailData from './components/alarmDetailData'; // 告警详情折叠面板组件
import { countnumData, statusData, levelData } from './components/pageConstant';
export default {
  components: {
    customColumns,
    cascadeLinkage,
    alarmDetailData,
    'a-badge': Badge,
    'a-switch': Switch
  },
  data () {
    return {
      timer: null,
      title: '',
      detailsVisible: false,
      push: 16,
      type: '',
      visible: false, // 告警处置弹窗默认隐藏
      confirmLoading: false,
      selectedRowKeys: [], // 选中的每一条告警id
      record: [], // 选中的数据
      optionData: [], // 处理人级联数据
      optioninfoValue: [], // 处理人级联选中的数据
      options: [], // 处理人级联选中的一条数据
      optionValue: [], // 告警信息级联数据
      countnumData, // 告警次数数据
      statusData, // 处理状态数据
      levelData, // 告警级别数据
      starttime: '', // 首次选择日期
      endtime: '', // 最后选择日期
      data: [], // 列表数据
      columns: [], // 表格列
      sum: [], // 告警状态数据统计
      form: this.$form.createForm(this),
      fieldNames: {
        value: 'name',
        label: 'name',
        children: 'children'
      },
      queryParam: {},
      loadData: (parameter) => {
        const para = Object.assign({}, this.queryParam);
        if (this.queryParam.starttime) {
          para.starttime = moment(this.queryParam.starttime).format('YYYY-MM-DD HH:mm:ss');
        }
        if (this.queryParam.endtime) {
          para.endtime = moment(this.queryParam.endtime).format('YYYY-MM-DD HH:mm:ss');
        }
        if (this.queryParam.keyword) {
          if (this.queryParam.keywordType === 'ip') {
            para.ip = this.queryParam.keyword;
          } else if (this.queryParam.keywordType === 'name') {
            para.name = this.queryParam.keyword;
          }
        }
        return findAlarm(Object.assign(parameter, para))
          .then((res) => {
            return res;
          });
      }
    };
  },
  mounted () {
    this.getCountAlarmSum(); // 告警数据统计展示
    this.handleGetAllDepList();
  },
  computed: {
    judge () {
      if (this.optionValue.length === 2) {
        this.push = 8;
        return true;
      } else {
        this.push = 16;
        return false;
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer);
  },
  methods: {
    onChangeSwitch (checked) {
      if (checked) {
        this.timer = setInterval(() => {
          this.$refs.table.refresh(true);
        }, 30000);
      } else {
        clearInterval(this.timer);
      }
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
    // 告警数据统计展示
    async getCountAlarmSum () {
      const res = await countAlarmSum();
      if (res.code === 0) {
        this.sum = res.data;
      }
    },
    // 告警信息级联组件选择事件
    handleType (value, type) {
      this.optionValue = value;
      this.queryParam.type = type;
      this.queryParam.content = '';
      if (value.length === 2) {
        this.queryParam.content = value[1];
      }
      if (value.length === 0) {
        this.queryParam.content = '';
      }
    },
    // 接收列定制传来的值
    getColumnsVal (val) {
      this.columns = val;
    },
    // 重置按钮
    handleClear () {
      this.queryParam = {};
      this.optionValue = [];
      this.$refs.table.refresh(true);
      this.$refs.cascadeLinkage.callMethod();
    },
    // 点击搜索按钮查询
    handleSearch () {
      this.$refs.table.refresh(true);
    },
    // 关闭报警
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
              that.$refs.table.refresh(true);
            } else {
              that.$message.error('关闭报警失败');
            }
          }
        });
      }
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
        this.optionData = val;
      }
    },
    // 告警处理
    onChange (value, options) { // 处理人级联选择
      this.optioninfoValue = value;
      this.options = options;
    },
    onSelectChange (selectedRowKeys, record) {
      this.selectedRowKeys = selectedRowKeys;
      this.record = record;
    },
    handleDisposal () {
      if (this.selectedRowKeys.length !== 1) {
        this.$message.warning('请选中一条修改');
        return;
      }
      if (this.record[0].status !== 1) {
        this.$message.warning('非未处理状态不能处理告警');
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
      e.preventDefault();
      this.form.validateFields(async (err, fieldsValue) => {
        if (err) {
          return false;
        } else {
          // 发请求，将参数传给后台，修改数据
          const params = {
            id: this.selectedRowKeys[0],
            dealuser: this.optioninfoValue[this.optioninfoValue.length - 1]
          };
          if (fieldsValue.msg === undefined) {
            params.msg = '';
          }
          const res = await updateAlarm(params);
          if (res.code === 0) {
            this.selectedRowKeys = [];
            this.$message.success('处理成功');
            this.form.resetFields();
            this.$refs.table.refresh(true);
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
    }
  }
};
</script>
<style lang="less" scoped>
.allowed{
  cursor: not-allowed;
  color: #fff;
}
.pointer{
  cursor: pointer;
}
.entire-fold {
  background: #1E5B97 !important;
  color: #fff !important;
}
.pointer{
  cursor: pointer;
}
.entire-box{
  min-height: 100%;
  background-color: #163c67;
}
.entire-content{
  min-height: 100%;
  height: 100%;
  padding: 20px;
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
.contentHeader {
  height: 40px;
  line-height: 35px;
  color: #89badd;
  font-size: 15px;
  background-color: #1d4676;
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  .header-right{
    color: #4990c4;
    font-size: 12px;
  }
}
.entire-form{
  margin-bottom: 12px;
}
.entire-personalized{
  border-bottom: none;
  padding: 5px 10px;
  overflow: hidden;
  height: 50px;
  margin-bottom: 5px;
  .entire-statistical{
    float: left;
    color: #90c6ee;
    font-size: 13px;
    line-height: 40px;
  }
  .entire-button{
    float: right;
    line-height: 40px;
  }
}
/deep/ .anticon-setting {
  color:#000;
}
/deep/.ant-form-item {
  margin-bottom: 15px;
  font-size: 12px;
  height: 32px;
  vertical-align: top;
}
/deep/.ant-form-item-label > label {
  color: #89badd;
  font-size: 13px;
}
/deep/.anticon {
  color: rgb(157, 215, 255);
}
/deep/.ant-btn {
  background-color: #0d5990;
  border: 1px solid #297ebb;
  color: #7dbae6;
}
.ant-switch::after {
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 35, 11, 0.2);
  box-shadow: 0 2px 4px 0 rgba(0, 35, 11, 0.2);
  background-color: #1f497a;
  width: 16px;
  height: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,.3);
  top: 2px;
}
.ant-switch{
  margin-left: 10px;
}
.ant-switch-checked {
  background-color: #3a9ae5;
  border-color: transparent;
}
</style>
