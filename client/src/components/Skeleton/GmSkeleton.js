export default {
  name: 'GmSkeleton',
  abstract: true, // 抽象组件的属性
  props: {
    showSpin: {
      type: Boolean,
      default: true
    },
    skeletPrefix: {
      type: String,
      default: 'gm-skeleton'
    }
  },
  render(h) {
    const slots = this.$slots.default || [h('')]
    this.$nextTick().then(() => {
      this.handlerPrefix(slots, this.showSpin ? this.addSkeletPrefix : this.removeSkeletPrefix)
    })
    // 如果 slots中有多个元素
    return slots.length > 1 ? h('div', [{
      staticClass: this.showSpin ? 'g-spinner' : ''
    }], slots) : slots

  },
  methods: {
    handlerComponent(slot, handler, init) {
      const originchildren = (((slot.componentInstance || {})._vnode || {}).componentOptions || {}).children
      // 如果当前 slot 是一个组件
      const compchildren = ((slot.componentInstance || {})._vnode || {}).children
    },
    handlerPrefix(slots, handler, init) {
      // 遍历插槽
      slots.forEach(slot => {
        // 获取children属性
        let children = slot.children || (slot.componentOptions || {}).children || ((slot.componentInstance || {})._vnode || {}).children
        if (slot.data) {
          if (!slot.componentOptions) {
            // 如果不是组件则 进行添加类名操作
            !init && handler(slot)
          } else {
            // 如果是一个组件，找到相关的children
          }
        }
      })
    },
    addSkeletPrefix(slot) {
      // slot 是否是一个组件
      // yes: slot.componentOptions 存在则获取 componentInstance._vnode
      // no: slot 为当前 vnode
      // vnode.elm 为当前节点绑定的 Element元素
      const rootVnode = slot.componentOptions ? (slot.componentInstance || {})._vnode || {} : slot;
      if (rootVnode.elm) {
        // 添加skeleton类名
        rootVnode.elm.classList.add(this.skeletPrefix)
      } else {
        // 从data属性中加载静态类名
        (rootVnode.data || {}).staticClass += ` ${this.skeletPrefix}`
      }
    },
    // 响应的类名移除
    removeSkeletPrefix(slot) {
      const rootVnode = slot.componentOptions ? (slot.componentInstance || {})._vnode || {} : slot;
      if (rootVnode.elm) {
        rootVnode.elm.classList && rootVnode.elm.classList.remove(this.skeletPrefix)
      } else if (rootVnode.data.staticClass) {
        rootVnode.data.staticClass = rootVnode.data.staticClass.replace(` ${this.skeletPrefix}`, '')
      }
    }
  }
}