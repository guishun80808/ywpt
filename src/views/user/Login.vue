<template>
    <a-row type="flex" justify="center" align="middle" style="height: 100%;">
      <a-row type="flex" justify="center">
        <img style="width:383px;height:auto;z-index:2;" src="~@/assets/image/login/login-earth@2x.png">
      </a-row>
      <div class="login-container">
        <a-form
          class="user-layout-login"
          :form="form"
          @submit="handleSubmit"
        >
          <a-form-item style="margin-bottom: 30px; margin-top:0;">
            <a-col :span="18" :push="3">
              <h4>登录</h4>
            </a-col>
          </a-form-item>
          <a-form-item>
            <a-col :span="18" :push="3">
              <a-input
                size="large"
                type="text"
                placeholder="账户"
                @keyup.enter="handleSubmit"
                v-decorator="[
                  'name',
                  {rules: [{ required: true, message: '请输入帐户名' }], validateTrigger: 'change'}
                ]"
              >
                <a-row slot="prefix" type="flex" align="middle">
                  <a-icon type="user" />
                  <a-divider style="height: 14px;width: 2px;" type="vertical" />
                </a-row>
              </a-input>
            </a-col>
          </a-form-item>

          <a-form-item>
            <a-col :span="18" :push="3">
              <a-input
                size="large"
                type="password"
                @keyup.enter="handleSubmit"
                placeholder="密码"
                v-decorator="[
                  'pass',
                  {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'change'}
                ]"
              >
                <a-row slot="prefix" type="flex" align="middle">
                  <a-icon type="lock" />
                  <a-divider style="height: 14px;width: 2px;" type="vertical" />
                </a-row>
              </a-input>
            </a-col>
          </a-form-item>

        </a-form>
        <a-form-item>
          <a-col :span="18" :push="3">
            <a-button
              size="large"
              @click="handleSubmit"
              type="primary"
              class="login-button"
              style="width: 100%;"
              :loading="state.loginBtn"
              :disabled="state.loginBtn"
            >登录</a-button>
          </a-col>
        </a-form-item>
        <a-form-item>
          <a-col :span="18" :push="3">
            <a-alert v-if="isLoginError" type="error" showIcon :message="errorMsg" />
          </a-col>
        </a-form-item>

      </div>

    <a-modal
        v-model="visible"
        title="修改密码"
        :ok-button-props="{ props: { disabled: updatePassBtn } }"
        :cancel-button-props="{ props: { disabled: false } }"
      >
        <a-form
          class="user-layout-login"
          :form="updatePassForm"
          @submit="handleUpdatePassSubmit"
        >
          <a-alert v-if="isUpdatePassError" type="error" showIcon style="margin-bottom: 24px;" message="密码不合规" />
          <a-form-item>
            <a-input
                size="large"
                type="password"
                :auto-complete="false"
                placeholder="请输入原密码"
                v-decorator="[
                  'oldpass',
                  {rules: [{ required: true, message: '密码最小长度8位，至少包括1位大写字母，1位小写字母，1位数字',
                  trigger: 'change', min: 8, pattern: passRegExp }],
                  validateTrigger: 'change'}
                ]"
              >
                <span slot="prefix">
                  <a-icon type="lock"/>
                </span>
              </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              type="password"
              :auto-complete="false"
              placeholder="密码"
              v-decorator="[
                'pass1',
                {rules: [{ required: true, message: '密码最小长度8位，至少包括1位大写字母，1位小写字母，1位数字',
                trigger: 'change', min: 8, pattern: passRegExp }],
                validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="lock" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              type="password"
              :auto-complete="false"
              placeholder="确认密码"
              v-decorator="[
                'pass2',
                {rules: [{ required: true, message: '密码最小长度8位，至少包括1位大写字母，1位小写字母，1位数字',
                trigger: 'change', min: 8, pattern: passRegExp }],
                validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="lock" />
            </a-input>
          </a-form-item>
        </a-form>
        <template slot="footer">
          <a-button
type="primary"
            :loading="state.updatePassBtn"
            :disabled="state.updatePassBtn"
            @click="handleUpdatePassSubmit">保存
          </a-button>
        </template>
      </a-modal>
  </a-row>
</template>

<script>
// import md5 from 'md5'
import { Alert, Divider } from 'ant-design-vue';
import { mapActions } from 'vuex';
import { passRegExp } from '@/constant/constants';

export default {
  components: {
    'a-alert': Alert,
    'a-divider': Divider
  },
  data () {
    return {
      passRegExp,
      visible: false,
      updatePassBtn: true,
      loginBtn: false,
      loginParams: null,
      isLoginError: false,
      isUpdatePassError: false,
      errorMsg: null,
      form: this.$form.createForm(this),
      updatePassForm: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        loginType: 0,
        smsSendBtn: false
      }
    };
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'UpdatePass']),
    handleUpdatePassSubmit (e) {
      e.preventDefault();
      const {
        updatePassForm: { validateFields },
        UpdatePass
      } = this;
      validateFields(['oldpass', 'pass1', 'pass2'], { force: true }, (err, values) => {
        if (!err) {
          if (values.pass1 !== values.pass2) {
            this.$message['error']('两次密码不一致');
            return;
          } else if (values.pass1 === this.loginParams.pass) {
            this.$message['error']('不能使用旧密码');
            return;
          }
          const updatePassParams = { ...values };
          updatePassParams.name = this.loginParams.name;
          updatePassParams.oldpass = values.oldpass;
          updatePassParams.pass1 = values.pass1;
          updatePassParams.pass2 = values.pass2;
          const newParam = { name: this.loginParams.name, pass: updatePassParams.pass2 };
          UpdatePass(updatePassParams)
            .then((res) => {
              if (res.code === 0) {
                this.loginFuc(newParam);
              } else {
                this.$message['error'](res.msg);
              }
            })
            .catch((err) => this.requestFailed(err))
            .finally(() => {
              this.updatePassBtn = false;
            });
        } else {
          setTimeout(() => {
            this.updatePassBtn = false;
          }, 600);
        }
      });
    },
    handleSubmit (e) {
      e.preventDefault();
      const {
        form: { validateFields },
        state
      } = this;
      state.loginBtn = true;
      const validateFieldsKey = ['name', 'pass'];
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values };
          // loginParams.pass = md5(values.pass)
          this.loginParams = loginParams;
          this.loginFuc(loginParams);
        } else {
          setTimeout(() => {
            state.loginBtn = false;
          }, 600);
        }
      });
    },
    loginFuc (loginParams) {
      const {
        state,
        Login
      } = this;
      Login(loginParams).then((res) => {
        if (res.code === 0) {
          this.loginSuccess(res);
        } else {
          this.errorMsg = res.msg;
          this.requestFailed({
            response: {
              data: {
                msg: res.msg
              }
            }
          });
          if (res.code === 2) {
            this.visible = true;
          }
        }
      })
        .catch((err) => {
          this.requestFailed(err);
        })
        .finally(() => {
          state.loginBtn = false;
        });
    },
    loginSuccess (res) {
      this.$router.push('/');
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$message.success(`${res.msg}`);
      }, 1000);
      this.isLoginError = false;
    },
    requestFailed () {
      this.isLoginError = true;
      // this.$message['error'](((err.response || {}).data || {}).message || '请求出现错误，请稍后再试')
    }
  }
};
</script>

<style lang="less" scoped>
  .login-container {
    z-index:3;
    width: 415px;
    margin-left: 165px;
    background-image: url(~@/assets/image/login/login-frame@2x.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    height:415px;

    .user-layout-login {
      ::-webkit-input-placeholder{
        color: #FFF;
        padding-left: 10px;
        position: absolute;
        font-size: 14px;
      }

      /deep/ .ant-form-item:not(.has-error) {
        margin-top: 28px;
        .ant-form-explain {
          margin-left: 15%;
        }
      }
      /deep/.ant-input-affix-wrapper, .login-button {
        width: 100%;
        height: 44px;
        i {
          font-size: 24px;
        }
        .ant-input{
          padding-left: 60px;
        }
      }

      h4 {
        margin: 50px 0 0px;
        // text-align: center;
        font-size: 24px;
        color: #fff;
      }
    }
  }
</style>
