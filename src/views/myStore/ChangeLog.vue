<template>
  <div class="changelog-box">
    <div class="changelog-form">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-input v-model="queryParam.deviceName" placeholder="请输入设备名称" @keyup.enter="$refs.table.refresh(true)" style="width:100%;"/>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-select v-model="queryParam.deviceType" placeholder="请选择设备类型">
              <a-select-option v-for="(obj, index) in typeListBysearch" :value="obj.family" :key="index">{{ obj.family }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-input v-model="queryParam.logtype" placeholder="请输入操作类型" @keyup.enter="$refs.table.refresh(true)" />
          </a-col>
          <a-col :md="4" :sm="24">
            <a-input v-model="queryParam.logoperator" placeholder="请输入操作者" @keyup.enter="$refs.table.refresh(true)" />
          </a-col>
          <a-col :md="4" :sm="24">
            <a-range-picker v-model="searchTime" @change="onChange"/>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button type="primary" style="margin-left: 8px" @click="() => {queryParam = {};$refs.table.refresh(true)}">重置</a-button>
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
      <span slot="name" slot-scope="text">
        {{ text }}
      </span>
    </s-table>
  </div>
</template>

<script>
import { getDeviceLog, typeList } from '@/api/myDevice';
export default {
  // 配置频度统计
  name: 'ChangeLog',
  data () {
    return {
      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      searchTime: undefined,
      typeListBysearch: [],
      // 表头
      columns: [
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          scopedSlots: { customRender: 'name' },
          sorter: true

        },
        {
          title: '设备类型',
          dataIndex: 'deviceType',
          scopedSlots: { customRender: 'deviceType' },
          sorter: true
        },
        {
          title: '设备IP',
          dataIndex: 'ip'
        },
        {
          title: '描述',
          dataIndex: 'logcontent',
          scopedSlots: { customRender: 'logcontent' },
          sorter: true
        },
        {
          title: '时间',
          dataIndex: 'logtime',
          scopedSlots: { customRender: 'logtime' },
          sorter: true
        },
        {
          title: '操作者',
          dataIndex: 'logoperator',
          scopedSlots: { customRender: 'logoperator' },
          sorter: true
        },
        {
          title: '操作类型',
          dataIndex: 'logtype',
          scopedSlots: { customRender: 'logtype' },
          sorter: true
        },
        {
          title: '结果',
          dataIndex: 'result',
          scopedSlots: { customRender: 'result' },
          sorter: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDeviceLog(Object.assign(parameter, this.queryParam))
          .then((res) => {
            return res;
          });
      }
    };
  },
  async mounted () {
    const data = await typeList();
    if (data.code === 0) {
      this.typeListBysearch = data.data;
    }
  },
  methods: {
    onChange (date, dateString) {
      this.searchTime = date;
      this.queryParam.logtimestart = dateString[0];
      this.queryParam.logtimeend = dateString[1];
    }
  }
};
</script>
<style lang="less" scope>
.changelog-box{
  padding: 10px;
  .changelog-form{
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
