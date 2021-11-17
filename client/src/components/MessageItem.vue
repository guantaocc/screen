<template>
  <div class="message-chat">
    <div v-if="isSysMessage" class="sys-message" style="text-align:center;">
      <span class="sys-message-box">
        {{ item[3] }}
      </span>
    </div>
    <div class="chat-message" v-else>
      <div class="msg" :style="wrapMessageStyle">
        <span class="types-message-box">
          <component :is="typesComponent" :message="item[3]"></component>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import messageMapTypesComponent from './message-map-types'
export default {
  name: 'MessageItem',
  props: {
    item: {
      type: Array,
      default: []
    }
  },
  computed: {
    isSysMessage() {
      let types = this.item[2]
      return [10000, 10001].includes(types)
    },
    typesComponent() {
      let types = this.item[2]
      return messageMapTypesComponent[types]
    },
    wrapMessageStyle() {
      let isSend = this.item[1]
      // console.log(isSend);
      if(isSend == 0){
        return {
          "float": "left"
        }
      }else {
        return {
          "float": "right"
        }
      }
    }
  }
}
</script>

<style scoped>
.sys-message {
  text-align: center;
}
</style>