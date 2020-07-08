<template>
  <div class="confinto_box">
    <div class="confinto-title">
      <a-form layout="inline">
        <a-row :gutter="48" style="margin-bottom:10px;text-align:right;">
          <a-col :md="18" :sm="24">
            <span style="float:left;color:#fff;line-height:32px;">配置入库</span>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-input placeholder="请输入配置项名称" v-model="queryParam.deviceName" @keyup.enter="searchLogByDeviceName">
              <a-icon slot="prefix" type="search"/>
            </a-input>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="logid"
      :columns="columns"
      :data="loadData">
      <span slot="deviceName" slot-scope="text">
        {{ text }}
      </span>
    </s-table>
  </div>
</template>
<script>
import moment from 'moment';
import { getDeviceLog } from '@/api/myDevice';
const statusMap = {
  0: {
    status: '0',
    text: '专用服务器'
  },
  1: {
    status: '1',
    text: '交换机'
  },
  2: {
    status: '2',
    text: '数据库'
  },
  3: {
    status: '3',
    text: '防火墙'
  }
};
export default {
  // 配置频度统计
  name: 'ConfInto',
  data () {
    return {
      // 查询参数
      queryParam: {
      },
      selectedRowKeys: [],
      selectedRows: [],
      statusMap,
      // 表头
      columns: [
        {
          title: '配置名称',
          dataIndex: 'deviceName',
          scopedSlots: { customRender: 'deviceName' },
          sorter: true
        },
        {
          title: '日志内容',
          dataIndex: 'logcontent',
          scopedSlots: { customRender: 'logcontent' },
          sorter: true
        },
        {
          title: '日志结果',
          dataIndex: 'result',
          scopedSlots: { customRender: 'result' },
          sorter: true
        },
        {
          title: '设备IP',
          dataIndex: 'ip',
          sorter: true
        },
        {
          title: '时间',
          dataIndex: 'logtime',
          scopedSlots: { customRender: 'logtime' },
          sorter: true
        },
        {
          title: '操作类型',
          dataIndex: 'logtype',
          scopedSlots: { customRender: 'logtype' },
          sorter: true
        },
        {
          title: '操作者',
          dataIndex: 'logoperator',
          scopedSlots: { customRender: 'logoperator' },
          sorter: true
        }
      ],
      columnData: {
        pageNo: 1,
        pageSize: 4,
        totalCount: 8,
        totalPage: 2
        // data: [{
        // }]
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDeviceLog(Object.assign(parameter, this.queryParam))
          .then((res) => {
            return res;
          });
      }
    };
  },
  mounted () {
    // getDeviceLog(Object.assign(this.queryParam))
    //       .then(res => {
    //         console.log(res)
    //       })
  },
  filters: {
    statusFilter (type) {
      return statusMap[type]?.text;
    },
    statusTypeFilter (type) {
      return statusMap[type]?.text;
    },
    percenFilter (num) {
      return `${num * 100}%`;
    }
  },
  created () {
    // getDeviceList({ t: new Date() })
  },
  methods: {
    searchLogByDeviceName () {
      console.log(this.queryParam.deviceName);
      this.$refs.table.refresh(true);
    },
    handleOk () {
      this.$refs.table.refresh();
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      };
    }
  }
};
</script>
<style scoped>
.confinto-title{
  padding: 5px 20px;
  height: 40px;
  color: #fff;
  font-size: 12px;
  background: #043c68;
}
</style>
