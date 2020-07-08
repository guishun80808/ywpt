import { axios } from '@/utils/request';

// 设备列表
function getMyDevice (parameter) {
  return axios({
    url: '/device/search',
    params: parameter
  });
}
function addDevice (data) {
  return axios({
    url: '/device/add',
    method: 'post',
    data
  });
}

function updateDevice (data) {
  return axios({
    url: '/device/update',
    method: 'post',
    data
  });
}

function deleteDevice (data) {
  return axios({
    url: '/device/del',
    method: 'post',
    data
  });
}

function findDeviceById (parameter) {
  return axios({
    url: '/device/find',
    params: parameter
  });
}

// 设备类型列表
function typeList (params) {
  return axios({
    url: '/device/type/search',
    params
  });
}
function typeAdd (data) {
  return axios({
    url: '/device/type/add',
    method: 'post',
    data
  });
}

function typeUpdate (data) {
  return axios({
    url: '/device/type/update',
    data
  });
}

function typeDel (params) {
  return axios({
    url: '/device/type/del',
    params
  });
}

function deviceCount (params) {
  return axios({
    url: '/device/count',
    params
  });
}

function countAutodev (params) {
  return axios({
    url: '/device/countautodev',
    params
  });
}

function getDeviceLog (params) {
  return axios({
    url: '/log/finddevlog',
    params
  });
}

// 下载excel模板
function downExcelTemplate (onDownloadProgress) {
  return axios({
    url: '/device/getdevmod',
    responseType: 'blob',
    onDownloadProgress
  });
}

// 导出配置
function exportConfig (params) {
  return axios({
    url: '/device/exportDevice',
    responseType: 'blob',
    params
  });
}

// 获取配置数据
function getSelectByfimaly (params) {
  return axios({
    url: '/device/selectByfimaly',
    params
  });
}

// 按状态统计告警
function findMonByLevel (params) {
  return axios({
    url: '/device/findMonByLevel',
    params
  });
}
// 按告警来源统计
function findMonByType (params) {
  return axios({
    url: '/device/findMonByType',
    params
  });
}
// 按类型统计变更次数
function findChMonBYfamily (params) {
  return axios({
    url: '/device/findChMonBYfamily',
    params
  });
}
// 按类型统计变更次数
function nodetop10 (params) {
  return axios({
    url: '/node/top10',
    params
  });
}

export {
  getMyDevice,
  addDevice,
  updateDevice,
  deleteDevice,
  findDeviceById,
  typeList,
  typeAdd,
  typeUpdate,
  typeDel,
  deviceCount,
  countAutodev,
  getDeviceLog,
  downExcelTemplate,
  exportConfig,
  getSelectByfimaly,
  findMonByLevel,
  findMonByType,
  findChMonBYfamily,
  nodetop10
};
