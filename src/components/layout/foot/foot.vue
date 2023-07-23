<template>
  <div class="container container-padding">
    <!-- 内框 -->
    <div class="footer">
      <!-- 头部链接部分 -->
      <div class="footer-link">
        <ul class="list-inline" v-if="info && news.length > 0">
          <li v-for="(item, index) in news" :key="index" @click="newClick(item)"><a>{{ item.name }}</a></li>
        </ul>
      </div>
      <!-- 边框下主体部分 -->
      <div class="navigation">
        <!-- 公司名称 -->
        <p class="nav-ul1">{{ $t('footer.companyName') }}</p>
        <!-- qq联系部分 -->
        <p class="nav-ul2">
          {{ $t('footer.business') }}&nbsp; 
          <a target="_self" :href="QQhref">
            <img class="QQ" :src="QQimg" :alt="$t('footer.sendMessage')" :title="$t('footer.sendMessage')" />
          </a>
          {{ $t('footer.communication') }}&nbsp;
          <a target="_self" :href="COMhref">
            <img :src="COMimg" :alt="$t('footer.3DModel')" :title="$t('footer.3DModel')">
          </a>
        </p>
        <p class="nav-ul">
          <br />
          {{ $t('footer.companyPhone') }}
          <br />
          {{ $t('footer.companyAddress') }}
          <br />
          <a target="_blank" :href="recordHref">{{ $t('footer.interRecord') }}</a>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import {footerQQimg, footerQQHref, footerCOMimg, footerCOMHref, interRecordHref} from '@/utils/global.js'
import { getAllInfo } from '@/api/news/news.js';
export default {
  name: 'foot',
  props: {
    info: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      news: [],
      QQimg: footerQQimg,
      QQhref: footerQQHref,
      COMimg: footerCOMimg,
      COMhref: footerCOMHref,
      recordHref: interRecordHref
    }
  },
  created() {
    this.initNew()
  },
  methods: {
    initNew() {
      getAllInfo()
        .then(res => {
          if (res.code === 20000) {
            this.news = res.data;
          }
        })
    },
    newClick(item) {
      this.$router.push({
        path: '/home/info',
        query: {
          id: item.id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variable.scss';
.nav-ul,
.nav-ul1, 
.nav-ul2, 
.nav-ul3 {
  color: $color-fontFooter;
  font-size: 1em;
}
.nav-ul1 {
  font-size: 1.2em;
  font-weight: bold;
  letter-spacing: 0.1em;
}


.footer {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  align-items: center;
  // 头部链接部分
  .footer-link {
    width: 100%;
    border-bottom: 1px solid $color-footerBorder;
    margin-top: 15px;
    // 里面的ul
    .list-inline {
      margin-bottom: 10px;
      li {
        display: inline-block;
        padding: 0 5px;
        a {
          color: $color-fontFooter;
        }
        a:hover {
          color: $color-main;
        }
      }
    }
  }
  // 下边的主体
  .navigation {
    margin-top: 15px;
    p {
      margin: 0 0 10px;
      .QQ {
        border: 0;
        width: 65px;
      }
      a {
        color: $color-fontFooter;
      }
      a:hover {
        color: $color-main;
      }
    }
  }
}
</style>