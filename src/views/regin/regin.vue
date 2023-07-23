<template>
  <div class="regin">
    <nav-bar :info="false" />
    <dialoger :visible="showDia" :title="$t('regin')" :mask="false" :closable="false">
      <template v-slot:footer>
        <div class="regin-footer">
          <p>
            {{ $t('reginFooterTxt') }}
            <a @click="linkToLogin">{{ $t('login') }}</a>
          </p>
        </div>
      </template>
    </dialoger>
  </div>
</template>
<script>
import navBar from '@/components/layout/navBar/navBar.vue';
import dialoger from '@/components/common/dialoger/dialoger.vue';
export default {
  name: 'regin',
  components: {
    navBar,
    dialoger
  },
  data() {
    return {
      showDia: true
    }
  },
  methods: {
    linkToLogin() {
      this.$router.push('/login');
    }
  }
}
</script>
<style lang="scss" scoped>
// 底部
.regin-footer {
  text-align: center;
  a {
    color: var(--color--main);
    // color: $main;
  }
  a:hover {
    color: var(--color--adaptborder);
  }
}
</style>