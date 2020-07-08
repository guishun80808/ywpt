<template>
  <div class="entire-custom">
    <a-popover placement="bottomRight">
      <template slot="content" class="custom">
        <a-divider orientation="left" style="width:24px;">常规</a-divider>
        <a-checkbox-group style="width:240px" v-model="value" @change="onChange">
          <a-row>
            <a-col :span="12" v-for="item in options" :key="item.value">
              <a-checkbox :disabled="item.disabled" :value="item.value">{{ item.label }}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
        <a-divider orientation="left" style="width:240px">扩展</a-divider>
        <a-checkbox-group style="width:240px" v-model="values" @change="onChanges">
          <a-row>
            <a-col :span="12" v-for="item in optionos" :key="item.value">
              <a-checkbox :disabled="item.disabled" :value="item.value">{{ item.label }}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </template>
      <a-button icon="setting" style="width:100px;">列定制</a-button >
    </a-popover>
  </div>
</template>
<script>
import { Popover } from 'ant-design-vue';
// 列定制常规
const options = [
  { label: '告警名称', value: 'name', disabled: true },
  { label: '告警来源', value: 'typeName', disabled: true },
  { label: '处理状态', value: 'status' },
  { label: 'IP', value: 'ip' },
  { label: '告警内容', value: 'content' },
  { label: '告警级别', value: 'level' },
  { label: '告警次数', value: 'alarmcount' },
  { label: '最后发生', value: 'lasttime' },
  { label: '处理人', value: 'dealuser' },
  { label: '处理时间', value: 'dealtime' },
  { label: '创建时间', value: 'createtime' },
  { label: '监控类别', value: 'indexName' }
];
// 列定制扩展
const optionos = [];
const renderLevel = (text, row, index) => {
  if (text === 1) {
    return '警告';
  } else if (text === 2) {
    return '错误';
  } else if (text === 3) {
    return '紧急';
  }
};
const renderStatus = (text, row, index) => {
  if (text === 1) {
    return '未处理';
  } else if (text === 2) {
    return '处理中';
  } else if (text === 3) {
    return '已解决';
  } else if (text === 4) {
    return '已关闭';
  }
};
export default {
  components: {
    'a-popover': Popover
  },
  name: 'customColumns',
  data () {
    return {
      value: ['name', 'typeName', 'content', 'level', 'alarmcount', 'lasttime', 'ip', 'status'], // 列常规默认选项
      values: [], // 扩展项选中项
      options, // 列定制-常规
      optionos, // 列定制-扩展
      checkedValue: [], // 用于列定制常规排序数组
      checkedVal: [], // 用于列定制扩展排序数组
      valueChecked: [], // 用于列定制所有选择后的选项排序数组
      columns: [] // 表格列数据
    };
  },
  created () {
    this.init();
  },
  watch: {
    'columns': function () {
      this.$emit('getColumns', this.columns);
    }
  },
  methods: {
    init () {
      // 获取缓存中的列定制，然后解析，回选列定制被选择的项
      if (sessionStorage.getItem('checkedValue') !== null) {
        const checkedValueStorage = sessionStorage.getItem('checkedValue');
        const checkedValueStorageArr = checkedValueStorage.split(',');
        this.value = checkedValueStorageArr;
      }
      if (sessionStorage.getItem('checkedVal') !== null) {
        const checkedValStorage = sessionStorage.getItem('checkedVal');
        let checkedValStorageArr = [];
        if (checkedValStorage.indexOf(',') < 0) {
          if (checkedValStorage !== '') {
            checkedValStorageArr.push(checkedValStorage);
          }
        } else {
          checkedValStorageArr = checkedValStorage.split(',');
        }
        this.values = checkedValStorageArr;
      }
      this.columns = [];
      this.valueChecked = [];
      for (let i = 0; i < this.value.length; i++) {
        this.valueChecked.push(this.value[i]);
      }
      for (let i = 0; i < this.values.length; i++) {
        this.valueChecked.push(this.values[i]);
      }
      for (let i = 0; i < this.valueChecked.length; i++) {
        const param = this.options.filter((item) => item.value === this.valueChecked[i]);
        const paramObj = this.optionos.filter((item) => item.value === this.valueChecked[i]);
        let item = {};
        // console.log(param[0].value)
        if (param.length !== 0) {
          item = {
            title: param[0].label,
            dataIndex: param[0].value,
            key: param[0].value,
            align: 'center',
            width: 200,
            sorter: true,
            scopedSlots: { customRender: param[0].value }
          };
        } else {
          item = {
            title: paramObj[0].label,
            dataIndex: paramObj[0].value,
            key: paramObj[0].value,
            align: 'center',
            width: 200,
            sorter: true,
            scopedSlots: { customRender: paramObj[0].value }
          };
        }
        if (this.valueChecked[i] === 'level') {
          item.customRender = renderLevel;
          item.scopedSlots = { customRender: 'level' };
        }
        if (this.valueChecked[i] === 'status') {
          item.customRender = renderStatus;
        }
        if (this.valueChecked[i] === 'name' || this.valueChecked[i] === 'typeName') {
          item.fixed = 'left';
          item.width = 150;
        }
        // console.log('item1111', item)
        this.columns.push(item);
      }
      this.columns.push({
        title: '关闭报警',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 100,
        scopedSlots: { customRender: 'operation' }
      });
      this.columns.unshift({
        title: '',
        key: 'color',
        fixed: 'left',
        align: 'center',
        width: 40,
        scopedSlots: { customRender: 'color' }
      });
    },
    // 列定制-常规
    onChange (checkedValues) {
      this.checkedValue = [];
      for (let i = 0; i < this.options.length; i++) {
        for (let j = 0; j < this.value.length; j++) {
          if (this.options[i].value === this.value[j]) {
            this.checkedValue.push(this.options[i].value);
          }
        }
      }
      sessionStorage.setItem('checkedValue', this.checkedValue);
      this.init();
    },
    // 列定制-扩展
    onChanges (checkedValues) {
      this.values = [];
      this.values = checkedValues;
      this.checkedVal = [];
      for (let i = 0; i < this.optionos.length; i++) {
        for (let j = 0; j < this.values.length; j++) {
          if (this.optionos[i].value === this.values[j]) {
            this.checkedVal.push(this.optionos[i].value);
          }
        }
      }
      sessionStorage.setItem('checkedVal', this.checkedVal);
      this.init();
    }
  }
};
</script>
<style lang="less" scope>
.entire-custom{
  float: right;
  /deep/.ant-popover-placement-bottom > .ant-popover-content > .ant-popover-arrow, .ant-popover-placement-bottomLeft > .ant-popover-content > .ant-popover-arrow, .ant-popover-placement-bottomRight > .ant-popover-content > .ant-popover-arrow {
  border-top-color: #226EAF !important;
  border-left-color: #226EAF !important;
  }
}
/deep/.ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-inner .ant-table-column-sorter-up.on, .ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-inner .ant-table-column-sorter-down.on {
  color: #17A1E6;
}
</style>
