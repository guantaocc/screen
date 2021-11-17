<template>
  <div id="app">
    <div class="message-tesst">
      <h2>消息示例demo</h2>
      <MessageList :message-list="messageList"></MessageList> -->
      <!-- <el-button size="small" @click="resolveCheckedData">点击获取点击节点组成的data</el-button> -->
    </div>
    <div class="broad-checked">
      <h2>消息选择包装组件demo</h2>
      <check-group v-model="checkedItems">
        <check-item v-for="item in items" :value="item" :key="item.id">
          {{ item.value }}
        </check-item>
      </check-group>
      <el-button size="mini" @click="changeItem">改变checked</el-button>
    </div>
    <div class="file-upload-demo" style="margin:10px 0;">
      <h2>大文件上传和断点续demo</h2>
      <LargeFileUpload />
    </div>
    <div class="webRTC-demo" style="margin:10px 0;">
      <h2>webRTC demo</h2>
      <webRTC />
    </div>
    <Splitpanes class="smart-splitter" style="height:600px;">
      <Pane size="20" min-size="10" class="hide-scrollbar">
        左
      </Pane>
      <Pane size="80" min-size="70" class="hide-scrollbar">
        <Splitpanes class="smart-splitter" style="height:600px;">
          <Pane size="20" min-size="10" class="hide-scrollbar">
            左
          </Pane>
          <Pane size="80" min-size="70" class="hide-scrollbar">
            右
          </Pane>
        </Splitpanes>
      </Pane>
    </Splitpanes>
  </div>
</template>

<script>
import MessageList from './components/MessageList.vue'
import CheckGroup from './components/CheckGroupManager/check-group.vue'
import CheckItem from './components/CheckGroupManager/check-item.vue'
import LargeFileUpload from './components/LargeFileUpload/index.vue'
import webRTC from './components/webRTC/index.vue'
import { Splitpanes, Pane } from 'splitpanes'

export default {
  name: 'App',
  components: {
    MessageList,
    CheckGroup,
    CheckItem,
    LargeFileUpload,
    webRTC,
    Splitpanes,
    Pane
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
        },
        {
          id: 3,
          msg: ['wxid0102', 0, 1, 'sliced slide right']
        }
      ],
      checkedItems: [
        {
          id: 1,
          value: '第一项'
        },
      ],
      items: [
        {
          id: 1,
          value: '第一项'
        },
        // id sorted
        {
          id: 3,
          value: '第三项'
        },
        {
          id: 2,
          value: '第二项'
        }
      ]
    }
  },
  mounted() {

  },
  methods: {
    changeItem() {
      this.checkedItems = []
    }
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
.smart-splitter > .splitpanes__splitter {
  position: relative;
  width: 3px;
  min-width: 2px;
  background-color: #fafafa;
}

.splitpanes__splitter:hover::before {
  opacity: 1;
}

.splitpanes__splitter::after {
  position: absolute;
  height: 100%;
  content: "\e637";
  font-family: "iconfont";
  z-index: 20;
  top: 0px;
  left: 0px;
  right: 0px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.splitpanes__splitter::before {
  position: absolute;
  height: 100%;
  right: -1.5px;
  left: -1.5px;
  top: 0px;
  opacity: 0;
  bottom: 0px;
  content: '';
  z-index: 20;
  background-color: #f5f5f5;
}
</style>