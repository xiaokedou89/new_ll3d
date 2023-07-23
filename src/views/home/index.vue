<template>
  <div class="home">
    <nav-bar></nav-bar>
    <router-view :key="$route.fullPath"></router-view>
    <foot></foot>
  </div>
</template>
<script>
import navBar from '@/components/layout/navBar/navBar.vue';
import foot from '@/components/layout/foot/foot.vue';
export default {
	name: 'Home',
  components: {
    navBar,
    foot
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  width: 100%;
}
.home-container {
  // height: 100%;
  height: calc(100% - 60px);
}
.home-container::-webkit-scollbar {
  display: none;
}
</style>