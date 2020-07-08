const renderEnable = (text, row, index) => {
  if (text === false) {
    return '否';
  } else if (text === true) {
    return '是';
  }
};
const columns = [
  {
    title: '告警名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    fixed: 'left',
    width: 150,
    scopedSlots: { customRender: 'name' },
    sorter: true
  },
  {
    title: '告警来源',
    dataIndex: 'typeName',
    key: 'typeName',
    align: 'center',
    fixed: 'left',
    width: 150,
    scopedSlots: { customRender: 'typeName' },
    sorter: true
  },
  {
    title: '告警内容',
    dataIndex: 'content',
    key: 'content',
    align: 'center',
    width: 220,
    scopedSlots: { customRender: 'content' },
    sorter: true
  },
  {
    title: '是否告警',
    dataIndex: 'enable',
    key: 'enable',
    align: 'center',
    scopedSlots: { customRender: 'enable' },
    sorter: true,
    customRender: renderEnable
  },
  {
    title: '初级阈值',
    dataIndex: 'value1',
    key: 'value1',
    align: 'center',
    scopedSlots: { customRender: 'value1' },
    sorter: true
  },
  {
    title: '中级阈值',
    dataIndex: 'value2',
    key: 'value2',
    align: 'center',
    scopedSlots: { customRender: 'value2' },
    sorter: true
  },
  {
    title: '高级阈值',
    dataIndex: 'value3',
    key: 'value3',
    align: 'center',
    scopedSlots: { customRender: 'value3' },
    sorter: true
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
    align: 'center',
    scopedSlots: { customRender: 'unit' },
    sorter: true
  },
  {
    title: '添加时间',
    dataIndex: 'time',
    key: 'time',
    align: 'center',
    width: 200,
    scopedSlots: { customRender: 'time' },
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    align: 'center',
    width: 100,
    scopedSlots: { customRender: 'operation' }
  }
];
const enableTypeConstant = {
  0: '否',
  1: '是'
};
export {
  columns,
  enableTypeConstant
};
