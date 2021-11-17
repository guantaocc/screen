const express = require("express")
const cors = require("cors")

const fse = require("fs-extra");
const fs = require("fs")
const multiparty = require("multiparty");
const path = require("path");

const app = express()

const UPLOAD_DIR = path.resolve(__dirname, "uploads")

const JSONParseRequest = req => {
  return new Promise(resolve => {
    let chunk = "";
    req.on("data", data => {
      chunk += data;
    });
    req.on("end", () => {
      resolve(JSON.parse(chunk));
    });
  });
}

// 返回已经上传切片名列表
const createUploadedList = async (filename) =>
  fse.existsSync(path.resolve(UPLOAD_DIR, `chunk-${filename}`))
    ? await fse.readdir(path.resolve(UPLOAD_DIR, `chunk-${filename}`))
    : [];

// 创建合并的流，并发合并文件
const pipeStream = (path, writeStream) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(path);
    // console.log(readStream);
    readStream.pipe(writeStream)
    readStream.on("end", () => {
      // console.log('end');
      resolve();
      fse.unlinkSync(path);
    });
  });
}

// merge chunks
const mergeFileChunk = async (chunkDir, size, filename) => {
  let chunkPaths = await fse.readdir(chunkDir)
  let filePath = path.resolve(UPLOAD_DIR, filename)
  console.log(filePath);
  // 下标排序
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1])
  console.log(chunkPaths);
  let chunkPromises = chunkPaths.map((chunkPath, index) => {
    return pipeStream(path.resolve(chunkDir, chunkPath), fs.createWriteStream(filePath, {
      start: index * size,
      end: (index + 1) * size
    }))
  })
  // console.log(chunkPromises);
  await Promise.all(chunkPromises)
  await fse.rmdir(chunkDir)
}

app.use(cors())

app.post('/upload', (req, res) => {
  const multipart = new multiparty.Form();
  multipart.parse(req, async (err, fileds, files) => {
    if (err) {
      return
    }
    // console.log(fileds, files);
    const [chunk] = files.chunk;
    const [hash] = fileds.hash;
    const [filename] = fileds.filename;
    const chunkDir = path.resolve(UPLOAD_DIR, `chunk-${filename}`)
    if (!fse.existsSync(chunkDir)) {
      await fse.mkdirs(chunkDir)
    }
    await fse.move(chunk.path, `${chunkDir}/${hash}`)
    res.end("recieve file chunk")
  })
})

app.post('/merge', async (req, res) => {

  let data = await JSONParseRequest(req);
  console.log("merge request", data);

  const { filename, size, hash } = data;
  const chunkDir = path.resolve(UPLOAD_DIR, `chunk-${filename}`)

  await mergeFileChunk(chunkDir, size, `${filename}-${hash}`)
  res.end("file merge success")
})

app.post("/verify", async (req, res) => {
  let data = await JSONParseRequest(req);
  let { filename, fileHash } = data
  let uploadPath = path.resolve(UPLOAD_DIR, `${filename}-${fileHash}`)
  console.log(fs.existsSync(uploadPath));
  if (fs.existsSync(uploadPath)) {
    res.end(JSON.stringify({
      shouldUpload: false
    }))
  } else {
    res.end(JSON.stringify({
      shouldUpload: true,
      uploadedList: await createUploadedList(filename)
    }))
  }
})


app.listen(3000, () => {
  console.log("server from 3000");
})