<template>
  <div class="storeconfig-box" :style="{minHeight: contentHeight}">
    <div class="storeconfig-left">
      <a-list item-layout="horizontal" :data-source="typeLists" >
        <div slot="header" v-if="pageType === 1">
          <div style="margin:20px 0;text-align:center;">
            <a-button type="dashed" @click="addClassModel=true">
              <a-icon type="plus"/>新建分组
            </a-button>
          </div>
        </div>
        <a-list-item
          slot="renderItem"
          slot-scope="item, index"
          style="padding: 5px 15px;margin-top:2px;"
          @mouseenter="currentIndex=index"
          @mouseleave="currentIndex=-1"
          v-bind:class="[{'onRowStyl':index==currentIndex},{'clickRowStyl':index==clickIndex}]"
          @click="clicked(item, index)"
          >
            <a-list-item-meta description="">
              <a slot="title">{{ item.family }}</a>
            </a-list-item-meta>
            <a-dropdown style="width: 20px;fontSize:12px;" v-if="pageType === 1 && item.alterable">
              <a class="ant-dropdown-link" @click="e => e.preventDefault()" >
                <a-icon style="font-size:12px;" type="down-square"/>
              </a>
              <a-menu slot="overlay" :disabled='false'>
                <a-menu-item>
                  <a href="javascript:;" style="color:#fff;" @click="showUpdateTypeMethod(item)">编辑</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="#" style="color:#fff;" @click="confirm1(item)">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
        </a-list-item>
      </a-list>
      <a-modal
        v-if="pageType === 1"
        title="修改类别"
        :visible="showUpdateType"
        :confirm-loading="confirmLoading"
        @ok="handleOkType"
        @cancel="showUpdateType = false">
        <a-input placeholder="修改类别" v-model="newType.family"/>
      </a-modal>
      <a-modal
        v-if="pageType === 1"
        title="添加类别"
        :visible="addClassModel"
        :confirm-loading="confirmLoading"
        @ok="handleOk1"
        @cancel="addClassModel = false">
        <a-form  :form="form" label-align="left" :label-col="{span: 5}" :wrapper-col="{span: 19}">
          <a-form-item label="类别名称">
            <a-input
            v-decorator="['name',{ rules: [{ required: true, message: '请输入类别' }] },]"
            placeholder="请输入类别"/>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <div class="storeconfig-right">
      <div class="storeconfig-right-form">
        <a-form layout="inline" style="margin-bottom:10px;">
          <a-row>
            <a-col :md="pageType === 3 ? 11 : 4" :sm="24" style="margin-right:10px;">
              <a-input v-model="queryParam.name" placeholder="请输入设备名称"/>
            </a-col>
            <a-col :md="pageType === 3 ? 11 : 4" :sm="24" style="margin-right:10px;">
              <a-input v-model="queryParam.ip" placeholder="请输入ip地址"/>
            </a-col>
            <a-col :push="pageType === 3 ? 11 : 0" :md="pageType === 3 ? 11 : 4" :sm="24" :style="pageType === 3 ? {marginTop: '10px', textAlign: 'right'} : {}">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button type="primary" @click="reset" style="margin-left:10px">重置</a-button>
            </a-col>
            <a-col style="float:right;" v-if="pageType === 1">
              <a-tooltip placement="top" style="margin-left:10px;">
                <template slot="title">
                  <span>导入配置文件</span>
                </template>
                <a-icon
style="margin-left:10px;font-weight:900;font-size: 18px;"
                @click="showPregress=true"
:component="xiazaiSvg" />
              </a-tooltip>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>导出配置文件</span>
                </template>
                <a-icon
style="margin-left:10px;font-weight:900;font-size: 18px;"
                @click="exportMyDevice"
