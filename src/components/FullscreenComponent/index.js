export default {
  data () {
    return {
      eleStyFullScreen: {
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        position: 'fixed'
      },
      localFullScreen: this.fullScreen
    };
  },
  props: {
    fullScreen: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    fullScreen: function (val, oldVal) {
      this.localFullScreen = val;
      const { $refs: { ele } } = this;
      if (val) {
        ele.requestFullscreen();
      } else {
        document.fullscreenElement && document.exitFullscreen();
      }
    },
    localFullScreen: function (val) {
      this.$emit('on-full-screen-change', val);
    }
  },
  created () {
    // 监听全屏事件
    document.onfullscreenchange = (event) => {
      const isFullscreen = document.fullscreenElement === this.$refs.ele;
      this.localFullScreen = isFullscreen;
    };
  },
  render () {
    return (
      <div
        {
        ...this.$props
        }
        ref="ele"
        style={this.localFullScreen ? this.eleStyFullScreen : null}
      >
        {this.$slots.default}
      </div>
    );
  }
};
