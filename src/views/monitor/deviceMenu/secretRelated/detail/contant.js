export const veGaugeChartSeries = {
  type: 'gauge',
  startAngle: 180,
  endAngle: 0,
  splitNumber: 2,
  splitLine: {
    show: false
  },
  radius: '90%',
  detail: {
    backgroundColor: 'RGBA(21,51,88, 1)',
    padding: [10, 30, 10, 30],
    borderWidth: 1,
    borderRadius: 2,
    fontSize: 15,
    borderColor: 'RGBA(21,51,88, 1)',
    offsetCenter: [0, 0],
    formatter: (value) => value + '%',
    textStyle: {
      color: '#fff'
    }
  },
  pointer: {
    show: false
  },
  axisLine: {
    lineStyle: {
      opacity: 0
    }
  },
  axisTick: {
    show: true,
    length: 30,
    splitNumber: 15,
    lineStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: 'rgba(8, 134, 211, 1)' // 0% 处的颜色
        }, {
          offset: 1, color: 'rgba(179, 255, 71, 1)' // 100% 处的颜色
        }],
        global: false // 缺省为 false
      }
    }
  },
  data: []
};

export const xAxis = {
  axisLabel: {
    color: '#fff'
  },
  type: 'category',
  boundaryGap: false,
  data: []
};

export const veLineChartSeries = {
  type: 'line',
  data: [],
  smooth: true,
  areaStyle: {
    color: 'RGBA(35, 111, 189, 1)'
  }
};

export const pingRateRightTooltip = {
  show: true,
  trigger: 'axis',
  formatter: (params) => {
    return `时间:${params[0]?.name}<br/>连通率:${params[0]?.value}%`;
  }
};

export const cpuRateTooltip = {
  show: true,
  trigger: 'axis',
  formatter: (params) => {
    return `时间:${params[0]?.name}<br/>CPU利用率:${params[0]?.value}%`;
  }
};

export const memRateTooltip = {
  show: true,
  trigger: 'axis',
  formatter: (params) => {
    return `时间:${params[0]?.name}<br/>物理内存利用率:${params[0]?.value}%`;
  }
};

export const swpRateTooltip = {
  show: true,
  trigger: 'axis',
  formatter: (params) => {
    return `时间:${params[0]?.name}<br/>交换内存利用率:${params[0]?.value}%`;
  }
};

export const respTimeTooltip = {
  show: true,
  trigger: 'axis',
  formatter: (params) => {
    return `时间:${params[0]?.name}<br/>响应时间:${params[0]?.value}ms`;
  }
};
