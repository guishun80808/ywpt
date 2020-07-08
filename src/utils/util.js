/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, true);
  event.eventType = 'message';
  window.dispatchEvent(event);
}

export function isIE () {
  const bw = window.navigator.userAgent;
  const compare = (s) => bw.indexOf(s) >= 0;
  const ie11 = (() => 'ActiveXObject' in window)();
  return compare('MSIE') || ie11;
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return;
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id));
  }, timeout);
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime (t, cFormat) {
  let time = t;
  if (!arguments.length) {
    return null;
  }
  if (!time) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time);
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value]; }
    if (result.length && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return timeStr;
}
export function objectToArr (obj) {
  if (!obj) {
    return;
  }
  const arr = [];
  for (const key in obj) {
    arr.push({
      [key]: obj[key]
    });
  }
  return arr;
}

export function createObjectURL (object) {
  return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

export function downFile (filename, blob) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const a = document.createElement('a');
    const url = createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

export function dataToTree (data, type, callBack, currentRow) {
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item, i) {
    item.title = item.name;
    item.key = item.orgid;
    item.scopedSlots = { title: 'title' };
    delete item.children;
  });

  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  const map = {};
  data.forEach(function (item) {
    map[item.orgid] = item;
  });
  const val = [];
  data.forEach(function (item) {
    if (item.role !== 'auditadmin' && item.role !== 'secadmin' && item.role !== 'sysadmin') {
      // 以当前遍历项，的pid,去map对象中找到索引的id
      const parent = map[item.parentid];
      // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {
        ;(parent.children || (parent.children = [])).push(item);
      } else {
        // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        val.push(item);
      }
    }
  });
  if (val.length === 0) {
    // this.$message.warning('暂无数据')
    return;
  }
  if (type !== 1) {
    callBack([currentRow.orgid]);
  }
  return val;
}

export function familyTree (arr, pid) {
  const temp = [];
  const forFn = function (arr, pid) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (item.orgid === pid) {
        temp.push(item);
        forFn(arr, item.parentid);
      }
    }
  };
  forFn(arr, pid);
  temp.reverse();
  return temp;
}
