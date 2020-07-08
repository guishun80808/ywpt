function levelConstant (text) {
  if (text === 1) {
    return '警告';
  } else if (text === 2) {
    return '错误';
  } else if (text === 3) {
    return '紧急';
  }
}
function statusConstant (text) {
  if (text === 1) {
    return '未处理';
  } else if (text === 2) {
    return '处理中';
  } else if (text === 3) {
    return '已解决';
  } else if (text === 4) {
    return '已关闭';
  }
}
function removeDuplicates (arr) {
  const result = [];
  const duplicatesIndices = [];
  arr.forEach((current, index) => {
    if (duplicatesIndices.includes(index)) return;
    result.push(current);
    for (let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {
      const comparison = arr[comparisonIndex];
      const currentKeys = Object.keys(current);
      const comparisonKeys = Object.keys(comparison);
      if (currentKeys.length !== comparisonKeys.length) continue;
      const currentKeysString = currentKeys.sort().join('').toLowerCase();
      const comparisonKeysString = comparisonKeys.sort().join('').toLowerCase();
      if (currentKeysString !== comparisonKeysString) continue;
      let valuesEqual = true;
      for (let i = 0; i < currentKeys.length; i++) {
        const key = currentKeys[i];
        if (current[key] !== comparison[key]) {
          valuesEqual = false;
          break;
        }
      }
      if (valuesEqual) duplicatesIndices.push(comparisonIndex);
    }
  });
  return result;
}
const countnumData = [
  {
    name: '>5',
    value: 5
  },
  {
    name: '>10',
    value: 10
  },
  {
    name: '>20',
    value: 20
  },
  {
    name: '>30',
    value: 30
  }
];
const statusData = [
  {
    name: '未处理',
    value: 1
  },
  {
    name: '处理中',
    value: 2
  },
  {
    name: '已解决',
    value: 3
  },
  {
    name: '已关闭',
    value: 4
  }
];
const levelData = [
  {
    name: '紧急',
    value: 3
  },
  {
    name: '错误',
    value: 2
  },
  {
    name: '警告',
    value: 1
  }
];
const timestrData = [
  {
    name: '最近 1 小时',
    value: '1h'
  },
  {
    name: '最近 4 小时',
    value: '4h'
  },
  {
    name: '最近 24 小时',
    value: '24h'
  },
  {
    name: '最近 7 天',
    value: '7d'
  },
  {
    name: '最近 15 天',
    value: '15d'
  },
  {
    name: '最近 30 天',
    value: '30d'
  }
];
const statusPageData = [
  {
    name: '未处理告警',
    value: 1
  },
  {
    name: '处理中告警',
    value: 2
  },
  {
    name: '已解决告警',
    value: 3
  },
  {
    name: '所有已关闭',
    value: 4
  }
];
const rulesColumns = [
  {
    title: '告警来源',
    dataIndex: 'typeName',
    key: 'typeName'
  },
  {
    title: '规则名称',
    dataIndex: 'content',
    key: 'content'
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    key: 'time'
  }
];
export {
  levelConstant,
  statusConstant,
  removeDuplicates,
  rulesColumns,
  countnumData,
  statusData,
  levelData,
  timestrData,
  statusPageData
};
