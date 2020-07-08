import Mock from 'mockjs2';
import { builder, getQueryParameters } from '../util';

const deviceList = [];

const getDeviceList = (options) => {
  const parameters = getQueryParameters(options);
  const totalCount = 5701;
  const pageNo = parseInt(parameters.pageNo);
  const pageSize = parseInt(parameters.pageSize);
  const totalPage = Math.ceil(totalCount / pageSize);
  const key = (pageNo - 1) * pageSize;
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1;

  for (let i = 0; i < next; i++) {
    const tmpKey = key + i;
    deviceList.push({
      key: tmpKey,
      ip: `${Number.parseInt(Math.random() * 256)}.${Number.parseInt(Math.random() * 256)}.${Number.parseInt(Math.random() * 256)}.${Number.parseInt(Math.random() * 256)}`,
      name: `name${i}`,
      chType: '专用服务器',
      subChType: '中科方德专用服务器',
      cpuRate: i,
      pingRate: i,
      memFreeRate: i,
      virtualMemory: i,
      swapFreeRate: i,
      netNum: i,
      ifAlarm: 1
    });
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: deviceList
  });
};

const dedicatedDeatil = (options) => builder(obj);

const getJtopoList = (options) => {
  const jtopos = [];

  jtopos.push({
    topologyId: 0,
    topologyName: 'topologyName0',
    topologyLevel: 1
  });
  return builder(jtopos);
};

const addJtopo = (options) => builder({
  topologyId: 15,
  topologyName: '子拓扑15',
  topologyLevel: 2
});

const jtopoDetail = (options) => {
  console.log(options);
  const topologyLinkList = [];
  const topologyNodeList = [];
  for (let i = 0; i < 14; i++) {
    topologyNodeList.push({
      nodeId: i,
      mapId: 0,
      typeId: 1,
      img: null,
      x: i * 50 + Math.random() * 300,
      y: i * 50,
      width: 90,
      height: 90,
      ip: null,
      alias: `alias${i}`,
      relMap: 0,
      col1: null,
      col2: null,
      insertTime: new Date()
    });
  }
  topologyLinkList.push({
    linkId: 2,
    mapId: 0,
    startNodeId: 0,
    startIndex: 0,
    startIp: '',
    startDesc: '',
    startMac: '',
    endNodeId: 1,
    endIndex: 1,
    endIp: '',
    endDesc: '',
    endMac: '',
    linkType: '',
    linkName: '',
    linkDash: false,
    linkWidth: 3,
    linkOffset: 0,
    col1: null,
    col2: null,
    insertTime: new Date()
  });
  return builder({
    topologyId: options.topologyId,
    topologyName: 'topologyName',
    topologyLinkList: topologyLinkList,
    topologyNodeList: topologyNodeList
  });
};

const jtopoAddNode = (options) => {
  console.log('options', options);
  return builder(JSON.parse(options.body));
};

const jtopoAddLink = (options) => builder({
  isSuccess: true
});

const jtopoDeleteNode = (options) => builder({
  isSuccess: true
});

Mock.mock(/\/api\/equipment\/list/, 'get', getDeviceList);
Mock.mock(/\/api\/topo\/list/, 'get', getJtopoList);
Mock.mock(/\/api\/topo\/add/, 'post', addJtopo);
Mock.mock(/\/api\/topo\/detail/, 'get', jtopoDetail);
Mock.mock(/\/api\/node\/add/, 'post', jtopoAddNode);
Mock.mock(/\/api\/link\/add/, 'post', jtopoAddLink);
Mock.mock(/\/api\/node\/delete/, 'post', jtopoDeleteNode);
