<template>
  <div>
    <ul class="func-ul">
      <li class="home" v-show="$route.name !== 'zallHome'" @click="goHome">
        <span class="iconfont">&#xe629;</span>
      </li>
      <li class="func" @mouseenter="showFuncMenu = true" @mouseleave="showFuncMenu = false">
        <a-row slot="title" type="flex" justify="space-between" align="middle">
          <a-row type="flex" align="middle" style="padding-left: 10px;">
            <img :src="require('@/assets/icons/avatar.png')" class="avatar" />
            <span class="user-name">{{name | getName}}</span>
          </a-row>
          <a-icon type="down" style="margin-left: 10px;padding-right: 10px;" />
        </a-row>
        <div v-show="showFuncMenu" class="func-menu">
          <p @click="handleEditPaass">
            <a-icon type="lock" />
            <span>修改密码</span>
          </p>
          <p @click="handleLogout">
            <a-icon type="poweroff" />
            <span>退出登录</span>
          </p>
        </div>
      </li>
    </ul>

    <a-modal
      v-model="visible"
      @cancel="cancelSave"
      title="修改密码"
    >
      <a-form
        class="user-layout-login"
        :form="updatePassForm"
        autocomplete="off"
        @submit="handleUpdatePassSubmit"
      >
        <a-alert
          v-if="isUpdatePassError"
          type="error"
          showIcon
          style="margin-bottom: 24px;"
          message="密码不合规"
        />
        <a-form-item>
          <span style="color：#fff">原始密码：</span>
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
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <span style="color：#fff">新密码：</span>
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
          <span style="color：#fff">再次确认新密码：</span>
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

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { USER_INFO } from '@/store/mutation-types';
import { passRegExp } from '@/constant/constants';
import { userNameMapConstant } from '@/constant/constantsMap';
export default {
  name: 'UserMenu',
  data () {
    return {
      passRegExp,
      loginParams: null,
      updatePassBtn: true,
      isLoginError: false,
      updatePassForm: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        loginType: 0,
        smsSendBtn: false
      },
      isUpdatePassError: false,
      visible: false,
      showFuncMenu: false
    };
  },
  computed: {
    ...mapGetters(['nickname', 'avatar']),
    name () {
      return this.$ss.get(USER_INFO)?.name;
    }
  },
  filters: {
    getName (value) {
      return userNameMapConstant[value] || value;
    }
  },
  methods: {
    goHome () {
      this.$router.push('/');
    },
    ...mapActions(['Logout', 'UpdatePass']),
    cancelSave () {
      this.updatePassForm.resetFields();
    },
    requestFailed (err) {
      this.isLoginError = true;
      this.$message['error'](((err.response || {}).data || {}).message || '请求出现错误，请稍后再试');
    },
    handleUpdatePassSubmit (e) {
      e.preventDefault();
      const {
        updatePassForm: { validateFields },
        UpdatePass,
        name
      } = this;
      validateFields(['name', 'oldpass', 'pass1', 'pass2'], { force: true }, (err, values) => {
        if (!err) {
          values.name = name;
          const updatePassParams = { ...values };
          if (values.pass1 !== values.pass2) {
            this.$message['error']('两次密码不一致');
            return;
          }
          UpdatePass(updatePassParams)
            .then(res => {
              if (res.code === 0) {
                this.visible = false;
                this.$message.success('修改成功！');
              } else {
                this.$message['error'](res.msg);
              }
            })
            .catch(err => this.requestFailed(err))
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
    handleLogout (e) {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          this.Logout()
            .then(() => {
              this.$store.dispatch('showGlobalLoading');
              setTimeout(() => {
                this.$store.dispatch('hideGlobalLoading');
              }, 1000);
            })
            .catch(err => {
              this.$message.error({
                title: '错误',
                description: err.message
              });
            });
        },
        onCancel () {}
      });
    },
    handleEditPaass () {
      this.visible = true;
    },
    handleToSettings () {}
  }
};
</script>

<style lang="less" scoped>
  @import url(~@/assets/style/less/theme-color.less);
  ul li{
    list-style: none;
  }
  .func-ul {
    display: flex;
    position:absolute;
    right: 10px;
    top: 0px;
    .home {
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      .iconfont{
        font-size: 24px;
        color: #5dbbff;
        font-weight: 400;
      }
    }
    li{
      height: 55px;
      &:hover {
        background: @header-hover-bg;
        cursor: pointer;
        span, i{
          color: #fff !important;
        }
      }
    }
    .func {
      width: 186px;
      span {
        span{
          color: @header-font-color;
        }
      }
      .user-name {
        padding-left: 10px;
        max-width: 110px;
        display:inline-block;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        color: @header-font-color;
      }
      i {
        color: @header-font-color;
      }
      .func-menu {
        display:flex;
        flex-direction: column;
        background: @header-hover-func-menu-bg;
        line-height: 0px;
        p{
          span{
            font-size: 12px !important;
            color: @header-func-menu-color !important;
          }
          i{
            color: @header-func-menu-color !important;
            padding: 0 20px 0 10px !important;
            font-size: 24px !important;
          }
          width: inherit;
          height: 55px;
          line-height: 55px;
          display:flex;
          align-items: center;
          margin: 0;
          border-bottom: 1px solid @header-bg;
          &:hover{
            background: @header-hover-bg;
            span, i{
              color: #fff !important;
            }
          }
        }
      }
    }
  }
  .theme-color {
    color: @header-font-color
  }
  .avatar {
    width: 24px;
    height: 24px;
  }
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
.ant-form-item-children {
  span {
    color: #fff;
  }
}
</style>
