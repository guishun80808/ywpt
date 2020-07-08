<template>
  <a-row style="width: 1200px;margin-left: 20px;">
    <a v-for="(obj, index) in menus" @click="switchRoute($event,obj)" class="menu-link" :key="index">
      <span class="item">
        <img :src="obj.meta.icon" @click="switchRoute($event, obj)" style="width:60px;height:62px;">
        <p class="pro-text">
          <span @click="switchRoute($event, obj)">
            {{obj.name}}
          </span>
          <span @click="switchRoute($event, obj)" class="pro-de">
            {{obj.meta.title}}
          </span>
        </p>
      </span>
    </a>
  </a-row>
</template>
<script>
import { USER_INFO } from '@/store/mutation-types';
export default {
  name: 'Home',
  computed: {
    menus () {
      const menus = [];
      const user = this.$ss.get(USER_INFO);
      const { addRouters } = this.$store.getters;
      if (!user) {
        return menus;
      }
      addRouters.forEach(element => {
        if (element.meta && element.meta.permission && element.meta.permission.includes(user.role) && !element.hidden) {
          menus.push(element);
        }
      });
      return menus;
    }
  },
  methods: {
    switchRoute (e, route) {
      e.stopPropagation();
      if (!this.$route.name.startsWith(route.name)) {
        this.$router.push(route);
      }
      this.$emit('click', e);
    }
  }
};
</script>
<style scoped>
  .menu-link{
    margin-top: 20px;
    float: left;
    height: 90px;
    width: 240px;
  }
  .item{
    display:flex;
  }
  .pro-text {
    font-size: 22px;
    color: #fff;
    flex-direction: column;
    display: flex;
    padding-left: 10px;
  }
  .pro-de {
      font-size: 14px;
      color: #5ca8e5;
  }
</style>
