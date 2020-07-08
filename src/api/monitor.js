import { axios } from '@/utils/request';

// 获取设备信息列表
function getDedicatedList (params) {
  return axios({
    url: '/dedicated/list',
    params
  });
}

// 涉密详细信息
function dedicatedDeatil (params) {
  return axios({
    url: '/dedicated/detail',
    params
  });
}

// 获取拓扑图列表
function getMapList (params) {
  return axios({
    url: '/map/list',
    params
  });
}

// 新增拓扑图
function addMap (data) {
  return axios({
    url: '/map/add',
    method: 'POST',
    data
  });
}

// 修改拓扑图
function updateMap (data) {
  return axios({
    url: '/map/update-map',
    method: 'POST',
    data
  });
}

// 拓扑图删除节点
function jtopoDeleteNode (data) {
  return axios({
    url: '/map/del',
    method: 'POST',
    data
  });
}

// 拓扑节点与链路批量修改
function batchMapUpdate (data) {
  return axios({
    url: '/map/update',
    method: 'POST',
    data
  });
}

// 拓扑图详情
function mapDetail (params) {
  return axios({
    url: '/map/detail',
    params
  });
}

// 删除拓扑图
function jtopoDel (data) {
  return axios({
    url: '/topo/del',
    method: 'delete',
    data
  });
}

// 拓扑图新增链路
function jtopoAddLink (data) {
  return axios({
    url: '/link/add',
    method: 'POST',
    data
  });
}

// 拓扑图删除链路
function jtopoDeleteLink (data) {
  return axios({
    url: '/link/delete',
    method: 'POST',
    data
  });
}

// 拓扑图新增节点
function jtopoAddNode (data) {
  return axios({
    url: '/node/add',
    method: 'POST',
    data
  });
}

// 拓扑图修改节点
function jtopoUpdateNode (data) {
  return axios({
    url: '/node/update',
    method: 'POST',
    data
  });
}

export {
  getDedicatedList,
  dedicatedDeatil,
  getMapList,
  addMap,
  updateMap,
  jtopoDel,
  mapDetail,
  jtopoAddLink,
  jtopoDeleteLink,
  jtopoAddNode,
  jtopoUpdateNode,
  jtopoDeleteNode,
  batchMapUpdate
};
