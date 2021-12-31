<template>
  <div id="app">
    <div class="message-tesst" v-if="testMappings.testMsg">
      <h2>消息示例demo</h2>
      <MessageList :message-list="messageList"></MessageList>
    </div>
    <div class="broad-checked" v-if="testMappings.testChecked">
      <h2>消息选择包装组件demo</h2>
      <check-group v-model="checkedItems">
        <check-item v-for="item in items" :value="item" :key="item.id">
          {{ item.value }}
        </check-item>
      </check-group>
      <el-button size="mini" @click="changeItem">改变checked</el-button>
    </div>
    <div class="file-upload-demo" style="margin:10px 0;" v-if="testMappings.testFiles">
      <h2>大文件上传和断点续demo</h2>
      <LargeFileUpload />
    </div>
    <Splitpanes class="smart-splitter" style="height:600px;" v-if="testMappings.testMsg">
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
    <!-- <ListView :data="listData" :item-size-getter="(item) => 30 + item.value % 10" /> -->

    <MediaTest />

    <button @click="showModal">show modal</button>
    <modal name="my-first-modal">
      This is my first modal
    </modal>
    <TransitionTest />

    <div class="fb-steps">
      <el-steps :active="avtive">
        <el-step class="fb-step" :class="avtive === index && 'is-success'" ref="step" v-for="(item, index) in 5" :key="index">
          <template #icon>
            <el-popover popper-class="step-popper" placement="top-start" width="200" trigger="hover">
              <template #reference>
                <i v-if="avtive === index" class="el-icon-check"></i>
                <span v-else>{{ index + 1 }}</span>
              </template>
              <span>这是一段内容,这是一段内容,这是一段内容,这是一段内容。</span>
            </el-popover>
          </template>
          <template #title>
            <span>步骤 {{ index + 1 }}</span>
          </template>
        </el-step>
      </el-steps>
    </div>

  </div>
</template>

<script>
import MessageList from './components/MessageList.vue'
import CheckGroup from './components/CheckGroupManager/check-group.vue'
import CheckItem from './components/CheckGroupManager/check-item.vue'
import LargeFileUpload from './components/LargeFileUpload/index.vue'
import webRTC from './components/webRTC/index.vue'
import MediaTest from './components/MediaTest'
import TransitionTest from './components/TransitionTest'
import { Splitpanes, Pane } from 'splitpanes'

import { v4 as uuidv4, version as uuidVersion, parse as uuidParse } from 'uuid';

import ListView from "@/components/ListView"
import Template from '../../uView/pages/example/template.vue'

import PollObserve from './utils/poll'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    TransitionTest,
    MediaTest,
    MessageList,
    CheckGroup,
    CheckItem,
    LargeFileUpload,
    webRTC,
    Splitpanes,
    Pane,
    ListView,
    Template
  },
  Templateplateputed: {
    listData() {
      let temp = [];
      for (let i = 1; i <= 100; i++) {
        temp.push({
          value: i
        })
      }
      return temp
    }
  },
  data() {
    return {
      testMappings: {
        testMsg: false,

      },
      avtive: 0,
      testArr: [1, 2],
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
      ],
      pollObserve: null
    }
  },
  mounted() {
    // console.log(this)
    // console.log(uuidVersion("bad6406b-1415-4b86-81fc-ef2ed185d027"));
    // console.log(uuidv4());
    // console.log(uuidParse("bad6406b-1415-4b86-81fc-ef2ed185d027"));
    this.pollObserve = new PollObserve({ delay: 3000 })
    this.pollRequest()
    console.log(this.pollObserve)
  },
  beforeDestory() {
    if (this.pollObserve) {
      this.pollObserve.destory()
      this.pollObserve = null
    }
  },
  methods: {
    pollRequest() {
      const axiosInstance = axios.create()
      const Promised = (params) => {
        return axiosInstance({
          url: 'http://jsonplaceholder.typicode.com/posts',
          method: 'get'
        })
      }

      const { request, emit, off } = this.pollObserve.on(Promised)
      if (request) {
        emit(request, (res, done) => {
          console.log("测试请求", res)
          done()
        })
      }
    },
    changeItem() {
      this.checkedItems = []
    },
    showModal() {
      this.$modal.show('my-first-modal')
    }
  }
}
</script>

<style lang="scss">
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
  content: "";
  z-index: 20;
  background-color: #f5f5f5;
}

.fb-steps {
  width: 60%;
  margin: 0 auto;
  .el-step {
    .el-step__title {
      font-size: 14px;
    }
    &.is-success {
      .el-icon-check {
        color: #67c23a;
      }
      .el-step__head {
        border-color: #67c23a;
      }
    }
  }
}
</style>