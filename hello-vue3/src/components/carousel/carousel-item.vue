<template>
  <div class="el-carousel__item" :style="itemStyle" :class="{'is-animating': data.animating, 'is-active': data.active, 'is-in-stage': data.inStage, 'el-carousel__item--card': type === 'card'}">
    <div v-if="type  === 'card'" v-show="!data.active" class="el-carousel__mask"></div>
    <slot></slot>
  </div>
</template>

<script>
import { onMounted, inject, getCurrentInstance, toRefs, reactive, computed } from 'vue'

// 缩放
const CARD_SCALE = 0.83

export default {
  name: 'CarouselItem',
  setup(props) {
    const data = reactive({
      hover: false,
      translate: 0,
      scale: 1,
      active: false,
      ready: false,
      inStage: false,
      animating: false,
    })

    const injectCarouselScope = inject('injectCarouselScope')
    const instance = getCurrentInstance()

    let parentType = injectCarouselScope.type

    const itemStyle = computed(() => {
      return {
        transform: `translateX(${data.translate}px) scale(${data.scale})`,
      }
    })

    function processIndex(index, activeIndex, length) {
      // 当前元素是最后一个元素，将最后一个元素调整到第一个元素的左边
      if (activeIndex == 0 && index === length - 1) {
        return -1
      } else if (activeIndex === length - 1 && index === 0) {
        // 当前元素是最后一个元素，将第一个元素调整到 右边
        return length
      } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
        // 当前元素的前面元素, 例如 activeIndex = 4; 需要吧 1, 2 元素调整到右边
        // length + 1 是需要将这个元素排到调整后的第0个元素的后面
        return length + 1
      } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
        // 当前元素的后面部分元素在loop之后需要调整到 length-1 元素前面
        // return -1-1
        return -2
      }
      return index
    }

    function calcCardTranslate(index, activeIndex) {
      const parentWidth = injectCarouselScope.root.value?.offsetWidth || 0
      if (data.inStage) {
        return (
          (parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1)) / 4
        )
      } else if (index < activeIndex) {
        return (-(1 + CARD_SCALE) * parentWidth) / 4
      } else {
        return ((3 + CARD_SCALE) * parentWidth) / 4
      }
    }

    function calcTranslate(index, activeIndex) {
      const parentWidth = injectCarouselScope.root.value?.offsetWidth;
      return parentWidth * (index - activeIndex)
    }

    function translateItem(index, activeIndex, oldIndex) {
      const length = injectCarouselScope.items.value.length

      // 是否是card, 调整scale


      if (parentType !== 'card' && oldIndex !== undefined) {
        data.animating = index === activeIndex || index === oldIndex
      }

      // 排除当前元素的 active值的调整
      if (index !== activeIndex && length > 2 && injectCarouselScope.loop) {
        index = processIndex(index, activeIndex, length)
      }

      if (parentType === 'card') {
        data.inStage = Math.round(Math.abs(index - activeIndex)) <= 1
        data.active = index === activeIndex
        data.translate = calcCardTranslate(index, activeIndex)
        data.scale = data.active ? 1 : CARD_SCALE
      } else {
        data.active = index === activeIndex
        const isVertical = parentDirection.value === 'vertical'
        data.translate = calcTranslate(index, activeIndex, isVertical)
      }
      data.ready = true
      data.ready = true
    }

    onMounted(() => {
      if (injectCarouselScope.addItem) {
        injectCarouselScope.addItem({
          uid: instance.uid,
          ...props,
          translateItem,
          ...toRefs(data)
        })
      }
    })
    return {
      data,
      type: injectCarouselScope.type,
      itemStyle
    }
  }
}
</script>

<style lang="scss" scoped>
.el-carousel__item {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}
.el-carousel__item.is-animating {
  transition: transform 0.4s ease-in-out;
}
.el-carousel__item--card {
  width: 50%;
  transition: transform 0.4s ease-in-out;
}

.el-carousel__item--card.is-in-stage {
  z-index: 1;
}

.el-carousel__item--card.is-active {
  z-index: 2;
}

.el-carousel__mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #fff;
  opacity: 0.24;
  transition: 0.1s;
}
</style>