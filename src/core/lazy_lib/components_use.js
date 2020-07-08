
/* eslint-disable */
/**
 * 该文件是为了按需加载，剔除掉了一些不需要的框架组件。
 * 减少了编译支持库包大小
 *
 * 当需要更多组件依赖时，在该文件加入即可
 */
import Vue from 'vue'
import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Card,
  Row,
  Col,
  Table,
  Tabs,
  Icon,
  Dropdown,
  List,
  Menu,
  Tooltip,
  Divider,
  DatePicker,
  Upload,
  Progress,
  message,
  Cascader
} from 'ant-design-vue'
import { STable, ModalComponent, PageLoading } from '@/components'

Vue.use(Form)
Vue.use(Input)
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Dropdown)
Vue.use(List)
Vue.use(Menu)
Vue.use(Tooltip)
Vue.use(Divider)
Vue.use(DatePicker)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Cascader)
Vue.use(PageLoading)
Vue.component('s-table', STable)
Vue.component('a-modal', ModalComponent)

message.config({
  duration: 2,
  maxCount: 1,
});
Vue.prototype.$confirm = ModalComponent.confirm
Vue.prototype.$message = message
Vue.prototype.$info = ModalComponent.info
Vue.prototype.$success = ModalComponent.success
Vue.prototype.$error = ModalComponent.error
Vue.prototype.$warning = ModalComponent.warning