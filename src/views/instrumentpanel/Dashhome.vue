<template>
  <div ref="viewBox" class="dashhome-con-box">
    <a-button type="primary" style="margin-left: 15px;" @click="handleCreate" v-show="dataSource.length === 0">创建仪表盘</a-button>
    <div style="padding:0 10px 10px 10px;" v-show="dataSource.length > 0">
      <div class="dash_top" :class="{fixed:true}" ref="topFixed">
        <div class="dash_input">
          <a-auto-complete
            :data-source="dataSource"
            class="dash-auto-comp"
            style="width:280px;margin-right:20px;"
            :placeholder="placeholder"
            v-model = "autoCompValue"
            @select="hadleSelectItem"
            :filter-option="filterOption"
          />
          <a-input
            class="input"
            ref="userNameInput"
            v-model="inputValue"
            style="width:300px;margin-right:20px;"
            type="button"
            @click="isShow=true">
            <a-icon slot="prefix" type="clock-circle" />
            <a-tooltip slot="suffix">
              <a-icon type="down" style="color: #fff;"/>
            </a-tooltip>
          </a-input>
          <!-- 创建仪表盘按钮 -->
          <a-button type="primary" style="background: #2082c3;border-color: #2082c3;" @click="handleCreate">创建仪表盘</a-button>
          <!-- 创建编辑仪表盘弹窗 -->
          <a-modal
            :title="title"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @cancel="handleCancel"
            centered
            @ok="handleOk"
            >
            <a-form :form="form" :wrapper-col="{ span: 24 }">
              <a-form-item>
                <a-input placeholder="请输入仪表盘名称" v-decorator="['name', { rules: [{ required: true, message: '请输入仪表盘名称!' }] }]"/>
              </a-form-item>
            </a-form>
          </a-modal>
        </div>
        <!-- 两个图标 -->
        <div class="dash_icon">
          <div class="iconfonts">
            <a-dropdown :trigger="['click']" overlayClassName="dash-drop">
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>给仪表盘更换尺寸</span>
                  </template>
                  <span><a-icon type="appstore" /></span>
                </a-tooltip>
              </a>
              <a-menu slot="overlay"  @click="handleSizeClick">
                <a-menu-item key="S">S</a-menu-item>
                <a-menu-item key="M">M</a-menu-item>
                <a-menu-item key="L">L</a-menu-item>
                <a-menu-item key="XL">XL</a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>编辑仪表盘</span>
                  </template>
                  <span><a-icon type="setting" /></span>
                </a-tooltip>
              </a>
              <a-menu slot="overlay">
                <a-menu-item key="0" @click="handleEditor">编辑</a-menu-item>
                <a-menu-item key="3" @click="handleDelete">删除</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </div>
      <!-- 仪表 -->
      <div class="dsah_board" style="margin-top: 60px;">
        <a-row :gutter="[24,16]">
          <a-col :span="heightStyle.span" v-for="(item,i) in boardList" :key="i">
            <div class='dsah_chart' :style="heightStyle">
              <header>
                <div class='dashwidget-title'>
                  <div class='dashwidget-name'>{{item.boardName}}</div>
                  <div class='dashwidget-ctrls'>
                    <div>
                      <a-icon type="form" @click="changeDashChart(item)"/>
                      <a-icon type="fullscreen" @click="chartFullscreen(item)" />
                      <a-icon type="close" @click="closeDashChart(item)"/>
                    </div>
                  </div>
                  <div class='dashwidget-tip'>{{item.boardName}}</div>
                </div>
              </header>
              <ve-line
                v-if="item.dashBoardType === '1' "
                width="100%"
                :height="heightStyle.chartHeight"
                :yAxis="item.yAxis"
                :xAxis="item.xAxis"
                :series="item.series"
                :grid ="grid">
                <div v-show="item.series&&item.series.length === 0" class="data-empty"><div class="wushuju"><a-icon type="unordered-list" /></div>这段时间暂无数据</div>
              </ve-line>
              <ve-bar
                width="100%"
                v-if="item.dashBoardType === '2' && item.chartType === CHART_VEBAR_TYPE"
                :height="heightStyle.chartHeight"
                :xAxis ="item.xAxis"
                :yAxis ="item.yAxis"
                :tooltip="veBarChartTooltip"
                :series="item.series"
                :legend-visible="false"
                :grid='item.grid'
                :extend="chartExtend"
              ><div v-show="item.series&&item.series.length === 0" class="data-empty"><div class="wushuju"><a-icon type="unordered-list" /></div>这段时间暂无数据</div></ve-bar>
              <!--  -->
              <ve-ring
                width="100%"
                v-if="item.dashBoardType === '2' && item.chartType === CHART_PIE_TYPE"
                :tooltip="item.veRingChartTooltip"
                :height="heightStyle.chartHeight"
                :series="item.veRingChartSeries"
                :extend="chartExtendPie"
              >
              <div v-show="item.veRingChartSeries.data.length === 0" class="data-empty"><div class="wushuju"><a-icon type="unordered-list" /></div>这段时间暂无数据</div>
              <ul v-show="showtLegend" class="legend-box" :style="{height:heightStyle.chartHeight}">
                <li v-for="(text,key) in item.formatterV" :key='key' :title="text">{{text}}</li>
              </ul>
              </ve-ring>
              <span
