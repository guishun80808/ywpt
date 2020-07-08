import Mock from 'mockjs2';
import { builder } from '../util';
const myData = () => builder({
  'data': [
    { ID: '1', type: '专用服务器', name: 'server01', changeNu: '3', queryNu: '4' },
    { ID: '2', type: '专用服务器', name: 'server01', changeNu: '3', queryNu: '4' },
    { ID: '3', type: '专用服务器', name: 'server01', changeNu: '3', queryNu: '4' },
    { ID: '4', type: '专用服务器', name: 'server01', changeNu: '3', queryNu: '4' },
    { ID: '5', type: '专用服务器', name: 'server01', changeNu: '3', queryNu: '4' },
    { ID: '6', type: '专用服务器', name: 'server01', changeNu: '3', queryNu: '4' },
    { ID: '7', type: '专用服务器', name: 'server01', changeNu: '3', queryNu: '4' },
    { ID: '8', type: '专用服务器', name: 'server01', changeNu: '3', queryNu: '4' },
    { ID: '9', type: '专用服务器', name: 'server01', changeNu: '3', queryNu: '4' }
  ],
  'pageSize': 10,
  'pageNo': 0,
  'totalPage': 6,
  'totalCount': 57
});
Mock.mock(/\/myData\/list/, 'get', myData);

const myData1 = () => builder({
  'data': [
    { ID: '1', chType: '专用服务器', name: 'server01', ip: '3', queryNu: '4' },
    { ID: '2', chType: '专用服务器', name: 'server01', ip: '3', queryNu: '4' },
    { ID: '3', chType: '专用服务器', name: 'server01', ip: '3', queryNu: '4' },
    { ID: '4', chType: '专用服务器', name: 'server01', ip: '3', queryNu: '4' },
    { ID: '5', chType: '专用服务器', name: 'server01', ip: '3', queryNu: '4' },
    { ID: '6', chType: '专用服务器', name: 'server01', ip: '3', queryNu: '4' },
    { ID: '7', chType: '专用服务器', name: 'server01', ip: '3', queryNu: '4' },
    { ID: '8', chType: '专用服务器', name: 'server01', ip: '3', queryNu: '4' },
    { ID: '9', chType: '专用服务器', name: 'server01', ip: '3', queryNu: '4' }
  ],
  'pageSize': 10,
  'pageNo': 0,
  'totalPage': 6,
  'totalCount': 57
});
Mock.mock(/\/myData\/list/, 'get', myData);
Mock.mock(/\/myData1\/list/, 'get', myData1);
