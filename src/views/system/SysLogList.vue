<template>
  <div class="SysLogList table-content">
    <header class="contentHeader" style="background: rgb(29, 70, 118)">{{$route.meta.title}}</header>
    <div id="SysLogList" class="table-page-search-wrapper " style="margin-bottom:15px;">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="5">
            <a-form-item label="日志IP" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model="queryParam.ip" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <a-form-item label="日志时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
          </a-col>
          <a-col :md="5" :sm="6">
            <a-form-item label="日志内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model="queryParam.logcontent" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="7" >
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button type="primary" style="margin-left: 10px" @click="resetParams">重置</a-button>
            <a-tooltip>
                <template slot="title">
                  将数据导出为Excle
                </template>
                <a-icon type="upload" @click="exportLogs" style="font-weight:900;font-size: 16px!important;cursor: pointer;color: #6ac5fe;margin:0 20px;" />
               </a-tooltip>
            <a-upload
            name="file"
            :multiple="false"
            accept='.xlsx,.xls'
            :customRequest="customRequest"
          >
           <a-tooltip>
                <template slot="title">
                  从Excel新增或更新数据
                </template>
                <a-icon type="download" style="font-weight:900;font-size: 16px!important;cursor: pointer;color: #6ac5fe;margin:0 0px;" />
               </a-tooltip>
        </a-upload>
          </a-col>
        </a-row>
      </a-form>
      <s-table

      ref="table"
      size="default"
      :columns="logColumns"
      :rowKey="(record,index) => index"
      :data="logsData"
      showPagination="auto"
      :scroll='{y:600}'>
      <span slot="logoperator" slot-scope="logoperator">{{ logoperator | getName }}</span>
  </s-table>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import { getSystemMLogList, syslogImportLogs, syslogExportLogs } from '@/api/system';
import { logColumns } from '@/constant/columnsses';
import { downFile } from '@/utils/util';
import { userNameMapConstant } from '@/constant/constantsMap';

export default {
  name: 'SystemLog',
  computed: {
    ...mapGetters(['userInfo'])
  },
  data () {
    return {
      logtime: null,
      ritimepick: 'ritimepick',
      labelCol: {
        xs: { span: 20 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 12 }
      },
      buttonCol: {
        wrapperCol: {
          xs: { span: 18 },
          sm: { span: 12, offset: 5 }
        }
      },
      // 查询参数
      logTypes: {
        0: '防火墙运行日志',
        1: '管理员操作日志',
        2: '普通日志',
        3: '其他日志'
      },
      modeleTypes: {
        0: '监控模块',
        1: '告警管理',
        2: '仓库管理',
        3: '系统管理'
      },
      queryParam: {
        logoperator: '',
        logtime: '',
        ip: '',
        operator: '',
        type: '',
        modelename: '',
        logtimestart: '',
        logtimeend: '',
        logcontent: ''
      },
      selectedRowKeys: [],
      selectedRows: [],
      // 表头
      logColumns,
      // 加载数据方法 必须为 Promise 对象
      logsData: (parameter) => getSystemMLogList(Object.assign(parameter, this.queryParam))
        .then((res) => {
          return res;
        }),
      createValue: []
    };
  },
  filters: {
    getName (value) {
      return userNameMapConstant[value] || value;
    }
  },
  methods: {
    customRequest (data) { // 上传提交
      const formData = new FormData();
      formData.append('file', data.file);
      this.saveFile(formData);
    },
    saveFile (formData) {
      syslogImportLogs(formData).then((res) => {
        if (res.code === 0) {
          this.$message.success('导入成功');
          this.getSystemMLogList();
        } else {
          this.$message.warning('导入失败，请联系管员');
        }
      });
    },
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
      this.queryParam.logtimestart = dateString[0];
      this.queryParam.logtimeend = dateString[1];
    },
    resetParams () {
      this.createValue = [];
      this.queryParam = {
        logoperator: '',
        ip: '',
        operator: '',
        type: '',
        modelename: '',
        logtimestart: '',
        logtimeend: '',
        logcontent: ''
      };
      this.$refs.table.refresh(true);
    },
    exportLogs () {
      const params = {};
      params.logoperator = this.queryParam.logoperator;
      params.ip = this.queryParam.ip;
      params.operator = this.queryParam.operator;
      params.type = this.queryParam.type;
      params.modelename = this.queryParam.modelename;
      params.logtimestart = this.queryParam.logtimestart;
      params.logtimeend = this.queryParam.logtimeend;
      params.logcontent = this.queryParam.logcontent;
      syslogExportLogs(params).then(res => {
        downFile('日志列表', res);
      });
    }
  }
};
</script>
<style>
 .SysLogList .contentHeader {
    height: 40px;
    line-height: 35px;
    font-size: 16px;
    padding-left: 20px;
    color: #fff;
}
#SysLogList .ant-upload-list-item{
  display: none;
}
#SysLogList .ant-calendar-range-picker-separator {
  color: #fff;
}
 .ant-calendar-date{
  /* color: rgba(0, 0, 0, 0.65); */
}
.ridatepicker  .ant-calendar-range .ant-calendar-in-range-cell::before{
  background: #17a1e6;
}
.ridatepicker  .ant-calendar-range.ant-calendar-time .ant-calendar-time-picker-inner {
    background: #0A3D76;
}
.ridatepicker  li.ant-calendar-time-picker-select-option-selected {
    font-weight: 600;
    background: #17a1e6;
}
.ridatepicker  .ant-calendar-range.ant-calendar-time .ant-calendar-time-picker-combobox{
  background: transparent;
}
.ridatepicker  .ant-calendar-time-picker-select li:hover {
    background: #17a1e6;
}
.ridatepicker  .ant-calendar-range .ant-calendar-input, .ant-calendar-range .ant-calendar-time-picker-input{
  color: #17A1E6;
    font-size: 14px;
    line-height: 1.5;
    background-color: #0A3D76;
    background-image: none;
    border: 1px solid #0154be;
}
.SysLogList ::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background-color: rgb(37, 97, 148);
  border-color: rgb(37, 97, 148);
}
/*定义滑块 内阴影+圆角*/
.SysLogList ::-webkit-scrollbar-thumb {
  /*  border-radius:5px; */
  -webkit-box-shadow: inset 0 0 6px #409eff;
  background-color: #409eff;
  border-color: rgb(37, 97, 148);
}
/*定义滚动条轨道 内阴影+圆角*/
.SysLogList ::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  width: 8px;
  background-color: rgb(37, 97, 148);
  border-color: rgb(37, 97, 148);
}
.SysLogList .ant-table-fixed-header .ant-table-scroll .ant-table-header{
  width: 101%;
}
#SysLogList{
  padding: 20px;
}

</style>
<style lang="less" scoped>
.table-content{
      min-height: 100%;
    height: 100%;
    min-height: 100%;
    background-color: #163c67;
}
</style>