v-if="item.dashBoardType === '3'&& item.chartType === CHART_SINGLE_VALUE_TYPE"
:style="{height:heightStyle.chartHeight,lineHeight:heightStyle.chartHeight,fontSize:valFonSize}"
              class="item-ag">
               <span class="dash-charttext">{{item.gaugeChartData.curKey +'：' + item.gaugeChartData.valCountNum}}{{curBIgChart.utils}}</span> {{item.gaugeChartData.rows[0].value }}{{item.utils}}
                </span>
              <ve-gauge
width="100%"
v-if="item.dashBoardType === '3'&& item.chartType === CHART_GAUGE_TYPE"
:data="item.gaugeChartData"
:settings="gaugeValSettings1"
               :height="heightStyle.chartHeight">
                <span class="dash-charttext">{{item.gaugeChartData.curKey + '占比' +'：' + item.gaugeChartData.valCountNum+'%'}}</span>
              </ve-gauge>
            </div>
          </a-col>
          <a-col :span="heightStyle.span">
            <div class="add_dash" :style="heightStyle" @click="handleAddDash">
              <div class="center_dash">
                <a-icon type="plus-square" />
                <p>添加仪表</p>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <!-- 时间选择框 -->
      <div ref="aa">
        <a-modal
        v-model="isShow"
        class="choose_panel dash-time-modal"
        width="600px"
        :mask='false'
        :footer="null"
        :closable='false'
        :getContainer="()=>this.$refs.aa"
        >
          <div class="choose_date">
            <a @click="handleTimeShow" >自定义</a>
            <ul>
              <li :class="tag===index?'bgcolor':''" v-for="(item,index) in timeList" :key="index" @click="handleChangeTime(index,item)">
                {{ item.name }}
              </li>
            </ul>
          </div>
          <div class="dash_panel_picker" :style="pickerStyle">
            <a-range-picker
            :disabledDate="handleData"
              show-time
              format="YYYY/MM/DD HH:mm:ss"
              @ok="onSelectTime"
              style="width:100%;margin-top:10px;"
              v-show="isTimeShow"
            />
          </div>
        </a-modal>
      </div>
      <!-- 图表放大 -->
      <a-modal
        v-model="isBigChart"
        class="bigchart_panel"
        :maskClosable = "false"
        :footer="null"
        width="90%"
      >
        <div class="big-chart">
          <p>{{curBIgChart.boardName}}</p>
          <ve-line
            v-show="curBIgChart.dashBoardType === '1'"
            width= "98%"
            height="700px"
            :xAxis ="curBIgChart.xAxis"
            :yAxis ="curBIgChart.yAxis"
            :series="curBIgChart.series"
            :grid ="grid">
            <div v-show="curBIgChart.series&&curBIgChart.series.length === 0" class="data-empty"><div class="wushuju"><a-icon type="unordered-list" /></div>这段时间暂无数据</div>
          </ve-line>
          <ve-bar
            v-if="curBIgChart.dashBoardType === '2' && curBIgChart.chartType === CHART_VEBAR_TYPE"
            height="700px"
            :legend-visible="false"
            :xAxis ="curBIgChart.xAxis"
            :yAxis ="curBIgChart.yAxis"
            :tooltip="veBarChartTooltip"
            :grid='curBIgChart.gridBig'
            :extend="chartExtend"
            :series="curBIgChart.series">
            <div v-show="curBIgChart.series&&curBIgChart.series.length === 0" class="data-empty"><div class="wushuju"><a-icon type="unordered-list" /></div>这段时间暂无数据</div>
          </ve-bar>
          <ve-ring
            v-if="curBIgChart.dashBoardType === '2' && curBIgChart.chartType === CHART_PIE_TYPE"
            :tooltip="curBIgChart.veRingChartTooltip"
            height="700px"
            :series="curBIgChart.veRingChartSeries"
            :extend="chartExtendPie">
            <div v-show="curBIgChart.veRingChartLegend && curBIgChart.veRingChartLegend.data && curBIgChart.veRingChartLegend.data.length === 0" class="data-empty">
              <div class="wushuju"><a-icon type="unordered-list" /></div>这段时间暂无数据
              </div>
              <ul class="legend-box legend-big-box" :style="{height:heightStyle.chartHeight}">
                <li v-for="(text,key) in curBIgChart.formatterV" :key='key' :title="text">{{text}}</li>
              </ul>
          </ve-ring>
          <span v-if="curBIgChart.dashBoardType === '3'&&curBIgChart.chartType === CHART_SINGLE_VALUE_TYPE" style="height：700px;line-height:700px;" class="item-ag item-big-chart">
          <span class="dash-charttext">{{curBIgChart.gaugeChartData.curKey  +'：' + curBIgChart.gaugeChartData.valCountNum}}{{curBIgChart.utils}}</span>   {{curBIgChart.gaugeChartData.rows[0].value}}{{curBIgChart.utils}}<span></span>
            </span>
          <ve-gauge
