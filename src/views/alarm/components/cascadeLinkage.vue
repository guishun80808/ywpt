<template>
   <a-form-item label="告警信息" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
      <a-cascader
      ref='child'
      :options="optionData"
      :fieldNames='fieldNames'
      @change="handleEvent"
      v-model="optionValue"
      :change-on-select="true"
      placeholder="请选择告警内容"/>
    </a-form-item>
</template>
<script>
import { findAllRule } from '@/api/alarm';
import { removeDuplicates } from '../components/pageConstant';
export default {
  name: 'cascadeLinkage',
  data () {
    return {
      optionData: [], // 级联的数据
      optionValue: [], // 级联选中的值
      type: '',
      fieldNames: {
        label: 'content',
        value: 'content',
        children: 'children'
      }
    };
  },
  mounted () {
    this.getAllRules();
  },
  methods: {
    callMethod () {
      this.type = '';
      this.optionValue = [];
    },
    // 先加载所有规则指标项
    async getAllRules () {
      const res = await findAllRule();
      if (res.code === 0) {
        const arr = [];
        res.data.forEach((item) => {
          const obj = {};
          obj.type = item.type;
          obj.content = item.typeName;
          arr.push(obj);
        });
        this.optionData = removeDuplicates(arr);
        this.optionData.forEach((item) => {
          const childList = res.data.filter((obj) => obj.type === item.type);
          item.children = childList;
        });
      }
    },
    handleEvent (value, options) {
      if (options) {
        this.type = options[0].type;
      } else {
        this.type = '';
      }
      this.$emit('handleChange', this.optionValue, this.type);
    }
  }
};
</script>
