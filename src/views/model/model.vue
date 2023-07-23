<template>
  <div class="model-third">
    <model v-if="!!modelId" :show-btn="true" :id="+modelId" />
  </div>
</template>
<script>
import {getModelByOid} from '@/api/model/model.js';
import model from '@/components/common/render/model.vue';
export default {
  name: 'Model-Model',
  components: {
    model
  },
  data() {
    return {
      oid: null,
      modelId: null
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.oid = this.$route.params.id;
      getModelByOid(this.oid)
      .then(res => {
        if (res.code === 20000) {
          this.modelId = res.data.id;
        } else {
          this.fail();
        }
      })
      .catch(err => {
        console.log(err);
        this.fail();
      })
    } else {
      this.fail();
    }
    
  },
  methods: {
    fail() {
      this.$message({
        message: this.$t('getMesFail'),
        type: 'error',
        duration: 1500
      });
      this.$router.back(-1);
    }
  }
}
</script>
<style lang="scss" scoped>
.model-third {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>