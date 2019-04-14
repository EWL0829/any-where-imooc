module.exports = {
  root: process.cwd(),   // 输出当前项目所在的根路径
  hostname: '127.0.0.1', // 使用本机的localhost作为服务器的域名
  port: 9527,            // 由于80端口可能会出现权限问题，所以使用了一个较大的端口
  compress: /.(html|js|css|md)$/, // 仅压缩满足正则给出的类型的文本文件
  cache: {
    maxAge: 6000, // 单位为s
    expires: true, // 由于expires表示比较老的缓存机制，为了兼容，这里就打开
    cacheControl: true,
    lastModified: true,
    etag: true
  },
};
