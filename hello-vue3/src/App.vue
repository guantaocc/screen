<template>
  <!-- <CountDown :time="3000" v-slot="{ text }">
    slot default {{ text }}
    <Row />
  </CountDown> -->
  <div>
    <Carousel :loop="true" :initial-index="0" type="card">
      <CarouselItem v-for="item in 5" :key="item">
        <h3>{{ item }}</h3>
      </CarouselItem>
    </Carousel>
  </div>
</template>

<script>
import CountDown from "./components/CountDown.vue"
import Carousel from './components/carousel/carousel.vue'
import CarouselItem from './components/carousel/carousel-item.vue'
import Row from "./components/row"

export default {
  components: {
    CountDown,
    Row,
    Carousel,
    CarouselItem
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>