<template>
  <div ref="root" style="width:925px;height:200px;overflow:hidden;">
    <div class="el_carousel__container">
      <!-- 按钮 -->
      <div class="button__container">
        <span class="arrow-left" @click="prev">按钮上</span>
        <span class="arrow-right" @click="next">按钮下</span>
      </div>
      <!-- slot items -->
      <slot></slot>
      <!-- 指示器 -->
      <ul class="indicator__container"></ul>
    </div>
  </div>
</template>

<script>
import CarouselItem from './carousel-item.vue'
import { reactive, toRefs, ref, provide, watch, onMounted, onBeforeUnmount } from 'vue'
// components props emits setup 
// setup中 ref/reactive computed function/useFunc watch/watchEffect provide/inject return/render
export default {
  name: 'Carousel',
  components: {
    CarouselItem
  },
  props: {
    initialIndex: {
      type: Number,
      default: 0,
    },
    loop: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: ''
    },
    interval: {
      type: Number,
      default: 3000
    },
    autoplay: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const data = reactive({
      activeIndex: -1,
      containerWidth: 0,
      timer: null,
      hover: false,
    })
    const root = ref(null)
    const items = ref([])

    function addItem(item) {
      items.value.push(item)
    }

    const playSlides = () => {
      if (data.activeIndex < items.value.length - 1) {
        data.activeIndex = data.activeIndex + 1
      } else if (props.loop) {
        data.activeIndex = 0
      }
    }

    function pauseTimer() {
      if (data.timer) {
        clearInterval(data.timer)
        data.timer = null
      }
    }

    // 启动定时器
    function startTimer() {
      if (props.interval <= 0 || !props.autoplay || data.timer) return
      data.timer = setInterval(() => playSlides(), props.interval)
    }


    function setActiveItem(index) {
      if (typeof index === 'string') {
        const filteredItems = items.value.filter((item) => item.name === index)
        if (filteredItems.length > 0) {
          index = items.value.indexOf(filteredItems[0])
        }
      }
      index = Number(index)
      if (isNaN(index) || index !== Math.floor(index)) {
        debugWarn('Carousel', 'index must be an integer.')
        return
      }
      const length = items.value.length
      const oldIndex = data.activeIndex
      if (index < 0) {
        data.activeIndex = props.loop ? length - 1 : 0
      } else if (index >= length) {
        data.activeIndex = props.loop ? 0 : length - 1
      } else {
        data.activeIndex = index
      }
      if (oldIndex === data.activeIndex) {
        resetItemPosition(oldIndex)
      }
    }

    function resetItemPosition(oldIndex) {
      items.value.forEach((item, index) => {
        item.translateItem(index, data.activeIndex, oldIndex)
      })
    }

    function prev() {
      setActiveItem(data.activeIndex - 1)
    }
    function next() {
      setActiveItem(data.activeIndex + 1)
    }

    watch(
      () => props.loop,
      () => {
        setActiveItem(data.activeIndex)
      }
    )

    watch(
      () => data.activeIndex,
      (current, prev) => {
        // 为了获取到变化前的oldIndex, 并调整transition位置
        resetItemPosition(prev)
        if (prev > -1) {
          emit('change', current, prev)
        }
      }
    )

    provide("injectCarouselScope", {
      root,
      direction: props.direction,
      type: props.type,
      items,
      loop: props.loop,
      addItem,
      setActiveItem,
    })

    onMounted(() => {
      if (
        props.initialIndex < items.value.length &&
        props.initialIndex >= 0
      ) {
        data.activeIndex = props.initialIndex
      }
      resetItemPosition()
      startTimer()
    })

    onBeforeUnmount(() => {
      pauseTimer()
    })


    return {
      root,
      items,
      prev,
      next,
      ...toRefs(data)
    }
  },

}
</script>

<style lang="scss" scoped>
.el_carousel__container {
  position: relative;
  height: 100%;
  .button__container {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    .arrow-left,
    .arrow-right {
      cursor: pointer;
      font-size: 24px;
      position: absolute;
      display: block;
      color: #fff;
      background: rgba($color: #000000, $alpha: 0.4);
    }
    .arrow-left {
      left: 0;
    }
    .arrow-right {
      right: 0;
    }
  }
}
</style>