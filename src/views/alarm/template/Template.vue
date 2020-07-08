<template>
  <div class="template-box">
    <header class="contentHeader">{{$route.meta.title}}</header>
    <div class="template-content">
      <div style="margin-bottom:15px;">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <cascadeLinkage @handleChange="handleType" ref="cascadeLinkage" style="width:100%;float:left;"></cascadeLinkage>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
      :row-key="text => text.id"
      :scroll="{ x: 1400}">
        <template slot="operation" slot-scope="text, record">
          <a href="javascript:;" @click="handleModel(record)">修改</a>
        </template>
      </s-table>
      <!-- 修改表单 -->
      <div>
        <a-modal
          title="修改"
          :visible="visible"
          :confirm-loading="confirmLoading"
          @ok="handleOk"
          @cancel="handleCancel">
          <a-form-model :form="form" :model="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
            <a-form-model-item label="告警名称">
              <a-input v-model="form.name" :disabled="true"/>
            </a-form-model-item>
            <a-form-model-item label="告警来源">
              <a-input v-model="form.typeName" :disabled="true"/>
            </a-form-model-item>
            <a-form-model-item label="告警内容">
              <a-input v-model="form.content" :disabled="true"/>
            </a-form-model-item>
            <a-form-model-item label="是否报警">
              <a-select v-model="enable" placeholder="请选择是否报警">
                <a-select-option v-for="(value, key) in enableTypeConstant" :value="key" :key="key">{{ value }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="初级阈值">
              <a-input v-model="form.value1" placeholder="请输入正整数"/>
            </a-form-model-item>
            <a-form-model-item label="中级阈值">
              <a-input v-model="form.value2" placeholder="请输入正整数"/>
            </a-form-model-item>
            <a-form-model-item label="高级阈值">
              <a-input v-model="form.value3" placeholder="请输入正整数"/>
            </a-form-model-item>
            <a-form-model-item label="单位">
              <a-input v-model="form.unit" :disabled="true"/>
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </div>
    </div>
  </div>
</template>
<script>
import { FormModel } from 'ant-design-vue';
import FormItem from 'ant-design-vue/es/form-model/FormItem';
import { findRule, updateRule } from '@/api/alarm';
import { columns, enableTypeConstant } from '../components/templateColumns';
import cascadeLinkage from '../components/cascadeLinkage'; // type,content级联选择组件
export default {
  components: {
    'a-form-model': FormModel,
    'a-form-model-item': FormItem,
    cascadeLinkage
  },
  data () {
    return {
      columns, // 表格列
      form: {
        name: '',
        content: '',
        typeName: '',
        value1: '',
        value2: '',
        value3: '',
        unit: ''
      },
      enable: '', // 模态框单独处理是否告警
      enableTypeConstant, // 用于编辑是否告警选项
      data: [], // 表格数据
      visible: false, // 修改模态框隐藏
      confirmLoading: false, // 修改模态框隐藏loading
      optionData: [], // 级联的数据
      loadData: (parameter) => findRule(Object.assign(parameter, this.queryParam))
        .then((res) => {
          return res;
        }),
      queryParam: {
        type: '',
        content: ''
      }
    };
  },
  methods: {
    // 级联组件选择事件
    handleType (value, type) {
      this.queryParam.type = type;
      this.queryParam.content = '';
      if (value.length === 2) {
        this.queryParam.content = value[1];
      }
      if (value.length === 0) {
        this.queryParam.content = '';
      }
      this.$refs.table.refresh(true);
    },
    // 点击修改弹出模态框
    handleModel (record) {
      this.visible = true;
      if (record.enable === true) {
        this.enable = '是';
      } else {
        this.enable = '否';
      }
      this.form = record;
    },
    // 模态框的确定按钮发送数据到后端
    async handleOk (e) {
      if (this.enable === '1') {
        this.form.enable = true;
      } else {
        this.form.enable = false;
      }
      this.confirmLoading = true;
      setTimeout(() => {
        this.confirmLoading = false;
      }, 1000);
      const params = {
        id: this.form.id,
        enable: this.form.enable
      };
      if (this.form.value1) {
        params.value1 = Number(this.form.value1);
      }
      if (this.form.value2) {
        params.value2 = Number(this.form.value2);
      }
      if (this.form.value3) {
        params.value3 = Number(this.form.value3);
      }
      const res = await updateRule(params);
      if (res.code === 0) {
        this.$refs.table.refresh(true);
        this.$message.success('修改成功');
      } else {
        this.$refs.table.refresh(true);
        this.$message.warning('修改失败,该指标有未处理完成的告警');
      }
      this.visible = false;
    },
    // 模态框取消按钮
    handleCancel (e) {
      e.preventDefault();
      this.visible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.ant-input[disabled] {
  background-color: #0A3D76;
  background-image: none;
  border: 1px solid rgba(1,84,190,1);
  color: #1890ff;
  cursor: not-allowed;
}
/deep/.ant-form-item-label > label {
  color: #89badd;
  font-size: 13px;
}
.template-box{
  min-height: 100%;
  background-color: #163c67;
}
.template-content{
  min-height: 100%;
  height: 100%;
  padding: 20px;
}
.contentHeader {
  height: 40px;
  line-height: 35px;
  color: #89badd;
  font-size: 15px;
  background-color: #1d4676;
}
</style>
