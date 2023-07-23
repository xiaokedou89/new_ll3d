<template>
  <div id="app" tabindex="-1">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
import {AmmoHelper} from '@/render/ammo/AmmoHelper'; 
export default {
  name: 'App',
  provide() {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true                    //控制视图是否显示的变量
    }
  },
  created() {
  // 初始化Ammo对象
    AmmoHelper.Init()
    // this.$store.dispatch('getAppConfig')
  },
  methods: {
    reload() {
      this.isRouterAlive = false;            //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true;         //再打开
      })
    }
  }
}
</script>

<style>

</style>
