// eslint-disable-next-line
import { BasicLayout, BlankLayout } from '@/layouts'
export const asyncRouterMap = [
  // system
  {
    path: '/system',
    name: 'System',
    component: BasicLayout,
    meta: { title: '系统管理', icon: require('@/assets/image/home/system-manager-icon.png'), permission: ['sysadmin', 'secadmin', 'auditadmin', 'ordinary'] },
    children: [
      {
        path: '/system/systemOrgan',
        name: 'SystemViewSystemOrgan',
        component: () => import('@/views/system/SystemOrgan'),
        meta: { title: '组织管理', icon: 'apartment', keepAlive: false, permission: ['sysadmin', 'secadmin', 'ordinary'] }
      },
      {
        path: '/system/systemLog',
        name: 'SystemViewSystemLog',
        component: () => import('@/views/system/SysLogList.vue'),
        meta: { title: '日志管理', icon: 'read', keepAlive: true, permission: ['auditadmin', 'secadmin'] }
      },
      {
        path: '/system/systemMsg',
        name: 'SystemViewSystemMsg',
        component: () => import('@/views/system/SystemMsg'),
        meta: { title: '消息中心', icon: 'message', keepAlive: true, permission: ['secadmin'] }
      },
      {
        path: '/system/alarmMsg',
        name: 'SystemViewAlarmMsg',
        component: () => import('@/views/system/AlarmMsg'),
        meta: { title: '消息中心', icon: 'message', keepAlive: true, permission: ['ordinary'] }
      },
      {
        path: '/system/sysconfig',
        name: 'SystemViewSysConfig',
        component: () => import('@/views/system/Sysconfig'),
        meta: { title: '系统安全配置', icon: 'lock', keepAlive: true, permission: ['secadmin'] }
      }
    ]
  },
  // myStore
  {
    path: '/myStore',
    name: 'Store',
    component: BasicLayout,
    meta: { title: '仓库管理', icon: require('@/assets/image/home/config-icon.png'), permission: [ 'sysadmin', 'ordinary' ] },
    children: [
      {
        path: '/myStore/StoreLayout',
        name: 'MyStoreStoreLayout',
        component: () => import('@/views/myStore/StoreLayout'),
        meta: { title: '仓库管理', icon: 'gold', keepAlive: true, permission: [ 'sysadmin', 'ordinary' ] }
      },
      {
        path: '/myStore/storeConfig',
        name: 'MyStoreStoreConfig',
        hidden: true,
        component: () => import('@/views/myStore/storeConfig/StoreConfig'),
        meta: { title: '仓库配置', keepAlive: true, permission: [ 'sysadmin', 'ordinary' ] }
      },
      {
        path: '/myStore/overView',
        name: 'MyStoreOverView',
        hidden: true,
        component: () => import('@/views/myStore/OverView'),
        meta: { title: '仓库总览', keepAlive: true, permission: [ 'sysadmin', 'ordinary' ] }
      },
      {
        path: '/myStore/changeLog',
        name: 'MyStoreChangeLog',
        hidden: true,
        component: () => import('@/views/myStore/ChangeLog'),
        meta: { title: '变更记录', keepAlive: true, permission: [ 'sysadmin', 'secadmin', 'auditadmin', 'ordinary' ] }
      }
    ]
  },
  // 监控模块
  {
    path: '/monitor',
    name: 'Monitor',
    component: BasicLayout,
    meta: { title: '监控模块', keepAlive: true, icon: require('@/assets/image/home/monitor-icon.png'), permission: [ 'sysadmin', 'ordinary' ] },
    children: [
      // 仪表盘
      {
        path: '/monitor/instrumentpanel',
        name: 'MonitorInstrumentPanel',
        component: () => import('@/views/instrumentpanel/Dashhome'),
        meta: { title: '仪表盘', keepAlive: true, icon: 'bar-chart', permission: ['sysadmin', 'ordinary'] }
      },
      {
        path: '/monitor/deviceMenu',
        name: 'MonitorDeviceMenu',
        component: BlankLayout,
        redirect: '/monitor/deviceMenu/secretRelated',
        meta: { title: '设备菜单', icon: 'menu-fold', keepAlive: false, permission: [ 'sysadmin', 'auditadmin', 'ordinary' ] },
        children: [
          {
            path: '/monitor/deviceMenu/secretRelated',
            name: 'MonitorDeviceMenuSecretRelated',
            component: () => import('@/views/monitor/deviceMenu/secretRelated/index'),
            meta: { title: '涉密专用信息设备', keepAlive: true, permission: [ 'sysadmin', 'auditadmin', 'ordinary' ] }
          },
          {
            path: '/monitor/deviceMenu/secretRelated/detail/:ip/:chType',
            name: 'MonitorDeviceMenuSecretRelatedDetail',
            component: () => import('@/views/monitor/deviceMenu/secretRelated/detail/index'),
            hidden: true,
            meta: { title: '涉密专用信息设备详情', hiddenHeaderContent: false, keepAlive: true, permission: [ 'sysadmin', 'auditadmin', 'ordinary' ] }
          }
        ]
      },
      {
        path: '/monitor/topologyMenu',
        name: 'MonitorTopologyMenu',
        component: () => import('@/views/monitor/jtopo/index.vue'),
        meta: { title: '拓扑菜单', icon: 'cloud-server', keepAlive: false, permission: [ 'sysadmin', 'auditadmin', 'ordinary' ] }
      }
    ]
  },
  // alarm
  {
    path: '/alarm',
    name: 'Alarm',
    component: BasicLayout,
    meta: { title: '告警管理', keepAlive: true, icon: require('@/assets/image/home/alarm-icon.png'), permission: ['sysadmin', 'secadmin', 'ordinary'] },
    children: [
      {
        path: '/alarm/entire',
        name: 'AlarmEntire',
        component: () => import('@/views/alarm/Entire'),
        meta: { title: '全部告警', icon: 'file-search', keepAlive: false, permission: ['sysadmin', 'ordinary'] }
      },
      {
        path: '/alarm/template',
        name: 'AlarmTemplate',
        component: () => import('@/views/alarm/template/Template'),
        meta: { title: '告警模板', icon: 'alert', keepAlive: true, permission: ['sysadmin', 'secadmin', 'ordinary'] }
      },
      {
        path: '/alarm/collection',
        name: 'AlarmCollection',
        component: () => import('@/views/alarm/collection/Collection'),
        meta: { title: '告警集合', icon: 'global', keepAlive: false, permission: ['sysadmin', 'ordinary'] }
      },
      {
        path: '/alarm/collection/page',
        name: 'AlarmCollectionPage',
        hidden: true,
        component: () => import('@/views/alarm/page/Page'),
        meta: { title: '告警页', keepAlive: false, permission: ['sysadmin', 'ordinary'] }
      }
    ]
  },
  // Statistical
  {
    path: '/statistical',
    name: 'Report',
    component: BasicLayout,
    meta: { title: '报表管理', icon: require('@/assets/image/home/report-icon.png'), permission: ['sysadmin', 'ordinary'] },
    children: [
      {
        path: '/statistical/staalartstatis',
        name: 'ReportAlarmstatis',
        component: () => import('@/views/statistical/AlarmStatisList'),
        meta: { title: '告警报表', icon: 'alert', keepAlive: true, permission: ['sysadmin', 'secadmin', 'auditadmin', 'ordinary'] }
      },
      {
        path: '/statistical/monstatis',
        name: 'ReportMonStatisList',
        component: () => import('@/views/statistical/MonStatisList'),
        meta: { title: '监控报表', icon: 'line-chart', keepAlive: true, permission: ['sysadmin', 'secadmin', 'auditadmin', 'ordinary'] }
      },
      {
        path: '/statistical/storeStatis',
        name: 'ReportStoreStatis',
        component: () => import('@/views/statistical/StoreStatisList'),
        meta: { title: '配置管理报表', icon: 'appstore', keepAlive: true, permission: ['sysadmin', 'secadmin', 'auditadmin', 'ordinary'] }
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
];

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: BasicLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: '/user/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },
  {
    path: '/',
    name: 'zall',
    component: BasicLayout,
    redirect: '/zall/home',
    children: [
      {
        path: '/zall/home',
        name: 'zallHome',
        component: () => import('@/views/home/home'),
        meta: { title: '卓尔信科', keepAlive: true, permission: [ 'sysadmin', 'ordinary' ] }
      }
    ],
    meta: { title: '卓尔信科', keepAlive: true, permission: ['sysadmin', 'ordinary'] }
  }
];
