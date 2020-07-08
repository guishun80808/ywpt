export const ipRegExp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
export const passRegExp = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,}).{8,}$/;

export const CHART_LINE_TYPE = '1'; // 折线图
export const CHART_BAR_TYPE = '2'; // 柱状图
export const CHART_PIE_TYPE = '3'; // 饼状图
export const CHART_GAUGE_TYPE = '4'; // 仪表盘
export const CHART_SINGLE_VALUE_TYPE = '5'; // 单值
export const CHART_VEBAR_TYPE = '6'; // 条形图
export const LOGIN_TIMEOUT = 30 * 60 * 1000; // 登陆超时时间

export const methodsData = [
  {
    name: '平均值',
    value: 'avg'
  },
  {
    name: '最大值',
    value: 'max'
  },
  {
    name: '最小值',
    value: 'min'
  },
  {
    name: '汇总值',
    value: 'sum'
  },
  {
    name: '最新值',
    value: 'last'
  }
];

export const chartData = [
  {
    name: '曲线图',
    value: 1
  },
  {
    name: '面积图',
    value: 2
  },
  {
    name: '柱状图',
    value: 3
  }
];

export const stausData = [
  {
    name: '紧急',
    value: '0'
  },
  {
    name: '警告',
    value: '1'
  },
  {
    name: '正常',
    value: '2'
  },
  {
    name: '提醒',
    value: '3'
  }
];

export const stausDataColor = {
  '0': 'red',
  '1': 'yellow',
  '2': 'green',
  '3': 'gray'
};
