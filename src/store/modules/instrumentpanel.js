
import cloneDeep from 'lodash.clonedeep';
import { boardPreTime, findresourcebyindex, boardAddTime, findboardbyboardmap, updateboard } from '@/api/dashhome';
import { linexAxis, yAxis } from '@/views/instrumentpanel/chartsSettings';
import { stausDataColor, CHART_LINE_TYPE } from '@/constant/constants';
import { drawValChart, drawPieVEbarAnd, drawChartLine } from '@/constant/chart-methons';

const defaultTimeseriesForms = {
  timeseriesIndicators: [],
  timeseriesMethods: 'avg',
  groupData: ['ip'], // 分组标签列表
  timeseriesGroup: [], // 选择的分组标签
  timeseriesData: [], // 资源标签列表
  timeseriesResources: [], // 选择的资源标签
  timeseriesChart: CHART_LINE_TYPE,
  chooseColor: '',
  indexName: [], // 指标名称
  indexName_: ''
};

const defaultTalineForms = {
  markValue: 0.01,
  markFlag: '0',
  lineName: ''
};

const p = function (msg) {
  return new Promise((resolve, reject) => {
    resolve({
      code: 1,
      msg
    });
  });
};

const state = {
  showAddOrUpdateModalVisible: false, // 模态框显示与隐藏
  addOrUpdateModalTitle: '', // 模态框标题
  dashBoardType: '1', // 仪表默认类型
  dashBoardTypes: ['1', '2', '3'], // 仪表类型 1时间序列、2统计排名、3单值
  timeseriesVeLineChartSeries: [], // 时间序列series数据
  options: [], // 指标名称列表
  timeseriesLinexAxis: cloneDeep(linexAxis), // 时间序列xAxis
  timeseriesYAxis: cloneDeep(yAxis), // 时间序列yAxis
  boardDetailObj: {}, // 仪表详情数据
  timeseriesForms: [], // 指标项
  talineForms: [], // 标记线
  curBoardMap: {}, // 当前显示的仪表盘
  curBoardMapList: [],
  title: '', // 标题
  editOrAddVal: true,
  utilVal: '', // 折线图纵坐标单位
  barWidth: 10,
  gridBottom: '20%',
  searchBoardMapParams: { // 查询当前仪表盘的参数
    startTime: Math.round(new Date().setDate((new Date().getDate() - 1)) / 1000).toString(),
    boardMapName: '',
    userName: '',
    endTime: Math.round(new Date().getTime() / 1000).toString()
  }
};
const mutations = {
  toggleState: (state, obj) => {
    state = Object.assign(state, obj);
  },
  clearTimeseries: (state) => { // 模态框隐藏时清除时间序列数据
    state.title = '';
    state.timeseriesVeLineChartSeries = [];
    state.timeseriesForms = [];
    state.talineForms = [];
    state.boardDetailObj = {};
    state.timeseriesLinexAxis = cloneDeep(linexAxis);
  }
};
function forEachTimeseriesForms (state) { // 时间序列指标项传参
  const arr = [];
  state.timeseriesForms.forEach((item, index) => {
    const obj = {};
    if (item.indexName) {
      obj.type = item.selec[0].value;
      obj.index = item.selec[1].value;
      obj.target = item.selec[2].value;
    }
    obj.poolingMethod = item.timeseriesMethods;
    obj.groupLabel = item.timeseriesGroup ? item.timeseriesGroup[0] : '';
    obj.resourceLabel = item.timeseriesResources;
    obj.chartType = item.timeseriesChart.toString();
    arr.push(obj);
  });
  return arr;
}

