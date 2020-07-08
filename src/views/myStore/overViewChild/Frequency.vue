<template>
  <div>
    <div class="frequency-title">
      <a-form layout="inline">
        <a-row :gutter="16" style="margin-bottom:10px;text-align:right;">
          <a-col :md="12" :sm="24">
            <span style="float:left;color:#fff;line-height:32px;">配置频度统计</span>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-range-picker  @change="onChange"/>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      key='id'
      :columns="columns"
      :data="loadData"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="type" slot-scope="text">
        {{ text }}
      </span>
      <span slot="name" slot-scope="text">
        {{ text }}
      </span>
      <span slot="changeNu" slot-scope="text">
        {{ text | percenFilter }}
      </span>
      <span slot="queryNu" slot-scope="text">
        {{ text | percenFilter }}
      </span>
      <template slot="footer">
        <!-- 当前查询到{{deviceCount}}条数据 -->
      </template>
    </s-table>
  </div>
</template>
<script>
import moment from 'moment';
import { getMyDevice } from '@/api/myDevice';
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
  name: 'Frequency',
  data () {
    return {
      // 查询参数
      selectedRowKeys: [],
      selectedRows: [],
      statusMap,
      queryParam: { typeId: '-1' },
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' },
          sorter: true
        },
        {
          title: '类型名称',
          dataIndex: 'family',
          scopedSlots: { customRender: 'family' },
          sorter: true
        },
        {
          title: '设备名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          sorter: true
        },
        {
          title: '变更次数',
          dataIndex: 'modifynum',
          scopedSlots: { customRender: 'modifynum' },
          sorter: true
        },
        {
          title: '查询次数',
          dataIndex: 'querynum',
          scopedSlots: { customRender: 'querynum' },
          sorter: true
        }
      ],
      deviceCount: 0,
      myData: {
        pageNo: 1,
        pageSize: 5,
        totalCount: 10,
        totlaPage: 2,
        data: [
          { type: '专用服务器', name: 'server01', change: '3', queryNu: '4' },
          { type: '专用服务器', name: 'server01', change: '3', queryNu: '4' },
          { type: '专用服务器', name: 'server01', change: '3', queryNu: '4' },
          { type: '专用服务器', name: 'server01', change: '3', queryNu: '4' },
          { type: '专用服务器', name: 'server01', change: '3', queryNu: '4' },
          { type: '专用服务器', name: 'server01', change: '3', queryNu: '4' },
          { type: '专用服务器', name: 'server01', change: '3', queryNu: '4' },
          { type: '专用服务器', name: 'server01', change: '3', queryNu: '4' },
          { type: '专用服务器', name: 'server01', change: '3', queryNu: '4' }
        ]
      },
      //  loadData: parameter => {
      //    console.log(this.myData)
      //   return this.myData
      // }
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getMyDevice(Object.assign(parameter, this.queryParam))
          .then((res) => {
            this.deviceCount = res.data.length;
            return res;
          });
      }
    };
  },
  filters: {
    statusFilter (type) {
      return statusMap[type]?.text;
    },
    statusTypeFilter (type) {
      return statusMap[type]?.text;
    },
    percenFilter (num) {
      return `${num * 100}`;
    }
  },
  created () {
    // getMyDevice({ t: new Date() })
  },
  methods: {
    onChange (date, dateString) {
      console.log(date, dateString);
      // 开始时间
      this.queryParam.startTime = moment(dateString[0]).format('YYYY-MM-DD 00:00:00');
      // 结束时间
      this.queryParam.endTime = moment(dateString[1]).format('YYYY-MM-DD 23:59:59');
      // 刷新列表
      this.$refs.table.refresh(true);
      console.log('this.queryParam.startTime', this.queryParam.startTime);
      console.log('this.queryParam.endTime', this.queryParam.endTime);
    },
    handleOk () {
      this.$refs.table.refresh();
    },
    resetSearchForm () {
      this.queryParam = {
        // date: moment(new Date())
      };
    }
  }
};
</script>

<style scoped>
/deep/ .ant-table-footer {
  color:#fff;
  background-color: #08254e;
}
.frequency-title{
  padding: 5px 20px;
  height: 40px;
  color: #fff;
  font-size: 12px;
  background: #043c68;
}
</style>
