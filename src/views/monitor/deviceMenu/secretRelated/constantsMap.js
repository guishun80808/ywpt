const dedicatedDetailTabsConstant = {
  availableList: '服务器可用性',
  staticInfoList: '静态信息',
  dynamicInfoList: '动态信息',
  cpuInfoList: '处理器信息',
  memoryInfoList: '内存信息',
  partitionInfoList: '文件系统挂载信息',
  diskIOInfoList: '磁盘IO信息',
  netInterInfoList: '网络接口信息',
  processInfoList: '进程信息'
};

const dedicatedDetailStatusMapConstant = {
  '1': '启用',
  '2': '禁用'
};

const secretRelatedKeyMap = {
  name: '设备名称',
  chType: '设备类型',
  ip: '设备IP',
  pingRate: '连通率(%)',
  cpuRate: 'CPU(%)',
  memFreeRate: '物理内存(%)',
  swapFreeRate: '虚拟内存(%)',
  netNum: '接口数'
};

const dedicatedDetailAvailableKeyMap = {
  pingRate: '服务器可达率',
  responseTime: '服务器响应时间'
};

const dedicatedDetailStaticInfoKeyMap = {
  'uniqueIdent': '唯一标识',
  'productName': '专用服务器名称',
  'productModel': '专用服务器型号',
  'manufacturer': '专用服务器制造商',
  'cpuInfo': '处理器信息',
  'diskSn': '硬盘序列号',
  'biosVersion': 'bios版本描述',
  'sysName': '操作系统名称',
  'sysArch': '处理器架构',
  'sysBits': '处理器位数',
  'sysVersion': '操作系统版本',
  'coreVersion': '内核版本',
  'netNum': '业务网口数量',
  'cpuNum': 'CPU数量',
  'socVersion': 'SOC卡版本',
  'ioVersion': '三合一版本'
};

const dedicatedDetailDynamicInfoKeyMap = {
  sysInstallTime: '操作系统安装时间',
  sysUptime: '操作系统开机时间'
};

const dedicatedDetailcpuInfoKeyMap = {
  cpuName: '处理器名称',
  cpuCores: '处理器超线程核数',
  cpuFreq: '处理器频率',
  cpuRate: '处理器实时使用率'
};

const dedicatedDetailMemoryInfoKeyMap = {
  'memTotal': '可用物理内存容量',
  'memFree': '未用物理内存容量',
  'memAvailable': '应用程序可以利用的内存',
  'buffers': '缓冲区的内存',
  'cached': 'cache内存',
  'swapTotal': '可用的总交换内存',
  'swapFree': '完全未用到的交换内存',
  'swapCached': '交换内存cache'
};

const dedicatedDetailPartitionInfoKeyMap = {
  'fileSys': '文件路径',
  'fileType': '文件类型',
  'partTotal': '总容量',
  'partFree': '剩余容量',
  'partInodeNum': 'iNode节点总数',
  'partInodeFree': 'iNode节点剩余数'
};

const dedicatedDetailDiskIOInfoKeyMap = {
  'diskName': '磁盘名称',
  'readNum': '平均读操作速率',
  'writeNum': '平均写操作速率',
  'kbRead': '平均每秒读字节数',
  'kbWrtn': '平均每秒写字节数'
};

const dedicatedDetailNetInterInfoKeyMap = {
  'ifIndex': '接口索引值',
  'ifDescr': '接口描述',
  'ifType': '接口类型',
  'ifMtu': '接口最大传输单元',
  'ifSpeed': '接口最大传输速率',
  'ifIp': '接口IP地址',
  'ifSubmask': '接口子网掩码',
  'ifGateway': '接口网关地址',
  'ifPhysaddr': '接口物理地址',
  'ifAdminStatus': '接口配置状态',
  'ifOperStatus': '接口运行状态',
  'ifInOctets': '接口接收到字节数',
  'ifInDiscards': '接口由于资源紧张丢弃的接收包的个数',
  'ifInErrors': '接口由于出错导致丢弃的接收包的个数',
  'ifOutOctets': '接口发送的字节数',
  'ifOutDiscards': '接口由于资源紧张丢弃的发送包的个数',
  'ifOutErrors': '接口由于出错导致丢弃的发送包的个数'
};

const dedicatedDetailProcessInfoKeyMap = {
  'procId': '进程ID',
  'procName': '进程名称',
  'procPath': '进程路径',
  'procState': '进程状态',
  'procCpu': '进程CPU占用率',
  'procMem': '进程内存占用率'
};

export {
  dedicatedDetailTabsConstant,
  dedicatedDetailStatusMapConstant,
  secretRelatedKeyMap,
  dedicatedDetailAvailableKeyMap,
  dedicatedDetailStaticInfoKeyMap,
  dedicatedDetailDynamicInfoKeyMap,
  dedicatedDetailcpuInfoKeyMap,
  dedicatedDetailMemoryInfoKeyMap,
  dedicatedDetailPartitionInfoKeyMap,
  dedicatedDetailDiskIOInfoKeyMap,
  dedicatedDetailNetInterInfoKeyMap,
  dedicatedDetailProcessInfoKeyMap
};
