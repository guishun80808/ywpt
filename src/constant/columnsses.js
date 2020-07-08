const logColumns = [
  {
    title: '序号',
    width: 80,
    align: 'center',
    // customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.defaultPageSize + (index + 1)}`
    customRender: (text, record, index) => (index + 1)
  },
  {
    title: '操作人',
    dataIndex: 'logoperator',
    align: 'center',
    scopedSlots: { customRender: 'logoperator' },
    sorter: true
  },
  {
    title: '操作时间',
    dataIndex: 'logtime',
    align: 'center',
    scopedSlots: { customRender: 'logtime' },
    sorter: true
  },
  {
    title: '日志内容',
    align: 'center',
    dataIndex: 'logcontent',
    sorter: true
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    align: 'center',
    scopedSlots: { customRender: 'ip' },
    sorter: true
  },
  {
    title: '操作模块',
    dataIndex: 'modelname',
    align: 'center',
    sorter: true,
    scopedSlots: { customRender: 'modelname' }
  },
  {
    title: '操作类型',
    dataIndex: 'logtype',
    align: 'center',
    sorter: true,
    scopedSlots: { customRender: 'logtype' }
  },
  {
    title: '操作结果',
    dataIndex: 'result',
    align: 'center',
    sorter: true,
    scopedSlots: { customRender: 'result' }
  }
];

const mesColumnsReaded = [
  {
    title: '序号',
    width: 80,
    align: 'center',
    // customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.defaultPageSize + (index + 1)}`
    customRender: (text, record, index) => (index + 1)
  },
  {
    title: '名称',
    dataIndex: 'operator',
    align: 'center',
    scopedSlots: { customRender: 'operator' },
    sorter: true
  },
  {
    title: '操作时间',
    dataIndex: 'operatetime',
    align: 'center',
    scopedSlots: { customRender: 'operatetime' },
    sorter: true
  },
  {
    title: '操作类型',
    dataIndex: 'OperateType',
    align: 'center',
    sorter: true,
    scopedSlots: { customRender: 'OperateType' }
  },
  {
    title: '处理结果',
    dataIndex: 'result',
    align: 'center',
    sorter: true,
    scopedSlots: { customRender: 'result' }
  },
  {
    title: '备注',
    dataIndex: 'describe',
    align: 'center',
    sorter: true,
    scopedSlots: { customRender: 'describe' }
  }
];
const mesColumnsNoReaded = [
  {
    title: '序号',
    width: 80,
    align: 'center',
    // customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.defaultPageSize + (index + 1)}`
    customRender: (text, record, index) => (index + 1)
  },
  {
    title: '名称',
    dataIndex: 'operator',
    align: 'center',
    scopedSlots: { customRender: 'operator' },
    sorter: true
  },
  {
    title: '操作时间',
    dataIndex: 'operatetime',
    align: 'center',
    scopedSlots: { customRender: 'operatetime' },
    sorter: true
  },
  {
    title: '操作内容',
    dataIndex: 'describe',
    align: 'center',
    scopedSlots: { customRender: 'describe' },
    sorter: true
  },
  {
    title: '操作类型',
    dataIndex: 'OperateType',
    align: 'center',
    scopedSlots: { customRender: 'OperateType' },
    sorter: true
  },
  {
    title: '操作',
    key: 'caozuo',
    fixed: 'right',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
];
const columnsUsers = [
  {
    title: '序号',
    width: 80,
    align: 'center',
    // customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.defaultPageSize + (index + 1)}`
    customRender: (text, record, index) => (index + 1)
  },
  {
    title: '用户名称',
    dataIndex: 'name',
    align: 'center',
    scopedSlots: { customRender: 'name' },
    sorter: true
  },
  {
    title: '用户昵称',
    dataIndex: 'byname',
    align: 'center',
    scopedSlots: { customRender: 'byname' },
    sorter: true
  },
  {
    title: '用户描述',
    dataIndex: 'describe',
    align: 'center',
    scopedSlots: { customRender: 'describe' },
    sorter: true
  },
  {
    title: '用户邮箱',
    dataIndex: 'email',
    align: 'center',
    scopedSlots: { customRender: 'email' },
    sorter: true
  },
  {
    title: '创建时间',
    dataIndex: 'createtime',
    align: 'center',
    scopedSlots: { customRender: 'createtime' },
    sorter: true
  },
  {
    title: '是否锁定',
    dataIndex: 'islocked',
    align: 'center',
    scopedSlots: { customRender: 'islocked' },
    sorter: true
  },
  {
    title: '操作',
    key: 'caozuo',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
];

export {
  logColumns, mesColumnsReaded, mesColumnsNoReaded, columnsUsers
};
