const echarts = require('echarts');
const zhuangshi = require('../../assets/image/orgin/zhuangshi.png');
export function drawChartMon (datas) {
  const myChart = echarts.init(document.getElementById('chartmon'));
  const option = {
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true,
          title: '下载图片',
          excludeComponents: ['toolbox'],
          backgroundColor: 'rgba(1, 45, 74,1)',
          iconStyle: {
            color: '#17A1E6',
            borderColor: '#17A1E6'
          },
          pixelRatio: 2
        }
      },
      top: 0,
      right: 85
    },
    tooltip: {
      trigger: 'axis',
      // formatter: '{b}{a}：{c}%',
      axisPointer: {
        type: ''
      }
    },
    title: {
      text: '配置类型统计（top10）',
      bottom: 8,
      textStyle: {
        // 标题颜色
        color: '#fff',
        fontSize: 16
      },
      left: 'center',
      top: 0
    },
    grid: {
      left: '3%',
      right: '7%',
      bottom: '5%',
      top: '10%',
      containLabel: true
    },
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {

        offset: 0,
        color: 'rgba(80,141,255,1)'
      }, {
        offset: 0.34,
        color: 'rgba(56,155,255,1)'
      }, {
        offset: 1,
        color: 'rgba(38,197,254,1)'
      }
    ]),
    xAxis: [
      {
        type: 'category',
        name: '类型',
        axisLine: {
          lineStyle: {
            // color: "#c3e7ff",
            color: '#fff',
            width: 1
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: ['#0064fa'],
            width: 1,
            type: 'solid'
          }
        }, // 网格线
        axisLabel: {
          interval: 0,
          textStyle: {
            color: '#c3e7ff'
          },
          rotate: -25
        },
        data: datas.names,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: {
      type: 'value',
      name: '（个）',
      axisLine: {
        lineStyle: {
          // color: "#c3e7ff",
          color: '#fff',
          width: 1
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#1859af'],
          width: 1,
          type: 'solid'
        }
      }, // 网格线
      axisLabel: {
        // formatter: function (value, index) {
        //     return value + '个'
        //      },
        interval: 0,
        textStyle: {
          color: '#c3e7ff'
        }
        // rotate: -25
      }
    },
    series: [
      {
        name: '配置数',
        type: 'bar',
        barWidth: '60%',
        data: datas.vals
      }
    ]
  };
  myChart.setOption(option);
  window.onresize = function () {
    myChart.resize();
  };
}

export function drawChartMon2 (datas) {
  console.log(datas);
  const myChart = echarts.init(document.getElementById('chartmon2'));
  const option = {
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true,
          title: '下载图片',
          excludeComponents: ['toolbox'],
          backgroundColor: 'rgba(1, 45, 74,1)',
          iconStyle: {
            color: '#17A1E6',
            borderColor: '#17A1E6'
          },
          pixelRatio: 2
        }
      },
      top: 0,
      right: 85
    },
    tooltip: {
      trigger: 'axis',
      // formatter: '{b}{a}：{c}%',
      axisPointer: {
        type: ''
      }
    },
    title: {
      text: '配置类型统计（top10）',
      bottom: 8,
      textStyle: {
        // 标题颜色
        color: '#fff',
        fontSize: 16
      },
      left: 'center',
      top: 0
    },
    grid: {
      left: '3%',
      right: '7%',
      bottom: '5%',
      top: '10%',
      containLabel: true
    },
    // color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
    //     offset: 0,
    //     color: 'rgb(0,133,253)'
    // }, {
    //     offset: 0.7,
    //     color: 'rgb(0,248,241)'
    // }]),
    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 0,
        color: 'rgb(0,205,137)'
      }, {
        offset: 0.7,
        color: 'rgb(0,254,191)'
      }
    ]),
    xAxis: [
      {
        type: 'category',
        name: '类型',
        axisLine: {
          lineStyle: {
            // color: "#c3e7ff",
            color: '#fff',
            width: 1
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: ['#0064fa'],
            width: 1,
            type: 'solid'
          }
        }, // 网格线
        axisLabel: {

          interval: 0,
          textStyle: {
            color: '#c3e7ff'
          },
          rotate: -25
        },
        data: datas.names,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: {
      type: 'value',
      name: '变更数（次）',
      axisLine: {
        lineStyle: {
          // color: "#c3e7ff",
          color: '#fff',
          width: 1
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#1859af'],
          width: 1,
          type: 'solid'
        }
      }, // 网格线
      axisLabel: {
        interval: 0,
        textStyle: {
          color: '#c3e7ff'
        }
        // rotate: -25
      }
    },
    series: [
      {
        name: '变更次数',
        type: 'bar',
        barWidth: '60%',
        data: datas.vals
      }
    ]
  };
  myChart.setOption(option);
  window.onresize = function () {
    myChart.resize();
  };
}

