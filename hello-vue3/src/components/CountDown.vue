<template>
  <div role="timer" class="_base-count-down">
    <slot :text="text">
      时间： {{ text }}
    </slot>
  </div>
</template>

<script>
import { computed, defineExpose, watch } from 'vue'
import { useCountDown } from "./index"

export default {
  name: 'CountDown',
  props: {
    time: {
      type: [Number, String],
      default: 0
    },
    millisecond: {
      type: Boolean,
      default: false
    },
    autoStart: {
      type: Boolean,
      default: true
    },
    format: {
      type: String,
      default: 'HH:mm:ss'
    }
  },
  emits: ['finish', 'change'],
  setup(props, { emit, slots }) {
    const { start, pause, reset, current } = useCountDown({
      time: +props.time,
      millisecond: props.millisecond,
      onChange: (current) => emit('change', current),
      onFinish: () => emit('finish')
    })

    const text = computed(() => current.value)

    const resetTime = () => {
      reset(+props.time)
      if (props.autoStart) {
        start()
      }
    }

    watch(() => props.time, resetTime, { immediate: true })

    defineExpose({
      start,
      pause,
      reset: resetTime
    })

    return {
      text
    }
  }
}
</script>

<style>
</style>