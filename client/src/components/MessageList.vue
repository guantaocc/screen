<template>
  <div class="message-list">
    <MessageItem class="msg-box-message clearfix" :item="item.msg" v-for="item in messageList" :key="item.id"></MessageItem>
  </div>
</template>

<script>
import MessageItem from './MessageItem.vue'
export default {
  props: {
    messageList: {
      type: Array,
      default: []
    }
  },
  name: 'MessageList',
  components: {
    MessageItem
  }
}
</script>

<style>

</style>