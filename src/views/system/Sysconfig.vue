<template>
  <div :bordered="false" class="table-content" id="Sysconfig" style="height:100%">
     <header class="contentHeader">{{$route.meta.title}}</header>
    <div style="width:90%;margin:0 auto;margin-top:20px;">
        <a-form
          :label-col="{ span: 10}"
          :wrapper-col="{ span: 10 }"
          :form="form"
          @submit="handleSubmit"
        >
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="登录超时时长（分）：">
                <a-input
                  type="number"
                  @input="intValidator($event)"
                  min="0"
                  v-decorator="[
                `loginOutTime`,
                {
                  rules: [
                    {
                      required: true,
                      message: '登录超时时长不得小于180分钟',
                      trigger: 'change',
                      pattern: /^([1][8-9][0-9]|[1-9][0-9][0-9]+)$/
                    }
                  ],
                  validateTrigger: 'change'
                },
              ]"
                  placeholder="请输入登录超时时长（分）"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="最小密码长度：">
                <a-input
                  type="number"
                  min="0"
                  @input="intValidator($event)"
                  v-decorator="[
                `minPassLength`,
                {
                  rules: [
                    {
                      required: true,
                      message: '密码长度不得小于8位大于20位',
                      trigger: 'change',
                      pattern: /^([8-9]|[1][0-9]|20)$/
                    }
                  ],
                  validateTrigger: 'change'
                },
              ]"
                  placeholder="请输入最小密码长度"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="密码复杂度：">

                 <a-tooltip>
                <template slot="title">
                  {{passComplex}}
                </template>
                <span class="spantext">{{passComplex}}</span>
               </a-tooltip>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="密码修改周期（天）：">
                <a-input
                  type="number"
                  min="0"
                  @input="intValidator($event)"
                  v-decorator="[
                `passChangeTime`,
                {
                  rules: [
                    {
                      required: true,
                      message: '密码修改周期不得大于7天',
                      trigger: 'change',
                      pattern: /^([1-7])$/
                    }
                  ],
                   validateTrigger: 'change'
                },
              ]"
                  placeholder="请输入密码修改周期（天）"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="最大尝试登录次数">
                <a-input
                  type="number"
                  min="0"
                  @input="intValidator($event)"
                  v-decorator="[
                `maxLoginCount`,
                {
                  rules: [
                    {
                      required: true,
                      message: '最大尝试登录次数不得大于5次',
                      trigger:'change',
                      pattern: /^([1-5])$/
                    }
                  ],
                  validateTrigger: 'change'
                },
              ]"
                  placeholder="请输入最大尝试登录次数"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="密码锁定时长（分）：">
                <a-input
                  type="number"
                  min="0"
                  @input="intValidator($event)"
                  v-decorator="[
                `passLockTime`,
                {
                  rules: [
                    {
                      required: true,
                      message: '请填写密码锁定时长不得小于30分钟',
                      trigger: 'change',
                      pattern: /^([3-9][0-9]|[1-9][0-9][0-9]+)$/
                    },
                  ],
                  validateTrigger: 'change'
                },
              ]"
                  placeholder="请输入密码锁定时长（分）"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" :style="{ textAlign: 'center' }">
              <a-button type="primary" :style="{ width:'120px'}" html-type="submit">提交</a-button>
              <a-button :style="{ marginLeft: '28px' ,width:'120px'}" @click="handleReset">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
         </div>
  </div>
</template>
<script>
import { getConfigMsg, setConfigMsg } from '@/api/system';
export default {
  data () {
    return {
      form: this.$form.createForm(this),
      passComplex: ''
    };
  },
  mounted () {
    this.getConfigMsg();
  },

  methods: {
    async getConfigMsg () {
      const data = await getConfigMsg();
      if (data.code === 0) {
        if (data.data && Array.isArray(data.data)) {
          const obj = {};
          for (let index = 0; index < data.data.length; index++) {
            const element = data.data[index];
            if (element.cfgName === 'passComplex') {
              this.passComplex = element.cfgValue;
            } else if (element.cfgName === 'maxTryLogin') {
              obj.maxLoginCount = element.cfgValue;
            } else if (element.cfgName === 'minPassLen') {
              obj.minPassLength = element.cfgValue;
            } else if (element.cfgName === 'passLockTime') {
              obj.passLockTime = element.cfgValue;
            } else if (element.cfgName === 'passModifyPeriod') {
              obj.passChangeTime = element.cfgValue;
            } else if (element.cfgName === 'sessionTimeOut') {
              obj.loginOutTime = element.cfgValue;
            }
          }
          this.form.setFieldsValue(obj);
        }
      }
    },
    intValidator (e) {
      let value = e.target.value;
      value = value.replace(/\D+/, '');
      if (value.length) {
        if (value.length > 1 && value[0] === 0) {
          e.target.value = value.substring(1, value.length);
          return;
        }
        e.target.value = value;
      } else {
        e.target.value = 0;
      }
    },
    setConfigMsg (params) {
      setConfigMsg(params).then((res) => {
        if (res.code === 0) {
          this.$message.success('保存成功');
          this.getConfigMsg();
        }
      });
    },
    handleSubmit (e) {
      e.preventDefault();
      const { form: { validateFields } } = this;
      validateFields((err, values) => {
        if (!err) {
          const paramsObj = { ...values };
          const params = [
            {
              cfgName: 'maxTryLogin',
              cfgValue: paramsObj.maxLoginCount // 最大尝试登录次数
            },
            {
              cfgName: 'minPassLen',
              cfgValue: paramsObj.minPassLength // 密码最小长度
            },
            {
              cfgName: 'passComplex', // 密码复杂度
              cfgValue: this.passComplex
            },
            {
              cfgName: 'passLockTime', // 密码锁定时长
              cfgValue: paramsObj.passLockTime
            },
            {
              cfgName: 'passModifyPeriod', // 密码修改周期
              cfgValue: paramsObj.passChangeTime
            },
            {
              cfgName: 'sessionTimeOut', // 登录超时时长
              cfgValue: paramsObj.loginOutTime
            }
          ];
          this.setConfigMsg(params);
        }
      });
    },
    handleReset () {
      // this.getConfigMsg()
      this.form.resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
.table-content {
    min-height: 100%;
    height: 100%;
    min-height: 100%;
    background-color: #163c67;
    .contentHeader {
    height: 40px;
    line-height: 35px;
    font-size: 16px;
    padding-left: 20px;
    color: #fff;
    background: rgb(29, 70, 118)
}
}
</style>
<style>
#Sysconfig .spantext {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  background-color: #0d5990;
  border-color: #297ebb;
  cursor: not-allowed;
  color: #fff;

}
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}

#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
#components-form-demo-advanced-search .search-result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}
#Sysconfig .ant-form-item {
  color: #17a1e6;
}
</style>
