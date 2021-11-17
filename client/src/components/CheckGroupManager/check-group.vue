<template>
  <div class="check-group">
    <slot></slot>
  </div>
</template>

<script>
import { findComponentsDownward } from './findComponentHelper'
export default {
  name: 'CheckGroup',
  componentName: 'CheckGroupFor',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    value(val){
      this.currentValue = val
      this.updateModel(true)
    }
  },
  data() {
    return {
      currentValue: this.value || [],
      children: []
    }
  },
  mounted() {
    // console.log(this);
    this.updateModel(true)
  },
  methods: {
    updateModel(update) {
      // 查找当前组件的子组件
      this.children = findComponentsDownward(this, 'CheckItemFor')
      if (this.children) {
        const value = this.currentValue
        this.children.forEach(child => {
          if (update) {
            let checked = value.findIndex(item => item.id == child.currentValue.id)
            if(checked != -1){
              child.setChecked(true)
            }else {
              child.setChecked(false)
            }
          }
        })
      }
    },
    // 接收子组件的事件
    refreshCurrentValue(child){
      if(!child.id){
        throw new Error("必须指定子选择框的id")
      }
      // 如果这个checkItem不存在，则加入，否则删除
      let index = this.currentValue.findIndex(v => v.id == child.id)
      if(index !== -1){
        this.currentValue.splice(index, 1)
      }else {
        this.currentValue.push(child)
      }
      this.currentValue.sort((a, b) => {
        return a.id - b.id
      })
      this.change()
    },
    change() {
      this.$emit("input", this.currentValue);
      this.$emit("on-change", this.currentValue);
    }
  }
}
</script>

<style>
</style>