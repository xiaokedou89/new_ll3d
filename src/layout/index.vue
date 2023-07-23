<template>
  <div class="home">
    <NavBarBak></NavBarBak>
    <div class="home-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import NavBarBak from '@/components/layout/navBar/navBarBak.vue'
import NavBar from '@/components/layout/navBar/navBar'
export default {
	name: 'Home',
  components: {
    NavBarBak,NavBar
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
}
.home-container {
  // height: 100%;
  //height: calc(100% - 60px);
  background-color: #2D2E31;
}
//.home-container::-webkit-scollbar {
//  display: none;
//}
</style>
