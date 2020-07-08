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
      style="width:100%"
       ref="tableNoRead"
      size="default"
      v-show="hasRead"
      :columns="mesColumnsNoReaded"
      :data="noReadList"
      :rowKey="(record,index) => index"
      :scroll='{y:600}'
      showPagination="auto"
    >
    <span
        slot="operator"
        slot-scope="operator"
      >{{ operator | getName  }}</span>
      <a slot="action" slot-scope="text,record" href="javascript:;">
        <span @click="handelAgree(record)">通过</span>
        <span style="margin-left:10px" @click="handelNoAgree(record)">驳回</span>
      </a>
    </s-table>
    <s-table
      style="width:100%"
       ref="table"
      size="default"
      v-show="!hasRead"
      :columns="mesColumnsReaded"
      :rowKey="(record,index) => index"
      :data="readedList"
      :scroll='{y:600}'
      showPagination="auto"
    >
      <span
        slot="operator"
        slot-scope="operator"
      >{{ operator | getName }}</span>
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
import { mapGetters } from 'vuex';
import { msgProcess, getSystemMsgList } from '@/api/system';
import { mesColumnsNoReaded, mesColumnsReaded } from '@/constant/columnsses';
import { userNameMapConstant } from '@/constant/constantsMap';
export default {
  name: 'SystemLog',
  computed: {
    ...mapGetters(['userInfo'])
  },
  filters: {
    getName (value) {
      return userNameMapConstant[value] || value;
    }
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
        messagestatus: '1' // 已读
      },
      queryParamNoRead: {
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
      // 加载数据方法 必须为 Promise 对象
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
    handelNoAgree (row) {
      this.modalTitle = '驳回理由';
      this.visible = true;
      this.agrOrNo = false;
      this.currentRow = row;
    },
    handelAgree (row) {
      this.modalTitle = '通过理由';
      this.visible = true;
      this.agrOrNo = true;
      this.currentRow = row;
    },
    async handleOk (e) {
      let params = null;
      const self = this;
      if (this.agrOrNo) {
        params = {
          messageid: self.currentRow.messageid,
          operator: self.currentRow.operator,
          describe: '',
          result: '1'
        };
        params.describe = this.msgRemaker;
        if (this.currentRow.OperateType === '修改用户') {
          params.oldname = this.currentRow.NewName;
        }
        const data = await msgProcess(params);
        if (data.code === 0) {
          this.$message.success('已通过');
          this.$refs.tableNoRead.refresh(true);
          this.$refs.table.refresh(true);
          this.visible = false;
          this.msgRemaker = '';
        }
      } else {
        if (this.msgRemaker === '') {
          this.$message.warning('请填写驳回理由！');
          return;
        }
        params = {
          messageid: self.currentRow.messageid,
          operator: self.currentRow.operator,
          result: '0'
        };
        params.describe = this.msgRemaker;
        const data = await msgProcess(params);
        if (data.code === 0) {
          this.$message.success('已驳回');
          this.$refs.tableNoRead.refresh(true);
          this.$refs.table.refresh(true);
          this.visible = false;
          this.msgRemaker = '';
        }
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
      this.$refs.table.refresh(true);
    },
    noReadClick () {
      this.hasRead = true;
      this.noprimary = 'primary';
      this.primary = '';
      this.$refs.tableNoRead.refresh(true);
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
    background: rgb(29, 70, 118)
}
}
#sysmsg{
  padding: 20px;
}
</style>
<style>
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
.sysmsg-sys .ant-table-fixed-header .ant-table-scroll .ant-table-header{
  width: 101%;
}
.sysmsg-sys .ant-table-scroll .ant-table-header>table{
  margin-bottom: 9px;
}
</style>
