<template>
  <div class="collection-bgbox">
    <header class="contentHeader">{{$route.meta.title}}</header>
    <div class="collection-box">
      <div style="width:100%;">
        <a-form :form="form">
          <a-select default-value="7d" style="width: 180px;margin-right: 20px;" @change="handleChooseTime">
            <a-select-option v-for='item in timestrData' :key="item.value">{{ item.name }}</a-select-option>
          </a-select>
          <a-radio-group :default-value="1" v-model="value" @change="onChange">
            <a-radio v-for='item in statusPageData' :key="item.value" :value="item.value">{{ item.name }}</a-radio>
          </a-radio-group>
          <div class="collection-icon">
            <a-button type="primary" @click="handleAdd">新增告警集合</a-button>
            <!-- 新增集合和修改集合的模态框 -->
            <a-modal
              :title="title"
              :visible="visible"
              :confirm-loading="confirmLoading"
              @ok="handleOk"
              @cancel="handleCancel"
              :bodyStyle="bodyStyle"
              width="40%">
              <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 17 }">
                <a-form-item label="告警名称">
                  <a-input v-decorator="['collname', { rules: [{ required: true, message: '请输入告警名称!' }] }]"/>
                </a-form-item>
                <a-form-item label="定义标签">
                  <a-input v-decorator="['desc', { rules: [{ required: true, message: '请输入标签!' }] }]"/>
                </a-form-item>
              </a-form>
              <a-collapse :bordered="false" expand-icon-position="right" :defaultActiveKey="defaultActiveKey" :activeKey="activeKey">
                <a-collapse-panel v-for="(data, index) in serverList" :key="index" :style="customStyle">
                  <div slot="header" style="color: #17A1E6;">
                    {{data.type}}
                  </div>
                  <a-checkbox :indeterminate="indeterminate" :checked="checkedMore.includes(index)"  @change="e => oncheckAllMiddleChange(e,data,index)">
                    全选
                  </a-checkbox>
                  <a-checkbox-group style="width:100%;" @change="checkedValues => handleMiddle(checkedValues, data, index)" v-model="data.middleId">
                    <a-row>
                      <a-col :span="12" v-for="item in data.list" :key="item.id">
                        <a-checkbox :value="item.id">
                          {{ item.content }}
                        </a-checkbox>
                      </a-col>
                    </a-row>
                  </a-checkbox-group>
                </a-collapse-panel>
              </a-collapse>
            </a-modal>
          </div>
        </a-form>
      </div>
      <div class="collection-circle" ref="collectionCircle">
        <ul>
          <li><span style="background-color: #ff522a;box-shadow: 0 0 5px #ff522a;"></span><p>紧急</p></li>
          <li><span style="background-color: #ffae2f;box-shadow: 0 0 5px #ffae2f;"></span><p>错误</p></li>
          <li><span style="background-color: #fadc23;box-shadow: 0 0 5px #fadc23;"></span><p>警告</p></li>
          <li><span style="background-color: #5be570;border-radius: 0;box-shadow: 0 0 5px #5be570;"></span><p>无警告</p></li>
        </ul>
      </div>
      <div
      class="collection-card"
      :style="{height: collectionCardHeight + 'px'}">
        <!-- 循环集合 -->
        <transition-group
          name="fade"
          enter-active-class="active"
          leave-active-class="leave"
          tag="div">
          <div
            class="card-one animated fadeInRightBig"
            id="card"
            @click="handleToPage(data.id, data.collname)"
            v-for="data in dataSource"
            :key="data.id"
            :style="{left: data.left + 'px', top: data.top + 'px'}"
            :class="data.level==3?'emergency':(data.level===2?'error':(data.level===1?'warning':'without'))">
            <div class="card-info">
              <div class="card-name">{{ data.collname }}</div>
              <div class="card-icon">
                <a-icon type="form" @click.stop="handleChangeOne(data.id)"/>
                <a-icon type="delete" @click.stop="showDeleteConfirm(data.id)"/>
              </div>
            </div>
            <div class="card-count">{{ data.count }}</div>
            <div class="card-tag">{{ data.createtime }}</div>
            <span :class="data.changeCount>0?'upCount':(data.changeCount<0?'downCount':'zero')">{{ data.changeCount > 0?'+':'' }}{{ data.changeCount }}</span>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<script>
