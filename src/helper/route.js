const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const path = require('path');
const HandleBars = require('handlebars');
const conf = require('../config/defaultConfig');

// 除了require之外，读取文件时的路径都使用绝对路径比较稳定
const tplPath = path.join(__dirname, '../template/dir.tpl');
/*
* 虽然平时推荐使用异步写法，但是在这里使用了同步，有两点需要注意：
* 1、首先下面所有的流程基本在文件内容读取结束之后执行才有意义
* 2、我们每一次执行完同步的操作之后，执行Node，实际上就只执行这一次(比如我们每次请求发起实际上文件内容对应的url是相同的，没有必要重复读取)，
* 此后我们可以使用缓存去读取缓存里的内容
* */
const source = fs.readFileSync(tplPath); // 由于readFileSync读取文件默认为buffer,也可以设置参数'utf-8'，强制转为字符串

// 不使用上一步设置的'utf-8'文件读取类型参数是因为我们也可以强制在source上使用toString()，因为buffer的读取速度更快，读取之后再进行转化
const template = HandleBars.compile(source.toString());

module.exports = async function (req, res, filePath) {
  // stat用于判断对应路径下的文件/文件夹是否存在
  try {
    const stats = await stat(filePath);

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
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      const dir = path.relative(conf.root, filePath);
      const data = {
        title: path.basename(filePath),
        files,
        dir: dir ? `/${dir}` : '', // 当dir为空字符串的时候就表明已经在根目录下了
      };
      res.end(template(data));
    }
  } catch (ex) {
    console.error('ex', ex);

    // stat用于判断对应路径下的文件/文件夹是否存在
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    // 一般来说在线上时不能将出错信息输出，防止出现一些安全问题，所以应该做一下生产环境/线上环境的判别
    res.end(`${filePath} is not a directory or file\n ${ex.toString()}`);
  }
};
