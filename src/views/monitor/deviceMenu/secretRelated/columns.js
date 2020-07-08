import moment from 'moment';
import { dedicatedDetailStatusMapConstant } from './constantsMap';

function formatsysUptime (timestamp) {
  const date = new Date(Date.now() - timestamp);
  return '开机时间:' + moment(date).format('YYYY-MM-DD HH:mm:ss');
}

const secretRelatedColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
    sorter: true
  },
  {
    title: '设备类型',
    dataIndex: 'chType',
    scopedSlots: { customRender: 'chType' },
    sorter: true
  },
  {
    title: '设备IP',
    dataIndex: 'ip',
    sorter: true
  },
  {
    title: '连通率(%)',
    dataIndex: 'pingRate',
    scopedSlots: { customRender: 'pingRate' },
    sorter: true
  },
  {
    title: 'CPU(%)',
    dataIndex: 'cpuRate',
    sorter: true,
    scopedSlots: { customRender: 'cpuRate' }
  },
  {
    title: '物理内存(%)',
    dataIndex: 'memFreeRate',
    sorter: true,
    scopedSlots: { customRender: 'memFreeRate' }
  },
  {
    title: '虚拟内存(%)',
    dataIndex: 'swapFreeRate',
    sorter: true,
    scopedSlots: { customRender: 'swapFreeRate' }
  },
  {
    title: '接口数',
    dataIndex: 'netNum',
    sorter: true,
    scopedSlots: { customRender: 'netNum' }
  }
];

// 中间件
const secretRelatedMiddleWareColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
    fixed: 'left'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '版本',
    dataIndex: 'version',
    sorter: true
  },
  {
    title: '是否启用https协议',
    dataIndex: 'isHttpsProtocol',
    sorter: true
  },
  {
    title: '支持的加密协议类型',
    dataIndex: 'supProtocols',
    sorter: true
  },
  {
    title: '内存总空间',
    dataIndex: 'memTotalSize',
    sorter: true
  },
  {
    title: '内存已用空间',
    dataIndex: 'memUsedSize',
    sorter: true
  },
  {
    title: '堆内存',
    dataIndex: 'heapMemTotalSize',
    sorter: true
  },
  {
    title: '已用堆内存',
    dataIndex: 'heapMemUsedSize',
    sorter: true
  },
  {
    title: '非堆内存',
    dataIndex: 'nonHeapMemTotalSize',
    sorter: true
  },
  {
    title: '已用非堆内存',
    dataIndex: 'noHeapMemUsedSize',
    sorter: true
  },
  {
    title: '最大连接数',
    dataIndex: 'maxConnNum',
    sorter: true
  },
  {
    title: '最大线程数',
    dataIndex: 'maxThreadNum',
    sorter: true,
    fixed: 'right'
  }
];

// 数据库
const secretRelatedDatabaseColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
    fixed: 'left'
  },
  {
    title: '版本',
    dataIndex: 'version'
  },
  {
    title: '设备IP',
    dataIndex: 'ip'
  },
  {
    title: '最大连接数',
    dataIndex: 'instanceNames'
  },
  {
    title: '已连接线程数',
    dataIndex: 'maxConnNum'
  },
  {
    title: '正在连接线程数',
    dataIndex: 'storageTotalSize'
  },
  {
    title: '数据库只读模式',
    dataIndex: 'maxMemSize'
  },
  {
    title: '客户端异常数',
    dataIndex: 'maxMemSize'
  },
  {
    title: '连接进程数',
    dataIndex: 'maxMemSize'
  },
  {
    title: '登陆会话数',
    dataIndex: 'maxMemSize'
  },
  {
    title: '每秒查询量',
    dataIndex: 'maxMemSize'
  },
  {
    title: '每秒事务量',
    dataIndex: 'maxMemSize',
    fixed: 'right'
  }
];
// 安全数据库
const secretRelatedSafeDatabaseColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
    fixed: 'left'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '版本',
    dataIndex: 'version'
  },
  {
    title: '设备IP',
    dataIndex: 'ip'
  },
  {
    title: '数据库列表',
    dataIndex: 'instanceNames'
  },
  {
    title: '最大连接数',
    dataIndex: 'maxConnNum'
  },
  {
    title: '存储分配总空间（KB）',
    dataIndex: 'storageTotalSize'
  },
  {
    title: '最大内存使用空间（KB）',
    dataIndex: 'maxMemSize'
  }
];

const chooseSecretRelatedColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
    sorter: true
  },
  {
    title: '设备类型',
    dataIndex: 'chType',
    scopedSlots: { customRender: 'chType' },
    sorter: true
  },
  {
    title: '设备IP',
    dataIndex: 'ip',
    sorter: true
  }
];

const dedicatedDetailAvailableColumns = [
  {
    dataIndex: 'pingRate',
    title: '服务器可达率(%)',
    width: '150px'
  },
  {
    dataIndex: 'responseTime',
    title: '服务器响应时间(毫秒)',
    width: '150px'
  }
];

const dedicatedDetailStaticInfoColumns = [
  {
    dataIndex: 'name',
    width: '150px'
  },
  {
    dataIndex: 'content'
  }
];

const dedicatedDetailDynamicInfoColumns = [
  {
    dataIndex: 'sysInstallTime',
    title: '操作系统安装时间',
    width: '150px',
    customRender: (text) => {
      console.log('text', typeof text);
      console.log('moment(text)', moment(text));
      const time = Number.parseInt(text);
      const unixTime = moment(time).unix();
      return moment(unixTime).format('YYYY-MM-DD hh:mm:ss');
    }
  },
  {
    dataIndex: 'sysUptime',
    title: '操作系统开机时间',
    width: '150px',
    customRender: (text) => {
      return formatsysUptime(Number.parseInt(text));
    }
  }
];

const dedicatedDetailcpuInfoColumns = [
  {
    dataIndex: 'cpuName',
    title: '处理器名称',
    width: '150px'
  },
  {
    dataIndex: 'cpuCores',
    title: '处理器超线程核数',
    width: '150px'
  },
  {
    dataIndex: 'cpuFreq',
    title: '处理器频率(GHZ)',
    width: '150px'
  },
  {
    dataIndex: 'cpuRate',
    title: '处理器实时使用率(%)',
    width: '150px'
  }
];

const dedicatedDetailMemoryInfoColumns = [
  {
    dataIndex: 'memTotal',
    title: '可用物理内存容量(KB)',
    width: '150px'
  },
  {
    dataIndex: 'memFree',
    title: '未用物理内存容量(KB)',
    width: '150px'
  },
  {
    dataIndex: 'memAvailable',
    title: '应用程序可以利用的内存(KB)',
    width: '150px'
  },
  {
    dataIndex: 'buffers',
    title: '缓冲区的内存(KB)',
    width: '150px'
  },
  {
    dataIndex: 'cached',
    title: 'cache内存(KB)',
    width: '150px'
  },
  {
    dataIndex: 'swapTotal',
    title: '可用的总交换内存(KB)',
    width: '150px'
  },
  {
    dataIndex: 'swapFree',
    title: '完全未用到的交换内存(KB)',
    width: '150px'
  },
  {
    dataIndex: 'swapCached',
    title: '交换内存cache(KB)',
    width: '150px'
  }
];

const dedicatedDetailPartitionInfoColumns = [
  {
    dataIndex: 'fileSys',
    title: '文件路径'
  },
  {
    dataIndex: 'fileType',
    title: '文件类型'
  },
  {
    dataIndex: 'partTotal',
    title: '总容量(KB)'
  },
  {
    dataIndex: 'partFree',
    title: '剩余容量(KB)'
  },
  {
    dataIndex: 'partInodeNum',
    title: 'iNode节点总数'
  },
  {
    dataIndex: 'partInodeFree',
    title: 'iNode节点剩余数'
  }
];