const actions = {
  chooseIndexName ({ state, commit, dispatch }, { o, selec, value, obj }) { // 选择指标名称
    const { timeseriesYAxis, searchBoardMapParams } = state;
    let { utilVal } = state;
    o.indexName = value;
    o.selec = selec;
    if (!obj) {
      o.timeseriesResources = [];
    }
    o.timeseriesData = []; // 资源标签列表
    const option = {};
    if (selec && selec) {
      option.type = selec[0].value;
      option.index = selec[1].value;
      option.target = selec[2].value;
      option.startTime = searchBoardMapParams.startTime;
      option.endTime = searchBoardMapParams.endTime;
      dispatch('findresourcebyindex', { option, o });
      timeseriesYAxis.axisLabel.formatter = (value) => {
        return value + selec[2].unit;
      };
      utilVal = selec[2].unit;
      commit('toggleState', {
        timeseriesYAxis, utilVal
      });
      dispatch('boardPreTime');
    }
  },
  timeseriesResourcesChange ({ dispatch }, { o, value }) { // 时间序列资源标签change事件
    o.timeseriesResources = value;
    dispatch('boardPreTime');
  },
  timeseriesGroupChange ({ dispatch }, { o, value }) { // 时间序列分组标签change事件
    o.timeseriesGroup = value;
    dispatch('boardPreTime');
  },
  timeseriesMethodsChange ({ dispatch }, { o, value }) { // 时间序列汇聚方法change事件
    o.timeseriesMethods = value;
    dispatch('boardPreTime');
  },
  timeseriesMarkValueChange ({ commit, dispatch }, { o, value }) { // 标记线Y change事件
    o.markValue = value;
    dispatch('boardPreTime');
  },
  timeseriesMarkFlagChange ({ commit, dispatch }, { o, value }) { // 标记线显示为 change事件
    o.markFlag = value;
    dispatch('boardPreTime');
  },
  // 时间序列+指标
  addTimeseriesItem ({ dispatch, commit, state }, obj) {
    const { timeseriesForms, options } = state;
    const selects = [];
    const values = [];
    const o = cloneDeep(defaultTimeseriesForms);
    if (obj) { // 编辑回填数据时调用
      o.timeseriesMethods = obj.poolingMethod;
      if (obj.groupLabel) {
        o.timeseriesGroup.push(obj.groupLabel);
      }
      if (obj.chartType) {
        o.timeseriesChart = obj.chartType;
      }
      o.timeseriesResources = obj.resourceLabel;
      o.indexName = [obj.type, obj.index, obj.target];
      const type = options.find(item => item.value === obj.type);
      const index = type.children.find(item => item.value === obj.index);
      const target = index.children.find(item => item.value === obj.target);
      selects.push(...[type, index, target]);
      values.push(...[type.value, index.value, target.value]);
    } else {
      if (options.length) {
        if (options[0].children.length) {
          if (options[0].children[0].children.length) {
            values.push(...[options[0].value, options[0].children[0].value, options[0].children[0].children[0].value]);
            selects.push(...[options[0], options[0].children[0], options[0].children[0].children[0]]);
            o.indexName = values;
          }
        }
      }
    }
    o.change = (value, selec) => { // 指标名称change事件
      dispatch('chooseIndexName', { o, selec, value });
    };
    o.timeseriesResourcesChange = (value) => { // 资源标签change事件
      dispatch('timeseriesResourcesChange', { o, value });
    };
    o.timeseriesGroupChange = (value) => { // 分组标签change事件
      dispatch('timeseriesGroupChange', { o, value });
    };
    o.timeseriesMethodsChange = (value) => { // 汇聚方法change事件
      dispatch('timeseriesMethodsChange', { o, value });
    };
    o.timeseriesDisplayRender = ({ labels }) => { // 指标名称回显事件
      const indexName_ = Array.isArray(labels) ? labels[labels.length - 1] : '';
      o.indexName_ = indexName_;
      return indexName_;
    };
    timeseriesForms.push(o);
    commit('toggleState', {
      timeseriesForms
    });
    dispatch('chooseIndexName', { o, selec: selects, value: values, obj });
  },
  addTalineItem ({ state, commit, dispatch }, obj) { // 新增每一项标记线
    const { talineForms } = state;
    let o = null;
    if (obj) {
      o = obj;
    } else {
      o = cloneDeep(defaultTalineForms);
    }
    o.timeseriesMarkValueChange = (value) => {
      dispatch('timeseriesMarkValueChange', { o, value });
    };
    o.timeseriesMarkFlagChange = (value) => {
      dispatch('timeseriesMarkFlagChange', { o, value });
    };
    talineForms.push(o);
    commit('toggleState', {
      talineForms
    });
    dispatch('boardPreTime');
  },
  delTalineItem ({ commit, dispatch }, index) { // 删除每一项标记线
    const { talineForms } = state;
    talineForms.splice(index, 1);
    commit('toggleState', {
      talineForms
    });
    dispatch('boardPreTime');
  },
  async findresourcebyindex ({ state, commit, dispatch }, { option, o }) { // 获取资源标签
    const data = await findresourcebyindex(option);
    if (data.code === 0) {
      o.timeseriesData = data.data;
    }
  },
  async boardPreTime ({ state, commit }) { // 时间序列预览
    const { dashBoardType, timeseriesLinexAxis, searchBoardMapParams, talineForms } = state;
    const options = {
      dashBoardType,
      timeSeriesIndicatorList: [],
      timeSeriesMarkLineList: [],
      startTime: searchBoardMapParams.startTime,
      endTime: searchBoardMapParams.endTime
    };
    const canNotRequest = state.timeseriesForms.some(item => !item.timeseriesGroup.length && !item.timeseriesResources.length);
    const talineFormsFlag = talineForms.every(item => item.markValue); // 判断标记线数据是否完整
    if (talineFormsFlag) {
      options.timeSeriesMarkLineList = talineForms;
    }
    if (!canNotRequest) {
      options.timeSeriesIndicatorList = forEachTimeseriesForms(state);
      const data = await boardPreTime(options);
      if (data.code === 0) {
        const xs = [];
        const ys = [];
        if (data.data && Array.isArray(data.data)) {
          data.data.forEach((dataItem, dateItemIndex) => {
            const arrData = [];
            if (dateItemIndex === 0) {
              if (talineForms.length) {
                talineForms.forEach(item => {
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
            }
            const y = {
              type: 'line',
              data: [],
              name: dataItem.ip,
              showSymbol: false,
              itemStyle: {
                normal: {
                  color: 'rgb(40,70,255)', // 折线点的颜色
                  lineStyle: {
                    color: 'rgb(40,70,255)' // 折线的颜色
                  }
                }
              },
              markLine: {
                symbol: 'none',
                data: arrData
              },
              smooth: true,
              tooltip: {
                show: true,
                trigger: 'item',
                formatter: (params) => {
                  return `ip：${params.seriesName}<br/>${params?.name}分：${params?.value}ms`;
                }
              },
              areaStyle: null
            };
            dataItem.value.forEach((valueItem) => {
              if (dateItemIndex === 0) {
                xs.push(Object.keys(valueItem)[0]);
              }
              y.data.push(Object.values(valueItem)[0]);
            });
            ys.push(y);
          });
          timeseriesLinexAxis.axisLabel.rotate = 70;
          timeseriesLinexAxis.data = xs;
        }
        commit('toggleState', {
          timeseriesVeLineChartSeries: ys,
          timeseriesLinexAxis
        });
      }
    }
  },
  changeCurBoardMap ({ state, commit }, obj) {
    const curBoardMap = obj;
    commit('toggleState', {
      curBoardMap
    });
  },
  changeSearchBoardMapParams ({ state, commit }, obj) {
    const searchBoardMapParams = obj;
    commit('toggleState', {
      searchBoardMapParams
    });
  },
  // 新增或者修改时间序列
  boardAddOrUpdateTime ({ state, commit, dispatch }) {
    const { dashBoardType, curBoardMap, timeseriesForms, talineForms, title, boardDetailObj, utilVal } = state;
    const arr = [];
    timeseriesForms.forEach(item => {
      arr.push(item.indexName_);
    });
    let boardName = '';
    if (title) {
      boardName = title;
    } else {
      if (arr.length) {
        boardName = arr.join('');
      } else {
        return p('请输入标题');
      }
    }
    const timeseriesFormsIndexNameFlag = timeseriesForms.some(item => !item.indexName.length);

    if (timeseriesFormsIndexNameFlag) {
      return p('请选择指标名称');
    }
    const timeseriesFormsFlag = timeseriesForms.some(item => !item.timeseriesResources.length && !item.timeseriesGroup.length);
    if (timeseriesFormsFlag) {
      return p('资源标签和分组标签两者必选一个');
    }
    const talineFormsFlag = talineForms.some(item => !item.lineName || !item.markValue);
    if (talineFormsFlag) {
      return p('标记线数据不完整');
    }
    const options = {
      boardName: boardName + 'utilVal:' + utilVal,
      dashBoardType: dashBoardType,
      boardMapId: curBoardMap.id,
      timeSeriesIndicatorList: forEachTimeseriesForms(state),
      timeSeriesMarkLineList: talineForms
    };
    return new Promise(async (resolve, reject) => {
      let data = null;
      if (!boardDetailObj.id) { // 新增
        data = await boardAddTime(options);
      } else {
        options.id = boardDetailObj.id;
        data = await updateboard(options);
      }
      if (data.code === 0) {
        commit('toggleState', {
          showAddOrUpdateModalVisible: false
        });
        dispatch('findboardbyboardmap', state.searchBoardMapParams);
      }
      resolve(data);
    });
  },
  // 获取仪表列表
  async findboardbyboardmap ({ state, commit, dispatch }, params) {
    if (!params.boardMapId) {
      return;
    }

    const data = await findboardbyboardmap(params);
    const curBoardMapList = [];
    if (data.code === 0) {
      if (data.data && Array.isArray(data.data)) {
        for (let index = 0; index < data.data.length; index++) {
          const element = data.data[index];
          if (element.dashBoardType === '1') {
            drawChartLine(element, curBoardMapList);
          } else if (element.dashBoardType === '2') {
            drawPieVEbarAnd(element, curBoardMapList, state.barWidth, state.gridBottom);
          } else if (element.dashBoardType === '3') {
            drawValChart(element, curBoardMapList);
          }
        }
        commit('toggleState', {
          curBoardMapList: []
        });
        commit('toggleState', {
          curBoardMapList: curBoardMapList
        });
      }
    }
  },
  changeEditOrAddVal ({ state, commit }, val) {
    const editOrAddVal = val;
    commit('toggleState', {
      editOrAddVal
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
