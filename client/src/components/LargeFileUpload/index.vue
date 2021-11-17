<template>
  <div>
    <div class="file-wrap">
      <input type="file" @change="handleFileChange" multiple/>
    </div>
    <div class="opator">
      <el-button type="primary" size="small" @click="handleUpload">上传</el-button>
      <el-button type="primary" size="small" @click="handlePause">暂停</el-button>
      <el-button type="primary" size="small" @click="handleRecover">恢复</el-button>
    </div>
    <div>
      <h3>分片详情</h3>
      <div v-if="container.data.length > 0">
        <div class="chunk-wrap">
          <div class="chunk-item" v-for="(item, index) in container.data" :key="index">
            <span>chunkname: {{ item.hash }}</span>
            <span>大小: {{ item.size }}</span>
            <span>进度: {{item.percentage }}</span>
          </div>
          <div>总进度: {{ uploadPercentage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const SIZE = 5 * 1024 * 1024

export default {
  data: () => ({
    container: {
      file: null,
      data: [],
      chunkSizeLength: 0,
      worker: null,
      hash: ''
    },
    requestList: []
  }),
  computed: {
    uploadPercentage() {
      if (!this.container.file || !this.container.data.length) return 0;
      const loaded = this.container.data
        .map(item => item.size * item.percentage)
        .reduce((acc, cur) => acc + cur);

      return parseInt((loaded / this.container.file.size).toFixed(2));
    }
  },
  methods: {
    createProgressHandler(item) {
      return e => {
        console.log(e)
        let percentage = parseInt(String((e.loaded / e.total) * 100));
        this.$set(item, 'percentage', percentage)
      }
    },
    calculateHash(fileChunkList) {
      return new Promise(resolve => {
        // 添加 worker 线程
        this.container.worker = new Worker("/hash.js");
        this.container.worker.postMessage({ fileChunkList });
        this.container.worker.onmessage = e => {
          const { percentage, hash } = e.data;
          this.hashPercentage = percentage;
          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    handleFileChange(e) {
      console.log(e)
      const [file] = e.target.files;
      if (!file) return;
      Object.assign(this.$data, this.$options.data());
      this.container.file = file;
      this.createFileChunk(file)
    },
    request(config) {
      let url = config.url || ""
      let method = config.method || 'post'
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = config.onprogress
        xhr.open(method, url, true);
        if (config.headers) {
          Object.keys(config.headers).forEach(key =>
            xhr.setRequestHeader(key, config.headers[key])
          );
        }
        xhr.send(config.data);
        xhr.onload = e => {
          // 请求成功的xhrrequest
          if (config.requestList) {
            const xhrIndex = config.requestList.findIndex(item => item === xhr)
            config.requestList.splice(xhrIndex, 1)
          }
          resolve({
            data: e.target.response
          });
        };
        if (config.requestList) {
          config.requestList.push(xhr)
        }
      });
    },
    // 取消切片的上传
    handlePause() {
      this.requestList.forEach(xhr => xhr?.abort());
      this.requestList = [];
    },
    // chunk file
    createFileChunk(file, size = SIZE) {
      let fileChunkList = []
      let cur = 0
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) })
        cur += size
      }
      console.log(fileChunkList);
      this.container.chunkSizeLength = fileChunkList.length
      return fileChunkList
    },

    // upload chunks
    async uploadChunks(uploadedList) {
      const requestList = this.container.data
      .filter(({ hash }) => !uploadedList.includes(hash))
      .map(({ chunk, hash }) => {
        const formData = new FormData()
        formData.append("chunk", chunk)
        formData.append("hash", hash)
        formData.append("filename", this.container.file.name)
        return {
          formData
        }
      }).map(({ formData }, index) => {
        return this.request({
          url: 'http://localhost:3000/upload/',
          method: 'post',
          data: formData,
          onprogress: this.createProgressHandler(this.container.data[index]),
          requestList: this.requestList
        })
      })
      await Promise.all(requestList)

      // 判断上传完成
      if(uploadedList.length + requestList.length === this.container.data.length){
        await this.mergeRequest()
      }
    },

    async mergeRequest() {
      await this.request({
        url: "http://localhost:3000/merge/",
        method: 'post',
        data: JSON.stringify({
          filename: this.container.file.name,
          size: SIZE,
          hash: this.container.hash
        })
      });
    },

    async verifyUpload(filename, fileHash) {
      const res = await this.request({
        url: "http://localhost:3000/verify",
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify({
          filename,
          fileHash
        })
      });
      // console.log(res)
      return JSON.parse(res.data);
    },

    async handleUpload() {
      if (!this.container.file) return;
      const fileChunkList = this.createFileChunk(this.container.file);
      this.container.hash = await this.calculateHash(fileChunkList);
      let { shouldUpload, uploadedList } = await this.verifyUpload(this.container.file.name, this.container.hash)
      if (!shouldUpload) {
        this.$message.success("上传成功")
        return
      }
      this.container.data = fileChunkList.map(({ file }, index) => ({
        fileHash: this.container.hash,
        chunk: file,
        index: index,
        size: file.size,
        hash: this.container.hash + "-" + index,
        percentage: uploadedList.includes(index) ? 100 : 0
      }))


      await this.uploadChunks(uploadedList)
    },
    async handleRecover() {
      const { uploadedList } = await this.verifyUpload(
        this.container.file.name,
        this.container.hash
      );
      await this.uploadChunks(uploadedList);
    }
  }
};
</script>
