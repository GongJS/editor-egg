/* eslint-disable @typescript-eslint/no-var-requires */
const OSS = require('ali-oss');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// 设置环境变量
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const publicPath = path.resolve(__dirname, '../app/public');

// 新建一个实例
const client = new OSS({
  accessKeyId: process.env.ALC_ACCESS_ID,
  accessKeySecret: process.env.ALC_ACCESS_SECRET,
  bucket: 'gjs-lego',
  endpoint: 'oss-cn-shanghai.aliyuncs.com',
});

async function run() {
  const publicFiles = fs.readdirSync(publicPath);
  const files = publicFiles.filter(f => f !== 'page.nj');
  const res = await Promise.all(
    files.map(async fileName => {
      const savedOSSPath = path.join('h5-assets', fileName);
      const filePath = path.join(publicPath, fileName);
      const result = await client.put(savedOSSPath, filePath);
      const { url } = result;
      return url;
    }),
  );
  console.log('上传成功', res);
}
run();