v-if="curBIgChart.dashBoardType === '3'&&curBIgChart.chartType === CHART_GAUGE_TYPE"
          :data="curBIgChart.gaugeChartData"
:settings="gaugeValSettings"
height="700px">
          <span class="dash-charttext">{{curBIgChart.gaugeChartData.curKey + '占比' +'：' + curBIgChart.gaugeChartData.valCountNum+'%'}}</span>
          </ve-gauge>
        </div>
      </a-modal>
      <!-- 点击新增及修改的表单 -->
      <modalDialog ref='modalDialog'></modalDialog>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { AutoComplete } from 'ant-design-vue';
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import { VeGauge, VeHistogram, VeLine, VeBar, VeRing } from 'v-charts/lib';
import modalDialog from './components/ModalDialog';
import { findallboardmap, deleteboardmap, addboardmap, updateboardmap, deleteboard, findBoardById } from '@/api/dashhome';
import { CHART_LINE_TYPE, CHART_BAR_TYPE, CHART_PIE_TYPE, CHART_GAUGE_TYPE, CHART_SINGLE_VALUE_TYPE, CHART_VEBAR_TYPE } from '@/constant/constants';
import { USER_INFO, INSTRUMENTPANEL_STYLE } from '@/store/mutation-types';
import { timeList } from '@/constant/chart-settings';
const echarts = require('echarts');
export default {
  components: {
    'a-auto-complete': AutoComplete,
    VeGauge,
    VeHistogram,
    VeLine,
    modalDialog,
    VeBar,
    VeRing
  },
  computed: {
    ...mapState({
      searchBoardMapParams: (state) => state.instrumentpanel.searchBoardMapParams,
      curBoardMap: (state) => state.instrumentpanel.curBoardMap,
      curBoardMapList: (state) => state.instrumentpanel.curBoardMapList
    })
  },
  watch: {
    curBoardMapList: {
      handler: function (val, oldval) {
        this.boardList = val;
        if (this.heightStyle.span === 4) {
          this.showtLegend = false;
          this.valFonSize = '16px';
          this.gaugeValSettings1.seriesMap['占比'].axisLine.lineStyle.width = 15;
          this.gaugeValSettings1.seriesMap['占比'].axisLabel.show = false;
          this.gaugeValSettings1.seriesMap['占比'].axisLabel.show = false;
          this.gaugeValSettings1.seriesMap['占比'].splitLine.length = 10;
          this.boardList.forEach(element => {
            if (element.dashBoardType === '1') {
              element.xAxis.show = false;
              element.xAxis.axisLabel.show = false;
            }
          });
        } else if (this.heightStyle.span === 6) {
          this.showtLegend = true;
          this.valFonSize = '26px';
          this.gaugeValSettings1.seriesMap['占比'].axisLine.lineStyle.width = 20;
          this.gaugeValSettings1.seriesMap['占比'].axisLabel.show = false;
          this.gaugeValSettings1.seriesMap['占比'].splitLine.length = 10;
          this.boardList.forEach(element => {
            if (element.dashBoardType === '1') {
              element.xAxis.show = true;
              element.xAxis.axisLabel.show = true;
            }
          });
        } else if (this.heightStyle.span === 8) {
          this.showtLegend = true;
          this.valFonSize = '36px';
          this.gaugeValSettings1.seriesMap['占比'].axisLine.lineStyle.width = 30;
          this.gaugeValSettings1.seriesMap['占比'].axisLabel.show = false;
          this.gaugeValSettings1.seriesMap['占比'].splitLine.length = 30;
          this.boardList.forEach(element => {
            if (element.dashBoardType === '1') {
              element.xAxis.show = true;
              element.xAxis.axisLabel.show = true;
            }
          });
        } else if (this.heightStyle.span === 24) {
          this.showtLegend = true;
          this.valFonSize = '60px';
          this.gaugeValSettings1.seriesMap['占比'].axisLine.lineStyle.width = 40;
          this.gaugeValSettings1.seriesMap['占比'].axisLabel.show = true;
          this.gaugeValSettings1.seriesMap['占比'].splitLine.length = 40;
          this.boardList.forEach(element => {
            if (element.dashBoardType === '1') {
              element.xAxis.show = true;
              element.xAxis.axisLabel.show = true;
            }
          });
        }
      },
      deep: true // 对象内部的属性监听，也叫深度监听
    }
  },
  data () {
    return {
      CHART_LINE_TYPE,
      CHART_BAR_TYPE,
      CHART_PIE_TYPE,
      CHART_GAUGE_TYPE,
      CHART_SINGLE_VALUE_TYPE,
      CHART_VEBAR_TYPE,
      getDataTimeout: null,
      userInfo: Vue.ss.get(USER_INFO),
      isModalShow: false,
      showtLegend: false,
      autoCompValue: '',
      dataSource: [],
      boardMapList: [],
      boardList: [], // 仪表列表
      veLineyAxis: {
        axisLabel: {
          show: true,
          textStyle: {
            color: '#fff'
          }
        }
      },
      veLinexAxis: {
        name: '时间',
        axisLabel: {
          show: true,
          textStyle: {
            color: '#fff'
          }
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '20%',
        containLabel: true
      },
      valFonSize: '16px',
      chartExtend: {
        color: ['#3883f8']
      },
      chartExtendPie: {
        color: ['#3883f8', '#00b436', '#fdcc74', '#4f01f1', '#4ad2ff', '#00CCCC', '#0099CC', '#66CCCC', '#009999', '#33FF99']
      },
      // 自定义图表的高度
      heightStyle: this.$ls.get(INSTRUMENTPANEL_STYLE) || {
        span: 8,
        height: '300px',
        chartHeight: '255px'
      },
      pickerStyle: { display: 'none' },
      title: '', // 仪表盘弹窗标题
      isShow: false, // 时间面板默认隐藏
      isBigChart: false, // 大图表
      isTimeShow: false, // 日期默认隐藏
      isFixed: false, // 头部是否固定
      inputValue: '最近1天',
      tag: 3,
      timeList,
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
                ],
                width: 50
              }
            },
            detail: {
              offsetCenter: [0, '30%'], // 设置仪表盘下方显示内容位置
              textStyle: { color: '#6ac5fe', fontSize: 30 }
            },
            splitLine: {
              length: 50,
              lineStyle: {
                width: 2
              }
            },
            axisLabel: {
              textStyle: {
                fontWeight: 'bolder',
                color: '#fff',
                fontSize: 14,
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            title: {
              textStyle: {
                fontSize: 14,
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            }
          }
        }
      },
      gaugeValSettings1: {
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
                ],
                width: 15
              }
            },
            itemStyle: {
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
            },
            pointer: {
              width: 3,
              length: '65%'

            },
            detail: {
              offsetCenter: [0, '30%'], // 设置仪表盘下方显示内容位置
              textStyle: { color: '#6ac5fe', fontSize: 10 }
            },
            splitLine: {
              length: 10,
              lineStyle: {
                width: 2
              }
            },
            axisLabel: {
              show: false,
              textStyle: {
                fontWeight: 'bolder',
                color: '#6ac5fe',
                shadowColor: '#6ac5fe',
                fontSize: 12
              }
            },
            title: {
              textStyle: {
                fontSize: 12,
                color: '#6ac5fe',
                shadowColor: '#6ac5fe'
              }
            }
          }
        }
      },
      addOrEdit: true, // true新增 false编辑
      visible: false, // 创建仪表盘弹窗默认隐藏
      confirmLoading: false, // 创建仪表盘点击确定的loading
      formLayout: 'horizontal',
      curBIgChart: {},
      form: this.$form.createForm(this),
      queryParams: {
        startTime: Math.round(new Date().setDate((new Date().getDate() - 1)) / 1000).toString(),
        boardMapId: '',
        userName: Vue.ss.get(USER_INFO).name,
        endTime: Math.round(new Date().getTime() / 1000).toString()
      },
      placeholder: '',
      veBarChartTooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}'
      },
      box: null
    };
  },
  mounted () {
    this.findallboardmap();
    window.onscroll = () => {
      if ((document.documentElement.scrollTop || document.body.scrollTop) > 0) {
        this.$refs.topFixed.style.background = 'rgba(0,0,0,.5)';
      } else {
        this.$refs.topFixed.style.background = 'initial';
      }
    };
  },
  destroyed () {
    window.onscroll = null;
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.openGetDataTimeout();
      vm.addEventListenerPageShowOrHide();
    });
  },
  beforeRouteLeave (to, from, next) {
    this.clearGetDataTimeout();
    document.removeEventListener('visibilitychange', this.pageShowOrHideCallback);
    next();
  },
  methods: {
    ...mapActions({
      changeCurBoardMap: 'instrumentpanel/changeCurBoardMap', // 当前仪表盘
      changeSearchBoardMapParams: 'instrumentpanel/changeSearchBoardMapParams', // 当前仪表盘参数
      findboardbyboardmap: 'instrumentpanel/findboardbyboardmap', // 当前仪表盘参数
      addTimeseriesItem: 'instrumentpanel/addTimeseriesItem',
      addTalineItem: 'instrumentpanel/addTalineItem',
      changeEditOrAddVal: 'instrumentpanel/changeEditOrAddVal'
    }),
    // 监听页面在前台还是后台
    addEventListenerPageShowOrHide () {
      document.addEventListener('visibilitychange', this.pageShowOrHideCallback);
    },
    pageShowOrHideCallback () {
      if (document.visibilityState === 'hidden') {
        this.clearGetDataTimeout();
      } else if (document.visibilityState === 'visible') {
        this.openGetDataTimeout();
      }
    },
    openGetDataTimeout () {
      this.getDataTimeout = setTimeout(() => {
        this.$store.dispatch('instrumentpanel/findboardbyboardmap', this.searchBoardMapParams);
        this.openGetDataTimeout();
      }, 1000 * 60 * 2);
    },
    clearGetDataTimeout () {
      window.clearTimeout(this.getDataTimeout);
      this.getDataTimeout = null;
    },
    handleData (time) {
      if (!time) {
        return false;
      } else {
        // 大于当前日期不能选
        return time > moment();
      }
    },
    // 点击修改仪表盘的图标
    async changeDashChart (board) {
      this.changeEditOrAddVal(false);
      const res = await findBoardById({
        dashBoardId: board.dashBoardId,
        dashBoardType: board.dashBoardType
      });
      if (res.code === 0) {
        let title = '';
        this.$store.commit('instrumentpanel/toggleState', {
          dashBoardTypes: [board.dashBoardType],
          dashBoardType: board.dashBoardType
        });
        this.$store.commit('instrumentpanel/clearTimeseries');
        switch (board.dashBoardType) {
          case '1':
            if (res.data && Array.isArray(res.data.timeSeriesIndicatorList)) {
              res.data.timeSeriesIndicatorList.forEach(item => {
                this.addTimeseriesItem(item);
              });
            }
            if (res.data && Array.isArray(res.data.timeSeriesMarkLineList)) {
              res.data.timeSeriesMarkLineList.forEach(item => {
                this.addTalineItem(item);
              });
            }
            title = res.data.boardName;
            this.$store.commit('instrumentpanel/toggleState', {
              addOrUpdateModalTitle: '修改仪表',
              title,
              showAddOrUpdateModalVisible: true,
              boardDetailObj: res.data
            });
            this.$store.dispatch('instrumentpanel/boardPreTime');
            break;
          case '2':
            this.$store.commit('instrumentpanel/toggleState', { addOrUpdateModalTitle: '修改仪表', showAddOrUpdateModalVisible: true });
            this.$refs.modalDialog.$emit('childMethod', res.data);
            break;
          case '3':
            this.$store.commit('instrumentpanel/toggleState', {
              addOrUpdateModalTitle: '修改仪表',
              showAddOrUpdateModalVisible: true,
              dashBoardType: board.dashBoardType,
              boardDetailObj: res.data
            });
            this.$refs.modalDialog.$emit('childMethodVal', res.data);
            break;
        }
      }
    },
    // 点击添加仪表弹出新增的表单
    handleAddDash () {
      this.$refs.modalDialog.$emit('childMethod2');
      this.changeEditOrAddVal(true);
      this.$store.commit('instrumentpanel/toggleState', { addOrUpdateModalTitle: '新增仪表', showAddOrUpdateModalVisible: true, dashBoardType: '1', dashBoardTypes: ['1', '2', '3'] });
      this.$store.commit('instrumentpanel/clearTimeseries');
      this.$store.dispatch('instrumentpanel/addTimeseriesItem');
    },
    // 默认仪表盘
    hadleSelectItem (item) {
      const self = this;
      this.boardMapList.forEach((el) => {
        if (el.id === self.autoCompValue) {
          this.changeCurBoardMap(el);
        }
      });
      this.queryParams.boardMapId = item;
      this.changeSearchBoardMapParams(this.queryParams);
      this.findboardbyboardmap(this.queryParams);
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
      );
    },
    // 选择时间高亮显示
    handleChangeTime (index, item) {
      this.tag = index;
      this.queryParams.startTime = item.time;
      this.queryParams.endTime = Math.round(new Date().getTime() / 1000).toString();
      this.inputValue = '最近' + item.name;
      this.isShow = false;
      this.pickerStyle.display = 'none';
      this.changeSearchBoardMapParams(this.queryParams);
      this.findboardbyboardmap(this.queryParams);
    },
    moment,
    // 日期的选择事件
    onSelectTime (value) {
      const st = moment(value[0]._d).format('YYYY/MM/DD HH:mm:ss');
      const et = moment(value[1]._d).format('YYYY/MM/DD HH:mm:ss');
      this.queryParams.startTime = Math.round(new Date(value[0]._d).getTime() / 1000).toString();
      this.queryParams.endTime = Math.round(new Date(value[1]._d).getTime() / 1000).toString();
      this.changeSearchBoardMapParams(this.queryParams);
      this.inputValue = st + ' 至 ' + et;
      this.isShow = false;
      this.findboardbyboardmap(this.queryParams);
    },
    // 点击自定义显示时间日期框
    handleTimeShow () {
      this.tag = -1;
      this.isTimeShow = true;
      this.pickerStyle.display = 'block';
      document.querySelectorAll('.dash_panel_picker .ant-input')[0].click();
    },
    // 选择仪表盘尺寸
    handleSizeClick (e) {
      const heightStyle = {};
      if (e.key === 'S') {
        heightStyle.span = 4;
        heightStyle.height = '200px';
        heightStyle.chartHeight = '155px';
        this.valFonSize = '16px';
        this.showtLegend = false;
        this.gaugeValSettings1.seriesMap['占比'].axisLine.lineStyle.width = 15;
        this.gaugeValSettings1.seriesMap['占比'].axisLabel.show = false;
        this.gaugeValSettings1.seriesMap['占比'].splitLine.length = 10;
        this.boardList.forEach(element => {
          if (element.dashBoardType === '1') {
            element.xAxis.show = false;
            element.xAxis.axisLabel.show = false;
          }
        });
      } else if (e.key === 'M') {
        heightStyle.span = 6;
        heightStyle.height = '230px';
        heightStyle.chartHeight = '185px';
        this.valFonSize = '26px';
        this.showtLegend = true;
        this.gaugeValSettings1.seriesMap['占比'].axisLine.lineStyle.width = 20;
        this.gaugeValSettings1.seriesMap['占比'].axisLabel.show = false;
        this.gaugeValSettings1.seriesMap['占比'].splitLine.length = 10;
        this.boardList.forEach(element => {
          if (element.dashBoardType === '1') {
            element.xAxis.show = true;
            element.xAxis.axisLabel.show = true;
          }
        });
      } else if (e.key === 'L') {
        heightStyle.span = 8;
        heightStyle.height = '300px';
        heightStyle.chartHeight = '255px';
        this.valFonSize = '36px';
        this.showtLegend = true;
        this.gaugeValSettings1.seriesMap['占比'].axisLine.lineStyle.width = 30;
        this.gaugeValSettings1.seriesMap['占比'].axisLabel.show = false;
        this.gaugeValSettings1.seriesMap['占比'].splitLine.length = 30;
        this.boardList.forEach(element => {
          if (element.dashBoardType === '1') {
            element.xAxis.show = true;
            element.xAxis.axisLabel.show = true;
          }
        });
      } else if (e.key === 'XL') {
        heightStyle.span = 24;
        heightStyle.height = '490px';
        heightStyle.chartHeight = '435px';
        this.valFonSize = '60px';
        this.showtLegend = true;
        this.gaugeValSettings1.seriesMap['占比'].axisLine.lineStyle.width = 40;
        this.gaugeValSettings1.seriesMap['占比'].axisLabel.show = true;
        this.gaugeValSettings1.seriesMap['占比'].splitLine.length = 40;
        this.boardList.forEach(element => {
          if (element.dashBoardType === '1') {
            element.xAxis.show = true;
            element.xAxis.axisLabel.show = true;
          }
        });
      }
      this.heightStyle = heightStyle;
      this.$ls.set(INSTRUMENTPANEL_STYLE, heightStyle);
    },
    getConText (item) {
      return <span style='font-size:12px'>确定要删除<span style='color:#6ac5fe'>{item.boardName}</span>这个仪表吗？</span>;
    },
    // 点击每一个仪表盘的图标X的删除事件
    closeDashChart (item) {
      const self = this;
      this.$confirm({
        title: '删除仪表',
        content: self.getConText(item),
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          self.deleteboard(item);
        }
      });
    },
    async deleteboard (item) {
      // 仪表删除
      const obj = {};
      obj.id = item.dashBoardId.toString();
      obj.boardMapId = this.curBoardMap.id;
      const { code } = await deleteboard(obj);
      if (code === 0) {
        this.$message.success('删除成功');
        // this.findallboardmap()
        this.$store.dispatch('instrumentpanel/findboardbyboardmap', this.searchBoardMapParams);
      }
    },
    // 点击创建仪表盘弹窗
    handleCreate () {
      this.visible = true;
      this.addOrEdit = true;
      this.title = '创建仪表盘名称';
    },
    // 点击图标编辑仪表盘
    async handleEditor () {
      this.visible = true;
      await this.$nextTick();
      this.form.setFieldsValue({ name: this.curBoardMap.boardMapName });
      this.addOrEdit = false;
      this.title = '修改仪表盘';
    },
    // 点击图标删除仪表盘
    handleDelete () {
      const self = this;
      this.$confirm({
        title: '删除仪表盘?',
        content: '确定要删除' + self.curBoardMap.boardMapName + '这个仪表盘吗?删除后,该仪表盘里所有的仪表都将删除。',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          self.deleteboardmap();
        }
      });
    },
    // 确定新增
    handleOk (e) {
      const self = this;
      const params = {
        boardMapName: '',
        userName: self.userInfo.name
      };
      e.preventDefault();
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return false;
        } else {
          this.confirmLoading = true;
          params.boardMapName = fieldsValue.name;
          if (self.addOrEdit) {
            addboardmap(params).then((res) => {
              if (res.code === 0) {
                this.$message.success('新增成功');
                this.findallboardmap();
                this.visible = false;
                this.confirmLoading = false;
                this.form.resetFields();
              } else {
                this.$message.warning('新增失败，请联系管理员!');
                this.visible = false;
                this.confirmLoading = false;
                this.form.resetFields();
              }
            });
          } else {
            params.id = self.curBoardMap.id;
            updateboardmap(params).then((res) => {
              if (res.code === 0) {
                this.$message.success('编辑成功');
                this.findallboardmap();
                this.visible = false;
                this.confirmLoading = false;
                this.form.resetFields();
              } else {
                this.$message.warning('编辑失败，请联系管理员!');
                this.visible = false;
                this.confirmLoading = false;
                this.form.resetFields();
              }
            });
          }
        }
      });
    },
    // 取消
    handleCancel (e) {
      e.preventDefault();
      this.form.resetFields();
      this.visible = false;
    },
    chartFullscreen (val) {
      this.isBigChart = true;
      this.curBIgChart = val;
    },
    async deleteboardmap () {
    // 仪表盘删除
      const self = this;
      const dara = await deleteboardmap({ id: self.curBoardMap.id });
      if (dara.code === 0) {
        this.$message.success('删除成功');
        this.findallboardmap();
      }
    },
    async findallboardmap () {
      // 仪表盘列表查询
      const self = this;
      this.dataSource = [];
      const params = {
        userName: ''
      };
      params.userName = this.userInfo.name;
      const data = await findallboardmap(params);
      if (data.code === 0) {
        if (Array.isArray(data.data)) {
          this.boardMapList = data.data;
          data.data.forEach((element) => {
            self.dataSource.push({
              text: element.boardMapName,
              value: element.id
            });
          });
          if (self.dataSource.length > 0) {
            this.placeholder = self.dataSource[0].text;
            this.changeCurBoardMap(data.data[0]);
            this.autoCompValue = '';
            this.queryParams.boardMapId = self.dataSource[0].value;
            this.changeSearchBoardMapParams(this.queryParams);
            this.findboardbyboardmap(this.queryParams);
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.item-ag{
  display:inline-block;
  font-size:60px;
  color:#17A1E6
  ;margin:0 auto;
  text-align: center;
  width: 100%;
  position: relative;
}
.legend-box{
  position: absolute;
  left: -30px;
  top: -8px;
  overflow-y: auto;
  li{
    color: #6ac5fe;
    list-style: none;
    cursor: text;
    width: 110px;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.wushuju{
  position: absolute;
  top: calc(50% - 65px);
  font-size: 42px;
  cursor: text;
  }
  .data-empty {
        cursor: text;
  }
 .legend-big-box{
   top: 10px;
   li{
     width: 150px;
   }
 }
.item-big-chart{
  font-size:100px;
   .dash-charttext{
    font-size: 16px;
     top: 10px;
  }
}

.dash-charttext{
    position: absolute;
    left: 15px;
    top: -5px;
    color: #6ac5fe;
    display: inline-block;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    cursor: text;
  }
.dash_top{
  width: 89.5%;
  height: 32px;
  margin-bottom: 20px;
  transition: box-shadow .5s;
  z-index: 9999;
  margin: 0 0 6px 10px;
  &.fixed{
    border-bottom: 1px solid transparent;
    position: fixed;
    right: 0;
    top: 56px;
    padding: 15px 20px;
    z-index: 100;
    margin: 0;
    height: 63px;
  }
  .dash_input{
    width:65%;
    height: 32px;
    float: left;
    display: flex;
  }
  .dash_icon{
    width:35%;
    height: 32px;
    float: right;
    .iconfonts{
      float: right;
      span{
        display: inline-block;
        width: 32px;
        height: 32px;
        background: #0A3D76;
        margin-left: 20px;
        cursor: pointer;
        i{
          font-size: 20px;
          color: #17A1E6;
          margin-left: 6px;
          margin-top: 6px;
        }
      }
    }
  }
}
@media screen and (max-width: 1700px) {
  .dash_top {
    width: 88%;
  }
}
  @media screen and (max-width: 1600px) {
  .dash_top {
    width: 87%;
  }
}
@media screen and (max-width: 1500px) {
  .dash_top {
    width: 86%;
  }
}
@media screen and (max-width: 1400px) {
  .dash_top {
    width: 85%;
  }
}
@media screen and (max-width: 1300px) {
  .dash_top {
    width: 84%;
  }
}
.dsah_board{
  width: 100%;
  height: 100%;
  .add_dash{
    width: 100%;
    border: 1px dashed rgba(0,0,0,.15);
    cursor: pointer;
    height: 100%;
    text-align: center;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    .center_dash{
      p{
        margin-bottom: 0;
      }
      i{
        font-size: 44px;
        opacity: .7;
        color: #2db7f5;
      }
      P{
        color: #2db7f5;
      }
      /deep/.anticon {
        color: #17A1E6 !important;
      }
    }
  }
  .dsah_chart{
    width: 100%;
    background: rgba(0,0,0,.2);
    cursor: pointer;
    header{
      padding: 10px 15px;
      transition: all .3s;
      font-size: 16px;
      line-height: 25px;
      cursor: text;
      position: relative;
      z-index: 99;
      .dashwidget-title{
        display: flex;
        justify-content: space-between;
      }
      .dashwidget-name {
        color: #6ac5fe;
        float: left;
        width: 65%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
        font-weight: 700;
        font-size: 14px;
      }
      .dashwidget-tip {
        background-color: #000;
        color: #fff;
        box-shadow: none;
        position: absolute;
        top: -15px;
        left: 10px;
        padding: 7px 10px;
        opacity: .7;
        border-radius: 2px;
        text-align: left;
        display: none;
        z-index: 9999;
        line-height: 12px;
        font-size: 12px;
      }
      .dashwidget-ctrls {
        width: 35%;
        white-space: nowrap;
        color: #2db7f5;
        font-size: 17px;
        display: none;
        cursor: pointer;
        div{
          float: right;
          /deep/.anticon{
            margin-left: 5px;
            color: #6ac5fe !important;
          }
          /deep/.anticon:hover{
            color:#fff !important;
          }
        }
      }
    }
    header:hover .dashwidget-tip{
      display: block;
    }
  }

  .add_dash:hover{
    background-color: rgba(0, 0, 0, 0.2);
  }
  .dsah_chart:hover .dashwidget-ctrls{
    display: block;
  }
}
.chart-panel{
  padding: 0;
  .item-max{
    width: 100%;
    height: 350px;
    margin-bottom: 16px;
  }
}
.chart-panel>p {
  font-size: 14px;
}
/deep/ .choose_panel{
  width: 600px !important;
  position: absolute;
  top: 120px;
  left: 522px;
  z-index: 1000;
}
.choose_date{
  width: 100%;
  height: 50px;
  a{
    width: 44px;
    float: left;
    background-color: #0d3256;
    color: #fff;
    border: 1px solid transparent;
    line-height: 44px;
    border-radius: 6px;
    text-align: center;
    cursor: pointer;
    font-size: 12px;
  }
  a:hover{
    background-color: #0e6898;
  }
  ul{
    float: right;
    margin-bottom: 0;
    li{
      margin-left: 6px;
      list-style: none;
      float: left;
      background-color: #0d3256;
      color: #fff;
      border: 1px solid transparent;
      width: 48px;
      line-height: 44px;
      border-radius: 6px;
      text-align: center;
      cursor: pointer;
    }
    .bgcolor{
      background-color: #0e6898;
    }
    li:hover{
      background-color: #0e6898;
    }
  }
}
.dash_panel_picker{
  width: 100%;
  height: 350px;
}
.data-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
}
/deep/.dash_top .dash_icon .iconfonts span {
  background: #1d3e60;
}
/deep/.ant-select-auto-complete.ant-select .ant-input {
  background-color: #1d3e60 !important;
}
/deep/.ant-input {
  background-color: #1d3e60 !important;
  font-size: 12px;
}
.ant-input-affix-wrapper {
  font-size: 12px;
}
.ant-dropdown-menu {
  background-color: #25588a;
}
</style>
