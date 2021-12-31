// 扩展axios模块

class PollObserve {
  constructor(pollConf) {
    let { delay } = pollConf
    this.delay = delay || 1000
    this.listeners = []
  }
  /** 循环调用模型 */
  loopCallModel = (callback) => {
    const call = (time = 1000) => setTimeout(callback, time)
    return { call }
  }

  findListeners(promised) {
    if (this.listeners) {
      return this.listeners.find(listener => listener.request === promised)
    }
  }

  /** 监听要进行的请求 */
  on(promise) {
    let isListener = this.findListeners(promise)
    if (!isListener) {
      this.listeners.push({
        request: promise,
        looping: false,
        count: 0
      })
      return {
        request: promise,
        emit: this.emit.bind(this),
        off: this.off
      }
    } else {
      return {}
    }
  }

  off(promised) {
    const listener = this.listeners.findIndex(listenre => listenre.request === promised)
    if (listener) {
      this.listeners.splice(listener, 1)
    }
  }

  /** 触发轮询 */
  emit(promised, responsedCaller) {
    // 从listeners 取出 promised
    const listener = this.findListeners(promised)
    if (!listener && listener.looping) {
      return
    }
    const loopModal = this.loopCallModel(async () => {
      try {
        const response = await listener.request()
        listener.count++

        const done = () => {
          loopModal.call(this.delay)
        }

        if (responsedCaller) {
          // done hooks
          responsedCaller(response, done)
        } else {
          done()
        }
      } catch (error) {
        listener.looping = false
      }
    })
    // 首次调用
    loopModal.call(0)
    listener.looping = true
  }

  // 重置轮询对象
  destory() {
    this.listeners = []
  }
}

export default PollObserve