import moment from 'moment';
import cloneDeep from 'lodash.clonedeep';
export const storeConfigColumn = [
  {
    title: '设备名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
    sorter: true
  },
  {
    title: '设备类别',
    dataIndex: 'family',
    scopedSlots: { customRender: 'family' },
    sorter: true
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    scopedSlots: { customRender: 'ip' },
    sorter: true
  },
  {
    title: '所属部门',
    dataIndex: 'department',
    scopedSlots: { customRender: 'department' },
    sorter: true
  },
  {
    title: '采购时间',
    dataIndex: 'buytime',
    scopedSlots: { customRender: 'buytime' },
    sorter: true
  },
  {
    title: '监控状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    sorter: true
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    scopedSlots: { customRender: 'remarks' },
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
];

export const allFormItems = {
  name: {
    label: '设备名称',
    fieldType: 'input',
    decorator: [
      'name',
      { rules: [{ required: true, message: '设备名称为必填项!' }] }
    ],
    placeholder: '请输入设备名称'
  },
  ip: {
    label: '设备IP',
    fieldType: 'input',
    decorator: [
      'ip',
      { rules: [
        { required: true, message: '设备ip为必填项!' },
        { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: 'ip格式不正确!' }
      ] }
    ],
    placeholder: '请输入设备ip'
  },
  macRequired: {
    label: 'MAC地址',
    fieldType: 'input',
    decorator: [
      'mac',
      {
        rules:
        [
          { required: true, message: '设备MAC为必填项!' },
          { pattern: /((([a-f0-9]{2}:){5})|(([a-f0-9]{2}-){5}))[a-f0-9]{2}/gi, message: 'MAC地址格式不正确!' }
        ]
      }
    ],
    placeholder: '请输入设备MAC'
  },
  macNoRequired: {
    label: 'MAC地址',
    fieldType: 'input',
    decorator: [
      'mac',
      { rules: [{ pattern: /((([a-f0-9]{2}:){5})|(([a-f0-9]{2}-){5}))[a-f0-9]{2}/gi, message: 'MAC地址格式不正确!' }] }
    ],
    placeholder: '请输入设备MAC'
  },
  departmentRequired: {
    label: '所在部门',
    fieldType: 'select',
    decorator: [
      'departmentid',
      { rules: [{ required: true, message: '所在部门为必填项!' }] }
    ],
    placeholder: '请选择设备所在部门',
    selectDataList: []
  },
  departmentNoRequired: {
    label: '所在部门',
    fieldType: 'select',
    decorator: ['departmentid'],
    placeholder: '请选择设备所在部门',
    selectDataList: []
  },
  managerRequired: {
    label: '责任人',
    fieldType: 'select',
    decorator: [
      'manager',
      { rules: [{ required: true, message: '设备责任人为必填项!' }] }
    ],
    placeholder: '请输入设备责任人',
    selectDataList: []
  },
  managerNoRequired: {
    label: '责任人',
    fieldType: 'select',
    decorator: ['manager'],
    placeholder: '请输入设备责任人',
    selectDataList: []
  },
  port: {
    label: '端口号',
    fieldType: 'input',
    decorator: [
      'port',
      { rules: [{ required: true, message: '端口号为必填项!' }] }
    ],
    placeholder: '请输入端口号'
  },
  account: {
    label: '用户名',
    fieldType: 'input',
    decorator: [
      'account',
      { rules: [{ required: true, message: '用户名为必填项!' }] }
    ],
    placeholder: '请输入用户名'
  },
  pwd: {
    label: '密码',
    fieldType: 'input',
    decorator: [
      'pwd',
      { rules: [{ required: true, message: '密码为必填项!' }] }
    ],
    placeholder: '请输入密码'
  },
  collectmode: {
    label: '监控节点采集方式',
    fieldType: 'input',
    decorator: [
      'collectmode',
      { rules: [{ required: true, message: '监控节点采集方式为必填项!' }] }
    ],
    placeholder: '请输入监控节点采集方式'
  },
  locationRequired: {
    label: '物理地址',
    fieldType: 'input',
    decorator: [
      'location', {
        rules: [{ required: true, message: '设备物理地址为必填项!' }]
      }
    ],
    placeholder: '请输入设备物理地址'
  },
  locationNoRequired: {
    label: '物理地址',
    fieldType: 'input',
    decorator: ['location'],
    placeholder: '请输入设备物理地址'
  },
  firmRequired: {
    label: '生产厂商名称',
    fieldType: 'input',
    decorator: [
      'firm',
      { rules: [{ required: true, message: '生产厂商名称必填' }] }
    ],
    placeholder: '请输入设备生产厂商名称'
  },
  firmNoRequired: {
    label: '生产厂商名称',
    fieldType: 'input',
    decorator: ['firm'],
    placeholder: '请输入设备生产厂商名称'
  },
  buytimeRequired: {
    label: '采购时间',
    fieldType: 'date-picker',
    decorator: [
      'buytime',
      {
        rules: [{ required: true, message: '请选择采购时间' }],
        initialValue: moment(new Date(), 'YYYY-MM-DD')
      }
    ],
    placeholder: '请输入设备采购时间',
    disabledEndDate: (endValue) => {
      const startValue = new Date();
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() <= endValue.valueOf();
    }
  },
  buytimeNoRequired: {
    label: '采购时间',
    fieldType: 'date-picker',
    decorator: [
      'buytime',
      { initialValue: moment(new Date(), 'YYYY-MM-DD') }
    ],
    placeholder: '请输入设备采购时间',
    disabledEndDate: (endValue) => {
      const startValue = new Date();
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() <= endValue.valueOf();
    }
  },
  statusRequired: {
    label: '监控状态',
    fieldType: 'select',
    decorator: [
      'status',
      { rules: [{ required: true, message: '请选择监控状态' }] }
    ],
    placeholder: '请选择监控状态',
    selectDataList: [
      {
        name: '启用',
        value: '1'
      },
      {
        name: '禁用',
        value: '0'
      }
    ]
  },
  statusNoRequired: {
    label: '监控状态',
    fieldType: 'select',
    decorator: ['status'],
    placeholder: '请选择监控状态',
    selectDataList: [
      {
        name: '启用',
        value: '1'
      },
      {
        name: '禁用',
        value: '0'
      }
    ]
  },
  remarksRequired: {
    label: '备注',
    fieldType: 'input',
    decorator: [
      'remarks',
      { rules: [{ required: true, message: '请输入备注' }] }
    ],
    placeholder: '请输入备注'
  },
  remarksNoRequired: {
    label: '备注',
    fieldType: 'input',
    decorator: ['remarks'],
    placeholder: '请输入备注'
  }
};

export const smSpecialInfoDevice = [ // SM专用信息设备
  cloneDeep(allFormItems.ip),
  cloneDeep(allFormItems.name),
  cloneDeep(allFormItems.macRequired),
  cloneDeep(allFormItems.departmentRequired),
  cloneDeep(allFormItems.managerRequired),
  cloneDeep(allFormItems.locationRequired),
  cloneDeep(allFormItems.firmNoRequired),
  cloneDeep(allFormItems.buytimeNoRequired),
  cloneDeep(allFormItems.statusNoRequired),
  cloneDeep(allFormItems.remarksNoRequired)
];
export const smSpecialServer = smSpecialInfoDevice; // SM专用信息设备——SM专用服务器
export const smSpecialSwitch = smSpecialInfoDevice; // SM专用信息设备——SM专用交换机
export const smSpecialSecurityDevice = smSpecialInfoDevice; // SM专用信息设备——SM专用安全设备
export const smSpecialDesktop = smSpecialInfoDevice; // SM专用信息设备——SM专用桌面机

export const adaptationSoftSource = [ // 适配软件资源
  cloneDeep(allFormItems.ip),
  cloneDeep(allFormItems.name),
  cloneDeep(allFormItems.firmNoRequired),
  cloneDeep(allFormItems.departmentRequired),
  cloneDeep(allFormItems.managerRequired),
  cloneDeep(allFormItems.buytimeNoRequired),
  cloneDeep(allFormItems.statusNoRequired),
  cloneDeep(allFormItems.remarksNoRequired)
];
export const securityDatabase = adaptationSoftSource; // 适配软件资源——安全数据库
export const securityMiddleware = adaptationSoftSource; // 适配软件资源——安全中间件

export const currencyInfoDeviceServer = [ // 通用信息设备——服务器
  cloneDeep(allFormItems.ip),
  cloneDeep(allFormItems.name),
  cloneDeep(allFormItems.collectmode),
  cloneDeep(allFormItems.port),
  cloneDeep(allFormItems.macNoRequired),
  cloneDeep(allFormItems.departmentNoRequired),
  cloneDeep(allFormItems.managerNoRequired),
  cloneDeep(allFormItems.locationNoRequired),
  cloneDeep(allFormItems.firmNoRequired),
  cloneDeep(allFormItems.buytimeNoRequired),
  cloneDeep(allFormItems.statusNoRequired),
  cloneDeep(allFormItems.remarksNoRequired)
];
export const currencyInfoDeviceNetworkDevice = currencyInfoDeviceServer; // 通用信息设备——网络设备

export const currencyInfoDeviceSecurityDevice = [ // 通用信息设备——安全设备
  cloneDeep(allFormItems.ip),
  cloneDeep(allFormItems.name),
  cloneDeep(allFormItems.macNoRequired),
  cloneDeep(allFormItems.departmentNoRequired),
  cloneDeep(allFormItems.managerNoRequired),
  cloneDeep(allFormItems.locationNoRequired),
  cloneDeep(allFormItems.firmNoRequired),
  cloneDeep(allFormItems.buytimeNoRequired),
  cloneDeep(allFormItems.statusNoRequired),
  cloneDeep(allFormItems.remarksNoRequired)
];

export const currencySoftSourceDatabase = [ // 通用软件资源——数据库
  cloneDeep(allFormItems.ip),
  cloneDeep(allFormItems.name),
  cloneDeep(allFormItems.account),
  cloneDeep(allFormItems.pwd),
  cloneDeep(allFormItems.port),
  cloneDeep(allFormItems.firmNoRequired),
  cloneDeep(allFormItems.departmentNoRequired),
  cloneDeep(allFormItems.managerNoRequired),
  cloneDeep(allFormItems.buytimeNoRequired),
  cloneDeep(allFormItems.statusNoRequired),
  cloneDeep(allFormItems.remarksNoRequired)
];
export const currencySoftSourceMiddleware = [ // 通用软件资源——中间件
  cloneDeep(allFormItems.ip),
  cloneDeep(allFormItems.name),
  cloneDeep(allFormItems.firmRequired),
  cloneDeep(allFormItems.departmentRequired),
  cloneDeep(allFormItems.managerRequired),
  cloneDeep(allFormItems.buytimeRequired),
  cloneDeep(allFormItems.statusRequired),
  cloneDeep(allFormItems.remarksRequired)
];
export const formItemsMap = {
  '0': smSpecialServer,
  '1': smSpecialSwitch,
  '3': smSpecialSecurityDevice,
  '6': smSpecialDesktop,
  '4': securityDatabase,
  '5': securityMiddleware,
  '7': currencyInfoDeviceServer,
  '2': currencyInfoDeviceNetworkDevice,
  '9': currencyInfoDeviceSecurityDevice,
  '10': currencySoftSourceDatabase,
  '11': currencySoftSourceMiddleware
};
