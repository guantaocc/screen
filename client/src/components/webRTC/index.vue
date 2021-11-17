<template>
  <div class="contentarea">
    <div class="camera-wrapper">
      <div class="camera">
        <video id="video">Video stream not available.</video>
        <button id="startbutton">Take photo</button>
      </div>
      <canvas id="canvas">
      </canvas>
      <div class="output">
        <img id="photo" alt="The screen capture will appear in this box.">
      </div>
    </div>
    <div class="slice">
      <el-button @click="found" size="small">开始</el-button>
    </div>
  </div>
</template>

<script>
// import "./capture"
export default {
  data: () => ({
    media_List: []
  }),
  methods: {
    async found(){
      try { 
        const [device] = await navigator.hid.requestDevice({
          filters: [{ vendorId: 0x05ac, usage: 0x0f, usagePage: 0xff00 }]
        });
        console.log(device);
        await device.open()
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style>
</style>