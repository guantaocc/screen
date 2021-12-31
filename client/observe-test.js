function observe(value, cb) {
  Object.keys(value).forEach((key) => defineReactive(value, key, value[key], cb))
}

// 代理_data 到 data
// data中数据的改变会触发到vm._data中触发依赖收集
function _proxy(data) {
  const that = this;
  Object.keys(data).forEach(key => {
    Object.defineProperty(that, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter() {
        // 依赖收集
        return that._data[key];
      },
      set: function proxySetter(val) {
        that._data[key] = val;
      }
    })
  });
}


// 依赖收集
class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  removeSub(sub) {
    remove(this.subs, sub)
  }

  notify() {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.cb = cb;
    this.vm = vm;
    Dep.target = this;
    this.cb.call(this.vm);
  }
  update() {
    this.cb.call(this.vm);
  }
}

function defineReactive(obj, key, val, cb) {
  /*在闭包内存储一个Dep对象*/
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      // 依赖收集
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return val
    },
    set: (newVal) => {
      val = newVal;
      // 订阅消息回调 render
      Dep.notify()
    }
  })
}

Dep.target = null

class Vue {
  constructor(options) {
    this._data = options.data
    _proxy.call(this, options.data)
    observe(this._data, options.render)
    let watcher = new Watcher(this,)
  }
}



let app = new Vue({
  el: '#app',
  data: {
    text: 'text',
    text2: 'text2'
  },
  render() {
    console.log("render")
  }
})

app.text2 = 222