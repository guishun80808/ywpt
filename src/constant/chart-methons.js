import cloneDeep from 'lodash.clonedeep';
import { veBarChartSeries, tXbarXAxis, tXbarYAxis, yAxisLine, veRingChartSeries, veRingChartLegend, veRingChartTooltip, gridObjV, gridBigObjV } from '@/constant/chart-settings';
import { CHART_LINE_TYPE, CHART_BAR_TYPE, CHART_PIE_TYPE, CHART_VEBAR_TYPE, stausDataColor } from '@/constant/constants';

function getBottom (item) {
  if (item.value.length === 1) {
    return '80%';
  } else if (item.value.length === 2) {
    return '70%';
  } else if (item.value.length === 3) {
    return '60%';
  } else if (item.value.length === 4) {
    return '50%';
  } else {
    return '5%';
  }
}
export function drawValChart (element, curBoardMapList) {
  // 单值仪表列表显示
  if (element.resultInfoList && Array.isArray(element.resultInfoList)) {
    element.resultInfoList.forEach((item, k) => {
      const arr = Object.values(item.value[0]);
      const curKey = Object.keys(item.value[0])[1];
      const utilVal = element.boardName.split('utilVal:')[1];
      const name = element.boardName.split('utilVal:')[0];
      let valCount = 0;
      let valCountNum = 0;
      if (element.chartType === '4') {
        valCount = arr[0] / 100;
        valCountNum = arr[0];
      } else if (element.chartType === '5') {
        valCount = arr[0];
        valCountNum = arr[0];
      }
      curBoardMapList.push({
        boardName: name,
        utils: utilVal,
        dashBoardId: element.dashBoardId,
        chartType: element.chartType,
        ip: item.ip,
        dashBoardType: element.dashBoardType,
        gaugeChartData: {
          columns: ['type', 'value'],
          curKey,
          valCountNum,
          rows: [{ type: '占比', value: valCount }]
        }
      });
    });
  }
}
export function drawPieVEbarAnd (element, curBoardMapList, barWidth, gridBottom) {
  // 条形图饼状图列表
  if (element.chartType === CHART_VEBAR_TYPE) {
    const objServe = cloneDeep(veBarChartSeries);
    objServe.barWidth = barWidth;
    const gridObj = cloneDeep(gridObjV);
    gridObj.bottom = gridBottom;
    const gridBigObj = cloneDeep(gridBigObjV);
    const objY = cloneDeep(tXbarYAxis);
    if (element.resultInfoList && Array.isArray(element.resultInfoList) && element.resultInfoList.length) {
      for (let index = 0; index < element.resultInfoList.length; index++) {
        const item = element.resultInfoList[index];
        let arrs = [];
        let vals = [];
        if (item.value && Array.isArray(item.value)) {
          gridObj.bottom = getBottom(item);
          item.value.forEach(val => {
            arrs = arrs.concat(Object.keys(val));
            vals = vals.concat(Object.values(val));
          });
        }
        objY.data = arrs;
        objServe.data = vals;
      }
      curBoardMapList.push({
        boardName: element.boardName,
        chartType: element.chartType,
        dashBoardId: element.dashBoardId,
        dashBoardType: element.dashBoardType,
        series: objServe,
        xAxis: tXbarXAxis,
        yAxis: objY,
        grid: gridObj,
        gridBig: gridBigObj
      });
    } else {
      curBoardMapList.push({
        boardName: element.boardName,
        chartType: element.chartType,
        dashBoardId: element.dashBoardId,
        dashBoardType: element.dashBoardType
      });
    }
  } else if (element.chartType === CHART_PIE_TYPE) {
    const veRingChartSeriesObj = cloneDeep(veRingChartSeries);
    const veRingChartLegendObj = cloneDeep(veRingChartLegend);
    if (element.resultInfoList && Array.isArray(element.resultInfoList) && element.resultInfoList.length) {
      const formatterV = [];
      for (let index = 0; index < element.resultInfoList.length; index++) {
        const item = element.resultInfoList[index];
        let arrs = [];
        let vals = [];
        if (Array.isArray(item.value)) {
          item.value.forEach(val => {
            arrs = arrs.concat(Object.keys(val));
            vals = vals.concat(Object.values(val));
            veRingChartSeriesObj.data.push({ value: Math.round(Object.values(val)[0] * 100) / 100, name: Object.keys(val)[0] });
          });
        }

        if (arrs.length) {
          for (let index = 0; index < arrs.length; index++) {
            formatterV.push(arrs[index] + '：' + vals[index]);
          }
        }
        veRingChartLegendObj.data = arrs;
      }
      curBoardMapList.push({
        formatterV,
        boardName: element.boardName,
        chartType: element.chartType,
        dashBoardId: element.dashBoardId,
        dashBoardType: element.dashBoardType,
        veRingChartSeries: veRingChartSeriesObj,
        veRingChartTooltip,
        veRingChartLegend: veRingChartLegendObj
      });
    } else {
      curBoardMapList.push({
        boardName: element.boardName,
        chartType: element.chartType,
        dashBoardId: element.dashBoardId,
        dashBoardType: element.dashBoardType,
        veRingChartSeries: veRingChartSeriesObj,
        veRingChartTooltip,
        veRingChartLegend: veRingChartLegendObj
      });
    }
  }
}
export function drawChartLine (element, curBoardMapList) {
  // 折线图列表绘制
  const ys = [];
  const arrData = [];
  const servers = [];
  const xs = [];
  const utilVal = element.boardName.split('utilVal:')[1];
  const name = element.boardName.split('utilVal:')[0];
  if (element.resultInfoList && Array.isArray(element.resultInfoList) && element.resultInfoList.length) {
    if (element.markLineList.length) {
      element.markLineList.forEach(item => {
        const markLineItem = {
          yAxis: item.markValue,
          lineStyle: {
            color: stausDataColor[item.markFlag],
            type: 'solid'
          }
        };
        arrData.push(markLineItem);
      });
    }

    element.resultInfoList.forEach((dataItem, i) => {
      const yAxis = cloneDeep(yAxisLine);
      yAxis.axisLabel = {
        color: '#6ac5fe',
        formatter (value) {
          return value + utilVal;
        }
      };
      const y = {
        type: 'line',
        name: dataItem.ip,
        data: [],
        smooth: true,
        areaStyle: null
      };
      const x = [];
      if (Array.isArray(dataItem.value)) {
        dataItem.value.forEach((valueItem, j) => {
          x.push(Object.keys(valueItem)[0]);
          y.data.push(Object.values(valueItem)[0]);
        });
      }
      ys.push(y);
      xs.push(x);
      const serversObj = {
        name: dataItem.ip,
        showSymbol: false,
        // animation: false, // 不显示加载动画
        animationDuration: 200,
        itemStyle: {
          normal: {
            color: 'rgb(40,70,255)', // 折线点的颜色
            lineStyle: {
              color: 'rgb(40,70,255)'// 折线的颜色
            }
          }
        },
        data: ys[i].data
      };
      if (element.chartType === CHART_LINE_TYPE) {
        serversObj.type = 'line';
        serversObj.markLine = {
          symbol: 'none',
          data: arrData
        };
      } else if (element.chartType === CHART_BAR_TYPE) {
        serversObj.type = 'bar';
      }
      servers.push(serversObj);
      curBoardMapList.push({
        boardName: name,
        dashBoardId: element.dashBoardId,
        ip: dataItem.ip,
        dashBoardType: element.dashBoardType,
        series: servers,
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#6ac5fe'
            }
          },
          data: xs[i]
        },
        yAxis
      });
    });
  } else {
    curBoardMapList.push({
      boardName: name,
      dashBoardId: element.dashBoardId,
      dashBoardType: element.dashBoardType,
      series: [],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#6ac5fe'
          }
        },
        data: []
      },
      yAxis: cloneDeep(yAxisLine)
    });
  }
}
