
import { axios } from '@/utils/request';

// 查询仪表盘列表
export function findallboardmap (data) {
  return axios({
    url: '/board/findallboardmap',
    method: 'post',
    data
  });
}

// 仪表盘删除
export function deleteboardmap (params) {
  return axios({
    url: '/board/deleteboardmap',
    method: 'get',
    params
  });
}
// 仪表盘修改
export function updateboardmap (data) {
  return axios({
    url: '/board/updateboardmap',
    method: 'post',
    data
  });
}
// 仪表盘增加
export function addboardmap (data) {
  return axios({
    url: '/board/addboardmap',
    method: 'post',
    data
  });
}
// 查询所有指标项
export function findallindex (params) {
  return axios({
    url: '/board/findallindex',
    method: 'get',
    params
  });
}
// 根据指标项查询资源标签
export function findresourcebyindex (data) {
  return axios({
    url: '/board/findresourcebyindex',
    method: 'post',
    data
  });
}
// 单值仪表盘数据实时显示
export function aggregate (data) {
  return axios({
    url: '/board/aggregate',
    method: 'post',
    data
  });
}
// 新增单值仪表
export function addunitboard (data) {
  return axios({
    url: '/board/addunitboard',
    method: 'post',
    data
  });
}
// 删除仪表
export function deleteboard (data) {
  return axios({
    url: '/board/deleteboard',
    method: 'post',
    data
  });
}
// 根据仪表盘名称查询所有仪表数据
export function findboardbyboardmap (data) {
  return axios({
    url: '/board/findboardbyboardmap',
    method: 'post',
    data
  });
}

// 时间序预览
export function boardPreTime (data) {
  return axios({
    url: '/board/pre-time',
    method: 'post',
    data
  });
}

// 新增时间序列
export function boardAddTime (data) {
  return axios({
    url: '/board/add-time',
    method: 'post',
    data
  });
}
// 统计排名预览
export function boardPreStat (data) {
  return axios({
    url: '/board/pre-stat',
    method: 'post',
    data
  });
}
// 统计排名新增
export function boardAddStat (data) {
  return axios({
    url: '/board/add-stat',
    method: 'post',
    data
  });
}

// 根据id和type查询仪表
export function findBoardById (params) {
  return axios({
    url: '/board/findboardbyid',
    method: 'get',
    params
  });
}

// 修改仪表
export function updateboard (data) {
  return axios({
    url: `/board/updateboard/${data.dashBoardType}`,
    method: 'post',
    data
  });
}
