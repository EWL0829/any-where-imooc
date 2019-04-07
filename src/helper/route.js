const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

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
      res.setHeader('Content-Type', 'text/plain');
      res.end(files.join(','))
    }
  } catch (ex) {
    // stat用于判断对应路径下的文件/文件夹是否存在
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${filePath} is not a directory or file.`);
  }
};
