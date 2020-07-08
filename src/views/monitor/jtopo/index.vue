<template>
  <leftNavLayoutComponent style="height: 100%;">
    <left-nav-component
      slot="left"
      style="background:#1a3b5f;height: 100%;width: 200px;"
      @click="jtopoMenuclick"
      :custom-keys="[currentJtopoIndex]"
      title-key="topologyName"
      :funcs="{icon: 'setting', menus: ['编辑', '删除']}"
      @funcItemClick="funcItemClick"
      :menus="jtopoList">
      <div slot="top" style="padding: 5px 0;text-align: center;">
        <a-button
style="background:#1681c4;border-color: #3c7bda; color: #fff;border-radius: 0;"
        @click="createOrUpdateJtopoModalVisible = true; createOrUpdateJtopoObj = {}">新建拓扑图</a-button>
      </div>
    </left-nav-component>

    <div slot="right" >
      <canvas :width="width" :height="height" style="margin: 0; padding: 0;" ref="canvas"></canvas>

      <a-modal
        :visible="createOrUpdateJtopoModalVisible"
        :mask-closable="false"
        :title="createOrUpdateJtopoObj.id ? '修改拓扑图' : '新建拓扑图'"
        :ok-button-props="{ props: { disabled: false } }"
        :cancel-button-props="{ props: { disabled: false } }"
        @ok="handleCreateJtopoSubmit"
        @cancel="createOrUpdateJtopoModalVisible = false; createJtopoForm.resetFields()"
      >
        <a-form :form="createJtopoForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleCreateJtopoSubmit">
          <a-form-item label="拓扑图名称">
            <a-input
              v-decorator="['jtopoName', { rules: [{ required: true, message: '请输入拓扑图名称' }] }]"
            />
          </a-form-item>
          <a-form-item label="类别">
            <a-select v-decorator="['jtopoType', { rules: [{ required: true, message: '请选择拓扑图类型' }] }]">
              <a-select-option value="0">
                网络拓扑
              </a-select-option>
              <a-select-option value="1">
                业务拓扑
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>

      <div class="jtopo-func-menu" @click="handleFuncBtn">
        <a-button type="primary" :disabled="noUpdate" data-type="save" title="保存">
          <a-icon type="save" />
        </a-button>
        <a-button type="primary" data-type="create" title="新增节点">
          <a-icon type="plus" />
        </a-button>
        <a-button type="primary" data-type="refresh" title="刷新拓扑图">
          <a-icon type="reload" />
        </a-button>
        <a-button type="primary" data-type="zoomOut" title="放大">
          <a-icon type="zoom-in" />
        </a-button>
        <a-button type="primary" data-type="zoomIn" title="缩放">
          <a-icon type="zoom-out" />
        </a-button>
        <a-button type="primary" :disabled="currentJtopo && currentJtopo.topologyLevel === 1" data-type="delete" title="删除拓扑图">
          <a-icon type="delete" />
        </a-button>
        <a-button type="primary" data-type="showAll" title="显示全部">
          <a-icon type="fullscreen" />
        </a-button>
      </div>

      <div v-show="jtopoDetailVisible" ref="nodeDetail" class="jtopo-detail" :style="jtopoDetailStyle">
        <template v-if="nodeDetail && nodeDetail.chType">
          <div style="font-size: 18px;">
            {{nodeDetail && nodeDetail.name}}
          </div>
          <div style="font-size: 10px;">
            {{nodeDetail && nodeDetail.ip}}
          </div>
          <a-row>
            <a-col :span="8">
              <div style="display:flex;justify-content: center; align-items: center;flex-direction: column;">
                <span>{{nodeDetail && Number.parseFloat(nodeDetail.cpuRate) + '%'}}</span>
                <span class="jtopo-detail-desc">CPU使用率</span>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display:flex;justify-content: center; align-items: center;flex-direction: column;">
                <span>{{nodeDetail && Number.parseFloat(nodeDetail.pingRate) + '%'}}</span>
                <span class="jtopo-detail-desc">连通率</span>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display:flex;justify-content: center; align-items: center;flex-direction: column;">
                <span>{{nodeDetail && nodeDetail.netNum}}个</span>
                <span class="jtopo-detail-desc">网络接口数</span>
              </div>
            </a-col>
            <a-col :span="12">
              <div style="display:flex;justify-content: center; align-items: center;flex-direction: column;">
                <span>{{nodeDetail && Number.parseFloat(nodeDetail.memFreeRate) + '%'}}</span>
                <span class="jtopo-detail-desc">物理内存利用率</span>
              </div>
            </a-col>
            <a-col :span="12">
              <div style="display:flex;justify-content: center; align-items: center;flex-direction: column;">
                <span>{{nodeDetail && Number.parseFloat(nodeDetail.swapFreeRate) + '%'}}</span>
                <span class="jtopo-detail-desc">交换内存利用率</span>
              </div>
            </a-col>

          </a-row>
        </template>
        <template v-else>
          <span class="jtopo-detail-desc">虚拟节点</span>
        </template>
      </div>

      <div v-show="jtopoLinkDetailVisible" ref="linkDetail" class="jtopo-detail" style="width: 300px;" :style="jtopoLinkDetailStyle">
        <template v-if="overTargetOnCanvas && overTargetOnCanvas.jtopoDetail">
          <a-row>
            <a-col :span="12">
              <a-row type="flex" justify="center" align="middle" style="flex-direction: column;margin-top: 0;">
                <span class="jtopo-detail-desc">ip</span>
                <span>{{overTargetOnCanvas && overTargetOnCanvas.jtopoDetail.startIp}}</span>
              </a-row>
            </a-col>
            <a-col :span="12">
              <a-row type="flex" justify="center" align="middle" style="flex-direction: column;">
                <span class="jtopo-detail-desc">mac</span>
                <span>{{overTargetOnCanvas && overTargetOnCanvas.jtopoDetail.startMac}}</span>
              </a-row>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-row type="flex" justify="center" align="middle" style="flex-direction: column;">
                <span class="jtopo-detail-desc">ip</span>
                <span>{{overTargetOnCanvas && overTargetOnCanvas.jtopoDetail.endIp}}</span>
              </a-row>
            </a-col>
            <a-col :span="12">
              <a-row type="flex" justify="center" align="middle" style="flex-direction: column;">
                <span class="jtopo-detail-desc">mac</span>
                <span>{{overTargetOnCanvas && overTargetOnCanvas.jtopoDetail.endMac}}</span>
              </a-row>
            </a-col>
          </a-row>
        </template>
      </div>

      <div v-show="contextMenuShow" class="right-click-menu" @click="handleMenu" :style="menuStyle">
        <a-button type="primary" data-index='0'>
          <a-icon type="plus" />
          新增节点
        </a-button>
        <template v-if="targetOnCanvas">
          <a-button data-index='1'>
            <a-icon type="edit" />
            编辑节点
          </a-button>
          <a-button data-index='2'>
            <a-icon type="delete" />
            删除节点
          </a-button>
          <a-button v-show="jtopoList.filter(item => item.topologyLevel !== 1).length" data-index='4'>
              <a-icon type="swap" />
              {{ targetOnCanvas && targetOnCanvas.jtopoDetail && targetOnCanvas.jtopoDetail.relMap ? '取消关联' : '关联拓扑'}}
          </a-button>
          <a-button data-index='3' v-if="targetOnCanvas && ((targetOnCanvas.inLinks && targetOnCanvas.inLinks.length) || (targetOnCanvas.outLinks && targetOnCanvas.outLinks.length))">
            <a-icon type="delete" />
            删除链路
          </a-button>
        </template>
      </div>

      <a-modal
        :mask-closable="false"
        v-model="deleteLinkVisible"
        title="删除链路"
        :ok-button-props="{ props: { disabled: !deleteLinkChecks.length} }"
        :cancel-button-props="{ props: { disabled: false } }"
        ok-text="删除"
        @ok="deleteLinkHandleOk"
        @cancel="deleteLinkChecks = [];targetOnCanvas = null"
      >
        <a-checkbox-group :value="deleteLinkChecks" @change="deleteLinkModalOnChange">
          <a-checkbox v-for="obj in targetOnCanvas && targetOnCanvas.inLinks" :key="obj.nodeId" :value="obj">
            {{obj.nodeA.jtopoDetail.alias}}
          </a-checkbox>
          <a-checkbox v-for="obj in targetOnCanvas && targetOnCanvas.outLinks" :key="obj.nodeId" :value="obj">
            {{obj.nodeZ.jtopoDetail.alias}}
          </a-checkbox>
        </a-checkbox-group>
      </a-modal>

      <a-modal
        :mask-closable="false"
        v-model="relationSubJtopoModalVisible"
        title="关联子拓扑图"
        :ok-button-props="{ props: { disabled: !relationSubJtopoChecks } }"
        :cancel-button-props="{ props: { disabled: false } }"
        ok-text="关联"
        @ok="relationSubJtopoHandleOk"
        @cancel="relationSubJtopoChecks=undefined"
      >
        <a-radio-group v-model="relationSubJtopoChecks" name="radioGroup" @change="relationSubJtopoModalOnChange">
          <template v-for="obj in jtopoList">
            <a-radio :key="obj.topologyId" :value="obj.topologyId" v-if="obj.topologyLevel !== 1">
              {{obj.topologyName}}
            </a-radio>
          </template>
        </a-radio-group>
      </a-modal>

      <a-modal
        v-model="createNodeModalVisible"
        :title="isAddForm?'新增节点':'修改节点'"
        :mask-closable="false"
        :ok-button-props="{ props: { disabled: false } }"
        :cancel-button-props="{ props: { disabled: false } }"
        @ok="handleSubmit"
        @cancel="createNodeForm.resetFields();chooseNodeTypeActiveKey='1';chooseNodeTypeChooseKeys=[];chooseNodeTypeChooseRows=[];"
        :width="800"
      >
        <a-tabs :active-key="chooseNodeTypeActiveKey" @change="chooseNodeTypeChange">
          <a-tab-pane v-if="chooseNodeTypeKeys.includes('1')" key="1" tab="虚拟节点">
            <a-form :form="createNodeForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
              <a-form-item label="节点名称">
                <a-input
                  @keyup.enter="handleSubmit"
                  v-decorator="['alias', { rules: [{ required: true, message: '请输入节点名称' }]}]"
                />
              </a-form-item>
              <a-form-item label="节点ip">
                <a-input
                  @keyup.enter="handleSubmit"
                  v-decorator="['ip', { rules: [{ required: true, message: 'ip格式不正确', pattern: ipRegExp } ] }]"
                />
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane v-if="chooseNodeTypeKeys.includes('2')" key="2" tab="实体节点">
            <div class="table-page-search-wrapper" style="margin-bottom:20px;">
              <a-form layout="inline" :label-col="{span: 6}" :wrapper-col="{span: 18}">
                <a-row :gutter="48">
                  <a-col :lg="12" :md="12" :sm="24">
                    <a-form-item label="设备名称">
                      <a-input v-model="queryParam.name" placeholder="设备名称"/>
                    </a-form-item>
                  </a-col>
                  <a-col :lg="12" :md="12" :sm="24">
                    <a-form-item label="设备IP">
                      <a-input v-model="queryParam.ip" placeholder="设备IP"/>
                    </a-form-item>
                  </a-col>
                  <a-col :lg="12" :md="12" :sm="24">
                    <a-form-item label="设备类型">
                      <a-select v-model="queryParam.chType" placeholder="选择设备类型">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option v-for="(obj, index) in deviceTypes" :value="obj.typeid" :key="index">{{ obj.family }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :lg="12" :md="12" :sm="24"  :push="6">
                    <a-form-item>
                      <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                      <a-button style="margin-left: 8px" @click="() => {queryParam = {};$refs.table.refresh(true)}">重置</a-button>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
            <s-table
              ref="table"
              size="default"
              :custom-row="customRow"
              :row-key="(record) => record.ip"
              :row-selection="rowSelection"
              :columns="chooseSecretRelatedColumns"
              :data="deviceLists"
            >
              <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
              <span slot="chType" slot-scope="text">
                {{ chTypeToFamily(text) }}
              </span>
            </s-table>
          </a-tab-pane>
        </a-tabs>
      </a-modal>
    </div>
  </leftNavLayoutComponent>
</template>

<script>
import { Radio } from 'ant-design-vue';
import { getDedicatedList } from '@/api/monitor';
import { typeList } from '@/api/myDevice';
import { chooseSecretRelatedColumns } from '@/views/monitor/deviceMenu/secretRelated/columns';
import { ipRegExp } from '@/constant/constants';
import { LeftNavComponent, LeftNavLayoutComponent } from '@/components/LeftNavComponent';
import methods from './index';

const beforeUnload = function (e) {
  const confirmationMessage = '如果你已经修改了拓扑，而且没有点击保存按钮，请先点击保存再推出，否则数据会丢失';
  (e || window.event).returnValue = confirmationMessage;
  return confirmationMessage;
};

export default {
  name: 'Jtopo',
  components: {
    LeftNavComponent,
    LeftNavLayoutComponent,
    'a-radio': Radio,
    'a-radio-group': Radio.Group
  },
  data () {
    this.stage = null; // 舞台
    this.beginNode = null; // 开始节点
    this.endNode = null; // 结束节点
    this.tempNodeA = null; // 临时首节点A
    this.tempNodeZ = null; // 临时尾节点Z
    this.timeoutc = null;
    this.canWheel = true; // 鼠标滚轮是否可以滚动
    this.zoomMultiple = 0.9; // 放大倍数
    this.nodeWidth = 40; // 节点宽
    this.mourseoverTimeout = null; // 鼠标悬浮在节点上触发请求详情接口的定时器
    this.mourseoverLinkTimeout = null; // 鼠标悬浮在链路上触发显示链路详情的定时器
    this.nodeInitY = 30; // 节点初始化纵坐标
    return {
      nodeDetail: undefined,
      hasBindEvent: false, // 是否绑定事件
      ipRegExp,
      deviceTypes: [],
      scene: null, // 场景
      jtopoList: [],
      currentJtopo: {},
      currentJtopoIndex: 0,
      noUpdate: true, // 拓扑图上是否有内容更新
      jtopoDetailStyle: {}, // 详情样式
      jtopoLinkDetailStyle: {}, // 链路详情样式
      chooseSecretRelatedColumns,
      queryParam: {
        chType: undefined
      },
      jtopoDetailVisible: false, // 是否显示详情
      jtopoLinkDetailVisible: false, // 是否显示链路详情
      createNodeForm: this.$form.createForm(this, { name: 'createNodeForm' }), // 新建拓扑节点表单
      createJtopoForm: this.$form.createForm(this, { name: 'createJtopoForm' }), // 新建拓扑图表单
      createNodeModalVisible: false, // 新增节点modal
      createOrUpdateJtopoModalVisible: false, // 新建或者修改拓扑图modal
      createOrUpdateJtopoObj: {}, // 保存新增或者修改拓扑图的数据
      relationSubJtopoModalVisible: false, // 关联子拓扑图modal
      targetOnCanvas: null, // 保存当前鼠标点击选择的节点
      overTargetOnCanvas: null, // 保存当前鼠标悬浮的节点
      deleteLinkVisible: false, // 删除节点之间链接modal
      deleteLinkChecks: [], // 删除节点之间的链接checkboxs
      chooseNodeTypeChooseKeys: [], // 选择实体节点选择的radio
      chooseNodeTypeChooseRow: [], // 选择实体节点选择的行
      relationSubJtopoChecks: undefined,
      chooseNodeTypeActiveKey: '1', // 新增或者修改节点时选择的节点类型
      chooseNodeTypeKeys: ['1', '2'], // 新增或者修改节点时选择的节点类型种类
      width: 0, // canvas宽度
      height: 0, // canvas高度
      contextMenuShow: false, // 右键菜单是否显示
      isAddForm: true, // 是否是新增表单
      menuStyle: {}, // 右键菜单样式
      deviceLists: (parameter) => {
        return getDedicatedList(Object.assign(parameter, this.queryParam))
          .then((res) => {
            return res;
          });
      }
    };
  },
  computed: {
    rowSelection () { // 选择实体节点
      return {
        selectedRowKeys: this.chooseNodeTypeChooseKeys,
        type: 'radio',
        hideDefaultSelections: true,
        onChange: (selectedRowKeys, selectedRows) => {
          this.chooseNodeTypeChooseKeys = selectedRowKeys;
          this.chooseNodeTypeChooseRow = selectedRows;
        }
      };
    }
  },
  async beforeRouteLeave (to, from, next) {
    await this.tipUserSaveData();
    window.removeEventListener('beforeunload', beforeUnload);
    next();
  },
  beforeDestroy () {
    this.clearAllAlarmTimeout();
  },
  async mounted () {
    this.jtopoInit();
    this.newScene();
    this.getJtopoList(true);
    const data = await typeList(); // 获取设备菜单列表
    if (data.code === 0) {
      this.deviceTypes = data.data;
    }
  },
  methods: {
    ...methods
  }
};
</script>
<style scoped lang="less">
  @import url(~@/assets/style/less/theme-color.less);
  .jtopo-detail {
    background: @jtopo-detail-bg;
    position: fixed;
    left: 0;
    top: 0;
    padding: 10px;
    max-width: 260px;
    color: #fff;
    .ant-row {
      .ant-col {
        padding-top: 10px;
        margin-top: 10px;
        border-top: 1px solid #165F96;
      }
    }
    &-desc {
      color: #52B0EB;
    }
  }
  .right-click-menu {
    position: fixed;
    top:0;
    left: 0;
    width: 100px;
    // min-height: 100px;
    background: #276fad;
    color: #6ec2ff;
    button {
      background: #276fad;
      color: #6ec2ff;
      border: none;
      width: 100%;
      font-size: 12px;
      text-align: left;
      border-radius: 0;
      &:hover {
        background: #17385F;
      }
    }
  }
  .jtopo-func-menu {
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    right: 10px;
    top: 200px;
    button {
      &:nth-child(1) {
        img {
          width: 17px;
          height: 17px;
        }
      }
      margin-top: 10px;
      width: 30px;
      display:flex;
      justify-content: center;
      align-items: center;
      height: 30px;
      text-align: center;
    }
  }
</style>
