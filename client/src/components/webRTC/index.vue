<template>
  <div class="contentarea">
    <div class="slice">
      <el-button @click="found" size="mini" type="primary">摄像头拍照</el-button>
    </div>

    <div class="camera-wrapper">
      <!-- 设备列表 -->
      <div class="media-list-wrapper">
        <h3>video设备列表</h3>
        <div class="list-item" v-for="(item, index) in media_List" :key="index" style="margin:4px 0;">
          <span>{{ item.label }} - {{ item.deviceId }}</span>
          <el-button type="primary" size="mini" @click="getStreamForGlobal(item.deviceId)">选择默认设备</el-button>
        </div>
      </div>
    </div>

    <div class="camera">
      <video ref="videoRef" id="video">Video stream not available.</video>
      <button id="startbutton" @click="TakePhoto">拍照</button>
    </div>

    <canvas id="canvas-wraps" ref="canvas">
    </canvas>

    <div class="output">
      <img ref="photo" id="photo">
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    media_List: [],
    defaultDeviceId: '',
    isSteaming: false,
    defaultWidth: 320,
    defaultHeight: 0
  }),
  methods: {
    async found() {
      let stream = await navigator.mediaDevices.getUserMedia({audio: false, video: true})
      let list = await window.navigator.mediaDevices.enumerateDevices()
      console.log("设备列表", list);
      let videoList = list.filter(device => device.kind == "videoinput")
      this.media_List = videoList
      console.log(videoList);
    },
    isHasDefaultDevice() {
      // localstorage store
      let hasDefaultDevice = localStorage.getItem("camera-takephoto-common")
      console.log(hasDefaultDevice);
    },
    async getStreamForGlobal(deviceId) {
      this.defaultDeviceId = deviceId;
      const constraints = {
        video: {
          width: {
            min: 480,
            ideal: 1920,
            max: 1080,
          },
          height: {
            min: 360,
            ideal: 1080,
            max: 810,
          },
        },
        deviceId: deviceId
      };
      let stream = await navigator.mediaDevices.getUserMedia(constraints)
      let videoRef = this.$refs['videoRef']
      videoRef.srcObject = stream
      videoRef.play()

      video.addEventListener('canplay', (e) => {
        this.defaultWidth = video.videoWidth;
        this.defaultHeight = video.videoHeight;

        // video.setAttribute('width', this.defaultWidth);
        // video.setAttribute('height', this.defaultHeight);
        this.isSteaming = true
      }, false);
    },

    canvasBlobToPromise(canvas) {
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          resolve(blob)
        })
      })
    },
    
    async TakePhoto() {
      if (this.isSteaming) {
        let canvas = this.$refs['canvas']
        let photoRef = this.$refs['photo']
        let context = canvas.getContext('2d');
        if (this.defaultWidth && this.defaultHeight) {
          canvas.width = this.defaultWidth;
          canvas.height = this.defaultHeight;
          context.drawImage(video, 0, 0, this.defaultWidth, this.defaultHeight);

          let blob = await this.canvasBlobToPromise(canvas);

          photoRef.setAttribute('src', blob);

          let file = new File([blob], "camera_blob_file", { lastModified: new Date() });

          // blob to file
          console.log("A", file);
        }
      }
    }
  }
};
</script>
<style>
</style>
