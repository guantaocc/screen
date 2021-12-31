import { computed, onActivated, onBeforeUnmount, ref } from 'vue';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function parseTime(time) {
  const days = Math.floor(time / DAY)
  const hours = Math.floor((time % DAY) / HOUR)
  const minutes = Math.floor((time % HOUR) / MINUTE);
  const seconds = Math.floor((time % MINUTE) / SECOND);
  const milliseconds = Math.floor(time % SECOND);

  return {
    total: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  }
}

function isSameSecond(time1, time2) {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000);
}

const raf = (fn) => {
  return window.requestAnimationFrame(fn)
}

const cancelRaf = (refId) => {
  window.cancelAnimationFrame(refId)
}

export function useCountDown(options) {
  let rafId = 0;
  let endTime = 0;
  let counting = false;
  let deactivated = false;

  // remain time
  const remain = ref(options.time)

  const current = computed(() => parseTime(remain.value))

  const pause = () => {
    counting = false;
    cancelRaf(rafId)
  }

  const getCurrentRemain = () => Math.max(endTime - Date.now(), 0)

  const setRemin = (value) => {
    remain.value = value
    options.onChange?.(current.value);
    if (value === 0) {
      pause()
      options.onFinish?.()
    }
  }

  const microTick = () => {
    rafId = raf(() => {
      if (counting) {
        setRemin(getCurrentRemain())
        if (remain.value > 0) {
          microTick();
        }
      }
    })
  }

  const macroTick = () => {

  }

  const tick = () => {
    microTick()
  }

  const start = () => {
    if (!counting) {
      endTime = Date.now() + remain.value
      counting = true
      tick()
    }
  }

  const reset = (totalTime = options.time) => {
    pause()
    remain.value = totalTime
  }

  onBeforeUnmount(() => {
    pause()
  })

  onActivated(() => {
    if (deactivated) {
      counting = true;
      deactivated = false;
      tick()
    }
  })

  onDeactivated(() => {
    if (counting) {
      pause();
      deactivated = true;
    }
  });

  return {
    start,
    pause,
    reset,
    current
  }
}