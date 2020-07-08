import { Modal, Button } from 'ant-design-vue';
import { initDefaultProps, mergeProps, getComponentFromProp } from 'ant-design-vue/es/_util/props-util';

Modal.props = initDefaultProps(
  Modal.props,
  {
    centered: true,
    okText: '保存'
  }
);
Modal.methods.renderFooter = function (locale) {
  const h = this.$createElement;
  const okType = this.okType;
  const confirmLoading = this.confirmLoading;

  const cancelBtnProps = mergeProps({ on: { click: this.handleCancel } }, this.cancelButtonProps || {});
  const okBtnProps = mergeProps({
    on: { click: this.handleOk },
    props: {
      type: okType,
      loading: confirmLoading
    }
  }, this.okButtonProps || {});
  return h('div', [
    h(
      Button,
      okBtnProps,
      [getComponentFromProp(this, 'okText') || locale.okText]
    ), h(
      Button,
      cancelBtnProps,
      [getComponentFromProp(this, 'cancelText') || locale.cancelText]
    )
  ]);
};
export default {
  ...Modal
};
