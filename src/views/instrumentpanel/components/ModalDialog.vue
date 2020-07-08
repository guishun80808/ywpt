<template>
  <div id="dash-home-model">
    <a-modal
      ref='modalDialog'
      :title="addOrUpdateModalTitle"
      :visible="showAddOrUpdateModalVisible"
      :mask-closable="false"
      :confirm-loading="dashConfirmLoading"
      @ok="handleSureAdd"
      @cancel="handleCancelAdd"
      width="95%"
      :bodyStyle="bodyStyle">
      <div class='chart-panel'>
        <p class="">预览</p>
        <div class='item-max'>
          <div class="line-box" style="height:350px" v-if="dashBoardType === '1'">
            <ve-line
            width= "98%"
            height="350px"
            :xAxis ="timeseriesLinexAxis"
            :yAxis ="timeseriesYAxis"
            :series="timeseriesVeLineChartSeries"
            :grid ="grid"></ve-line>
          </div>
          <div class="sort-box" style="height:350px"  v-if="dashBoardType === '2'">
            <ve-bar
            v-if="queryParam.chartType!==CHART_PIE_TYPE"
            width= "100%"
            height="350px"
            :xAxis ="barXAxis"
            :yAxis ="barYAxis"
            :series="veBarChartSeries"
            :tooltip="veBarChartTooltip"
            :legend-visible="false"
            :extend="chartExtend"
            :grid ="barGrid"></ve-bar>
            <ve-ring
            v-if="queryParam.chartType===CHART_PIE_TYPE"
            :tooltip="veRingChartTooltip"
            :series="veRingChartSeries"
            :extend="chartExtendPie"
            :legend="veRingChartLegend"></ve-ring>
          </div>
          <div class="value-box" style="height:350px;text-align:center;line-height:350px;" v-if="dashBoardType === '3'">
            <span v-if='!isRate' style="display:inline-block;font-size:60px;color:#17A1E6;margin:o auto;">{{valueCount}}<span>{{unitVal}}</span></span>
            <ve-gauge v-if='isRate' :data="gaugeChartData" :settings="gaugeValSettings"></ve-gauge>
          </div>
        </div>
      </div>
      <a-row :gutter="48">
        <a-form>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-form>
              <a-form-item label="标题" :label-col="{ span: 1 }" :wrapper-col="{ span: 12 }">
                <a-input :placeholder="titlePlaceholder" v-model="title" />
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-form-item label="类型" :label-col="{ span: 1 }" :wrapper-col="{ span: 23 }">
                <a-tabs :active-key="dashBoardType" @change="callback">
                  <a-tab-pane v-if="dashBoardTypes.includes('1')" key="1" tab="时间序列"></a-tab-pane>
                  <a-tab-pane v-if="dashBoardTypes.includes('2')" key="2" tab="统计排名"></a-tab-pane>
                  <a-tab-pane v-if="dashBoardTypes.includes('3')" key="3" tab="单值"></a-tab-pane>
                </a-tabs>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <!-- 时间序列 -->
            <div id="tabkey1_timeseries" v-if="dashBoardTypes.includes('1') && dashBoardType === '1'">
              <a-form-item label="指标" :label-col="{ span: 1 }" :wrapper-col="{ span: 23 }">
                <div class='timeseries' v-for="(queryParam, index) in timeseriesForms" :key="index">
                  <a-row :gutter="48">
                    <a-col :lg="8" :md="24" :xs="24" :sm="24">
                        <a-form-item label="指标名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                            <a-cascader
                                :allow-clear="false"
                                :options="options"
                                :display-render="queryParam.timeseriesDisplayRender"
                                @change="queryParam.change"
                                expand-trigger="hover"
                                placeholder="请选择指标类型"
                                v-model="queryParam.indexName"/>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="16" :md="24" :xs="24" :sm="24">
                        <a-form-item label="资源标签" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                            <a-select
                                mode="multiple"
                                placeholder="可输入多个标签"
                                style="width: 100%"
                                @change="queryParam.timeseriesResourcesChange"
                                v-model="queryParam.timeseriesResources">
                                <a-select-option v-for="item in queryParam.timeseriesData" :key="item">
                                    {{ item }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="24" :xs="24" :sm="24">
                        <a-form-item label="汇聚方法" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                            <a-select placeholder="选择汇聚方法" @change="queryParam.timeseriesMethodsChange" v-model="queryParam.timeseriesMethods">
                                <a-select-option v-for="item in methodsData" :key="item.value">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="16" :md="24" :xs="24" :sm="24">
                        <a-form-item label="分组标签" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                            <a-select
                                mode="multiple"
                                style="width: 100%"
                                placeholder="请选择"
                                @change="queryParam.timeseriesGroupChange"
                                v-model="queryParam.timeseriesGroup">
                                <a-select-option v-for="item in queryParam.groupData" :key="item">
                                    {{ item }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="8" :md="24" :xs="24" :sm="24">
                        <a-form-item label="图表类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                            <a-select v-model="queryParam.timeseriesChart" placeholder="选择图表类型">
                                <a-select-option :key="CHART_LINE_TYPE">折线图</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                  </a-row>
                </div>
                <!-- <p><a-button type="primary" icon="plus" style="margin-top:10px;" @click="addTimeseriesItem(null)">指标</a-button></p> -->
                <!-- 标记线 -->
                <div id="tabkey1_taline">
                  <div class='taline' v-for="(queryParam, index) in talineForms" :key="index">
                    <a-row :gutter="48">
                      <a-col :md="8" :sm="24">
                        <a-form-item label="标记线Y" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
                          <a-input-number
v-model="queryParam.markValue"
:min="0"
:step="0.01"
@change="queryParam.timeseriesMarkValueChange"
                          :parser="(value) => { if (value) {return Number.parseFloat(value)} else {return value} }"
style="width:100%;"/>
                        </a-form-item>
                      </a-col>
                      <a-col :md="8" :sm="24">
                        <a-form-item label="显示为" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
                          <a-select placeholder="正常" v-model="queryParam.markFlag" @change="queryParam.timeseriesMarkFlagChange">
                            <a-select-option v-for="item in stausData" :key="item.value">
                              {{ item.name }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :md="8" :sm="24">
                        <a-form-item label="请输入名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
                          <a-input placeholder="填写标记线名称" v-model="queryParam.lineName"/>
                        </a-form-item>
                      </a-col>
                      <span @click="delTalineItem(index)" class="taline_delete"><a-icon type="delete" /></span>
                    </a-row>
                  </div>
                </div>
                <p style="color:#fff;">
                <a-button type="primary" icon="plus" style="margin-top:10px;" @click="addTalineItem(null)">标记线</a-button>
                  标记线是以水位线的方式辅助查看图表
                </p>
              </a-form-item>
            </div>
            <!-- 统计排名 -->
            <div v-if="dashBoardTypes.includes('2') && dashBoardType === '2'">
              <a-form-item label="指标" :label-col="{ span: 1 }" :wrapper-col="{ span: 23 }">
                <div class='statistical'>
                  <a-row :gutter="48">
                    <a-col :md="8" :sm="24">
                      <a-form-item label="指标名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                        <a-cascader
                          :allow-clear="false"
                          :options="options"
                          :display-render="displayRenderStati"
                          expand-trigger="hover"
                          @change="statisticalIndicators"
                          placeholder="请选择指标类型"
                          v-model="statisticalData"/>
                      </a-form-item>
                    </a-col>
                    <a-col :md="16" :sm="24">
                      <a-form-item label="资源标签" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
                        <a-select
                          mode="multiple"
                          placeholder="可输入多个标签"
                          style="width: 100%"
                          v-model="queryParam.resourceLabel"
                          @change="handleStatisticalTab"
                          @deselect="handleStatisticalTabClose">
                          <a-select-option v-for="item in statisticalOptions" :key="item">
                              {{ item }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="24">
                      <a-form-item label="汇聚方法" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                        <a-select placeholder="请选择" v-model="queryParam.poolingMethod" @change="handleStatisticalChange">
                          <a-select-option v-for="item in methodsData" :key="item.value">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="24">
                      <a-form-item label="分组标签" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
                        <a-select
                          placeholder="请选择"
                          style="width: 100%"
                          v-model="queryParam.groupLabel"
                          @change="handleStatisticalChange">
                            <a-select-option v-for="item in statisticalGroupData" :key="item.value">
                              {{ item.name }}
                            </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="24">
                      <a-form-item label="图表类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
                        <a-select placeholder="请选择" v-model="queryParam.chartType">
                          <a-select-option :value="CHART_VEBAR_TYPE">条形图</a-select-option>
                          <a-select-option :value="CHART_PIE_TYPE">饼图</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :md="16" :sm="24" v-if="queryParam.groupLabel==='ip'">
                      <a-form-item label="排除标签" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
                        <a-select
                          mode="multiple"
                          placeholder="分组之后排除项选择"
                          style="width: 100%"
                          v-model="queryParam.excludeLabel"
                          @change="handleStatisticalChange">
                          <a-select-option v-for="item in statisticalExcludeData" :key="item">
                            {{ item }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-form-item>
            </div>
            <!-- 单值 -->
            <div v-if="dashBoardTypes.includes('3') && dashBoardType === '3'">
              <a-form-item label="指标" :label-col="{ span: 1 }" :wrapper-col="{ span: 23 }">
                <div class='single'>
                  <a-row :gutter="48">
                    <a-col :md="8" :sm="24">
                      <a-form-item label="指标名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                        <a-cascader
                          :options="options"
                          :allow-clear="false"
                          :display-render="displayRender"
                          @change="selectValueTab"
                          expand-trigger="hover"
                          placeholder="请选择指标名称"
                          v-model="valueTypes"/>
                      </a-form-item>
                    </a-col>
                    <a-col :md="16" :sm="24">
                      <a-form-item label="资源标签" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
                        <a-select
                          mode="default"
                          placeholder="请选择标签"
                          :value="singleTab"
                          style="width: 100%"
                          v-model="valueQueryParam.ip"
                          @change="handleSingleValueTab">
                          <a-select-option v-for="(item,i) in valueOptions" :key="i" :value="item">
                            {{ item }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="24">
                      <a-form-item label="汇聚方法" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                        <a-select v-model="valueQueryParam.strategy" placeholder="平均值" @change="handleValueMeth">
                          <a-select-option v-for="item in methodsData" :key="item.value">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :md="16" :sm="24">
                      <a-form-item label="图表类型" :label-col="{ span: 2 }" :wrapper-col="{ span: 8 }">
                        <a-select  v-model="valueQueryParam.chartType"  style="width: 100%" :disabled='disabled' @change="handleValueType">
                          <a-select-option v-for="item in valueTagTypes" :key="item.value">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-form-item>
            </div>
          </a-col>
        </a-form>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import { InputNumber } from 'ant-design-vue';
import { mapState, mapActions } from 'vuex';
import { VeLine, VeBar, VeRing, VeGauge } from 'v-charts/lib';
import { veBarChartSeries, veBarChartTooltip, veRingChartSeries, veRingChartTooltip, veRingChartLegend, barXAxis, barYAxis } from '../chartsSettings';
import { findallindex, findresourcebyindex, aggregate, boardPreStat, boardAddStat, addunitboard, updateboard } from '@/api/dashhome';
import { USER_INFO } from '@/store/mutation-types';
import { CHART_LINE_TYPE, CHART_BAR_TYPE, CHART_PIE_TYPE, CHART_GAUGE_TYPE, CHART_SINGLE_VALUE_TYPE, CHART_VEBAR_TYPE, methodsData, chartData, stausData } from '@/constant/constants';
const echarts = require('echarts');
export default {
  name: 'modalDialog',
  components: {
    VeLine,
    VeBar,
    VeRing,
    'a-input-number': InputNumber,
    VeGauge
  },
  data () {
    return {
      CHART_LINE_TYPE,
      CHART_BAR_TYPE,
      CHART_PIE_TYPE,
      CHART_GAUGE_TYPE,
      CHART_SINGLE_VALUE_TYPE,
      CHART_VEBAR_TYPE,
      bodyStyle: { height: '700px', overflow: 'auto' },
      staChartUnit: '', // t图表数据单位
      statiId: '', // 仪表盘id
      statisticalData: [], // 统计排名指标名称数据
      statisticalOptions: [], // 统计排名资源标签过滤数据
      resourceLabel: [], // 统计排名选中资源标签数据
      statisticalExcludeData: [], // 统计排名排除标签下拉框数据
      statisticalGroupData: [{ name: 'ip', value: 'ip' }, { name: '不选', value: '' }], // 统计排名分组下拉框数据
      // 条形图和饼图
      barXAxis,
      barYAxis,
      veBarChartSeries,
      veBarChartTooltip,
      veRingChartSeries,
      veRingChartTooltip,
      veRingChartLegend,
      queryParam: { excludeLabel: [], resourceLabel: [], groupLabel: '', poolingMethod: 'avg', chartType: CHART_VEBAR_TYPE }, // form2参数
      barGrid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '10%',
        containLabel: true
      },
      singleTab: [], // 单值资源标签
      methodsData, // 汇聚方法下拉框的数据
      chartData, // 图表下拉框数据
      stausData, // 状态数据
      dashConfirmLoading: false, // 添加仪表点击确定的loading
      dateFormat: 'YYYY/MM/DD',
      monthFormat: 'YYYY/MM',
      valueParam: {
        type: '',
        index: '',
        target: '',
        startTime: Math.round(new Date().setDate((new Date().getDate() - 1)) / 1000).toString(),
        endTime: Math.round(new Date().getTime() / 1000).toString()
      },
      valueOptions: [],
      valueTagTypes: [
        {
          name: '单值',
          value: CHART_SINGLE_VALUE_TYPE
        },
        {
          name: '迈速表',
          value: CHART_GAUGE_TYPE
        }
      ],
      valueQueryParam: {
        strategy: 'avg',
        type: '',
        index: '',
        target: '',
        ip: '',
        chartType: CHART_SINGLE_VALUE_TYPE,
        startTime: '',
        endTime: ''
      },
      addValueCount: {
        boardName: '单值仪表',
        strategy: '',
        boardMapName: '',
        type: '',
        index: '',
        target: '',
        ip: '',
        chartType: CHART_SINGLE_VALUE_TYPE
      },
      editValueCount: {
        boardName: '',
        strategy: '',
        boardMapName: '',
        type: '',
        index: '',
        target: '',
        ip: '',
        id: '',
        chartType: ''
      },
      valueCount: 0,
      disabled: true,
      isRate: false, // false显示数值 true显示迈速表
      valueTypes: [],
      unitVal: '',
      gaugeChartData: {
        columns: ['type', 'value'],
        rows: [{ type: '占比', value: 0 }]
      },
      chartExtend: {
        color: ['#3883f8']
      },
      chartExtendPie: {
        color: ['#3883f8', '#00b436', '#fdcc74', '#4f01f1', '#4ad2ff', '#00CCCC', '#0099CC', '#66CCCC', '#009999', '#33FF99']
      },
      gaugeValSettings: {
        dataName: {
          '占比': ''
        },
        dataType: {
          '占比': 'percent'
        },
        seriesMap: {
          '占比': {
            min: 0,
            max: 1,
            startAngle: 195,
            endAngle: -15,
            axisLine: {
              lineStyle: {
                color: [
                  [
                    1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      {
                        offset: 0.1,
                        color: 'rgba(20,138,0,1)'
                      },
                      {
                        offset: 0.5,
                        color: 'rgba(255,255,0,1)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(255,15,0,1)'
                      }
                    ])
                  ]
                ]
              }
            },
            detail: {
              offsetCenter: [0, '30%'], // 设置仪表盘下方显示内容位置
              textStyle: { color: '#6ac5fe', fontSize: 24 }
            },
            axisLabel: {
              textStyle: {
                fontWeight: 'bolder',
                color: '#6ac5fe',
                shadowColor: '#6ac5fe',
                shadowBlur: 10
              }
            },
            title: {
              textStyle: {
                fontSize: 14,
                color: '#6ac5fe',
                shadowColor: '#6ac5fe',
                shadowBlur: 10
              }
            }
          }
        }

      }
    };
  },
  computed: {
    title: {
      get () {
        return this.$store.state.instrumentpanel.title;
      },
      set (val) {
        this.$store.commit('instrumentpanel/toggleState', {
          title: val
        });
      }
    },
    ...mapState({
      dashBoardTypes: state => state.instrumentpanel.dashBoardTypes,
      options: state => state.instrumentpanel.options,
      boardDetailObj: state => state.instrumentpanel.boardDetailObj,
      showAddOrUpdateModalVisible: (state) => state.instrumentpanel.showAddOrUpdateModalVisible,
      addOrUpdateModalTitle: (state) => state.instrumentpanel.addOrUpdateModalTitle,
      timeseriesForms: (state) => state.instrumentpanel.timeseriesForms,
      timeseriesYAxis: state => state.instrumentpanel.timeseriesYAxis,
      titlePlaceholder: state => {
        const arr = [];
        state.instrumentpanel.timeseriesForms.forEach(item => {
          arr.push(item.indexName_);
        });
        let name = '';
        if (arr.length) {
          name = arr.join('');
        } else {
          name = '请输入标题';
        }
        return name;
      },
      curBoardMapList: state => state.instrumentpanel.curBoardMapList,
      talineForms: (state) => state.instrumentpanel.talineForms,
      dashBoardType: (state) => state.instrumentpanel.dashBoardType,
      curBoardMap: (state) => state.instrumentpanel.curBoardMap, // 当前仪表盘对象
      searchBoardMapParams: (state) => state.instrumentpanel.searchBoardMapParams, // 查询当前仪表列表的参数
      timeseriesVeLineChartSeries: state => state.instrumentpanel.timeseriesVeLineChartSeries,
      timeseriesLinexAxis: state => state.instrumentpanel.timeseriesLinexAxis,
      editOrAddVal: state => state.instrumentpanel.editOrAddVal
    })
  },
  async mounted () {
    const data = await findallindex();
    if (data.code === 0) {
      this.forChildren(data.data);
      this.$store.commit('instrumentpanel/toggleState', {
        options: data.data
      });
    }
    this.mounAggregate();
    this.monitoring(); // 调用统计排名修改监听事件
    this.monitoringAdd(); // 调用统计排名新增监听事件
    this.monitoringVal(); // 注册监听事件
  },
  methods: {
    ...mapActions({
      addTimeseriesItem: 'instrumentpanel/addTimeseriesItem', // 新增每一项指标
      addTalineItem: 'instrumentpanel/addTalineItem', // 新增每一项标记线
      delTalineItem: 'instrumentpanel/delTalineItem', // 删除每一项标记线
      findboardbyboardmap: 'instrumentpanel/findboardbyboardmap' // 当前仪表盘参数
    }),
    async selectValueTab (val, select) {
      this.title = '单值仪表' + select[2].label;
      this.valueCount = 0;
      const obj = {
        type: val[0],
        index: val[1],
        target: val[2]
      };
      Object.assign(this.valueParam, obj);
      this.valueParam.startTime = this.searchBoardMapParams.startTime;
      this.valueParam.endTime = this.searchBoardMapParams.endTime;
      Object.assign(this.valueQueryParam, obj);
      Object.assign(this.addValueCount, obj);
      Object.assign(this.editValueCount, obj);
      this.gaugeValSettings.dataName['占比'] = select[2].label;
      this.unitVal = select[2].unit;
      if (select[2].isRate) {
        this.isRate = true;
        this.disabled = false;
        this.valueQueryParam.chartType = CHART_GAUGE_TYPE;
        this.addValueCount.chartType = CHART_GAUGE_TYPE;
      } else if (!select[2].isRate) {
        this.isRate = false;
        this.disabled = true;
        this.valueQueryParam.chartType = CHART_SINGLE_VALUE_TYPE;
        this.addValueCount.chartType = CHART_SINGLE_VALUE_TYPE;
      }
      const { data } = await findresourcebyindex(this.valueParam);
      this.valueQueryParam.ip = '';
      this.valueOptions = data;
      if (data.length === 0) {
        this.valueCount = 0;
        this.unitVal = '';
        this.isRate = false;
        this.valueQueryParam.chartType = CHART_SINGLE_VALUE_TYPE;
        this.addValueCount.chartType = CHART_SINGLE_VALUE_TYPE;
      }
    },
    handleSingleValueTab (val) {
      this.valueParam.ip = val;
      this.valueQueryParam.ip = val;
      this.addValueCount.ip = val;
      Object.assign(this.valueQueryParam, this.valueParam);
      this.title = '单值仪表' + this.options[0].children[0].children[0].label;
      this.aggregate();
    },
    handleValueMeth (val) {
      this.valueQueryParam.startTime = this.searchBoardMapParams.startTime;
      this.valueQueryParam.endTime = this.searchBoardMapParams.endTime;
      this.addValueCount.strategy = val;
      if (val === 'sum') {
        this.aggregate('sum');
      } else {
        this.aggregate();
      }
    },
    forChildren (arr) {
      if (!arr) return;
      arr.forEach((item, index) => {
        if (typeof item === 'object') {
          item.value = item.idx;
          item.label = item.idxName;
          item.children = item.targets;
          this.forChildren(item.children);
        } else {
          const targets = item.split('_');
          const obj = {};
          obj.label = targets[1];
          obj.value = targets[0];
          obj.unit = targets[2]; // 单值单位
          if (targets[2] === '%') {
            obj.isRate = true;
          } else {
            obj.isRate = false;
          }
          arr[index] = obj;
        }
      });
    },
    // 确定新增仪表
    async handleSureAdd (e) {
      e.preventDefault();
      const { dashBoardType } = this;
      this.dashConfirmLoading = true;
      switch (dashBoardType) {
        case '1': // 时间序列
          const data = await this.$store.dispatch('instrumentpanel/boardAddOrUpdateTime');
          if (data.code === 1) {
            this.$message.error(data.msg);
          } else {
            this.$message.success(data.msg);
          }
          break;
        case '2':
          this.handleBoardAddStat();
          break;
        case '3':
          this.addValCount();
          break;
        default:
          this.dashConfirmLoading = false;
          break;
      }
      setTimeout(() => {
        this.dashConfirmLoading = false;
      }, 500);
    },
    // 取消新增仪表
    handleCancelAdd (e) {
      e.preventDefault();
      this.$store.commit('instrumentpanel/toggleState', { showAddOrUpdateModalVisible: false });
      this.$store.commit('instrumentpanel/clearTimeseries');
      this.statisticalData = []; // 置空统计排名指标名称数据
      this.resetMothods(); // 调用统计排名重置方法
      this.valueQueryParam.ip = '';
      this.resetValueParam();
    },
    // form表单里面的tab
    callback (key) {
      this.$store.commit('instrumentpanel/toggleState', { dashBoardType: key });
    },
    // form表单统计排名新增方法
    async handleBoardAddStat () {
      if (this.statisticalData.length === 0) { // 判断指标名称不能为空
        this.$message.warning('请选择指标名称');
        return false;
      }
      if (!this.queryParam.groupLabel && this.queryParam.resourceLabel.length === 0) { // 判断资源标签或分组标签不能都为空
        this.$message.warning('资源标签和分组标签必须选择一个');
        return false;
      }
      if (this.title === '') { // 判断标题不能为空
        this.$message.warning('请输入标题');
        return false;
      }
      const params = {
        userName: this.$ss.get(USER_INFO).name,
        dashBoardType: '2',
        boardMapId: this.curBoardMap.id,
        boardName: this.title,
        chartType: this.queryParam.chartType,
        type: this.statisticalData[0],
        index: this.statisticalData[1],
        target: this.statisticalData[2],
        poolingMethod: this.queryParam.poolingMethod,
        groupLabel: this.queryParam.groupLabel,
        resourceLabel: this.queryParam.resourceLabel,
        excludeLabel: this.queryParam.excludeLabel
      };
      if (this.statiId === '') { // 判断id，没有id代表新增
        const res = await boardAddStat(params);
        if (res.code === 0) {
          this.$message.success('新增成功');
          this.publicMothods(); // 根据指标项查询资源标签
          this.resetMothods(); // 重置方法
          this.refreshMothods(); // 调取查询方法隐藏弹框
        } else {
          this.$message.error('新增失败');
          this.$store.commit('instrumentpanel/toggleState', { showAddOrUpdateModalVisible: true }); // 失败弹窗不隐藏
        }
      } else { // id有值就赋值给params传值给后台
        params.id = this.statiId;
        const res = await updateboard(params);
        if (res.code === 0) {
          this.$message.success('修改成功');
          this.statiId = ''; // 置空仪表id
          this.publicMothods(); // 根据指标项查询资源标签
          this.resetMothods(); // 重置方法
          this.refreshMothods(); // 调取查询方法隐藏弹框
        } else {
          this.$message.error('修改失败');
          this.$store.commit('instrumentpanel/toggleState', { showAddOrUpdateModalVisible: true }); // 失败弹窗不隐藏
        }
      }
    },
    // 重置方法公共代码
    resetMothods () {
      this.staChartUnit = ''; // 清空单位
      this.barYAxis.data = []; // 置空图表的数据
      this.veBarChartSeries.data = [];
      this.veRingChartSeries.data = [];
      this.veRingChartLegend.data = [];
      this.queryParam = { poolingMethod: 'avg', chartType: CHART_VEBAR_TYPE, groupLabel: '', resourceLabel: [], excludeLabel: [] };
    },
    refreshMothods () { // 刷新数据隐藏弹窗
      this.findboardbyboardmap(this.searchBoardMapParams);
      this.$store.commit('instrumentpanel/toggleState', { showAddOrUpdateModalVisible: false, title: '' });
    },
    // 根据指标项查询资源标签公共代码
    async publicMothods () {
      console.log('执行了查询资源标签代码');
      const param = {
        type: this.statisticalData[0],
        index: this.statisticalData[1],
        target: this.statisticalData[2],
        startTime: this.searchBoardMapParams.startTime,
        endTime: this.searchBoardMapParams.endTime
      };
      const res = await findresourcebyindex(param);
      if (res.code === 0) {
        this.statisticalOptions = res.data; // 赋值给统计排名资源标签选择的数据
      }
    },
    monitoring () { // 统计排名修改监听事件
      this.$on('childMethod', (res) => {
        this.queryParam = res;
        this.statiId = this.queryParam.id; // 将仪表id赋值给全局变量
        this.statisticalData = [this.queryParam.type, this.queryParam.index, this.queryParam.target]; // 给指标名称赋值回填
        this.publicMothods(); // 根据指标项查询资源标签公共代码
        this.statisticalExcludeData = this.queryParam.resourceLabel; // 将资源标签数据赋值给排除标签
        this.handleBoardPreStatistical(); // 统计排名实时显示接口
        this.$store.commit('instrumentpanel/toggleState', { title: this.queryParam.boardName });
      });
    },
    monitoringAdd () { // 统计排名新增监听事件
      this.$on('childMethod2', (res) => {
        // 给指标名称初始默认值
        this.statisticalData = [this.options[0].value, this.options[0].children[0].value, this.options[0].children[0].children[0].value];
        this.publicMothods(); // 根据指标项查询资源标签公共代码
      });
    },
    displayRenderStati ({ labels }) { // 统计排名指标名称的render函数，暂时无用
      return labels[labels.length - 1];
    },
    // 判断资源标签和分组标签值不为空的方法
    judgeMothods () {
      if (!this.queryParam.groupLabel && this.queryParam.resourceLabel.length === 0) {
        this.barYAxis.data = []; // 如果资源标签和分组标签都没有选中，就先置空图表数据
        this.veBarChartSeries.data = [];
        this.veRingChartSeries.data = [];
        this.veRingChartLegend.data = [];
        return false;
      } else {
        this.handleBoardPreStatistical(); // 调用统计排名实时显示数据接口
      }
    },
    // form表单统计排名的指标名称change方法
    async statisticalIndicators (value, selectedOptions) {
      this.title = '统计排名' + selectedOptions[2].label;
      this.staChartUnit = selectedOptions[2].unit; // 选择指标名称后单位赋值
      this.queryParam.resourceLabel = []; // 置空资源标签数据
      this.statisticalExcludeData = []; // 置空排除标签数据
      this.queryParam.excludeLabel = []; // 置空排除标签选中的数据
      if (selectedOptions !== undefined && selectedOptions.length > 2) {
        this.queryParam.type = selectedOptions[0].value;
        this.queryParam.index = selectedOptions[1].value;
        this.queryParam.target = selectedOptions[2].value;
        const param = {
          type: selectedOptions[0].value,
          index: selectedOptions[1].value,
          target: selectedOptions[2].value,
          startTime: this.searchBoardMapParams.startTime,
          endTime: this.searchBoardMapParams.endTime
        };
        console.log('选择指标名称的参数', param);
        const res = await findresourcebyindex(param);
        if (res.code === 0) {
          this.statisticalOptions = res.data; // 赋值统计排名资源标签过滤数据
          veBarChartTooltip.formatter = (v) => {
            return `${v[0].name}: ${v[0].value}${this.staChartUnit}`;
          }; // 条形图数据单位赋值
          veRingChartTooltip.formatter = (v) => {
            return `${v.name}: ${v.value}${this.staChartUnit}(占比${v.percent.toFixed(2)}%)`;
          }; // 饼图数据单位赋值
        }
      }
      this.judgeMothods();
    },
    // form表单统计排名资源标签change事件
    handleStatisticalTab (resourceLabel) {
      this.title = '统计排名' + this.options[0].children[0].children[0].label;
      this.queryParam.resourceLabel = resourceLabel; // 赋值资源标签
      this.statisticalExcludeData = this.queryParam.resourceLabel; // 赋值排除标签
      this.judgeMothods(); // 调用判断资源标签和分组标签值不为空的方法
    },
    handleStatisticalTabClose (resourceLabel) { // 关闭资源标签单项，同时清除排除标签数据
      this.queryParam.excludeLabel = this.queryParam.excludeLabel.filter(item => item !== resourceLabel);
      this.statisticalExcludeData = this.statisticalExcludeData.filter(item => item !== resourceLabel);
    },
    // form表单统计排名的汇聚方法/排除标签/分组标签change公共方法,调用判断资源标签和分组标签值不为空的方法
    handleStatisticalChange (value) {
      this.judgeMothods();
    },
    // 统计排名实时显示数据接口
    async handleBoardPreStatistical () {
      const param = {
        type: this.statisticalData[0],
        index: this.statisticalData[1],
        target: this.statisticalData[2],
        poolingMethod: this.queryParam.poolingMethod,
        groupLabel: this.queryParam.groupLabel,
        resourceLabel: this.queryParam.resourceLabel,
        excludeLabel: this.queryParam.excludeLabel,
        chartType: this.queryParam.chartType,
        startTime: this.searchBoardMapParams.startTime,
        endTime: this.searchBoardMapParams.endTime
      };
      const res = await boardPreStat(param);
      veBarChartTooltip.formatter = (v) => {
        return `${v[0].name}: ${v[0].value}${this.staChartUnit}`;
      }; // 条形图数据单位赋值
      veRingChartTooltip.formatter = (v) => {
        return `${v.name}: ${v.value}${this.staChartUnit}(占比${v.percent.toFixed(2)}%)`;
      }; // 饼图数据单位赋值
      this.barYAxis.data = []; // 先置空图表数据
      this.veBarChartSeries.data = [];
      this.veRingChartSeries.data = [];
      if (!this.queryParam.groupLabel && this.queryParam.resourceLabel.length === 0) {
        return; // 先判断分组标签和资源标签是否为空，如果为空就不赋值给图表数据
      } else {
        // 循环res.data，处理数据赋值给条形图和饼图数据
        res.data.forEach((item) => {
          for (const key in item) {
            this.barYAxis.data.push(key);
            this.veBarChartSeries.data.push(item[key]);
            const obj = { value: 0, name: '' };
            obj.name = key;
            obj.value = Math.round(item[key] * 100) / 100;
            this.veRingChartSeries.data.push(obj);
            this.veRingChartLegend.data.push(key);
          }
        });
      }
      // 判断数据的长度，设置条形图的间距大小
      if (res.data.length === 1) {
        this.barGrid.bottom = '80%';
      } else if (res.data.length === 2) {
        this.barGrid.bottom = '70%';
      } else if (res.data.length === 3) {
        this.barGrid.bottom = '60%';
      } else if (res.data.length === 4) {
        this.barGrid.bottom = '50%';
      } else {
        this.barGrid.bottom = '5%';
      }
      return res;
    },
    async findresourcebyindex (param) { // 根据指标项查询资源标签的请求方法
      const res = await findresourcebyindex(param);
      return res;
    },
    displayRender ({ labels }) { // form表单的单值的指标名称render方法
      return labels[labels.length - 1];
    },
    async aggregate (type) {
      // 单值仪表盘数据实时显示
      const { boardMapId, startTime, endTime } = this.searchBoardMapParams;
      this.addValueCount.boardMapId = boardMapId;
      this.valueQueryParam.startTime = startTime;
      this.valueQueryParam.endTime = endTime;
      const data = await aggregate(this.valueQueryParam);
      if (data.data === '' || data.data === undefined) {
        this.valueCount = 0;
        this.isRate = false;
        this.valueQueryParam.chartType = CHART_SINGLE_VALUE_TYPE;
        this.addValueCount.chartType = CHART_SINGLE_VALUE_TYPE;
        return;
      }
      this.valueCount = data.data[0].value[0][this.valueQueryParam.strategy];
      this.gaugeChartData.rows[0].value = data.data[0].value[0][this.valueQueryParam.strategy] / 100;
      if (type === 'sum') {
        this.gaugeValSettings.seriesMap['占比'].max = data.count;
      } else {
        this.gaugeValSettings.seriesMap['占比'].max = 1;
      }
    },
    handleValueType (val, select) {
      if (val === CHART_GAUGE_TYPE) {
        this.isRate = true;
      } else if (val === CHART_SINGLE_VALUE_TYPE) {
        this.isRate = false;
      }
    },
    // 单值仪表新增
    async addValCount () {
      this.addValueCount.boardMapId = this.curBoardMap.id;
      this.addValueCount.ip = this.valueQueryParam.ip;
      this.addValueCount.strategy = this.valueQueryParam.strategy;
      if (this.editOrAddVal.length === 0) {
        this.$message.warning('当前没有资源标签，无法新增！');
        return;
      }
      if (this.editOrAddVal) {
        if (this.valueTypes.length === 0) {
          this.$message.warning('请选择指标名称');
          return;
        }
        if (this.addValueCount.ip === '') {
          this.$message.warning('请选择资源标签');
          return;
        }
        if (this.title === '') {
          this.$message.warning('请输入标题');
          return;
        }
        this.addValueCount.chartType = this.valueQueryParam.chartType;
        this.addValueCount.boardName = this.title + 'utilVal:' + this.unitVal;
        const valData = await addunitboard(this.addValueCount);
        if (valData.code === 1) {
          this.$message.error('新增单值仪表失败');
        } else if (valData.code === 0) {
          this.$message.success('新增成功');
          this.findboardbyboardmap(this.searchBoardMapParams);
          this.$store.commit('instrumentpanel/toggleState', { addOrUpdateModalTitle: '新增仪表', showAddOrUpdateModalVisible: false });
          this.dashConfirmLoading = false;
          this.resetValueParam();
        } else {
          this.$message.error('新增单值仪表失败');
        }
      } else {
        this.editValueCount.boardName = this.title + 'utilVal:' + this.unitVal;
        this.editValueCount.chartType = this.valueQueryParam.chartType;
        this.editValueCount.dashBoardType = '3';
        const res = await updateboard(this.editValueCount);
        if (res.code === 0) {
          this.$message.success('修改成功');
          this.findboardbyboardmap(this.searchBoardMapParams);
          this.$store.commit('instrumentpanel/toggleState', { addOrUpdateModalTitle: '新增仪表', showAddOrUpdateModalVisible: false });
          this.resetValueParam();
        }
      }
    },
    async resetValueParam () {
      const obj = {
        type: this.options[0].value,
        index: this.options[0].children[0].value,
        target: this.options[0].children[0].children[0].value
      };
      this.valueParam = obj;
      Object.assign(this.valueParam, obj);
      this.valueTypes = [this.options[0].value, this.options[0].children[0].value, this.options[0].children[0].children[0].value];
      const lists = await findresourcebyindex(this.valueParam);
      this.valueOptions = lists.data;
      Object.assign(this.valueQueryParam, obj);
      Object.assign(this.addValueCount, obj);
      this.valueParam.endTime = Math.round(new Date().getTime() / 1000).toString();
      this.valueParam.startTime = Math.round(new Date().setDate((new Date().getDate() - 1)) / 1000).toString();
      this.isRate = false;
      this.valueCount = 0;
    },
    monitoringVal () { // 监听事件
      let curTarget = {};
      this.$on('childMethodVal', (res) => {
        const obj = {
          ip: res.ip,
          type: res.type,
          index: res.index,
          target: res.target,
          strategy: res.strategy
        };
        this.options.forEach(indexs => {
          if (indexs.children && indexs.children.length > 0 && indexs.value === res.type) {
            indexs.children.forEach(types => {
              if (types.children && types.children.length > 0 && types.value === res.index) {
                types.children.forEach(targets => {
                  if (targets.value === res.target) {
                    curTarget = targets;
                    if (curTarget.isRate) {
                      this.disabled = false;
                      if (res.chartType === CHART_GAUGE_TYPE) {
                        this.isRate = true;
                      } else if (res.chartType === CHART_SINGLE_VALUE_TYPE) {
                        this.isRate = false;
                      }
                    } else {
                      this.isRate = false;
                      this.disabled = true;
                    }
                  }
                });
              }
            });
          }
        });
        this.valueQueryParam.ip = res.ip;
        this.valueQueryParam.strategy = res.strategy;
        this.valueQueryParam.chartType = res.chartType;
        findresourcebyindex(this.valueParam).then(data => {
          if (data.code === 0) {
            this.valueOptions = data.data;
            if (data.data.length === 0) {
              this.valueQueryParam.ip = '';
            }
            Object.assign(this.addValueCount, obj);
            Object.assign(this.editValueCount, obj);
            this.editValueCount.id = res.id;
            this.$store.commit('instrumentpanel/toggleState', {
              title: res.boardName
            });

            this.valueTypes = [res.type, res.index, res.target];

            Object.assign(this.valueQueryParam, obj);
            this.aggregate();
          }
        });
      });
    },
    async mounAggregate () {
      if (this.options.length === 0) {
        return false;
      } else {
        const obj = {
          type: this.options[0].value,
          index: this.options[0].children[0].value,
          target: this.options[0].children[0].children[0].value
        };
        this.title = this.options[0].children[0].children[0].label;
        this.unitVal = this.options[0].children[0].children[0].unit;
        this.valueParam.type = this.options[0].value;
        Object.assign(this.valueParam, obj);
        this.valueTypes = [this.options[0].value, this.options[0].children[0].value, this.options[0].children[0].children[0].value];
        const lists = await findresourcebyindex(this.valueParam);
        this.valueOptions = lists.data;
        Object.assign(this.addValueCount, obj);
        Object.assign(this.valueOptions, obj);
        this.gaugeValSettings.dataName['占比'] = this.options[0].children[0].children[0].label;
        const datasOPtios = await findresourcebyindex(this.valueParam);
        this.valueOptions = datasOPtios.data;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.timeseries{
    background-color: #1a5f97;
    padding: 20px;
    position: relative;
    .timeseries_delete{
        position: absolute;
        right: 40px;
        top: 40px;
        font-size: 25px;
        color: #fff;
    }
}
.taline{
    background-color: #1a5f97;
    padding: 20px;
    position: relative;
    .taline_delete{
        position: absolute;
        right: 40px;
        top: 4px;
        font-size: 25px;
        color: #fff;
    }
}
.statistical{
    background-color: #1a5f97;
    padding: 20px;
    .color{
        display: inline-block;
        width: 24px;
        height: 24px;
    }
}
/deep/ .ant-btn {
    margin-left: 0 !important;
    display: inline-block;
    text-align: left;
    border: 1px solid #0154be;
    background-color: #0A3D76;
}
/deep/ .ant-dropdown-menu {
    width: 170px  !important;
    height: 66px;
    padding: 10px 0 0 10px;
}
/deep/ .ant-dropdown {
    width: 145px;
    height: 66px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
/deep/ .ant-dropdown-menu-item{
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: 0 6px 6px 0;
    padding: 0;
}
.single{
    background-color: #1a5f97;
    padding: 20px;
}
.ant-modal-root .ant-modal-content .ant-modal-header .ant-modal-title {
    text-align: center;
}
/deep/ .ant-col{
    text-align: left;
}
/deep/ .ant-form-item {
    margin-bottom: 0px;
}
/deep/ .ant-select-selection--multiple .ant-select-selection__choice {
    color: #fff;
    background-color: #3DA9ED;
    border: 1px solid #2E649A;
    border-radius: 6px;
}
/deep/ .ant-input-number-input {
    background-color: #0A3D76;
    border: 1px solid #2E649A;
}
/deep/ input {
    color: #17A1E6;
}
/deep/ .ant-select-disabled .ant-select-selection {
    background: #0A3D76;
}
/deep/ .ant-input-number-handler-wrap {
    background: none;
}
/deep/.ant-form-item-label > label {
    color: #fff;
}

</style>
