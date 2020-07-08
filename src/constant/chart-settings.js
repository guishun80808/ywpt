// 条形图
export const veBarChartSeries = {
  type: 'bar',
  barWidth: 15,
  // animation: false, // 不显示加载动画
  animationDuration: 200,
  data: []
};
export const barXAxis = {
  type: 'value',
  splitLine: {
    show: false
  },
  axisLabel: {
    show: false
  }
};
export const barYAxis = {
  type: 'category',
  splitLine: {
    show: false
  },
  axisLabel: {
    color: '#6ac5fe'
  },
  boundaryGap: false,
  data: []
};
export const veBarChartTooltip = {
  trigger: 'axis',
  formatter: '{b}: {c}'
}; // 条形图

export const tXbarXAxis = {
  type: 'value',
  splitLine: {
    show: false
  },
  axisLabel: {
    show: false
  }
};
export const tXbarYAxis = {
  type: 'category',
  splitLine: {
    show: false
  },
  axisLabel: {
    color: '#6ac5fe'
  },
  boundaryGap: false,
  data: []
};

export const xAxisLine = {
  type: 'category',
  splitLine: {
    show: true,
    lineStyle: {
      color: ['rgb(45,110,156)'],
      width: 1,
      type: 'solid'
    }
  },
  boundaryGap: false,
  axisLabel: {
    show: true,
    textStyle: {
      color: '#6ac5fe'
    }
  },
  data: []
};
export const xAxisPie = {
  type: 'category',
  boundaryGap: false,
  data: []
};
export const yAxisLine = {
  type: 'value',
  splitNumber: 2,
  splitLine: {
    show: true,
    lineStyle: {
      color: ['rgb(45,110,156)'],
      width: 1,
      type: 'solid'
    }
  },
  axisLabel: {
    color: '#6ac5fe',
    formatter (value) {
      return value;
    }
  }
};
// 饼图
export const veRingChartSeries = {
  name: '',
  type: 'pie',
  radius: ['50%', '70%'],
  avoidLabelOverlap: false,
  // animation: false, // 不显示加载动画
  animationDuration: 200,
  label: {
    show: false,
    position: 'center'
  },
  emphasis: {
    label: {
      show: true
    }
  },
  labelLine: {
    show: false
  },
  data: []
};
export const veRingChartLegend = {
  orient: 'vertical',
  show: false,
  textStyle: { // 图例文字的样式
    color: '#6ac5fe',
    fontSize: 12
  },
  left: 10,
  formatter (value) {
    return value;
  },
  // show:false,
  data: []
};
export const veRingChartTooltip = {
  trigger: 'item',
  formatter: '{a} <br/>{b}: {c} ({d}%)'
};

export const gridObjV = {
  left: '3%',
  right: '4%',
  bottom: '5%',
  containLabel: true
};
export const gridBigObjV = {
  left: '3%',
  right: '4%',
  bottom: '70%',
  containLabel: true
};
export const timeList = [
  {
    name: '1月', time: Math.round(new Date().setDate((new Date().getDate() - 30)) / 1000).toString() // 1月
  },
  {
    name: '7天', time: Math.round(new Date().setDate((new Date().getDate() - 7)) / 1000).toString() // 7天
  },
  {
    name: '3天', time: Math.round(new Date().setDate((new Date().getDate() - 3)) / 1000).toString() // 3天
  },
  {
    name: '1天', time: Math.round(new Date().setDate((new Date().getDate() - 1)) / 1000).toString() // 1天
  },
  {
    name: '12小时', time: Math.round(new Date().getTime() / 1000 - 43200).toString() // 12小时
  },
  {
    name: '6小时', time: Math.round(new Date().getTime() / 1000 - 21600).toString() // 6小时
  },
  {
    name: '1小时', time: Math.round(new Date().getTime() / 1000 - 3600).toString() // 1小时
  },
  {
    name: '30分钟', time: Math.round(new Date().getTime() / 1000 - 1800).toString() // 30分钟
  }
];
