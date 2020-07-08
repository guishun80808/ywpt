<template>
  <div id="SystemOrgan">
     <header class="contentHeader">{{$route.meta.title}}</header>
    <!-- 新增、编辑部门 -->
    <a-modal
      :title="title"
      :visible="visible"
      @cancel="handleCancel"
      @ok="handleOk">
      <a-form :form="form" :wrapper-col="{ span: 24 }">
        <a-form-item
        label="部门名称">
          <a-input placeholder="请输入部门名称" v-decorator="['name', { rules: [{ required: true, message: '请输入部门名称!' }] }]"/>
        </a-form-item>
        <a-form-item
        label="部门描述">
          <a-input placeholder="请输入部门描述"  v-decorator="['describe', { rules: [{ required: false, message: '请输入部门描述!' }] }]"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 新增用户 -->
    <a-modal
      :title="title"
      :visible="visibleUser"
      @cancel="handleCancel"
      @ok="handleOk">
      <a-form :form="formUser" :wrapper-col="{ span: 24 }">
        <a-form-item
        label="用户名称">
          <a-input placeholder="请输入用户名称" v-decorator="['name', { rules: [{ required: true, message: '请输入部门名称!' }] }]"/>
        </a-form-item>
         <a-form-item
        label="用户昵称">
          <a-input placeholder="请输入用户昵称" v-decorator="['byname', { rules: [{ required: false, message: '请输入用户昵称!' }] }]"/>
        </a-form-item>
        <a-form-item
        label="用户描述">
          <a-input placeholder="请输入用户描述"  v-decorator="['describe', { rules: [{ required: false, message: '请输入用户描述!' }] }]"/>
        </a-form-item>
        <a-form-item
        label="用户邮箱">
          <a-input
            placeholder="请输入用户邮箱"
            v-decorator="['email', { rules: [{
            required: false,
            message: '请输入正确邮箱格式!',
            pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ }] }]"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <div class="content">
      <div class="left">
        <div style="width: 170px;margin: 0 auto;margin-top:8px;">
          <a-auto-complete
            :data-source="dataSource"
            dropdownClassName="dropdownMenuStyle"
            style="width: 170px;margin: 0 auto;"
            placeholder="请输入"
            slot="default"
            @select="hadleSelectOri"
            :rowKey="record => record.value"
            v-model="oriAutoVal"
            ref="autoComplete"
            :filter-option="filterOption"/>
        </div>
        <div class="acibtns" v-if="userInfo.name === 'sysadm'" >
          <span style="margin-right:10px;" v-if="isBtns"  @click="addOrigin">
            <a-tooltip>
              <template slot="title">添加部门</template>
              <span>
                <a-icon type="plus"/>
              </span>
            </a-tooltip>
          </span>
          <span  @click="editOrigin"  v-if="isBtns">
            <a-tooltip>
              <template slot="title">编辑部门</template>
              <span>
                <a-icon type="edit"/>
              </span>
            </a-tooltip>
          </span>
          <span v-if="currentRow.parentid&&isBtns"  @click="delOrigin">
            <a-tooltip>
              <template slot="title">删除部门</template>
              <span>
                <a-icon type="delete" />
              </span>
            </a-tooltip>
          </span>
        </div>
        <div class="tree-content">
          <a-tree
            auto-expand-parent
            :tree-data="tableData"
            :expanded-keys="expandedRowKeys"
            @expand="onExpand"
            @select="girdClick" >
            <template slot-scope="text" slot="title">
               <span class="treespan" :id="text.orgid" :class="{gray:text.islocked}" :title="getTiltle(text)">
                <span class="home-qiye" v-if="!text.parentid"></span>
                <span class="home-bumen iconfont" v-if="text.parentid">&#xeaf2;</span>
                <span class="suoding a-icon-remove-outline">
                  <a-icon
                    v-show="text.islocked"
                    slot="count"
                    type="lock"
                    style="color: #f5222d!important"/>
               </span>
                <span class="name">{{text.name}}</span>
             </span>
            </template>
          </a-tree>
        </div>
      </div>
      <div class="right">
        <div class="adduser-btn">
          <a-auto-complete
            :data-source="dataSourceUser"
            dropdownClassName="dropdownMenuStyle"
            style="width: 170px;margin: 0 auto;float:left"
            placeholder="请输入"
            @select="hadleSelectUser"
            :rowKey="record => record.value"
            v-model="userAutoVal"
            :filter-option="filterOption"/>
          <a-button type="primary" @click="addUser" v-if="userInfo.name === 'sysadm'" style="float:right;height:32px;">
            <a-icon type="plus" />添加用户
          </a-button>
        </div>
        <div class="table-content">
          <s-table
            style="width:100%"
            ref="table"
            size="default"
            :columns="columnsUsers"
            :rowKey="(record,index) => index"
            :data="dataUsers"
            :scroll='{y:620}'>
            <span slot="islocked" slot-scope="islocked">{{islocked ? "已锁定" : "未锁定" }}</span>
            <div class="acibtns" slot="action" slot-scope="text,record"  v-if="!record.islocked&&userInfo.name === 'sysadm'">
                <span  @click="editUser(record)">
                <a-tooltip>
                  <template slot="title">编辑用户</template>
                  <a-icon type="edit" />
                </a-tooltip>
              </span>
              <span style="margin-left:10px;" @click="delOrigin(record)" >
                <a-tooltip>
                  <template slot="title">删除用户</template>
                  <a-icon type="delete" />
                </a-tooltip>
              </span>
              <span style="margin-left:10px" @click="updateleader(record,1)" v-show="record.leaderid !== record.orgid">
                <a-tooltip>
                  <template slot="title">升为部门负责人</template>
                  <a-icon type="vertical-align-top" />
                </a-tooltip>
              </span>
              <span style="margin-left:10px" @click="updateleader(record,0)" v-show="record.leaderid === record.orgid">
                <a-tooltip>
                  <template slot="title">取消部门负责人</template>
                  <a-icon type="vertical-align-bottom" />
                </a-tooltip>
              </span>
            </div>
            <div class="acibtns" slot="action" style="text-align:center" slot-scope="text,record" v-else-if="record.islocked&&userInfo.name === 'secadm'">
               <span  @click="resetUserPsWord(record)" style="margin-right:15px;">
                    <a-tooltip>
                      <template slot="title">重置密码</template>
                      <a-icon type="rest" />
                    </a-tooltip>
                  </span>
                  <span  @click="setLockById(record)">
                    <a-tooltip>
                      <template slot="title">解锁用户</template>
                      <a-icon type="unlock" />
                    </a-tooltip>
                  </span>
            </div>
            <div class="acibtns" slot="action" style="text-align:center" slot-scope="text,record" v-else-if="!record.islocked&&userInfo.name === 'secadm'">
               <span  @click="resetUserPsWord(record)" style="margin-right:15px;">
                    <a-tooltip>
                      <template slot="title">重置密码</template>
                      <a-icon type="rest" />
                    </a-tooltip>
                  </span>
            </div>
            <div class="acibtns" slot="action" style="text-align:center" slot-scope="text,record" v-else-if="record.islocked&&userInfo.name === 'sysadm'">
                --
            </div>
          </s-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { AutoComplete, Tree } from 'ant-design-vue';
