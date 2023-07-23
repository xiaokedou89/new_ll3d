<template>
  <div id="ARScene"></div>
</template>

<script>
import * as renderer from '@/render/webar/render';
import {getOne} from "@/api/model/model";
import {storeGetModel} from "@/utils/global";

export default {
  name: "ARScene",
  data() {
    return {
      id:'',
      modelOrigin:'',
      path:{
        texture:'',
        objModel:'',
        imageRecognition:''
      }
    }
  },
  mounted() {
    this.initModel()

  },
  methods:{
    // 释放之前选择文件的blob
    revokeBlob(blob) {
      if (blob) {
        window.URL.revokeObjectURL(blob);
      }
    },
    initModel() {
      if (this.$route.query && typeof this.$route.query.id != null) {
        this.id = this.$route.query.id
        getOne(this.id).then(res => {
          if (res.data.texture != null) {
            this.path.texture = storeGetModel + "/" + JSON.parse(res.data.texture)[0].new
          }
          this.path.imageRecognition=
          this.getModel(res.data.model)
              .then(res => {
                this.path.path = res;
                this.revokeBlob(this.modelOrigin);
                renderer.init(this.path)
              })
        })
      }
    },
    charCode(str) {
      return Array.from(str).map((item) => {
        return String.fromCharCode(item.charCodeAt(0) ^ 49)
      }).join('')
    },
    async getModel(modelName) {
      const that = this;
      return await new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('get', `${storeGetModel}/${modelName}`);
        xhr.send();
        xhr.onreadystatechange = function (e) {
          if (this.readyState === 4 && this.status === 200) {
            that.modelOrigin = this.response;
            that.modelOrigin = that.charCode(that.modelOrigin);
            that.modelOrigin = new Blob([that.modelOrigin]);
            // add
            // let modelBlob = new Blob([that.modelOrigin]);
            // let url = window.URL.createObjectURL(new Blob([that.modelOrigin]));
            let url = window.URL.createObjectURL(that.modelOrigin);
            resolve(url);
          } else if (this.status !== 200) {
            that.$message({
              message: '获取模型数据失败',
              type: 'error',
              duration: 1500
            });
            reject(null);
          }
        };
      });
    },
  }
}
</script>

<style>

</style>
