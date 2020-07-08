import Mock from 'mockjs2';
import { builder, getQueryParameters } from '../util';

const deviceList = [];

const getMyDevice = (options) => {
  const parameters = getQueryParameters(options);
  console.log('parameters', parameters);
  const totalCount = 5701;
  const pageNo = parseInt(parameters.page);
  const pageSize = parseInt(parameters.limit);
  const totalPage = Math.ceil(totalCount / pageSize);
  const key = (pageNo - 1) * pageSize;
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1;

  for (let i = 0; i < next; i++) {
    const tmpKey = key + i;
    deviceList.push({
      key: tmpKey + 1,
      name: `deviceName${i}`,
      createTime: '2020.1.' + i,
      IP: `${Number.parseInt(Math.random() * 256)}.${Number.parseInt(Math.random() * 256)}.${Number.parseInt(Math.random() * 256)}.${Number.parseInt(Math.random() * 256)}`,
      updateTime: '2020.1.' + i,
      describe: i,
      department: '中科' + i,
      deviceType: i + 1,
      watchStatus: 'true',
      editable: false
    });
  }

  return {
    count: totalCount,
    data: deviceList,
    code: 0,
    message: ''
  };
};

Mock.mock(/\/myDevice\/list/, 'get', getMyDevice);
