// 扩展axios模块

import axios from 'axios'
const axiosInstance = axios.create()

class PollObserve {
  constructor(instance, pollConf) {
    let { delay } = pollConf

    this.delay = delay
    // 轮询总次数
    this.count = 0
    // 是否已经开始轮询
    this.isLoop = false
    this.instance = instance
  }
  /** 循环调用模型 */
  loopCallModel = (callback) => {
    const call = (time = 1000) => setTimeout(callback, time)
    return { call }
  }
  // 触发轮询
  emit(responsedCaller) {
    this.isLoop = true
    const loopModal = this.loopCallModel(async () => {
      try {
        const response = await instance({
          url: '/test',
          params: { id: 1 }
        })

        const done = () => {
          loopModal.call()
        }

        if (responsedCaller) {
          // done hooks
          responsedCaller(response, done)
        } else {
          done()
        }
      } catch (error) {
        this.isLoop = false
      }

    })
  }
  // 重置轮询对象
  destory() {

  }
}





let ObservePoll = new PollObserve(axiosInstance, { delay: 1000 })
ObservePoll.emit((res, done) => {
  // 输入判断的条件
  console.log(res)
  // 如果调用 done 函数则继续轮询
})