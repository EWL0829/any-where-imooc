const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig');
const route = require('./helper/route');

// 在编写了Server之后又传回到index使用，而不是直接使用App.js是因为
// 考虑到如果用户需要直接使用App.js里的内容，可以直接将这一个文件require
// 到要使用的文件中，相当于把没有cli相关的部分拆出来作为一个可使用的功能模块
class Server {
  // 这里的config参数是指传入的用户自定义config
  constructor(config) {
    this.conf = Object.assign({}, conf, config);
  }

  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url);

      route(req, res, filePath, this.conf);
    });

    server.listen(this.conf.port, this.conf.hostname, () => {
      const addr = `http://${this.conf.hostname}:${this.conf.port}`;
      console.info(`server started at ${chalk.green(addr)}`);
    });
  }
}

module.exports = Server;
