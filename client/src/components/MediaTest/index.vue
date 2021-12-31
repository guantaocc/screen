<template>
  <div class="box-block">
    <div id="box1"></div>
    <div id="box2"></div>
  </div>
</template>

<script>
export default {
  name: 'MediaTest'
}
</script>

<style lang="scss" scoped>
#box1 {
  @media screen and (min-width: 1400px) {
    display: inline-block;
    width: 50%;
    height: 300px;
    font-size: 16px;
  }
  @media screen and (min-width: 375px) and (max-width: 1400px) {
    width: 100%;
    height: 150px;
    font-size: 14px;
  }
  box-sizing: border-box;
  background-color: coral;
  color: white;
  padding: 10px;
}
#box2 {
  @media screen and (min-width: 1400px) {
    display: inline-block;
    width: 50%;
    height: 300px;
    font-size: 16px;
  }
  @media screen and (min-width: 375px) and (max-width: 1400px) {
    width: 100%;
    height: 150px;
    font-size: 14px;
  }
  box-sizing: border-box;
  background-color: mediumpurple;
  color: white;
  padding: 10px;
}
</style>>