:component="shangchuanSvg" />
              </a-tooltip>
              <a-divider type="vertical" />
              <a-button type="primary" @click="addOrUpdateShowModal" style="margin-left:10px">添加</a-button>
              <a-button type="primary" @click="delSomeDevice()">删除</a-button>
            </a-col>
          </a-row>
        </a-form>
        <a-modal
          v-if="pageType === 1"
          title="导入配置"
          :visible="showPregress"
          :confirm-loading="confirmLoading"
          @ok="handleCancel2"
          @cancel="handleCancel2">
          <p>请依照模板导入，否则会导入失败</p>
          <div style="text-align:center">
            <a-button-group></a-button-group>
            <a-progress :percent="percent" :width="200" :status='progressStatus'/>
            <span style="float:left">
              <span class="circle"><span class="number"> 1</span></span><span>上传EXCEL</span>
            </span>
            <span>
              <span class="circle"><span class="number"> 2</span></span><span>{{uploadMsg}}</span>
            </span>
            <span style="float:right">
              <span class="circle"><span class="number"> 3</span></span><span>导入配置</span>
            </span>
            <div class="footer" >
              <a-upload-dragger
                name="file"
                :multiple="true"
                @change="handleChange"
                :customRequest="customRequest"
                :showUploadList="false">
                <p class="ant-upload-text">
                  已经按照模板定制好
                </p>
                <p class="ant-upload-hint">
                  点击上传或将文件拖到此处
                </p>
              </a-upload-dragger>
              <a style="margin-right: -300px" @click="downloadTemplate"><span><a-icon type="question" />还没有模板，点击下载</span></a>
            </div>
          </div>
        </a-modal>
      </div>
      <s-table
        ref="table"
        size="default"
        :row-key="(record) => record.ip"
        :row-selection="rowSelection"
        :columns="columns"
        :scroll="tableHasScroll ? { x: 'max-content' } : {}"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="name" slot-scope="text, record">
          <router-link :to="`/monitor/deviceMenu/secretRelated/detail/${record.ip}/${pageType === 1 ? record.type : record.chType}`">
            {{ text }}
          </router-link>
        </span>
        <span slot="buytime" slot-scope="text">
          {{ text | momentFilter }}
        </span>
        <span slot="describe" slot-scope="text">
          {{ text }}
        </span>
        <span slot="status" slot-scope="text">
          {{ text | statusFilter}}
        </span>
        <span slot="action" slot-scope="text, record" v-if="pageType === 1">
          <a @click="updateConfig(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="delDevice(record)">删除</a>
        </span>
      </s-table>
    </div>
    <a-modal
      :visible="addOrUpdateDeviceModalVisible"
      :confirm-loading="confirmLoading"
      @ok="addOrUpdateHandleOk"
      :mask-closable="false"
      @cancel="addOrUpdateHandleCancel"
      :title="objDetail.id ? '修改': '新增'"
      :width="'700px'"
      :body-style="{height: '500px',overflowY: 'scroll'}">
      <a-form :form="addOrUpdateForm" :label-col="{xs: 5, sm: 5, md: 5, lg: 5}" :wrapper-col="{xs: 19, sm: 19, md: 19, lg: 19}">
        <a-form-item label="设备类别">
          <a-select
            has-feedback
            v-decorator="[
              'type',
              { rules: [{ required: true, message: '请选择设备类别' }] },
            ]"
            placeholder="请选择设备类别"
            @change="deviceTypeChange"
          >
            <a-select-option :value="item.typeid" v-if="item.typeid > -1" v-for="(item, index) in typeLists" :key="index" >
              {{item.family}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-for="(obj, index) in formItems" :label="obj.label" :key="index">
          <a-select
            v-if="obj.fieldType === 'select' && obj.decorator[0] === 'departmentid'"
            has-feedback
            v-decorator="obj.decorator"
            @change="departmentChange"
            :placeholder="obj.placeholder"
          >
            <a-select-option :value="item.value" v-for="(item, itemIndex) in obj.selectDataList" :key="itemIndex">
              {{item.name}}
            </a-select-option>
          </a-select>
          <a-select
            v-if="obj.fieldType === 'select' && obj.decorator[0] !== 'departmentid'"
            has-feedback
            v-decorator="obj.decorator"
            :placeholder="obj.placeholder"
          >
            <a-select-option :value="item.value" v-for="(item, itemIndex) in obj.selectDataList" :key="itemIndex">
              {{item.name}}
            </a-select-option>
          </a-select>
          <a-input
            v-if="obj.fieldType === 'input'"
              v-decorator="obj.decorator"
              :placeholder="obj.placeholder"
              :disabled="obj.disabled"
          />
          <a-date-picker
            v-if="obj.fieldType === 'date-picker'"
            v-decorator="obj.decorator"
            :placeholder="obj.placeholder"
            :disabledDate="obj.disabledEndDate"
            style="width: 100%"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import cloneDeep from 'lodash.clonedeep';
import { Popconfirm } from 'ant-design-vue';
import STree from '@/components/Tree/Tree';
import { downFile } from '@/utils/util';
import { getDedicatedList } from '@/api/monitor';
import { addDevice, updateDevice, typeList, typeAdd, typeUpdate,
  typeDel, getMyDevice, deleteDevice, findDeviceById,
  downExcelTemplate, exportConfig
} from '@/api/myDevice';
import { findMem, getAllOrgnization } from '@/api/system';
import moment from 'moment';
import { secretRelatedColumns, secretRelatedMiddleWareColumns, secretRelatedDatabaseColumns, secretRelatedSafeDatabaseColumns } from '@/views/monitor/deviceMenu/secretRelated/columns';
import { storeConfigColumn, formItemsMap } from './constants';
import { deviceStatus } from '@/constant/constantsMap';
import { shangchuanSvg, xiazaiSvg } from '@/core/icons';

export default {
  name: 'StoreConfig',
  components: {
    STree,
    'a-popconfirm': Popconfirm
  },
  data () {
    return {
      tableHasScroll: false,
      shangchuanSvg,
      xiazaiSvg,
      contentHeight: '',
      moment,
      form: this.$form.createForm(this),
      addOrUpdateForm: this.$form.createForm(this),
      addOrUpdateDeviceModalVisible: false,
      objDetail: {},
      formItems: [], // 字段列表
      uploadMsg: '',
      percent: 0,
      progressStatus: 'active',
      showUpdateType: false,
      clickIndex: 0,
      currentIndex: -1,
      typeLists: [], // 类别列表
      addClassModel: false,
      confirmLoading: false,
      type: '',
      childId: '0',
      showUpdateDevice: false,
      newDevice: {},
      selectedRowKeys: [],
      selectedRows: '',
      showPregress: false,
      showAddType: false,
      preUpdateDevice: {},
      // 查询参数 type:0 查询所有类型
      queryParam: { },
      destroyMe: true,
      newType: {
        typeid: '',
        family: ''
      },
      flag: '0',
      orgnizationList: [],
      // 表头
      columns: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: function () {}
    };
  },
  props: {
    pageType: {
      type: Number,
      default: 1
    }
  },
  computed: {
    rowSelection () {
      if (this.pageType === 1) {
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            selectedRows.forEach((item) => {
              this.selectedRowKeys.push(item.id);
            });
          }
        };
      } else if (this.pageType === 2) {
        return null;
      }
    }
  },
  filters: {
    statusFilter (num) {
      return deviceStatus[num];
    },
    momentFilter (time) {
      return time ? moment(time).format('YYYY-MM-DD') : '---';
    }
  },
  async mounted () {
    if (this.pageType === 1) {
      this.queryParam.typeId = -1;
      this.columns = storeConfigColumn;
      this.loadData = this.getMyDevice;
      await this.$nextTick();
      this.$refs.table.refresh(true);
      this.typeList();
      this.getAllOrgnization();
    } else {
      await this.typeList();
      if (this.typeLists.length) {
        this.queryParam.chType = this.typeLists[0].typeid;
        this.switchColumnByTypeid(this.typeLists[0].typeid);
        this.loadData = this.getDedicatedList;
        await this.$nextTick();
        this.$refs.table.refresh(true);
      }
    }
    const bodyStyle = document.body.getBoundingClientRect();
    this.contentHeight = bodyStyle.height - 95 + 'px';
  },
  methods: {
    /*
     *@author: zoushenglin
     *@date: 2020-07-07 15:15:48
     *@params: typeid 设备类别id
    */
    async switchColumnByTypeid (typeid) {
      switch (typeid) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 5:
        case 6:
        case 7:
        case 9:
          this.tableHasScroll = false;
          this.columns = secretRelatedColumns;
          break;
        case 4: // 安全数据库
          this.tableHasScroll = false;
          this.columns = secretRelatedSafeDatabaseColumns;
          break;
        case 10: // 数据库
          this.tableHasScroll = true;
          await this.$nextTick();
          this.columns = secretRelatedDatabaseColumns;
          break;
        case 11: // 中间件
          this.tableHasScroll = true;
          await this.$nextTick();
          this.columns = secretRelatedMiddleWareColumns;
          break;
        default:
          this.tableHasScroll = false;
          this.columns = secretRelatedColumns;
          break;
      }
    },
    async typeList () { // 获取设备类别列表
      const data = await typeList();
      if (data.code === 0) {
        if (this.pageType === 1) {
          data.data.unshift({
            alterable: false,
            family: '所有设备',
            typeid: -1,
            value: -1,
            name: '所有设备'
          });
        }
        this.typeLists = data.data;
      }
    },
    getMyDevice (parameter) {
      return getMyDevice(Object.assign(parameter, this.queryParam))
        .then((res) => {
          return res;
        });
    },
    getDedicatedList (parameter) {
      return getDedicatedList(Object.assign(parameter, this.queryParam))
        .then((res) => {
          return res;
        });
    },
    async findMem (orgid, noReset) {
      const res = await findMem({ orgid });
      if (res.code === 0) {
        const managerItem = this.formItems.find(item => item.decorator[0] === 'manager'); // 如果存在责任人选项
        if (!noReset) {
          this.addOrUpdateForm.resetFields(['manager']);
        }
        res.data.forEach(item => {
          item.value = item.name;
        });
        if (managerItem) {
          managerItem.selectDataList = res.data;
        }
      }
    },
    async getAllOrgnization () { // 获取部门列表
      const data = await getAllOrgnization();
      if (data.code === 0) {
        data.data.forEach(item => {
          item.value = item.orgid;
        });
        this.orgnizationList = data.data;
      }
    },
    departmentChange (value, option) { // 部门切换change事件
      this.findMem(value);
    },
    downloadTemplate () {
      downExcelTemplate((res) => {
        this.percent = res.loaded / res.total * 100;
        this.progressStatus = 'success';
      }).then((blob) => {
        downFile('配置模板', blob);
      });
    },
    exportMyDevice () {
      if (this.queryParam.family === '所有设备') {
        this.queryParam.family = '';
      }
      exportConfig(this.queryParam).then((blob) => {
        downFile('配置导出', blob);
      });
    },
    customRequest (data) { // 上传提交
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('token', 'token');
      this.saveFile(formData);
    },
    saveFile (formData) {
      const that = this;
      this.axios({
        method: 'post',
        url: '/device/uploadfile',
        data: formData
      }).then((response) => {
        const startIndex = response.indexOf('code');
        const str = response.substring(startIndex - 2);
        const obj = JSON.parse(str);
        if (obj.code === 1 && obj.msg === 'wrong') {
          // 数据导入错误
          that.uploadMsg = '已上传';
          that.percent = 100;
          that.progressStatus = 'exception';
          this.$message.error('请检查自动配置格式');
        } else if (obj.code === 1 && obj.msg === 'bad') {
          // 数据导入冲突错误
          that.uploadMsg = '已上传';
          that.percent = 100;
          that.progressStatus = 'exception';
          this.$message.error('导入数据发生IP冲突,请检查序号为' + obj.data + '的配置项');
        } else if (obj.code === 1 && obj.msg === 'fortmatwrong') {
          // 文件错误
          that.uploadMsg = '已上传';
          that.percent = 100;
          that.progressStatus = 'exception';
          this.$message.error('请上传正确格式文件');
        } else if (obj.code === 0) {
          // 上传导入成功
          that.uploadMsg = '已上传';
          that.percent = 100;
          that.progressStatus = 'success';
          this.$message.success('导入成功');
          this.flag = '1';
        }
      }).catch(() => {
        // 服务器错误
        that.uploadMsg = '上传失败';
        that.percent = 50;
        that.progressStatus = 'exception';
      });
    },
    handleChange (info) {
      const status = info.file.status;
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    showUpdateTypeMethod (obj) {
      this.showUpdateType = true;
      this.newType.typeid = obj.typeid;
      this.newType.family = obj.family;
    },
    handleOkType (e) {
      typeUpdate(Object.assign(this.newType)).then((res) => {
        this.typeList();
      });
      this.showUpdateType = false;
    },
    clicked (item, index) {
      this.clickIndex = index;
      if (this.pageType === 1) {
        this.queryParam.family = item.family;
        this.queryParam.typeId = item.typeid;
        this.childId = item.typeid.toString();
      } else {
        this.queryParam.chType = item.typeid;
        this.switchColumnByTypeid(item.typeid);
      }

      this.$refs.table.refresh(true);
    },
    handleOk1 (e) {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const res = await typeAdd({ family: values.name });
          if (res.code === 0) {
            this.addClassModel = false;
            this.form.resetFields();
            this.typeList();
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        }
      });
    },
    confirm1 (item) { // 删除设备类别
      this.$confirm({
        content: `确定删除${item.family}吗?`,
        okText: '删除',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          typeDel({
            typeid: item.typeid
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg);
              this.typeList();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    refreshPage () {
      this.$refs.table.refresh(true); // 刷新页面
    },
    deviceTypeChange (value) {
      const item = cloneDeep(formItemsMap[value]);
      if (item) {
        this.formItems = cloneDeep(formItemsMap[value]);
      } else {
        this.formItems = cloneDeep(formItemsMap['7']);
      }
      const departmentidItem = this.formItems.find(item => item.decorator[0] === 'departmentid');
      departmentidItem.selectDataList = this.orgnizationList;
    },
    async addOrUpdateShowModal () { // 展示新增或者修改模态框
      const { queryParam: { typeId }, typeLists, objDetail } = this;
      this.addOrUpdateDeviceModalVisible = true;
      const objDetail_ = cloneDeep(objDetail);
      if (objDetail_.buytime) {
        objDetail_.buytime = moment(objDetail_.buytime);
      }
      // 每次模态框显示的时候为部门列表赋值
      if (!objDetail_.id) { // 新增
        if (typeId === -1) {
          objDetail_.type = typeLists.find(item => item.typeid !== -1)?.typeid;
        } else {
          objDetail_.type = this.queryParam.typeId;
        }
      }
      this.deviceTypeChange(objDetail_.type);
      await this.$nextTick();
      const fieldKeys = [];
      this.formItems.forEach(item => fieldKeys.push(item.decorator[0]));
      const objDetailNeed = {
        type: objDetail_.type
      };
      const buytimeItem = this.formItems.find(item => item.decorator[0] === 'buytime');
      if (buytimeItem && !objDetail_.id) { // 为了采购时间默认值
        objDetail_.buytime = moment(new Date(), 'YYYY-MM-DD');
      }
      fieldKeys.forEach(item => {
        objDetailNeed[item] = objDetail_[item];
      });
      this.addOrUpdateForm.setFieldsValue(objDetailNeed);
      if (objDetail_.departmentid) {
        this.findMem(objDetail_.departmentid, true);
      }
    },
    addOrUpdateHandleOk (e) {
      const { objDetail } = this;
      this.addOrUpdateForm.validateFields(async (err, values) => {
        if (!err && values.buytime) {
          values.buytime = values.buytime.format('YYYY-MM-DD hh:mm');
          let res = null;
          if (!objDetail.id) { // 新增
            res = await addDevice(values);
          } else {
            values.id = objDetail.id;
            res = await updateDevice(values);
          }
          if (res.code === 0) {
            this.addOrUpdateHandleCancel();
            this.$message.success(res.msg);
            this.refreshPage();
          } else {
            this.$message.error(res.msg);
          }
        }
      });
    },
    addOrUpdateHandleCancel (e) {
      this.addOrUpdateDeviceModalVisible = false;
      this.objDetail = {};
      this.addOrUpdateForm.resetFields();
    },
    delDevice (record) {
      this.$confirm({
        content: `确定删除${record.family}吗?`,
        onOk: async () => {
          const res = await deleteDevice([record.id]);
          if (res.code === 0) {
            this.$message.success(res.msg);
            this.refreshPage();
          } else {
            this.$message.error(res.msg);
          }
        },
        okText: '删除',
        cancelText: '取消',
        okType: 'danger'
      });
    },
    // 删除
    delSomeDevice () {
      if (this.selectedRowKeys.length) {
        const that = this;
        this.$confirm({
          title: '你确认删除吗?',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          async onOk () {
            const res = await deleteDevice(that.selectedRowKeys);
            if (res.code === 0) {
              that.$message.success(res.msg);
              that.refreshPage();
            } else {
              that.$message.error(res.msg);
            }
          }
        });
      } else {
        this.$message.success('请选择要删除的数据');
      }
    },
    async updateConfig (record) { // 获取设备详情
      const res = await findDeviceById({ id: record.id });
      if (res.code === 0) {
        this.objDetail = res.data;
        this.addOrUpdateShowModal();
      }
    },
    addList (value) {
      this.newDevice = this.$refs.child.subValue;
      this.refreshPage();
    },
    // 关闭文件上传框
    handleCancel2 (e) {
      this.percent = 0;
      this.showPregress = false;
      if (this.flag === '1') {
        this.flag = '0';
        this.refreshPage();
      }
    },
    reset () {
      this.queryParam.name = '';
      this.queryParam.ip = '';
      this.$refs.table.refresh(true);
    }
  }
};
</script>
<style scoped>
.onRowStyl {
  background-color:#286599;
  color:#fff;
  border-color:#40a9ff;
}
.clickRowStyl {
  border-radius: 2px;
  background-color:#286599;
  border:none;
}
.clickRowStyl .ant-list-item-meta .ant-list-item-meta-content .ant-list-item-meta-title a{
  color:#fff;
}
.ant-list-split >>>.ant-list-item {
  border: none;
}
.ant-progress-circle-wrap,
.ant-progress-line-wrap {
  margin-right: 8px;
  margin-bottom: 5px;
}
.circle{
border-radius: 50%;
height: 20px;
width: 20px;
display: inline-block;
background: #238ff9;
vertical-align: top;
}
.number{
  display: block;
  color: #FFFFFF;
  height: 20px;
  line-height: 20px;
  text-align: center
}
.storeconfig-left{
  background: #0E385E;
  border: 1px solid #2a5f9c;
  width: 150px;
  flex: 0 0 auto;
  margin-right: 10px;
  min-height: 100%;
}
.storeconfig-right{
  flex: 1 1 auto
}
.storeconfig-box {
  padding: 10px;
  display: flex;
  min-height: 100%;
  height: 100%;
}
/deep/.ant-list-item-meta-title {
  margin-bottom: 0px;
  font-size: 12px;
}
/deep/.ant-list-split .ant-list-header {
  border-bottom: none;
}
/deep/.ant-list-header, .ant-list-footer {
  padding-top: 0px;
  padding-bottom: 0px;
}
/deep/.ant-list-item:hover a{
  color: #fff;
}
/deep/.ant-list-item-meta-title > a {
  color: #6ca4cd;
}
/deep/.ant-btn-primary {
  background-color: #1f99e5;
  border-color: #1f99e5;
  color: #fff;
}
/deep/.ant-btn-dashed {
  background-color: #173c66;
  border-color: #2a5f9c;
  color: #fff;
  font-size: 12px;
  padding: 0 14px;
  border-style: solid;
}
</style>
