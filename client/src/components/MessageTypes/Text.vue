<template>
  <span>{{ message }}</span>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>