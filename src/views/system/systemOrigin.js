import { getAllDepList, addDepMsg, editDepMsg, delDepMsg, resetUserPsWord, updateleader, setLockById } from '@/api/system';
import { dataToTree, familyTree } from '@/utils/util';
export default {
  getTiltle (item) {
    if (item.islocked) {
      return item.name + '已经被锁定';
    } else {
      return item.name;
    }
  },
  searchAllUser () {
    this.userParam.orgid = '';
    this.userParam.name = '';
    this.$refs.table.refresh(true);
    this.$nextTick(() => {
      document.querySelectorAll('.treespan').forEach(dom => {
        dom.style.backgroundColor = 'transparent';
      });
    });
  },
  async addUser () {
    // 新增用户
    if (this.currentRow.islocked) {
      this.$message.success('该部门被锁定，暂不能新增用户！');
      return;
    }
    this.title = '新增用户';
    this.visibleUser = true;
    await this.$nextTick();
    this.formType = 3;
  },
  async editUser (row) {
    // 编辑用户
    this.currentUser = row;
    this.title = '编辑用户';
    this.visibleUser = true;
    this.formType = 4;
    await this.$nextTick();
    this.formUser.setFieldsValue({ name: row.name, byname: row.byname, describe: row.describe, email: row.email });
  },
  // 新增部门
  addOrigin () {
    if (this.currentRow.islocked) {
      this.$message.success('该部门被锁定，暂不能新增部门！');
      return;
    }
    this.formType = 1;
    this.visible = true;
    this.title = '新增部门';
  },
  addDepByParam (params) {
    if (!params.parentid) {
      params.parentid = this.tableData[0].orgid;
    }
    addDepMsg(params).then((res) => {
      if (res.code === 0) {
        this.$message.success('新增成功，等待审核');
        if (params.type === 1) {
          // 新增部门
          this.getAllDepList();
          this.form.resetFields();
          this.visible = false;
        } else if (params.type === 2) {
          // 新增用户
          this.userParam.orgid = this.currentRow.orgid;
          this.$refs.table.refresh(true);
          this.formUser.resetFields();
          this.visibleUser = false;
        }
      } else {
        this.$message.warning('新增失败，请联系管理员');
      }
    });
  },
  editDepMsg (params) {
    editDepMsg(params).then((res) => {
      if (res.code === 0) {
        this.getAllDepList();
        if (params.name === this.currentRow.name || params.name === this.currentUser.name) {
          this.$message.success('编辑成功');
        } else {
          this.$message.success('编辑成功，等待审核');
        }
        if (params.type === 1) {
          this.girdClick([this.currentRow.orgid]);
          this.form.resetFields();
          this.visible = false;
        } else if (params.type === 2) {
          this.$refs.table.refresh(true);
          this.userParam.orgid = this.currentRow.orgid;
          this.visibleUser = false;
          this.formUser.resetFields();
        }
      } else {
        this.$message.warning('编辑失败，请联系管理员');
      }
    });
  },
  // 编辑部门
  async editOrigin () {
    this.formType = 2;
    this.visible = true;
    await this.$nextTick();
    this.form.setFieldsValue({ name: this.currentRow.name, describe: this.currentRow.describe });
    this.title = '编辑部门';
  },
  getConText (item, val) {
    return <span style='font-size:14px'>确定要删除 <span style='color:#6ac5fe'>{item.name}</span> 这个{val}吗？</span>;
  },
  // 删除用户
  delOrigin (row) {
    const self = this;
    if (row.orgid) {
      this.currentUser = row;
      if (row.islocked) {
        this.$message.warning('锁定状态不能删除');
        return;
      }
      this.$confirm({
        title: '删除用户',
        content: self.getConText(row, '用户'),
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          const delParamUser = {
            orgid: self.currentUser.orgid,
            name: self.currentUser.name,
            type: self.currentUser.type
          };
          self.delDepMsg(delParamUser);
        }
      });
    } else {
      if (this.currentRow.islocked) {
        this.$message.warning('锁定状态不能删除');
        return;
      }
      const { orgid } = self.currentRow;
      for (let index = 0; index < this.tableDataNoTree.length; index++) {
        const element = this.tableDataNoTree[index];
        if (element.parentid === orgid) {
          self.$message.warning('请先删除该部门下子部门');
          return;
        }
      }
      for (let index = 0; index < this.tableDataNoTreeUser.length; index++) {
        const element = this.tableDataNoTreeUser[index];
        if (element.parentid === orgid) {
          self.$message.warning('请先删除该部门下用户');
          return;
        }
      }
      this.$confirm({
        title: '删除部门',
        content: self.getConText(self.currentRow, '部门'),
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          const delParamDep = {
            orgid: self.currentRow.orgid,
            name: self.currentRow.name,
            type: self.currentRow.type
          };
          self.delDepMsg(delParamDep);
        }
      });
    }
  },
  async delDepMsg (params) {
    const data = await delDepMsg(params);
    if (data.code === 0) {
      if (params.type === 1) {
        this.$message.success('删除成功，等待审核');
        this.getAllDepList();
      } else if (params.type === 2) {
        this.userParam.orgid = this.currentRow.orgid;
        this.$refs.table.refresh(true);
      }
    } else {
      this.$message.warning('删除失败');
    }
  },
  handleCancel () {
    // 新增编辑部门取消
    this.form.resetFields();
    this.formUser.resetFields();
    this.visible = false;
    this.visibleUser = false;
  },
  handleOk () {
    // 新增编辑部门保存
    let params = {};
    if (this.formType === 1 || this.formType === 2) {
      this.form.validateFields((error, values) => {
        if (!error) {
          params = { ...values };
          params.type = 1;
          params.parentid = this.currentRow.orgid;
          if (this.formType === 1) {
            // 新增部门
            params.type = 1;
            this.addDepByParam(params);
          } else if (this.formType === 2) {
            // 编辑部门
            params.type = 1;
            params.orgid = this.currentRow.orgid;
            params.oldname = this.currentRow.name;
            this.editDepMsg(params);
          }
        }
      });
    } else if (this.formType === 3 || this.formType === 4) {
      this.formUser.validateFields((error, values) => {
        if (!error) {
          params = { ...values };
          params.type = 2;
          params.parentid = this.currentRow.orgid;
          if (this.formType === 3) {
            // 新增用户
            this.addDepByParam(params);
          } else if (this.formType === 4) {
            // 编辑用户
            params.orgid = this.currentUser.orgid;
            params.oldname = this.currentUser.name;
            this.editDepMsg(params);
          }
        }
      });
    }
  },
  getUpdateText (item, val) { // 确定要重置用户zhangxixi的密码？
    return <span style='font-size:14px'>确定要将用户 <span style='color:#6ac5fe'>{item.name}</span> {val}</span>;
  },
  updateleader (row, type) {
    // 升为、取消部门负责人
    const self = this;
    if (type === 1) {
      // 升为部门负责人
      this.$confirm({
        title: self.getUpdateText(row, '设置为部门负责人吗？'),
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          self.upDtaeLeaderOn(row, type);
        }
      });
    } else if (type === 0) {
      // 取消部门负责人
      this.$confirm({
        title: self.getUpdateText(row, '取消部门负责人吗？'),
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          self.upDtaeLeaderOn(row, type);
        }
      });
    }
  },
  async upDtaeLeaderOn (row, type) {
    if (this.currentRow.islocked) {
      this.$message.success('锁定状态不能操作');
      return;
    }
    const resetUserPsWordParams = {
      orgid: row.orgid,
      type: type,
      name: row.name,
      leaderid: row.orgid
    };
    if (type === 0) {
      resetUserPsWordParams.leaderid = '';
    }
    const data = await updateleader(resetUserPsWordParams);
    if (data.code === 0) {
      this.$message.success('更新成功，等待审核');
      this.getAllDepList();
      this.$refs.table.refresh(true);
    } else {
      this.$message.warning('更新失败');
    }
  },
  async getAllDepList (type) {
    const self = this;
    this.tableDataNoTree = [];
    self.dataSource = [];
    const params = {
      page: 1,
      limit: 10000,
      type: 1
    };
    const data = await getAllDepList(params);
    if (Array.isArray(data.data)) {
      data.data.forEach(item => {
        if (item.role !== 'auditadmin' && item.role !== 'secadmin' && item.role !== 'sysadmin' && item.type === 1 && item.name) {
          self.tableDataNoTree.push(item);
          self.dataSource.push({
            text: item.name,
            value: item.orgid
          });
        }
      });
      this.tableData = dataToTree(this.tableDataNoTree, type, this.girdClick, this.currentRow);
    }
  },
  async getAllUserDatas () {
    const self = this;
    this.tableDataNoTreeUser = [];
    const params = {
      page: 1,
      limit: 100000,
      type: 2
    };
    const data = await getAllDepList(params);
    data.data.forEach(item => {
      if (item.role !== 'auditadmin' && item.role !== 'secadmin' && item.role !== 'sysadmin' && item.type === 2 && item.name) {
        self.tableDataNoTreeUser.push(item);
        self.dataSourceUser.push({
          text: item.name,
          value: item.orgid
        });
      }
    });
  },
  getResConText (item) {
    return <span style='font-size:14px'>确定要重置用户 <span style='color:#6ac5fe'>{item.name}</span> 的密码吗？</span>;
  },
  resetUserPsWord (row) {
    const self = this;
    if (row.islocked) {
      this.$message.success('锁定状态不能操作');
      return;
    }
    this.$confirm({
      title: self.getResConText(row),
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk () {
        const resetUserPsWordParams = {
          orgid: row.orgid,
          name: row.name
        };
        resetUserPsWord(resetUserPsWordParams).then(data => {
          if (data.code === 0) {
            self.$message.success('密码重置成功');
          } else {
            self.$message.warning('密码重置失败');
          }
        });
      }
    });
  },
  getUnlocked (item) {
    return <span style='font-size:14px'>确定要将用户 <span style='color:#6ac5fe'>{item.name}</span> 解锁吗？</span>;
  },
  setLockById (row) {
    const self = this;
    this.$confirm({
      title: self.getUnlocked(row),
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk () {
        const params = { name: '', status: false, lockTime: '' };
        params.name = row.name;
        setLockById(params).then((res) => {
          if (res.code === 0) {
            self.$message.success('解锁成功！');
            self.$refs.table.refresh(true); // 刷新用户列表
          }
        });
      }
    });
  },
  hadleSelectOri (value) {
    // 部门自动输入的input框选中点击事件
    this.currentRow = this.tableDataNoTree.find((n, i) => n.orgid === value);
    this.userAutoVal = '';
    this.userParam.orgid = this.currentRow.orgid;
    const rows = familyTree(this.tableDataNoTree, this.currentRow.orgid); // 获取选中部门的所有子节点
    for (let index = 0; index < rows.length; index++) {
      this.expandedRowKeys.push(rows[index].orgid);
    }
    this.girdClick([value]);
  },
  hadleSelectUser (value) {
    // 用户自动输入的input框选中点击事件
    this.currentUser = this.tableDataNoTreeUser.find((n, i) => n.orgid === value);
    this.userParam.name = this.currentUser.name;
    this.$refs.table.refresh(true); // 刷新用户列表
  },
  onExpand (expandedKeys) {
    this.expandedRowKeys = expandedKeys;
  },
  girdClick (selectedKeys, info) {
    if (info) {
      this.oriAutoVal = '';
    }
    this.userAutoVal = '';
    this.userParam.name = '';
    let row = null;
    if (selectedKeys.length > 0) {
      this.userParam.orgid = selectedKeys[0];
      row = this.tableDataNoTree.find((n, i) => n.orgid === selectedKeys[0]);
      this.currentRow = row;
      this.$refs.table.refresh(true);
      if (!row.islocked) {
        this.isBtns = true;
      } else {
        this.isBtns = false;
      }
      this.dataSourceUser = [];
      this.tableDataNoTreeUser.forEach(item => {
        if (item.parentid === row.orgid) {
          this.dataSourceUser.push({
            text: item.name,
            value: item.orgid
          });
        }
      });
      console.log(this.dataSourceUser);
      console.log(this.tableDataNoTreeUser);
      this.$nextTick(() => {
        document.querySelectorAll('.ant-tree li .ant-tree-node-content-wrapper').forEach(dom => {
          dom.style.backgroundColor = 'transparent';
        });
        document.getElementById(row.orgid).parentNode.parentNode.style.backgroundColor = '#0a7dbf';
      });
    } else {
      document.getElementById(this.currentRow.orgid).parentNode.parentNode.style.backgroundColor = 'transparent';
      this.isBtns = false;
      this.userParam.orgid = '';
      this.currentRow = { orgid: '' };
      this.$nextTick(() => {
        document.querySelectorAll('.treespan').forEach(dom => {
          dom.style.backgroundColor = 'transparent';
        });
      });
      this.$refs.table.refresh(true); // 刷新用户列表
    }
  },
  filterOption (input, option) {
    return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
  }
};
