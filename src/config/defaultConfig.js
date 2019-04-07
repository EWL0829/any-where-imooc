module.exports = {
  root: process.cwd(),   // 输出当前项目所在的根路径
  hostname: '127.0.0.1', // 使用本机的localhost作为服务器的域名
  port: 9527,            // 由于80端口可能会出现权限问题，所以使用了一个较大的端口
};
