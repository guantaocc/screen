<template>
  <el-tree :data="data" show-checkbox node-key="id" ref="tree" highlight-current>
    <span class="custom-tree-node" slot-scope="{ node, data }">
      <span style="display: flex;align-items: center">
        <img :src="data.icon ? data.icon : require('@/assets/wechat_1.png')" width="19px" height="19px" style="vertical-align:bottom;">
        <span style="width: auto;height: 19px; line-height: 19px; color: black;">
          &nbsp;{{ data.label }}
        </span>
      </span>
    </span>
  </el-tree>
</template>

<script>
export default {
  data() {
    return {
      data: [{
        label: 'XZ211018003J4',
        icon: require('@/assets/档案.png'),
        children: [
          {
            label: '机身信息',
            icon: require('@/assets/phone.png'),
            children: [
              {
                label: '通讯录',
                icon: require('@/assets/address_book.jpg'),
              },
              {
                label: '通话记录',
                icon: require('@/assets/call_record.jpg'),
              },
              {
                label: '短信息',
                icon: require('@/assets/sms.jpg'),
              }
            ]
          },
          {
            label: '应用程序',
            icon: require('@/assets/档案2.png'),
            children: [
              {
                label: '官方微信',
                children: [
                  {
                    label: 'A中委王红月，13126579175/wang16633393731',
                    children: [
                      {
                        label: '账号信息'
                      },
                      {
                        label: '群列表'
                      },
                      {
                        label: '群成员列表'
                      },
                      {
                        label: '新联系人'
                      },
                      {
                        label: '银行卡'
                      },
                      {
                        label: '聊天记录',
                        children: [
                          {
                            label: '好友聊天记录',
                            children: [
                              {
                                label: '全部聊天记录'
                              },
                              {
                                label: '转账',
                                icon: require('@/assets/transfer.png'),

                              },
                              {
                                label: '红包',
                                icon: require('@/assets/redpackets.png'),
                              },
                              {
                                label: '音频',
                                icon: require('@/assets/voice.png'),
                              },
                            ]
                          },
                          {
                            label: '群聊天记录',
                            children: [
                              {
                                label: '全部聊天记录'
                              },
                              {
                                label: '转账',
                                icon: require('@/assets/transfer.png'),
                              },
                            ]
                          }
                        ]
                      },
                      {
                        label: '删除聊天记录',
                        children: [
                          {
                            label: '好友聊天记录',
                            children: [
                              {
                                label: '全部聊天记录'
                              },
                              {
                                label: '转账',
                                icon: require('@/assets/transfer.png'),

                              },
                              {
                                label: '红包',
                                icon: require('@/assets/redpackets.png'),
                              },
                              {
                                label: '音频',
                                icon: require('@/assets/voice.png'),
                              },
                            ]
                          },
                          {
                            label: '群聊天记录',
                            children: [
                              {
                                label: '全部聊天记录'
                              },
                              {
                                label: '转账',
                                icon: require('@/assets/transfer.png'),
                              },
                            ]
                          }
                        ]
                      },
                      {
                        label: '公众号'
                      },
                      {
                        label: '朋友圈'
                      }
                    ]
                  }
                ]
              },
              {
                label: '微信分身01',
                children: [
                  {
                    label: '...'
                  }
                ]
              }
            ],
          },

        ]
      }],
    }
  },
  methods: {
    resolveCheckedData() {
      let ref = this.$refs['tree']
      console.log(ref.root);
      let result = []
      this.recurseCheckedData(result, ref.root)
      console.log(result);
    },

    recurseCheckedData(result, root) {
      let childNodes = root.childNodes
      if (childNodes && childNodes.length > 0) {
        childNodes.forEach((child) => {
          if (child.checked || child.indeterminate) {
            let { id: id, label: label } = child.data
            let config = Object.assign({}, { label: label })
            result.push(config)
            if (child.childNodes && child.childNodes.length > 0) {
              let index = result.findIndex(item => item == config)
              result[index].children = []
              this.recurseCheckedData(result[index].children, child)
            }
          }
        })
      }
    }
  }
}
</script>

<style>
</style>