export function drawChartMon3 (datas) {
  console.log(datas);
  const myChart = echarts.init(document.getElementById('chartmon3'));
  const option = {
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true,
          title: '下载图片',
          excludeComponents: ['toolbox'],
          backgroundColor: 'rgba(1, 45, 74,1)',
          iconStyle: {
            color: '#17A1E6',
            borderColor: '#17A1E6'
          },
          pixelRatio: 2
        }
      },
      top: 0,
      right: 85
    },
    tooltip: {
      trigger: 'axis',
      // formatter: '{b}{a}：{c}%',
      axisPointer: {
        type: ''
      }
    },
    title: {
      text: '拓扑图使用配置分布',
      bottom: 8,
      textStyle: {
        // 标题颜色
        color: '#fff',
        fontSize: 16
      },
      left: 'center',
      top: 0
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '5%',
      top: '10%',
      containLabel: true
    },
    // color: ['#864efb'],
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {

        offset: 0,
        color: 'rgba(80,141,255,1)'
      }, {
        offset: 0.34,
        color: 'rgba(56,155,255,1)'
      }, {
        offset: 1,
        color: 'rgba(38,197,254,1)'
      }
    ]),
    xAxis: [
      {
        type: 'category',
        name: '类型',
        axisLine: {
          lineStyle: {
            // color: "#c3e7ff",
            color: '#fff',
            width: 1
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: ['#315070'],
            width: 1,
            type: 'solid'
          }
        }, // 网格线
        axisLabel: {

          interval: 0,
          textStyle: {
            color: '#c3e7ff'
          },
          rotate: -25
        },
        data: datas.names,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: {
      type: 'value',
      name: '拓扑图（个）',
      axisLine: {
        lineStyle: {
          // color: "#c3e7ff",
          color: '#fff',
          width: 1
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#1859af'],
          width: 1,
          type: 'solid'
        }
      }, // 网格线
      axisLabel: {
        interval: 0,
        textStyle: {
          color: '#c3e7ff'
        }
        // rotate: -25
      }
    },
    series: [
      {
        name: '配置数',
        type: 'bar',
        barWidth: '60%',
        data: datas.vals
      }
    ]
  };
  myChart.setOption(option);
  window.onresize = function () {
    myChart.resize();
  };
}

export function drawChartMon4 (datas) {
  const legends = [];
  for (let index = 0; index < datas.length; index++) {
    const element = datas[index];
    legends.push(element.name);
  }
  const myChart = echarts.init(document.getElementById('chartmon4'));

  const option = {
    graphic: {
      elements: [
        {
          type: 'image',
          style: {
            image: zhuangshi,
            width: 65,
            height: 65
          },
          left: 'center',
          top: 175
        }
      ]
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true,
          title: '下载图片',
          excludeComponents: ['toolbox'],
          backgroundColor: 'rgba(1, 45, 74,1)',
          iconStyle: {
            color: '#17A1E6',
            borderColor: '#17A1E6'
          },
          pixelRatio: 2
        }
      },
      top: 0,
      right: 50
    },
    title: {
      text: '告警级别统计',
      subtext: '',
      bottom: 80,
      textStyle: {
        // 标题颜色
        color: '#fff',
        fontSize: 14
      },
      subtextStyle: {
        color: '#fff'
      },
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} {b} : {c} ({d}%)'
    },
    legend: {
      icon: 'circle',
      // orient: "horizontal",
      orient: 'vertical',
      left: 'center',
      textStyle: {
        color: '#fff'
      },
      bottom: 0,
      data: legends
    },
    series: [
      {
        hoverAnimation: false,
        name: ' ',
        type: 'pie',
        radius: ['55%', '40%'],
        center: ['50%', '42%'],
        labelLine: {
          normal: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2
            // length: this.standSize / 50,
            // length2: this.standSize / 100,
          }
        },
        label: {
          normal: {
            borderWidth: 1,
            borderRadius: 4,
            padding: [0, 70] // 文字和图的边距
          }
        },

        data: datas,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          normal: {
            color: function (params) {
              // build a color map as your need.
              const colorList = ['#864efb', 'rgb(25,103,255)', 'rgb(0,255,240)', 'rgb(247,116,255)', '#6dc051', '#f6ff00'];
              //  var colorList = ["#f6ff00", "#ffa523", "#e92200"];
              return colorList[params.dataIndex];
            }
          }
        }
      }
    ]
  };
  // 为echarts对象加载数据
  myChart.setOption(option);
  setTimeout(function () {
    window.onresize = function () {
      myChart.resize();
    };
  }, 200);
}

