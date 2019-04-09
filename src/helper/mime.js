const path = require('path');

// mime类型对应关系
const mimeTypes = {
  'css': 'text/css',
  'gif': 'image/gif',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'text/javascript',
  'json': 'application/json',
  'pdf': 'application/pdf',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'swf': 'application/x-shockwave-flash',
  'tiff': 'image/tiff',
  'txt': 'text/plain',
  'wav': 'audio/x-wav',
  'wma': 'audio/x-ms-wma',
  'wmv': 'video/x-ms-wmv',
  'xml': 'text/xml'
};

module.exports = (filePath) => {
  // 此处使用pop是为了避免在解析类似于 xx.min.js 之类的后缀名时出现问题
  let ext = path.extname(filePath)
    .split('.')
    .pop()
    .toLowerCase();

  // 文件后缀名有可能会出现没有后缀名的情况，就直接将文件路径赋值为后缀名
  if (!ext) {
    ext = filePath;
  }

  // 如果没有对应的解析类型，就直接默认使用text/plain
  return mimeTypes[ext] || mimeTypes['txt'];
};
