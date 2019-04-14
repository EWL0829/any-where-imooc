// 读取命令行中的参数

/*
* 首先可以考虑使用process的argv方法，但是这种方法比较麻烦，比如
* 需要我们自己去判断 -port 和 缩写-p 是一回事，
* 所以这里直接使用了npm上的yargs工具
* */

const yargs = require('yargs');
const Server = require('./app');

const argv = yargs
  .usage('anywhere [options]')
  .option('p', {
      alias: 'port',
      default: 9527,
      describe: '端口号',
    })
  .option('h', {
    alias: 'host',
    default: '127.0.0.1',
    describe: '主机名',
  })
  .option('d', {
    alias: 'root',
    default: process.cwd(),
    describe: '根目录 root path',
  })
  .version()
  .alias('v', 'version')
  .help()  // 工具会根据上述的option项生成对应的help信息
  .argv;

const server = new Server(argv);
server.start(); // 启动程序