import { getUsersBydep } from '@/api/system';
import { USER_INFO } from '@/store/mutation-types';
import { columnsUsers } from '@/constant/columnsses';
import methods from './systemOrigin';
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 }
};
export default {
  name: 'SystemOrgan',
  components: {
    'a-tree': Tree,
    'a-auto-complete': AutoComplete
  },
  data () {
    return {
      formItemLayout,
      formTailLayout,
      currentRow: {
        parentid: ''
      },
      currentUser: {
        parentid: ''
      },
      userInfo: Vue.ss.get(USER_INFO),
      dataSource: [],
      dataSourceUser: [],
      tableDataNoTree: [], // 所有部门
      tableDataNoTreeUser: [], // 所有用户
      expandedRowKeys: [],
      tableData: [],
      userParam: {
        type: 2,
        orgid: ''
      },
      dataUsers: (parameter) => getUsersBydep(Object.assign(parameter, this.userParam))
        .then((res) => {
          const result = [];
          this.dataSourceUser = [];
          this.tableDataNoTreeUser = [];
          for (let index = 0; index < res.data.length; index++) {
            const item = res.data[index];
            if (item.role !== 'auditadmin' && item.role !== 'secadmin' && item.role !== 'sysadmin' && item.type !== 1 && item.name) {
              result.push(item);
              this.tableDataNoTreeUser.push(item);
              this.dataSourceUser.push({
                text: item.name,
                value: item.orgid
              });
            }
          }
          res.data = result;
          return res;
        }),
      userAutoVal: '',
      oriAutoVal: '',
      title: '新增部门',
      visible: false,
      visibleUser: false,
      form: this.$form.createForm(this),
      formUser: this.$form.createForm(this),
      columnsUsers,
      formType: 1,
      isBtns: false
    };
  },
  methods: {
    ...methods
  },
  mounted () {
    this.getAllDepList(1); // 首次加载
  }
};
</script>
<style lang="less" scoped>
#SystemOrgan {
  width: 100%;
  position: relative;
  height: 98%;
  overflow: hidden;
  .contentHeader {
    height: 40px;
    line-height:35px;
    font-size: 16px;
    padding-left: 20px;
    color: #fff;
  }
  .content {
    width: 100%;
    position: relative;
    height: 92%;
    border: 1px solid rgb(37, 97, 148);
    .left {
      width: 180px;
      position: absolute;
      left: 0px;
      background: rgb(16, 66, 110);
      height: 100%;
      min-height: 700px;
      padding: 0 5px;
      .home-qiye{
        background: url('~@/assets/image/orgin/qiye.png') no-repeat center;
        display: inline-block;
        width: 16px;
        height: 16px;
        position: absolute;
        left: -17px;
        top: 4px;
      }
      .home-bumen{
        display: inline-block;
        width: 16px;
        height: 16px;
        position: absolute;
        left: -17px;
        top: 0px;
      }
      .acibtns {
        width: 170px;
        margin: 0 auto;
        margin-top: 2px;
        text-align: center;
        line-height: 26px;
        height: 22px;
        span {
          width: 40px;
          margin-right: 10px;
        }
      }
      .acibtnsdep {
        width: 170px;
        margin: 0 auto;
        margin-top: 8px;
        text-align: center;
        line-height: 30px;
        height: 32px;
        span {
          width: 30px;
          margin-right: 8px;
        }
      }
      .treespan {
        padding: 0 5px;
        display: inline-block;
        position: relative;
        height: 23px;
        .name{
          max-width: 100px;
          overflow: hidden;
          display: inline-block;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .gray{
        color: #ccc;
      }
      .bgname {
        color: #ccc;
      }
      .suoding {
        position: absolute;
        left: -17px;
        top: 3px;
        color: red;
        font-weight: bold;
        font-size: 10px !important;
        -webkit-transform: scale(1) !important;
      }
      .ant-tree-treenode-selected{
        .treespan{
          background: transparent!important
        }
      }
    }
    .right {
      margin-left: 180px;
      height: 100%;
      position: relative;
      padding: 8px 15px;
      .table-content {
        height: 740px;
        overflow: hidden;
      }
      .adduser-btn{
        margin-bottom:10px;
        height:30px;
      }
    }
  }
}
</style>
<style lang="less">
#SystemOrgan{
  .ant-table-scroll {
    word-break: break-all;
  }
  .ant-table-placeholder {
      border: 1px solid #1d558f;
      background: #18477a;
  }
  .left [class*=' a-icon-'],
  .left [class^='a-icon-'] {
    font-size: 14px !important;
    vertical-align: sub;
  }
  .ant-table-fixed-right .ant-table-thead > tr > th:first-child {
    text-align: center;
  }
  .ant-form-item-label > label {
    color: #fff;
  }
  .acibtns span {
    cursor: pointer;
    display: inline-block;
    width: 35px;
    line-height: 16px;
    height: 18px;
    text-align: center;
    background: rgb(6, 128, 229);
    color: #fff;
    font-size: 12px;
    border-radius: 4px;
  }
  .ant-tree li .ant-tree-node-content-wrapper {
    color: #fff;
    padding-left: 20px;
 }
 .ant-tree li .ant-tree-node-content-wrapper:hover {
    background: #0a7dbf;
 }
 .ant-table-fixed-header .ant-table-scroll .ant-table-header{
    overflow:auto!important;
    width: 100%;
 }
 .ant-table-fixed-header > .ant-table-content > .ant-table-scroll > .ant-table-body{
    margin-top: 15px;
 }
 .ant-tree li span.ant-tree-switcher,.ant-tree li span.ant-tree-iconEle{
   color: #fff;
 }
}
.downtemp .ant-modal-footer .ant-btn-primary {
  display: none;
}
</style>
