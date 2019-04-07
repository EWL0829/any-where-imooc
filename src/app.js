const http = require('http');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const conf = require('./config/defaultConfig');

const server = http.createServer((req, res) => {
  const filePath = path.join(conf.root, req.url);

  // stat用于判断对应路径下的文件/文件夹是否存在
  fs.stat(filePath, (err, stats) => {
    // 如果文件不存在
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`${filePath} is not a directory or file.`);
      return;
    }

    // 如果是文件
    if (stats.isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      // 将对应的文件内容返回，首先从对应路径的文件中读取内容并创建一个文件流，将内容一点一点吐回给res(pipe的作用)
      fs.createReadStream(filePath).pipe(res);

      /*读取并传输文件的写法也可能是如下，
      * fs.readFile(filePath, (err, data) => {
      *   res.end(data)
      * })
      * 虽然该方法也是异步的不会卡住其他的进程，但是因为readFile会在读完所有的文件之后再将文件内容返给response，
      * 相对较慢，所以使用createReadStream的方式更好
      * */
    } else if (stats.isDirectory()) {
      fs.readdir(filePath, (err, files) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('charset', 'utf-8');
        res.end(files.join(','))
      });
    }
  });
});

server.listen(conf.port, conf.hostname, () => {
  const addr = `http://${conf.hostname}:${conf.port}`;
  console.info(`server started at ${chalk.green(addr)}`);
});
