<template>
  <div class="model-detail">
    <model :show-btn="true" :key="+modelId" :id="+modelId" />
  </div>
</template>
<script>
import model from '@/components/common/render/model.vue';
export default {
  name: 'ModelDetail',
  components: {
    model
  },
  data() {
    return {
      modelId: null
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      this.modelId = this.$route.query.id;
    }
  }
}
</script>
<style lang="scss" scoped>
.model-detail {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>