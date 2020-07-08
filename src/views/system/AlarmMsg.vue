<template>
  <div :bordered="false" class="sysmsg-sys table-content">
     <header class="contentHeader">{{$route.meta.title}}</header>
    <div class="table-page-search-wrapper" id="sysmsg">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="10" :sm="24" style="margin-bottom:15px;">
            <a-button :type="noprimary" @click="noReadClick">未处理（{{hasNoTotol}}）</a-button>
            <a-button
              style="margin-left: 20px"
              :type="primary"
              @click="readedClick"
            >已处理（{{hasTotol}}）</a-button>
          </a-col>
        </a-row>
      </a-form>
      <s-table
      :pagination="pagination1"
      v-show="hasRead"
      :columns="mesColumnsNoReaded"
      :rowKey="(record,index) => index"
      :data-source="noReadList"
      @change="handleTableChange1"
    >
      <a slot="action" slot-scope="text,record" href="javascript:;">
        <span @click="handelAgree(record)">处理</span>
      </a>
    </s-table>
    <s-table
      v-show="!hasRead"
      :columns="mesColumnsReaded"
      :rowKey="(record,index) => index"
      :data="readedList"
    >
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span
        slot="result"
        slot-scope="result"
      >{{ result === "0" ? "已驳回" : result === "1" ? "已通过" : "" }}</span>
    </s-table>
    </div>
    <a-modal
      :title="modalTitle"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-input v-model="msgRemaker" placeholder="请输入" />
    </a-modal>

  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { resolvealarm } from '@/api/alarm';
import { getSystemMsgList } from '@/api/system';
import { mesColumnsNoReaded, mesColumnsReaded } from '@/constant/columnsses';
import { USER_INFO } from '@/store/mutation-types';

export default {
  name: 'SystemLog',
  computed: {
    ...mapGetters(['userInfo'])
  },
  data () {
    return {
      modalTitle: '通过理由',
      currentRow: null,
      msgRemaker: '',
      visible: false,
      confirmLoading: false,
      hasNoTotol: 0,
      hasTotol: 0,
      // 查询参数
      queryParam: {
        username: Vue.ss.get(USER_INFO).name,
        msgstatus: '1' // 已读
      },
      msgstatus: {
        username: Vue.ss.get(USER_INFO).name,
        messagestatus: '0' // 未读
      },
      logTypes: {
        0: '管理员消息',
        1: '审核消息',
        2: '系统消息',
        3: '其他消息'
      },
      statusList: {
        0: '已审核',
        1: '未审核'
      },
      selectedRowKeys: [],
      selectedRows: [],
      hasRead: true,
      agrOrNo: true,
      primary: '',
      noprimary: 'primary',
      // 表头
      mesColumnsReaded,
      mesColumnsNoReaded,
      readedList: (parameter) => getSystemMsgList(Object.assign(parameter, this.queryParam))
        .then((res) => {
          this.hasTotol = res.count;
          return res;
        }),
      noReadList: (parameter) => getSystemMsgList(Object.assign(parameter, this.queryParamNoRead))
        .then((res) => {
          this.hasNoTotol = res.count;
          return res;
        })
    };
  },
  methods: {
    handelAgree (row) {
      this.modalTitle = '备注';
      this.visible = true;
      this.agrOrNo = true;
      this.currentRow = row;
    },
    handleOk (e) {
      let params = null;
      const self = this;
      if (this.agrOrNo) {
        params = {
          id: self.currentRow.NewName,
          dealuser: self.userInfo.name,
          msg: ''
        };
        params.msg = this.msgRemaker;
        if (this.currentRow.OperateType === '修改用户') {
          params.oldname = this.currentRow.NewName;
        }
        resolvealarm(params).then((res) => {
          if (res.code === 0) {
            this.$message.success('已处理');
            this.$refs.tableNoRead.refresh(true);
            this.$refs.table.refresh(true);
            this.visible = false;
            this.msgRemaker = '';
          } else {
            this.$message.warning('处理失败');
          }
        });
      }
    },
    handleCancel (e) {
      this.visible = false;
      this.msgRemaker = '';
    },
    readedClick () {
      this.hasRead = false;
      this.noprimary = '';
      this.primary = 'primary';
    },
    noReadClick () {
      this.hasRead = true;
      this.noprimary = 'primary';
      this.primary = '';
    }
  }
};
</script>
<style lang="less" scoped>
.table-content {
    min-height: 100%;
    height: 100%;
    min-height: 100%;
    background-color: #163c67;
    .contentHeader {
    height: 40px;
    line-height: 35px;
    font-size: 16px;
    padding-left: 20px;
    color: #fff;
    margin-bottom: 15px;
    background: rgb(29, 70, 118)
}
}
#sysmsg{
  padding: 20px;
}
</style>
<style>
.contentHeader {
    height: 40px;
    line-height: 50px;
    font-size: 16px;
    padding-left: 20px;
    color: #fff;
    margin-bottom: 15px;
}
#sysmsg .ant-table-placeholder {
    position: relative;
    z-index: 1;
    margin-top: -1px;
    padding: 16px 16px;
    font-size: 14px;
    text-align: center;
    border: 1px solid #1d558f;
    background: #18477a;
    border-radius: 0 0 2px 2px;
}
.sysmsg-sys ::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background-color: rgb(37, 97, 148);
  border-color: rgb(37, 97, 148);
}
/*定义滑块 内阴影+圆角*/
.sysmsg-sys ::-webkit-scrollbar-thumb {
  /*  border-radius:5px; */
  -webkit-box-shadow: inset 0 0 6px #409eff;
  background-color: #409eff;
  border-color: rgb(37, 97, 148);
}
/*定义滚动条轨道 内阴影+圆角*/
.sysmsg-sys ::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  width: 8px;
  background-color: rgb(37, 97, 148);
  border-color: rgb(37, 97, 148);
}
.sysmsg-sys .ant-table-scroll .ant-table-header>table{
  margin-bottom: 9px;
}
</style>
