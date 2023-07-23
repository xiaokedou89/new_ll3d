<template>
  <div class="hot-div">
  </div>
</template>
<script>
export default {
  name: 'hotDiv'
}
</script>
<style lang="scss" scoped>
.hot-div {
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  // background-color: rgba(103, 2, 2, .765);
  background-color: rgba(103, 2, 2);
  cursor: pointer;
  position: absolute;
  z-index: 999999;
  transition: border-radius .25s linear;
  &::before {
    display: block;
    content: "";
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #fff;
    animation: scale 1.5s linear infinite;
  }
  &::after {
    display: none;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    content: "哈哈哈";
    position: absolute;
    white-space: nowrap;
    height: 25px;
    padding-right: 10px;
    line-height: 25px;
    background-color: rgba(103, 2, 2);
    right: 0;
    top: 0;
    transform: translateX(100%);
    transition: display .25s linear;
    z-index: -1;
  }
}
.hot-div:hover {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  &::after {
    display: inline-block;
    transition: display .25s linear;
  }
}
@keyframes scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>