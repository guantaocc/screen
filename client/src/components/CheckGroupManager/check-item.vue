<template>
  <div class="check-item" @click="changeStatus" :class="checkedClass">
    <slot></slot>
  </div>
</template>

<script>
import { findComponentUpward } from './findComponentHelper'
export default {
  name: 'CheckItem',
  componentName: 'CheckItemFor',
  props: {
    value: [Object, Number, Boolean, String]
  },
  computed: {
    checkedClass(){
      return this.checked ? 'is-checked': ''
    }
  },
  data(){
    return {
      currentValue: this.value || [],
      checked: false
    }
  },
  methods: {
    changeStatus(){
      this.checked = !this.checked
      let parent = findComponentUpward(this, 'CheckGroupFor')
      if(parent){
        parent.refreshCurrentValue(this.currentValue)
      }
    },
    setChecked(isChecked){
      this.checked = isChecked
    }
  }
}
</script>

<style scoped>
.is-checked {
  background-color: #ebebeb;
}
.check-item {
  height: 16px;
  cursor: pointer;
  margin: 2px 0;
}
</style>