import { Radio, Collapse } from 'ant-design-vue';
import ACollapsePanel from 'ant-design-vue/es/vc-collapse/src/Panel';
import { deleteAlarmMap, findAllRule, findMapByUserId, addAlarmMap, findMapByMapId } from '@/api/alarm';
import { timestrData, statusPageData } from '../components/pageConstant';
import { USER_INFO } from '@/store/mutation-types';
export default {
  components: {
    'a-radio': Radio,
    'a-radio-group': Radio.Group,
    'a-collapse': Collapse,
    ACollapsePanel
  },
  data () {
    return {
      activeKey: [],
      defaultActiveKey: '',
      changeCount: 0, // 变化的报警数
      collectData: [],
      customStyle: 'border: 0;overflow: hidden',
      bodyStyle: { height: '440px', overflow: 'auto' },
      username: '', // 当前登录用户名
      timestrData, // 时间选择数据
      statusPageData, // 选择状态数据
      title: '', // 标题
      value: 1, // 默认状态
      time: '7d', // 默认时间段
      visible: false, // 表单默认隐藏
      confirmLoading: false, // 表单确认按钮loading默认隐藏
      dataSource: [], // 集合页面展示数据
      indeterminate: false,
      checkAllMiddle: false,
      dataId: '', // 用于修改集合时获取当前记录ID
      form: this.$form.createForm(this),
      collectionCardHeight: 0, // 集合容器高度
      // 初始获取所有类型
      rullForms: [],
      serverList: [], // 用于存放修改数据结构后的集合，checkbox循环的数据
      rullAllForm: [], // 用于初始化所有规则，方便后续单独使用
      checkedMore: [] // 用于存放选择的类型
    };
  },
  mounted () {
    this.username = this.$ss.get(USER_INFO).name;
    this.getCollectionData();
    this.getAllRules();
    window.addEventListener('resize', this.handleResize, true);
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize, true);
  },
  watch: {
    collectData (newval, oldval) {
      if (oldval.length !== 0) {
        for (let i = 0; i < newval.length; i++) {
          for (let j = 0; j < oldval.length; j++) {
            if (newval[i].id === oldval[j].id) {
              this.dataSource[i].changeCount = newval[i].count - oldval[j].count;
            }
          }
        }
      }
    }
  },
  methods: {
    handleResize () {
      this.dataSource = this.computedPosition(this.dataSource);
    },
    // 默认字段查询所有
    async getCollectionData () {
      const params = {
        userid: this.username,
        timestr: this.time,
        status: this.value
      };
      const res = await findMapByUserId(params);
      if (res.code === 0) {
        await this.$nextTick();
        this.dataSource = this.computedPosition(res.data);
        this.collectData = res.data;
      }
    },
    computedPosition (arr) {
      if (!arr.length) {
        return;
      }
      const collectionCircle = this.$refs.collectionCircle;
      let { width } = collectionCircle.getBoundingClientRect();
      width -= 2;
      const arrLen = arr.length;
      const cardWidth = 130;
      const cardHeight = 130;
      let minMargin = 0;
      let everyRowNum = Math.floor(width / cardWidth);
      const sxWidth = width % cardWidth;
      if (sxWidth < 100) {
        everyRowNum = Math.floor(width / cardWidth) - 1;
      }
      minMargin = (width - everyRowNum * cardWidth) / (everyRowNum - 1);
      for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
          arr[i].left = 0;
          arr[i].top = minMargin;
        } else {
          let left = arr[i - 1].left + minMargin + cardWidth;
          let top = arr[i - 1].top;
          if (i !== 1 && ((i + 1) % everyRowNum === 1)) {
            left = 0;
            top += cardWidth + minMargin;
          }
          arr[i].left = left;
          arr[i].top = top;
        }
      }
      this.collectionCardHeight = arr[arrLen - 1].top + cardHeight + minMargin;
      return arr;
    },
    // 先加载所有规则指标项
    async getAllRules () {
      const res = await findAllRule();
      if (res.code === 0) {
        this.rullAllForm = [];
        res.data.forEach(item => {
          this.rullAllForm.push(item);
          if (this.rullForms.indexOf(item.typeName) < 0) {
            this.rullForms.push(item.typeName);
          }
        });
        this.serverList = [];
        this.rullForms.forEach(itemRule => {
          const list = [];
          const obj = {};
          obj.type = itemRule;
          res.data.forEach(itemData => {
            if (itemRule === itemData.typeName) {
              list.push(itemData);
            }
          });
          obj.list = list;
          obj.middleId = [];
          this.serverList.push(obj);
        });
      }
    },
    // 选择时间
    handleChooseTime (value) {
      this.time = value;
      this.getCollectionData();
    },
    // 选择状态
    onChange (e) {
      this.value = e.target.value;
      this.getCollectionData();
    },
    // 点击新增集合按钮弹出新增的表单
    handleAdd () {
      this.defaultActiveKey = '';
      this.activeKey = [];
      this.dataId = '';
      this.title = '新增告警集合';
      this.visible = true;
      this.getAllRules();
    },
    // 选中指标项
    handleMiddle (checkedValues, data, index) {
      data.middleId = checkedValues;
      this.indeterminate = !!data.middleId.length && data.middleId.length < data.list.length;
      this.checkAllMiddle = data.middleId.length === data.list.length;
      if (checkedValues.length === data.list.length) {
        this.checkedMore.push(index);
      } else {
        const ind = this.checkedMore.indexOf(index);
        if (ind > -1) {
          this.checkedMore.splice(ind, 1);
        }
      }
    },
    oncheckAllMiddleChange (e, data, index) {
      if (e.target.checked) {
        this.checkedMore.push(index);
      } else {
        const ind = this.checkedMore.indexOf(index);
        if (ind > -1) {
          this.checkedMore.splice(ind, 1);
        }
      }
      data.middleId = e.target.checked ? data.list.map((currentValue) => currentValue.id) : [];
      this.indeterminate = false;
      this.checkAllMiddle = e.target.checked;
    },
    // 确定新增及修改
    handleOk (e) {
      e.preventDefault();
      this.form.validateFields(async (err, fieldsValue) => {
        if (err) {
          return false;
        } else {
          const objId = [];
          this.serverList.forEach(item => {
            item.middleId.forEach(itemObjId => {
              if (objId.indexOf(itemObjId) < 0) {
                objId.push(itemObjId);
              }
            });
          });
          // 新增报警集合 // 修改报警集合
          const params = {
            userid: this.username,
            rules: objId,
            collname: fieldsValue.collname,
            desc: fieldsValue.desc,
            id: this.dataId
          };
          const res = await addAlarmMap(params);
          if (res.code === 0) {
            this.$message.success(this.title + '成功');
            this.getCollectionData();
            this.checkedMore = [];
          } else {
            this.$message.error(this.title + '失败');
          }
          this.confirmLoading = true;
          setTimeout(() => {
            this.confirmLoading = false;
            this.form.resetFields();
            this.checkAllMiddle = false;
            this.defaultActiveKey = '';
            this.activeKey = [];
          }, 1000);
          this.visible = false;
        }
      });
    },
    // 取消新增或修改
    handleCancel (e) {
      e.preventDefault();
      this.visible = false;
      this.form.resetFields();
      this.checkAllMiddle = false;
      this.checkedMore = [];
      this.defaultActiveKey = '';
      this.activeKey = [];
    },
    // 点击修改告警集合查询出该集合所有已存在的指标项
    async handleChangeOne (oId) {
      this.title = '修改告警集合';
      this.getAllRules();
      this.visible = true;
      const params = {
        id: oId
      };
      const res = await findMapByMapId(params);
      if (res.code === 0) {
        this.dataId = oId;
        this.serverList = [];
        this.rullForms.forEach(itemRule => {
          const list = [];
          const ruleList = [];
          const obj = {};
          obj.type = itemRule;
          this.rullAllForm.forEach(itemData => {
            if (itemRule === itemData.typeName) {
              list.push(itemData);
              if (res.data[0].rules.indexOf(itemData.id) > -1) {
                ruleList.push(itemData.id);
              }
            }
          });
          obj.list = list;
          obj.middleId = ruleList;
          this.serverList.push(obj);
          if (list.length === ruleList.length) {
            if (this.serverList.indexOf(obj) > -1) {
              this.checkedMore.push(this.serverList.indexOf(obj));
            }
          }
        });
        this.form.setFieldsValue({ collname: res.data[0].collname, desc: res.data[0].desc });
      }
    },
    // 删除某一个报警信息
    showDeleteConfirm (oId) {
      const that = this;
      this.$confirm({
        title: '你确认删除吗?',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        async onOk () {
          const res = await deleteAlarmMap({ id: oId });
          if (res.code === 0) {
            that.$message.success('删除成功');
            that.getCollectionData();
          } else {
            that.$message.error('删除失败');
          }
        }
      });
    },
    // 跳转到告警页
    handleToPage (oId, collname) {
      this.$router.push(
        {
          path: '/alarm/collection/page',
          query:
          {
            id: oId,
            name: collname
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.emergency{
  background-color: #ff522a;
}
.error{
  background-color: #ffae2f;
}
.warning{
  background-color: #fadc23;
}
.without{
  background-color: #5be570;
}
li{
  list-style: none;
}
.collection-bgbox{
  min-height: 100%;
  background-color: #163c67;
}
.contentHeader {
  height: 40px;
  line-height: 35px;
  color: #89badd;
  font-size: 15px;
  background-color: #1d4676;
}
.collection-box{
  padding: 10px;
  min-height: 100%;
  .collection-icon{
    float: right;
    display: flex;
    span{
      display: block;
      width:32px;
      height: 32px;
      background:rgb(240,242,245);
      margin-right: 8px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
    }
  }
.collection-circle{
  width: 100%;
  height: 38px;
  padding: 10px 0px;
  color: #4990c4;
  ul{
    float: right;
    height: 18px;
    margin: 0px;
    padding: 0px;
    li{
    height: 18px;
    float: left;
    margin-left: 10px;
    display: flex;
    text-align: center;
    line-height: 18px;
    span{
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-top: 3px;
      margin-right: 10px;
    }
    p{
      font-size: 12px;
      margin: 0px;
    }
   }
  }
}
.collection-card{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .card-one{
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 4px 15px 1px rgba(0,0,0,.3);
    width: 130px;
    height: 130px;
    position: absolute;
    cursor: pointer;
    opacity: 1;
    .card-info{
      height: 35%;
      padding: 5px;
      box-sizing: border-box;
      overflow: hidden;
      .card-icon{
        max-width: 30%;
        height: auto;
        line-height: 18px;
        font-size: 14px;
        text-align: right;
        color: #fff;
        float: right;
        display: none;
        .anticon:hover{
          color: rgba(0, 0, 0, 0.65) !important;
        }
      }
      .card-name{
        max-width: 70%;
        height: auto;
        float: left;
        padding: 0 4px;
        overflow: hidden;
        font-size: 13px;
        border-radius: 4px;
        background-color: rgba(0,0,0,.12);
        color: #fff;
      }
    }
    .card-count{
      width: 100%;
      height: 45%;
      font-size: 28px;
      font-weight: 600;
      color: #fff;
      text-align: center;
      line-height: 50px;
    }
    .card-tag{
      display: none;
      height: 20%;
      width: 100%;
      box-sizing: border-box;
      color: #fff;
      text-align: center;
      font-size: 10px;
    }
    .upCount {
      position: absolute;
      left: 6%;
      top: 94%;
      font-size: 24px;
      color: #fff;
      font-weight: 600;
      animation: upmove 1S;
      opacity: 1;
    }
    .downCount{
      position: absolute;
      left: 10%;
      top: -23%;
      font-size: 24px;
      color: #fff;
      font-weight: 600;
      animation: downmove 1S;
      opacity: 1;
    }
    .zero {
      display: none;
    }
  }
}
}
@keyframes upmove{
  0%{
    top: 94%;
    opacity: 1;
  }
  50%{
    top: 40%;
    opacity: 0.5;
  }
  100%{
    top: -23%;
    opacity: 0;
  }
}
@keyframes downmove{
  0%{
    top: -23%;
    opacity: 1;
  }
  50%{
    top: 40%;
    opacity: 0.5;
  }
  100%{
    top: 94%;
    opacity: 0;
  }
}
#card:hover .card-icon{
  display: block;
}
#card:hover .card-tag{
  display: block;
}
#card:hover {
  opacity: .9;
}
/deep/.ant-collapse-content {
  color: #17A1E6 !important;
  background-color: #095a95 !important;
}
/deep/.ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow {
  color: #17A1E6 !important;
}
@keyframes bounce-in {
  0%{
    opacity: 0;
    width: 0;
    left: 0;
    top: 0;
    margin-left: 0;
  }
  // 50%{
  //   opacity: .5;
  //   width: 65px;
  // }
  100%{
    opacity: 1;
    width: 130px;
  }
}
.active{
  transform-origin: left right;
  animation: bounce-in 0.3s;
}
.leave{
  transform-origin: left right;
  animation: bounce-in 0.3s reverse;
}
</style>
