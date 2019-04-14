// 从配置文件中读取支持的缓存模式
const { cache } = require('../config/defaultConfig');

// 修改时间可以从stats信息中查看
function refreshRes(stats, res) {
  const { maxAge, expires, cacheControl, lastModified, etag } = cache;

  if (expires) {
    // maxAge配置的是秒数，所以要注意转化为毫秒数，且expires是一个绝对的时间点，要用Date转为时间字符串
    res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString());
  }

  if (cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  }

  if (lastModified) {
    // 资源信息中的mtime表示上次修改时间
    res.setHeader('Last-Modified', stats.mtime.toUTCString(),  );
  }

  // todo 生成etag的包很多，可以搜一下
  if (etag) {
    res.setHeader('ETag', `${stats.size}-${stats.mtime}`);
  }
}

module.exports = function isFresh(stats, req, res) {
  refreshRes(stats, res);

  // 从客户端读取上次的修改时间
  const lastModified = req.headers['if-modified-since'];
  const etag = req.headers['if-none-match'];

  // 如果客户端这两个信息都读取不到，则表示这是第一次请求，根本没有设置过这两个属性
  if (!lastModified || !etag) {
    return false;
  }

  // 如果上一次的修改时间和响应中的修改时间不一致，那么表示已经过期了(响应中的资源修改时间会一直被更新)，etag中同理
  if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false;
  }

  if (etag && etag !== res.getHeader('ETag')) {
    return false;
  }

  return true;
};
