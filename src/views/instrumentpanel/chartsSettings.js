
export const linexAxis = {
  axisLabel: {
    color: '#6ac5fe'
  },
  axisLine: {
    show: true,
    lineStyle: {
      color: '#6ac5fe'
    }
  },
  type: 'category',
  boundaryGap: false,
  data: []
};
export const yAxis = {
  type: 'value',
  axisLine: {
    show: true,
    lineStyle: {
      color: '#6ac5fe'
    }
  },
  axisLabel: {
    color: '#6ac5fe',
    formatter (value) {
      return value + '%';
    }
  },
  splitLine: {
    show: false
  }
};
// 条形图
export const veBarChartSeries = {
  type: 'bar',
  barWidth: 20,
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
};
// 饼图
export const veRingChartSeries = {
  name: '',
  type: 'pie',
  radius: ['50%', '70%'],
  avoidLabelOverlap: false,
  label: {
    show: false,
    position: 'center'
  },
  emphasis: {
    label: {
      show: true,
      fontSize: '20',
      fontWeight: 'bold'
    }
  },
  labelLine: {
    show: false
  },
  data: []
};
export const veRingChartTooltip = {
  trigger: 'item',
  formatter: '{a} <br/>{b}: {c}%(占比{d}%)'
};
export const veRingChartLegend = {
  orient: 'vertical',
  textStyle: { // 图例文字的样式
    color: '#6ac5fe',
    fontSize: 16
  },
  left: 10,
  data: []
};
