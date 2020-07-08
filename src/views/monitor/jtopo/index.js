import { getMapList, addMap, updateMap, mapDetail, jtopoAddNode, jtopoDeleteNode, jtopoUpdateNode, batchMapUpdate,
  getDedicatedList, jtopoDel } from '@/api/monitor';
import '@/assets/libs/jtopo-0.4.8-min';
const JTopo = window.JTopo;
const strokeColor = '76, 198, 154';
const lineWidth = 1;

function getJtopoTypeIconMap (type) {
  if (type) {
    return require(`@/assets/image/jtopo/jtopo-icon${type}@2x.png`);
  } else {
    return require('@/assets/image/jtopo/jtopo-icon0@2x.png');
  }
}

export default {
  tipUserSaveData () {
    if (!this.noUpdate) {
      return new Promise((resolve, reject) => {
        this.$confirm({
          content: '拓扑图有数据未保存，先保存吧',
          onOk: () => {
            this.batchMapUpdate();
            resolve();
          },
          onCancel () {
            resolve();
          },
          okText: '保存',
          cancelText: '不保存'
        });
      });
    } else {
      return null;
    }
  },
  async funcItemClick (menu, index) {
    this.createOrUpdateJtopoObj = menu;
    switch (index) {
      case 0: // 编辑
        this.createOrUpdateJtopoModalVisible = true;
        await this.$nextTick();
        this.createJtopoForm.setFieldsValue({
          jtopoName: menu.topologyName,
          jtopoType: menu.topologyType
        });
        break;
      case 1: // 删除
        this.deleteJtopoHandleOk([menu.topologyId]);
        break;
    }
  },
  handleCreateJtopoSubmit (e) { // 新增拓扑图
    e.preventDefault();
    this.createJtopoForm.validateFields(async (err, values) => {
      if (!err) {
        let data = null;
        const obj = {
          topologyName: values.jtopoName,
          topologyPicture: '',
          topologyType: values.jtopoType,
          zoomPercent: this.scene.zoom_,
          topologyLevel: 2
        };
        if (!this.createOrUpdateJtopoObj.topologyId) { // 新建
          data = await addMap(obj);
          if (data.code === 0) {
            data.data.icon = 'security-scan';
            this.jtopoList.push(data.data);
          }
        } else { // 修改
          obj.topologyId = this.createOrUpdateJtopoObj.topologyId;
          data = await updateMap(obj);
        }

        if (data.code === 0) {
          this.$message.success(data.msg);
          this.createOrUpdateJtopoModalVisible = false;
          this.createJtopoForm.resetFields();
          if (this.createOrUpdateJtopoObj.topologyId) {
            this.getJtopoList();
          }
        } else {
          this.$message.error(data.msg);
        }
      }
    });
  },
  async jtopoMenuclick (index) { // 子拓扑切换
    await this.tipUserSaveData();
    this.currentJtopoIndex = index;
    await this.getTopoDetail(this.jtopoList[index].topologyId);
    this.noUpdate = true;
  },
  customRow (record) { // 选择实体节点时点击行可选择
    return {
      on: { // 事件
        click: (event) => {
          this.chooseNodeTypeChooseKeys = [record.ip];
          this.chooseNodeTypeChooseRow = [record];
        }
      }
    };
  },
  chTypeToFamily (text) { // 设备类型转义
    const a = this.deviceTypes.find((item) => item.typeid.toString() === text);
    return a?.family;
  },
  chooseNodeTypeChange (value) { // 虚拟节点和实体节点的切换
    this.chooseNodeTypeActiveKey = value;
  },
  deleteJtopoHandleOk (ids) { // 删除子拓扑
    this.$confirm({
      content: '在删除子拓扑之前请保存当前拓扑图上的数据哦，确定要删除吗',
      onOk: async () => {
        const data = await jtopoDel({
          ids
        });
        if (data.code === 0) {
          if (this.currentJtopo.topologyId === ids[0]) { // 删除了当前展示的拓扑，需要重新请求详情接口
            this.getJtopoList(true);
          } else {
            this.getJtopoList();
          }
        }
      }
    });
  },
  async deleteNode () { // 删除节点
    const { inLinks, outLinks } = this.targetOnCanvas;
    const nodeIds = [this.targetOnCanvas.jtopoDetail.id];
    const linkIds = [];
    if (inLinks) {
      inLinks.map((item) => {
        if (item.jtopoDetail.id) {
          linkIds.push(item.jtopoDetail.id);
        }
      });
    }
    if (outLinks) {
      outLinks.map((item) => {
        if (item.jtopoDetail.id) {
          linkIds.push(item.jtopoDetail.id);
        }
      });
    }
    const data = await jtopoDeleteNode({
      nodeIds,
      linkIds
    });
    if (data.code === 0) {
      if (inLinks) {
        inLinks.map((item) => {
          this.scene.remove(item);
        });
      }
      if (outLinks) {
        outLinks.map((item) => {
          this.scene.remove(item);
        });
      }
      window.clearTimeout(this.targetOnCanvas.ti); // 清除保存在该节点上的定时器
      this.scene.remove(this.targetOnCanvas);
    }
  },
  async deleteLinkHandleOk () { // 删除链路
    const linkIds = [];
    this.deleteLinkChecks.map((item) => {
      if (item.jtopoDetail.id) {
        linkIds.push(item.jtopoDetail.id);
      }
    });
    if (linkIds.length) {
      const data = await jtopoDeleteNode({
        linkIds,
        nodeIds: []
      });
      if (data.code === 0) {
        this.$message.success(data.msg);
        this.deleteLinkNode();
        this.deleteLinkVisible = false;
      } else {
        this.$message.error(data.msg);
      }
    } else {
      this.deleteLinkNode();
      this.deleteLinkVisible = false;
    }
  },
  deleteLinkNode () { // 从场景中移除链路
    this.deleteLinkChecks.map((item) => {
      this.scene.remove(item);
    });
  },
  handleAlarm (node, alarm) { // 告警定时器
    console.log('alarm');
    node.ti = setTimeout(() => {
      if (node.jtopoDetail.alarm) {
        node.alarm = `告警(${alarm})`;
        node.alarmColor = '200,0,0';
        node.alarmAlpha = 1;
        node.jtopoDetail.alarm = null;
      } else {
        node.alarm = null;
        node.jtopoDetail.alarm = alarm;
      }
      this.handleAlarm(node, alarm);
    }, 600);
  },
  newScene () { // 新建一个场景
    const scene = new JTopo.Scene(this.stage); // 创建一个场景对象
    scene.zoom_ = 1; // 初始化放大倍数为1
    scene.backgroundColor = '8,36,76';
    this.stage.add(scene);
    this.scene = scene;
    return scene;
  },
  async relationSubJtopoHandleOk () { // 关联子拓扑确认事件
    const data = await jtopoUpdateNode({
      id: this.targetOnCanvas.jtopoDetail.id,
      alias: this.targetOnCanvas.jtopoDetail.alias,
      relMap: this.relationSubJtopoChecks
    });
    if (data.code === 0) {
      this.$message.success(data.msg);
      this.targetOnCanvas.jtopoDetail.relMap = data.data.relMap;
      this.relationSubJtopoModalVisible = false;
    } else {
      this.$message.error(data.msg);
    }
  },
  async batchMapUpdate () { // 批量修改
    const addLinkList = [];
    const updateNodeList = [];
    const { scene, currentJtopo } = this;
    scene.childs.map((item) => {
      if (item.elementType === 'node') {
        updateNodeList.push({
          id: item.jtopoDetail.id,
          x: Number.parseInt(item.x),
          y: Number.parseInt(item.y)
        });
      } else {
        if (!item.jtopoDetail.id && item.nodeA.jtopoDetail.id && item.nodeZ.jtopoDetail.id) {
          addLinkList.push({
            topologyId: currentJtopo.topologyId,
            startNodeId: item.nodeA.jtopoDetail.nodeId,
            startIndex: null,
            startIp: item.nodeA.jtopoDetail.ip,
            startDesc: null,
            startMac: null,
            endNodeId: item.nodeZ.jtopoDetail.nodeId,
            endIndex: null,
            endIp: item.nodeZ.jtopoDetail.ip,
            endDesc: null,
            endMac: null,
            linkType: '0',
            linkName: '',
            linkDash: '',
            linkWidth: '0',
            linkOffset: '0'
          });
        }
      }
    });
    const data = await batchMapUpdate({
      addLinkList,
      updateNodeList
    });
    if (data.code === 0) {
      this.$message.success(data.msg);
      this.noUpdate = true;
    } else {
      this.$message.error(data.msg);
    }
  },
  async handleFuncBtn (e) { // 功能菜单按钮click事件委托
    const { target } = e;
    if (Object.is(target.nodeName.toUpperCase(), 'BUTTON')) {
      const type = target.dataset.type;
      switch (type) {
        case 'showAll': // 显示全部
          this.stage.setCenter(this.width / 2, this.height / 2);
          this.stage.centerAndZoom();
          if (this.scene.zoom_ >= 1) {
            this.scene.zoomIn(1 / this.scene.zoom_);
          } else {
            this.scene.zoomOut(this.scene.zoom_);
          }
          this.scene.zoom_ = 1;
          break;
        case 'create': // 新增节点
          this.createNodeFunc();
          break;
        case 'refresh': // 刷新
          await this.tipUserSaveData();
          this.getTopoDetail(this.currentJtopo.topologyId);
          break;
        case 'zoomIn': // 放大
          this.sceneZoomIn();
          break;
        case 'zoomOut': // 缩小
          this.sceneZoomOut();
          break;
        case 'save': // 更新拓扑图上修改过的节点属性
          this.batchMapUpdate();
          break;
        case 'delete': // 删除拓扑图
          this.deleteJtopoHandleOk([this.currentJtopo.topologyId]);
          break;
      }
    }
  },
  createNodeFunc () { // 新增节点
    this.isAddForm = true;
    this.chooseNodeTypeKeys = ['1', '2'];
    this.createNodeModalVisible = true;
  },
  async handleMenu (e) { // 右键菜单点击事件
    this.contextMenuShow = false;
    const { target } = e;
    if (Object.is(target.nodeName.toUpperCase(), 'BUTTON')) {
      const index = target.dataset.index;
      switch (index) {
        case '0': // 新增
          this.createNodeFunc();
          break;
        case '1': // 编辑
          this.isAddForm = false;
          this.createNodeModalVisible = true;
          this.chooseNodeTypeKeys = [this.targetOnCanvas.jtopoDetail.typeId];
          this.chooseNodeTypeActiveKey = this.targetOnCanvas.jtopoDetail.typeId;
          if (this.targetOnCanvas.jtopoDetail.typeId === '2') { // 实体节点
            await this.$nextTick();
            this.chooseNodeTypeChooseKeys = [this.targetOnCanvas.jtopoDetail.ip];
            this.chooseNodeTypeActiveKey = '2';
          } else {
            await this.$nextTick();
            this.createNodeForm.setFieldsValue({
              alias: this.targetOnCanvas.jtopoDetail.alias,
              ip: this.targetOnCanvas.jtopoDetail.ip
            });
          }
          break;
        case '2': // 删除
          this.$confirm({
            content: '将会删除该节点以及与其相连的所有链路，确定删除吗？',
            onOk: () => {
              this.deleteNode();
            },
            okText: '删除',
            cancelText: '取消'
          });
          break;
        case '3': // 删除连接
          this.deleteLinkVisible = true;
          break;
        case '4': // 关联子图
          if (this.targetOnCanvas.jtopoDetail.relMap) {
            this.relationSubJtopoChecks = undefined;
            this.relationSubJtopoHandleOk();
          } else {
            this.relationSubJtopoModalVisible = true;
          }
          break;
      }
    }
  },
  handleSubmit (e) { // 新增或者修改节点
    e.preventDefault();
    switch (this.chooseNodeTypeActiveKey) {
      case '1': // 虚拟
        this.createNodeForm.validateFields((err, values) => {
          if (!err) {
            this.nodeAddOrUpdate(values);
          }
        });
        break;
      case '2': // 实体
        if (this.isAddForm) { // 新增
          if (!this.chooseNodeTypeChooseKeys.length || !this.chooseNodeTypeChooseRow.length) {
            this.$message.success('请选择实体节点');
          } else {
            this.nodeAddOrUpdate(this.chooseNodeTypeChooseRow[0]);
          }
        } else {
          if (this.chooseNodeTypeChooseKeys && !this.chooseNodeTypeChooseRow.length) { // 用户没有修改数据
            this.createNodeModalVisible = false;
            this.createNodeForm.resetFields();
          } else if (this.chooseNodeTypeChooseKeys && this.chooseNodeTypeChooseRow.length) {
            this.nodeAddOrUpdate(this.chooseNodeTypeChooseRow[0]);
          } else {
            this.$message.success('请选择实体节点');
          }
        }
        break;
    }
  },
  async nodeAddOrUpdate (obj) {
    let resultType = 'success';
    let data = null;
    let node = null;
    if (this.isAddForm) { // 新增
      node = {
        topologyId: this.currentJtopo.topologyId,
        nodeId: null,
        typeId: this.chooseNodeTypeActiveKey,
        img: null,
        x: 30,
        y: this.nodeInitY += 80,
        width: this.nodeWidth,
        height: this.nodeWidth,
        ip: obj.ip,
        alias: obj.alias
      };
      if (this.chooseNodeTypeActiveKey === '2') {
        node.chType = obj.chType;
        node.alias = obj.name;
      }
      data = await jtopoAddNode(node);
    } else { // 修改
      node = {
        id: this.targetOnCanvas.jtopoDetail.id,
        ip: obj.ip,
        alias: obj.alias,
        typeId: this.chooseNodeTypeActiveKey
      };
      if (this.chooseNodeTypeActiveKey === '2') {
        node.alias = obj.name;
      }
      data = await jtopoUpdateNode(node);
    }
    if (data.code === 0) {
      if (this.isAddForm) {
        this.newNode(data.data);
      } else {
        this.targetOnCanvas.jtopoDetail = node;
        this.targetOnCanvas.text = node.alias;
      }
      this.createNodeModalVisible = false;
      this.createNodeForm.resetFields();
    } else {
      resultType = 'error';
    }
    this.$message[resultType](data.msg);
  },
  deleteLinkModalOnChange (checkedValues) { // 删除链路复选框change事件
    this.deleteLinkChecks = checkedValues;
  },
  relationSubJtopoModalOnChange (e) { // 关联子拓扑单选框change事件
    this.relationSubJtopoChecks = e.target.value;
  },
  async getJtopoList (needDetail) { // 获取拓扑列表
    const jtopoList = [];
    const data = await getMapList();
    if (data.code === 0) {
      data.data.map(async (item, index) => {
        if (item.topologyLevel === 1) { // 主拓扑
          item.hasAction = false;
          item.icon = 'bank';
        } else {
          item.hasAction = true;
          item.icon = 'security-scan';
        }
        jtopoList.push(item);
        if (needDetail && index === 0) { // 如果需要请求详情，则取第一个拓扑
          await this.getTopoDetail(item.topologyId);
        }
      });
      this.jtopoList = jtopoList;
      if (needDetail) {
        this.currentJtopoIndex = 0;
      }
    }
  },
  async getTopoDetail (topologyId) { // 获取拓扑图下的节点以及链路列表
    this.clearAllAlarmTimeout();
    const scene = this.scene;
    scene.clear(); // 清除场景的内容
    const res = await mapDetail({
      topologyId
    });
    if (res.code === 0) {
      this.currentJtopo = res.data;
      const { topologyLinkList, topologyNodeList } = res.data;

      topologyNodeList.map((item) => {
        this.newNode(item);
      });
      topologyLinkList.map((item) => {
        const beginNode = scene.childs.find((i) => i.jtopoDetail.nodeId === item.startNodeId);
        const endNode = scene.childs.find((i) => i.jtopoDetail.nodeId === item.endNodeId);
        this.newLinkHasArg(beginNode, endNode, item);
      });

      this.tempNodeA = new JTopo.Node('tempA');
      this.tempNodeA.setSize(1, 1);
      this.tempNodeZ = new JTopo.Node('tempZ');
      this.tempNodeZ.setSize(1, 1);
      this.link = new JTopo.Link(this.tempNodeA, this.tempNodeZ);
      this.link.strokeColor = strokeColor;

      if (!this.hasBindEvent) {
        this.sceneMouseEvent();
        this.hasBindEvent = true;
      }
      this.noUpdate = true;
    }
  },
  clearMouseOverTimeoutAndHideContent () {
    window.clearTimeout(this.mourseoverTimeout);
    this.mourseoverTimeout = null;
    window.clearTimeout(this.mourseoverLinkTimeout);
    this.mourseoverLinkTimeout = null;
    this.jtopoDetailVisible = false;
    this.jtopoLinkDetailVisible = false;
  },
  removeLinkAndNode () { // 删除节点时也要删除与节点相连的链路
    this.scene.remove(this.link);
    this.beginNode = null;
    this.endNode = null;
  },
  async showDetail (obj, e) { // 显示详情信息
    this.nodeDetail = obj;
    this.jtopoDetailVisible = true;
    await this.$nextTick();
    const top = e.pageY;
    const left = e.pageX;
    this.jtopoDetailStyle = {
      left: left + 'px',
      top: top + 'px'
    };
  },
  async showLinkDetail (e) { // 显示链路详情信息
    const { overTargetOnCanvas } = this;
    const { nodeA, nodeZ } = e.target;
    if (overTargetOnCanvas.jtopoDetail.startNodeId === nodeA.nodeId) {
      overTargetOnCanvas.jtopoDetail.startAlias = nodeA.jtopoDetail.alias;
      overTargetOnCanvas.jtopoDetail.endAlias = nodeZ.jtopoDetail.alias;
    } else {
      overTargetOnCanvas.jtopoDetail.startAlias = nodeZ.jtopoDetail.alias;
      overTargetOnCanvas.jtopoDetail.endAlias = nodeA.jtopoDetail.alias;
    }
    this.overTargetOnCanvas = overTargetOnCanvas;
    this.jtopoLinkDetailVisible = true;
    await this.$nextTick();
    const top = e.pageY;
    const left = e.pageX;
    this.jtopoLinkDetailStyle = {
      left: left + 'px',
      top: top + 'px'
    };
  },
  sceneZoomIn () {
    const { zoomMultiple } = this;
    this.scene.zoomIn(zoomMultiple);
    this.scene.zoom_ *= zoomMultiple;
  },
  sceneZoomOut () {
    const { zoomMultiple } = this;
    this.scene.zoomOut(zoomMultiple);
    this.scene.zoom_ /= zoomMultiple;
  },
  sceneMouseEvent () { // 鼠标事件
    this.scene.addEventListener('mousedown', (e) => {
      this.clearMouseOverTimeoutAndHideContent();
      this.contextMenuShow = false;
      if (e.target !== null && e.target instanceof JTopo.Node) {
        e.target.jtopoDetail.isDrag = false;
      }
      if (!e.target || e.target === this.beginNode || e.target === this.link) {
        this.scene.remove(this.link);
      }
    });
    this.scene.addEventListener('mousedrag', (e) => {
      if (e.target !== null) {
        this.noUpdate = false;
        e.target.jtopoDetail.isDrag = true;
      }
      this.clearMouseOverTimeoutAndHideContent();
    });
    this.scene.addEventListener('mousemove', (e) => {
      this.tempNodeZ.setLocation(e.x, e.y); // 设置连线的位置随鼠标的移动而变化
      if (!e.target || !(e.target instanceof JTopo.Node)) {
        this.jtopoDetailVisible = false;
      } else if (!e.target || !(e.target instanceof JTopo.Link)) {
        this.jtopoLinkDetailVisible = false;
      }
    });
    this.scene.addEventListener('mouseover', (e) => {
      this.overTargetOnCanvas = e.target;

      this.clearMouseOverTimeoutAndHideContent();

      if (e.target && e.target instanceof JTopo.Node) {
        if (this.contextMenuShow) {
          return;
        }
        this.mourseoverTimeout = setTimeout(async () => {
          if (this.overTargetOnCanvas) {
            if (!this.overTargetOnCanvas.jtopoDetail.chType && this.overTargetOnCanvas.jtopoDetail.typeId === '1') {
              this.showDetail({ chType: '' }, e);
            } else {
              const data = await getDedicatedList({ // 获取节点信息
                ip: this.overTargetOnCanvas.jtopoDetail.ip,
                chType: this.overTargetOnCanvas.jtopoDetail.chType
              });
              if (data.code === 0) {
                this.showDetail(data.data[0], e);
              }
            }
          }
        }, 500);
      } else if (e.target && e.target instanceof JTopo.Link) {
        if (this.contextMenuShow) {
          return;
        }
        this.mourseoverLinkTimeout = setTimeout(() => {
          if (this.overTargetOnCanvas && this.overTargetOnCanvas.jtopoDetail.id) { // 此链路已经被保存在数据库中才会有id
            this.showLinkDetail(e);
          }
        }, 500);
      }
    });
    this.scene.addEventListener('mouseout', (e) => {
      this.clearMouseOverTimeoutAndHideContent();
    });
    this.scene.addEventListener('dbclick', (e) => {
      this.clearMouseOverTimeoutAndHideContent();
      this.removeLinkAndNode(); // 移除临时的节点和链路
      if (e.button === 2) { // 右键
        return;
      }
      if (e.target !== null && e.target instanceof JTopo.Node) { // 在节点上
        const jtopoDetail = e.target.jtopoDetail;
        const { jtopoList } = this;
        if (jtopoDetail.relMap) { // 该节点有关联子拓扑则进入子拓扑
          const toJtopoIndex = jtopoList.findIndex(item => jtopoDetail.relMap === item.topologyId);
          this.jtopoMenuclick(toJtopoIndex);
        }
        if (!jtopoDetail.relMap && jtopoDetail.chType) { // 该节点没有关联子拓扑且属于实体节点则进入设备详情
          const chType = jtopoDetail.chType;
          const ip = jtopoDetail.ip;
          this.$router.push(`/monitor/deviceMenu/secretRelated/detail/${ip}/${chType}`);
        }
      }
    });
    this.scene.addEventListener('mousewheel', (e) => { // 鼠标滑轮滚动放大缩小场景
      this.clearMouseOverTimeoutAndHideContent();
      if (this.canWheel) {
        const wheelDelta = e.wheelDelta || -e.detail;
        this.canWheel = false;
        if (wheelDelta > 0) { // 放大
          this.sceneZoomIn();
        } else { // 缩小
          this.sceneZoomOut();
        }
        this.timeoutc = window.setTimeout(() => { // 节流
          this.canWheel = true;
        }, 100);
      }
    });
    this.scene.addEventListener('mouseup', async (e) => {
      this.clearMouseOverTimeoutAndHideContent();
      if (e.button === 2) { // 右键
        this.removeLinkAndNode();
        this.targetOnCanvas = e.target;
        this.contextMenuShow = true;
        await this.$nextTick();
        const menuStyle = {
          left: e.pageX + 'px',
          top: e.pageY + 10 + 'px'
        };
        this.menuStyle = menuStyle;
      } else if (e.button !== 2 && e.target && e.target instanceof JTopo.Node) {
        if (e.target.jtopoDetail.isDrag) {
          return;
        }
        if (this.beginNode === null) {
          this.beginNode = e.target;
          this.scene.add(this.link);
          this.tempNodeA.setLocation(e.x, e.y);
          this.tempNodeZ.setLocation(e.x, e.y);
        } else if (this.beginNode !== null && this.beginNode !== e.target) {
          const { inLinks, outLinks } = e.target;
          if (inLinks && outLinks) {
            const outIndex = outLinks.findIndex((item) => {
              return item.nodeZ === this.beginNode;
            });
            const inIndex = inLinks.findIndex((item) => {
              return item.nodeA === this.beginNode;
            });
            if (outIndex > -1 || inIndex > -1) {
              this.beginNode = null;
              this.removeLinkAndNode();
              console.warning('链路已存在');
              return;
            }
          }
          this.endNode = e.target;
          this.newLink();
        } else {
          this.beginNode = e.target;
          this.scene.add(this.link);
          this.tempNodeA.setLocation(e.x, e.y);
          this.tempNodeZ.setLocation(e.x, e.y);
        }
      } else {
        this.removeLinkAndNode();
      }
    });
  },
  newNode (n) { // 新建一个节点
    const node = new JTopo.Node(n.alias);
    node.jtopoDetail = n;
    node.x = n.x;
    node.y = n.y;
    node.width = n.width;
    node.height = n.height;
    node.setImage(getJtopoTypeIconMap(n.chType));
    node.ti = null; // 如果该节点有告警，则初始化该节点下的定时器
    if (node.jtopoDetail.alarm) {
      this.handleAlarm(node, node.jtopoDetail.alarm);
    }
    this.scene.add(node);
    console.log('getElementByXY =', this.scene.getElementByXY(node.x, node.y));
  },
  clearAllAlarmTimeout () {
    const children = this.scene.childs;
    const nodes = children.filter(item => item.elementType === 'node');
    nodes.forEach(item => {
      console.log('item.ti', item.ti);
      window.clearTimeout(item.ti);
      item.ti = null;
    });
  },
  newLinkHasArg (beginNode, endNode, obj) { // 新建一条链路(带参数)
    const link = new JTopo.Link(beginNode, endNode);
    link.lineWidth = lineWidth; // 线宽
    link.jtopoDetail = obj;
    link.strokeColor = strokeColor;
    this.scene.add(link);
  },
  newLink () { // 新建一条链路
    const link = new JTopo.Link(this.beginNode, this.endNode);
    link.lineWidth = lineWidth; // 线宽
    link.strokeColor = strokeColor;
    link.jtopoDetail = {};
    this.scene.add(link);
    this.beginNode = null;
    this.scene.remove(this.link);
    this.noUpdate = false;
  },
  async jtopoInit () { // 初始化拓扑图
    const { $refs: { canvas } } = this;
    this.stage = new JTopo.Stage(canvas); // 创建一个舞台对象
    await this.$nextTick(); // 等待dom渲染结束
    this.setCanvasWH();
  },
  setCanvasWH () { // 设置canvas宽高
    const bodyStyle = document.body.getBoundingClientRect();
    this.width = bodyStyle.width - 200 * 2;
    this.height = bodyStyle.height - 64 - 26;
  }
};
