<template>
  <div class="pagination">
    <el-select v-model="pageSize" placeholder="" @change="sizechange">
      <el-option
        v-for="item in options"
        :key="item.size"
        size="mini"
        :label="item.label"
        :value="item.size"
      />
    </el-select>
    <button size="mini" class="btn-arrow" @click="prev"><</button>
    <span class="show-text">{{ pageCount }}</span>
    <button size="mini" class="btn-arrow" @click="next">></button>
  </div>
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    pageCount: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      pageSize: 10,
      options: [
        {
          size: 5,
          label: this.$t("pagination.five")
        },
        {
          size: 10,
          label: this.$t("pagination.ten")
        },
        {
          size: 15,
          label: this.$t("pagination.fifteen")
        },
        {
          size: 20,
          label: this.$t("pagination.twenty")
        }
      ]

    }
  },
  methods: {
    next() {
      this.$emit('next')
    },
    prev() {
      this.$emit('prev')
    },
    sizechange() {
      this.$emit('selectchange', this.pageSize)
    }
  }
}
</script>
<style scoped>
.el-select {
  width: 100px;
  height: 29px;
  line-height: 29px;
}
.show-text {
  display: inline-block;
  width: 28px;
  height: 28px;
  background: #1890ff;
  color: #fff;
  text-align: center;
  font-size: 14px;
  line-height: 28px;
  border-radius: 3px;
}
/* .el-select>>>.el-input__inner {
  height: 29px;
} */
.btn-arrow {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin: 0 5px;
  background-color: #fff;
  color: #C0C4CC;
  font-size: 14px;
  line-height: 28px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 2px;
  cursor: pointer;
}
</style>
