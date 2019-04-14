const { exec } = require('child_process');

// 暂时不做linux的支持，后续学习后进行添加
module.exports = url => {
  switch (process.platform) {
    case 'darwin':
      exec(`open ${url}`);
      break;
    case 'win32':
      exec(`start ${url}`);
      break;
  }
};
