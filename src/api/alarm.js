import { axios } from '@/utils/request';
// 全部告警条件查询
function findAlarm (data) {
  return axios({
    url: '/alarm/find',
    method: 'POST',
    data
  });
}
// 告警模板->告警描述查询
function findContentByType (params) {
  return axios({
    url: '/alarm/findcontentbytype',
    params
  });
}
// 告警模板-列表条件查询
function findRule (data) {
  return axios({
    url: '/alarm/findrule',
    method: 'POST',
    data
  });
}
// 告警模板-修改操作--回填查询,不需要此接口
function findRuleById (params) {
  return axios({
    url: '/alarm/findrulebyid',
    params
  });
}
// 告警模板-修改操作
function updateRule (data) {
  return axios({
    url: '/alarm/updaterule',
    method: 'POST',
    data
  });
}
// 告警集合-条件查询
function findMapByUserId (data) {
  return axios({
    url: '/alarm/findmapbyuserid',
    method: 'POST',
    data
  });
}
// 告警集合-新增集合
function addAlarmMap (data) {
  return axios({
    url: '/alarm/addalarmmap',
    method: 'POST',
    data
  });
}
// 告警集合-新增集合-规则查询
function findAllRule (params) {
  return axios({
    url: '/alarm/findallrule',
    params
  });
}
// 告警集合-删除集合
function deleteAlarmMap (params) {
  return axios({
    url: '/alarm/deletealarmmap',
    params
  });
}
// 告警集合-根据id查询当前告警集合对象的所有规则
function findMapByMapId (params) {
  return axios({
    url: '/alarm/findmapbymapid',
    params
  });
}

// 告警集合-根据id跳转到告警页
function findAlarmByMapId (data) {
  return axios({
    url: '/alarm/findalarmbymapid',
    method: 'POST',
    data
  });
}
// 告警页关闭操作
function offAlarm (params) {
  return axios({
    url: '/alarm/offalarm',
    params
  });
}
// 告警页-告警处理
function updateAlarm (data) {
  return axios({
    url: '/alarm/updatealarm',
    method: 'POST',
    data
  });
}
// 告警页-查看告警详情
function findAlarmById (params) {
  return axios({
    url: '/alarm/findalarmbyid',
    params
  });
}
// 紧急、错误、警告、恢复(告警集合)
function countAlarmSum (params) {
  return axios({
    url: '/alarm/countalarmsum',
    params
  });
}

// 告警页关联规则查询
function pageFindRule (params) {
  return axios({
    url: `/alarm/find-rule/${params.id}`,
    params
  });
}

// 根据用户获取告警消息
function alarmFindmsg (data) {
  return axios({
    url: '/alarm/findmsg',
    method: 'post',
    data
  });
}

// 处理告警消息
function resolvealarm (data) {
  return axios({
    url: '/alarm/resolvealarm',
    method: 'post',
    data
  });
}

// 导出告警
function exportAlarm (params) {
  return axios({
    url: '/alarm/exportAlarm',
    responseType: 'blob',
    params
  });
}
// 告警页时间轴查询
function timeSerise (data) {
  return axios({
    url: '/alarm/time-series',
    method: 'POST',
    data
  });
}
export {
  findAlarm,
  findContentByType,
  findRule,
  offAlarm,
  updateAlarm,
  deleteAlarmMap,
  addAlarmMap,
  findAllRule,
  updateRule,
  findMapByUserId,
  findMapByMapId,
  findAlarmByMapId,
  findRuleById,
  countAlarmSum,
  findAlarmById,
  pageFindRule,
  timeSerise,
  alarmFindmsg,
  resolvealarm,
  exportAlarm
};