export function drawChartMon6 (datas) {
  const legends = [];
  for (let index = 0; index < datas.length; index++) {
    const element = datas[index];
    legends.push(element.name);
  }
  const myChart = echarts.init(document.getElementById('chartmon6'));

  const option = {
    graphic: {
      elements: [
        {
          type: 'image',
          style: {
            image: zhuangshi,
            width: 65,
            height: 65
          },
          left: 'center',
          top: 175
        }
      ]
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true,
          title: '下载图片',
          excludeComponents: ['toolbox'],
          backgroundColor: 'rgba(1, 45, 74,1)',
          iconStyle: {
            color: '#17A1E6',
            borderColor: '#17A1E6'
          },
          pixelRatio: 2
        }
      },
      top: 0,
      right: 50
    },
    title: {
      text: '拓扑图使用分布',
      subtext: '',
      bottom: 80,
      textStyle: {
        // 标题颜色
        color: '#fff',
        fontSize: 14
      },
      subtextStyle: {
        color: '#fff'
      },
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} {b} : {c} ({d}%)'
    },
    legend: {
      icon: 'circle',
      // orient: "horizontal",
      orient: 'vertical',
      left: 'center',
      textStyle: {
        color: '#fff'
      },
      bottom: 0,
      data: legends
    },
    series: [
      {
        hoverAnimation: false,
        name: ' ',
        type: 'pie',
        radius: ['55%', '40%'],
        center: ['50%', '42%'],
        label: {
          normal: {
            borderWidth: 1,
            borderRadius: 4,
            padding: [0, 40] // 文字和图的边距
          }
        },

        data: datas,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          normal: {
            color: function (params) {
              // build a color map as your need.
              const colorList = ['#864efb', 'rgb(25,103,255)', 'rgb(0,255,240)', '#ffa523', '#f6ff00', 'rgb(30,161,20)'];
              //  var colorList = ["#f6ff00", "#ffa523", "#e92200"];
              return colorList[params.dataIndex];
            }
          }
        }
      }
    ]
  };
  // 为echarts对象加载数据
  myChart.setOption(option);
  setTimeout(function () {
    window.onresize = function () {
      myChart.resize();
    };
  }, 200);
}

export function drawChartMon5 (datas) {
  window.onresize = function () {
    myChart.resize();
  };
  const myChart = echarts.init(document.getElementById('chartmon5'));
  const option = {
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true,
          title: '下载图片',
          excludeComponents: ['toolbox'],
          backgroundColor: 'rgba(1, 45, 74,1)',
          iconStyle: {
            color: '#17A1E6',
            borderColor: '#17A1E6'
          },
          pixelRatio: 2
        }
      },
      top: 0,
      right: 85
    },
    tooltip: {
      trigger: 'axis',
      // formatter: '{b}{a}：{c}%',
      axisPointer: {
        type: ''
      }
    },
    title: {
      text: '配置类型统计（top10）',
      bottom: 8,
      textStyle: {
        // 标题颜色
        color: '#fff',
        fontSize: 16
      },
      left: 'center',
      top: 0
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '5%',
      top: '10%',
      containLabel: true
    },
    color: ['rgb(0,133,253)'],
    xAxis: [
      {
        type: 'category',
        name: '类型',
        axisLine: {
          lineStyle: {
            // color: "#c3e7ff",
            color: '#fff',
            width: 1
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: ['#0064fa'],
            width: 1,
            type: 'solid'
          }
        }, // 网格线
        axisLabel: {

          interval: 0,
          textStyle: {
            color: '#c3e7ff'
          },
          rotate: -25
        },
        data: datas.names,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: {
      type: 'value',
      name: '数量：（个）',
      axisLine: {
        lineStyle: {
          // color: "#c3e7ff",
          color: '#fff',
          width: 1
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#1859af'],
          width: 1,
          type: 'solid'
        }
      }, // 网格线
      axisLabel: {
        interval: 0,
        textStyle: {
          color: '#c3e7ff'
        }
        // rotate: -25
      }
    },
    series: [
      {
        name: '配置数',
        type: 'bar',
        barWidth: '60%',
        data: datas.vals
      }
    ]
  };
  myChart.setOption(option);
  window.onresize = function () {
    myChart.resize();
  };
}
