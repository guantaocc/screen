<template>
  <div class="transiton-test">
    <transition name="fade" @before-enter="fadeTransitionEnter">
      <div v-if="visible">
        fade transition
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'TransitionTest',
  data() {
    return {
      visible: false
    }
  },

  created() {
    this.$nextTick(() => {
      this.startFadeTransiton()
    })
  },

  methods: {
    fadeTransitionEnter() {

    },
    startFadeTransiton() {
      this.visible = true
    }
  }
}
</script>


<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>