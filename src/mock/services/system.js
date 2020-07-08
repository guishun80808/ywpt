import Mock from 'mockjs2';
import { builder, getQueryParameters } from '../util';

const deviceList = [];

const getSystemMsgList = (options) => {
  const parameters = getQueryParameters(options);
  const totalCount = 5701;
  const page = parseInt(parameters.page);
  const limit = parseInt(parameters.limit);
  const totalPage = Math.ceil(totalCount / limit);
  const key = (page - 1) * limit;
  const next = (page >= totalPage ? (totalCount % limit) : limit) + 1;

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
    limit: limit,
    page: page,
    totalCount: totalCount,
    totalPage: totalPage,
    data: deviceList
  });
};

const getJtopoList = (options) => {
  const jtopos = [];

  for (let i = 0; i < 5; i++) {
    jtopos.push({
      topologyId: i,
      topologyName: `topologyName${i}`
    });
  }
  return builder(jtopos);
};

const addJtopo = (options = {
  topologyName: '',
  topologyPicture: '',
  topologyType: '',
  zoomPercent: ''
}) => builder({
  topologyId: 15,
  topologyName: options.topologyName
});

const jtopoDetail = (options) => {
  const topologyLinkList = [];
  const topologyNodeList = [];
  for (let i = 0; i < 10; i++) {
    topologyLinkList.push({
      linkId: i,
      mapId: 0,
      startNodeId: i === 0 ? 1 : 0,
      startIndex: 0,
      startIp: '',
      startDesc: '',
      startMac: '',
      endNodeId: i,
      endIndex: i,
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
  return builder({
    topologyId: options.topologyId,
    topologyName: 'topologyName',
    topologyLinkList: topologyLinkList,
    topologyNodeList: topologyNodeList
  });
};

const jtopoAddNode = (options = {
  mapId: 0,
  nodeId: 11,
  typeId: 0,
  img: null,
  x: 200,
  y: 100,
  width: 90,
  height: 90,
  ip: null,
  alias: 'test11'
}) => {
  console.log('options', options);
  return builder(JSON.parse(options.body));
};

Mock.mock(/\/system\/list/, 'get', getSystemMsgList);
Mock.mock(/\/api\/topo\/list/, 'get', getJtopoList);
Mock.mock(/\/api\/topo\/add/, 'post', addJtopo);
Mock.mock(/\/api\/topo\/detail/, 'get', jtopoDetail);
Mock.mock(/\/api\/node\/add/, 'post', jtopoAddNode);
