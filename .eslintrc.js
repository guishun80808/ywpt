module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/base',
    '@vue/standard'
  ],
  'rules': {
    "semi": ["error", "always"], // 要求使用分号
    "quotes": ["error", "single"], // 强制使用一致的单引号
    /** 自定义规则start */
    'no-empty': ['error'], // 禁止出现空语句块
    'no-extra-parens': ['error'], // 禁止不必要的括号
    // 'no-extra-semi': ['error'], // 禁止不必要的分号
    'no-sparse-arrays': ['error'], // 禁用稀疏数组
    'no-unreachable': ['error'], // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码

    // 'array-callback-return': ['error'], // 强制数组方法的回调函数中有 return 语句
    // 'class-methods-use-this': ['error'], // 强制类方法使用 this
    'eqeqeq': ['error'], // 要求使用 === 和 !==
    'no-alert': ['error'], // 禁用 alert、confirm 和 prompt
    'no-caller': ['error'], // 禁用 arguments.caller 或 arguments.callee
    // 'no-empty-function': ['error'], // 禁止出现空函数
    'no-empty-pattern': ['error'], // 禁止使用空解构模式
    'no-multi-spaces': ['error'], // 禁止使用多个空格
    'no-multi-str': ['error'], // 禁止使用多行字符串
    // 'no-unused-vars': ['error'], // 禁止出现未使用过的变量
    'no-use-before-define': ['error', { "functions": false, "classes": false, 'variables': false }], // 禁止在变量定义之前使用它们

    // 'array-bracket-newline': ['error'], // 在数组开括号后和闭括号前强制换行
    'func-call-spacing':  ['error', 'never'], // 禁止在函数标识符和其调用之间有空格
    'indent':  ['error'], // 强制使用一致的缩进
    'keyword-spacing':  ['error'], // 强制在关键字前后使用一致的空格
    'no-mixed-spaces-and-tabs':  ['error'], // 禁止空格和 tab 的混合缩进
    'no-multiple-empty-lines':  ['error', {'max': 2}], // 禁止出现多行空行

    /*** ES6 */
    // 'arrow-body-style':  ['error'], // 要求箭头函数体使用大括号
    // 'arrow-parens':  ['error'], // 要求箭头函数的参数使用圆括号
    'no-const-assign':  ['error'], // 禁止修改 const 声明的变量
    'no-var':  ['error'], // 要求使用 let 或 const 而不是 var
    'prefer-const': ['error'], // 要求使用 const 声明那些声明后不再被修改的变量

    'no-eq-null': ['error'], // 禁止在没有类型检查操作符的情况下与 null 进行比较
    'no-eval': ['error'], // 禁用 eval()
    'no-extend-native': ['error'], // 禁止扩展原生类型
    'no-lone-blocks': ['error'], // 禁用不必要的嵌套块
    // 'no-magic-numbers': ['error'], // 禁用魔术数字
    'no-new-func': ['error'], // 禁止对 Function 对象使用 new 操作符
    'no-new-wrappers': ['error'], // 禁止对 String，Number 和 Boolean 使用 new 操作符
    // 'no-param-reassign': ['error'], // 禁止对 function 的参数进行重新赋值
    'no-return-assign': ['error', "always"], // 禁止在 return 语句中使用赋值语句
    'no-useless-catch': ['error'], // 禁止不必要的 catch 子句
    'no-with': ['error'], // 禁用 with 语句
    'require-await': ['error'], // 禁止使用不带 await 表达式的 async 函数

    // 'max-len': ['error', {'code': 120}], // 强制行的最大长度
    // 'max-lines': ['error', {'max': 500, 'skipBlankLines': true, 'skipComments': true}], // 强制文件的最大行数
    // 'max-lines-per-function': ['error', {'max': 80, 'skipBlankLines': true, 'skipComments': true}], // 强制函数最大代码行数
    'max-params': ['error', {'max': 4}], // 强制函数定义中最多允许的参数数量
    'new-cap': ['error'], // 要求构造函数首字母大写
    'no-nested-ternary': ['off'], // 禁用嵌套的三元表达式
    'no-new-object': ['error'], // 禁用 Object 的构造函数
    'no-trailing-spaces': ['error'], // 禁用行尾空格
    "no-mixed-operators": ["off"], // 禁止混合使用不同的操作符

    /**Vue相关配置 */
    'vue/max-attributes-per-line': [
      2,
      {
        'singleline': 5,
        'multiline': {
          'max': 1,
          'allowFirstLine': false
        }
      }
    ],
    'vue/attribute-hyphenation': 0,
    'vue/html-self-closing': 0,
    'vue/component-name-in-template-casing': 0,
    'vue/html-closing-bracket-spacing': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/no-unused-components': 0,
    'vue/multiline-html-element-content-newline': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/no-parsing-error': 0

  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