// 磁盘IO信息
const dedicatedDetailDiskIOInfoColumns = [
  {
    dataIndex: 'diskName',
    title: '磁盘名称',
    width: '150px'
  },
  {
    dataIndex: 'readNum',
    title: '平均读操作速率(kb/s)',
    width: '150px'
  },
  {
    dataIndex: 'writeNum',
    title: '平均写操作速率(kb/s)',
    width: '150px'
  },
  {
    dataIndex: 'kbRead',
    title: '平均每秒读字节数',
    width: '150px'
  },
  {
    dataIndex: 'kbWrtn',
    title: '平均每秒写字节数',
    width: '150px'
  }
];

const dedicatedDetailNetInterInfoColumns = [
  {
    dataIndex: 'ifIndex',
    fixed: 'left',
    title: '接口索引值'
  },
  {
    dataIndex: 'ifDescr',
    width: '150px',
    title: '接口描述'
  },
  {
    dataIndex: 'ifType',
    width: '150px',
    title: '接口类型'
  },
  {
    dataIndex: 'ifMtu',
    width: '180px',
    title: '接口最大传输单元(KB)'
  },
  {
    dataIndex: 'ifSpeed',
    width: '180px',
    title: '接口最大传输速率(kb/s)'
  },
  {
    dataIndex: 'ifIp',
    width: '150px',
    title: '接口IP地址'
  },
  {
    dataIndex: 'ifSubmask',
    width: '150px',
    title: '接口子网掩码'
  },
  {
    dataIndex: 'ifGateway',
    width: '150px',
    title: '接口网关地址'
  },
  {
    dataIndex: 'ifPhysaddr',
    width: '150px',
    title: '接口物理地址'
  },
  {
    dataIndex: 'ifAdminStatus',
    width: '150px',
    title: '接口配置状态',
    customRender: (text) => dedicatedDetailStatusMapConstant[text] || '其它'
  },
  {
    dataIndex: 'ifOperStatus',
    width: '150px',
    title: '接口运行状态',
    customRender: (text) => dedicatedDetailStatusMapConstant[text] || '其它'
  },
  {
    dataIndex: 'ifInOctets',
    width: '150px',
    title: '接口接收到字节数'
  },
  {
    dataIndex: 'ifInDiscards',
    width: '270px',
    title: '接口由于资源紧张丢弃的接收包的个数'
  },
  {
    dataIndex: 'ifInErrors',
    width: '270px',
    title: '接口由于出错导致丢弃的接收包的个数'
  },
  {
    dataIndex: 'ifOutOctets',
    width: '150px',
    title: '接口发送的字节数'
  },
  {
    dataIndex: 'ifOutDiscards',
    width: '270px',
    title: '接口由于资源紧张丢弃的发送包的个数'
  },
  {
    dataIndex: 'ifOutErrors',
    fixed: 'right',
    title: '接口由于出错导致丢弃的发送包的个数'
  }
];

const dedicatedDetailProcessInfoColumns = [
  {
    dataIndex: 'procId',
    width: '150px',
    title: '进程ID'
  },
  {
    dataIndex: 'procName',
    width: '150px',
    title: '进程名称'
  },
  {
    dataIndex: 'procPath',
    width: '150px',
    title: '进程路径'
  },
  {
    dataIndex: 'procState',
    width: '150px',
    title: '进程状态',
    customRender: (text) => {
      const map = {
        '0': '',
        '1': '',
        '2': '正常'
      };
      return map[text];
    }
  },
  {
    dataIndex: 'procCpu',
    width: '150px',
    title: '进程CPU占用率(%)'
  },
  {
    dataIndex: 'procMem',
    width: '150px',
    title: '进程内存占用率(%)'
  }
];

export {
  secretRelatedColumns,
  secretRelatedMiddleWareColumns,
  secretRelatedDatabaseColumns,
  secretRelatedSafeDatabaseColumns,
  chooseSecretRelatedColumns,
  dedicatedDetailAvailableColumns,
  dedicatedDetailStaticInfoColumns,
  dedicatedDetailPartitionInfoColumns,
  dedicatedDetailNetInterInfoColumns,
  dedicatedDetailDynamicInfoColumns,
  dedicatedDetailcpuInfoColumns,
  dedicatedDetailMemoryInfoColumns,
  dedicatedDetailDiskIOInfoColumns,
  dedicatedDetailProcessInfoColumns
};
