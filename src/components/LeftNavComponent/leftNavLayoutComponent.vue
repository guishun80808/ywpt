<template>
  <a-layout style="min-height: 100%;">
    <a-layout-sider style="min-height: 100%;">
      <slot name="left"></slot>
    </a-layout-sider>
    <a-layout-content>
      <slot name="right"></slot>
    </a-layout-content>
  </a-layout>
</template>
<script>
import { Layout } from 'ant-design-vue';
export default {
  components: {
    'a-layout': Layout,
    'a-layout-content': Layout.Content,
    'a-layout-sider': Layout.Sider
  }
};
</script>
