<template>
  <div class="recommend" v-if="show && flag">
    <!-- 乐乐三维云标题介绍 -->
    <div class="recommend-container title">
      <h1>{{ $t('llCloud') }}</h1>
      <p>{{ $t('llCloudIntro') }}</p>
    </div>
    <!-- 图片推荐 -->
    <div class="recommend-container content">
      <ul class="recommend-content">
        <li v-for="(item, index) in list" :key="index">
          <a class="recommend-item" @click="link(item)">
            <img class="recommend-img" v-if="item.thumb" :src="getImg(item.thumb)" />
            <span class="recommend-label" v-if="item.name">{{ item.name }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getRecommend } from '@/api/news/news.js';
import {filePrefix, image, recommendParamsObj} from '@/utils/global.js';
export default {
  name: 'recommend',
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: [],
      flag: true
    }
  },
  created() {
    this.init();
  },
  computed: {
    getImg() {
      return function (src) {
        return filePrefix + image + src
      }
    }
  },
  methods: {
    init() {
      getRecommend('model', {
        recommend: recommendParamsObj.recommend,
        status: recommendParamsObj.status,
        parentId: recommendParamsObj.parentId,
        pkId: 0,
        size: 8
      })
      .then(res => {
        if (res.code === 20000) {
          this.list = res.data;
        } else {
          this.list = [];
          this.flag = false;
        }
      })
      .catch(err => {
        this.list = [];
        this.flag = false;
      })
    },
    link(item) {
      this.$router.push({
        path: '/home/modelList',
        query: {
          categoryId: item.id
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
// 公共容器
.recommend-container {
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  text-align: center;
}
// 乐乐三维云标题及介绍
.title {
  background-color: var(--color--navbg);
  padding: 30px 0;
  color: var(--color--fontMain);
  h1 {
    font-size: 30px;
    margin: 20px 0 10px 0;
    font-weight: 500;
  }
  p {
    letter-spacing: 2px;
    margin-bottom: 10px;
    font-size: 14px;
  }
}

.recommend-content {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  li {
    box-sizing: border-box;
    .recommend-item {
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: 0;
      padding-top: 62.5%;
      background: url('~@/assets/first/background.jpg') no-repeat center center/cover;
      // border: 1px solid red;
      position: relative;
      &::before {
        background: rgba(0, 0, 0, 0.4) none repeat scroll 0 0;
        content: "";
        display: block;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        z-index: 1;
        transition: background 0.2 ease 0s;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.0);
      }
      &:hover::before {
        background: rgba(0, 0, 0, 0.0) none repeat scroll 0 0;
      } 
      .recommend-img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .recommend-label {
        background: rgba(0, 0, 0, 0.4) none repeat scroll 0 0;
        border: 1px solid #fff;
        border-radius: 16px;
        font-weight: 300;
        left: 50%;
        padding: 2px 10px;
        position: absolute;
        text-transform: uppercase;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: background 0.2s ease 0s;
        color: #fff;
        font-size: 16px;
      }
    }
  }
}
@media (min-width: 1100px) {
  .recommend-content li {
    width: 25%;
  }
}
@media (min-width: 415px) and (max-width: 1099px) {
  .recommend-content li {
    width: 50%;
  }
}
@media (max-width: 414px) {
  .recommend-content li {
    width: 100%;
  }
}
</style>