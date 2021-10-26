<template>
  <div id="app">
    <MessageList :message-list="messageList"></MessageList>
  </div>
</template>

<script>
import MessageList from './components/MessageList.vue'
export default {
  name: 'App',
  components: {
    MessageList
  },
  data() {
    return {
      messageList: [
        {
          id: 1,
          msg: ['wxid0102', 0, 0, '请问你是做什么的']
        },
        {
          id: 2,
          msg: ['wxid0102', 0, 10000, '系统消息']
        }
      ]
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style>
.clearfix:after {
  content: "\0020";
  display: block;
  height: 0;
  clear: both;
}
.clearfix {
  zoom: 1;
}
</style>