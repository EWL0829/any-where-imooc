// totalSize表示整个的字节数
// req表示用户发来的请求，我们需要从中读取一下range字段，观察用户需要从多少位开始多少位结束的范围
// res表示我们发回的响应，并且我们需要在响应中写入范围以及总的字节数
module.exports = (totalSize, req, res) => {
  const range = req.headers['range'];
  // 如果拿不到range
  if (!range) {
    return {code: 200};
  }

  // 如果可以拿到range就设置一下范围，bytes后面的两个数字可能有也可能没有
  const size = range.match(/bytes=(\d*)-(\d*)/);
  // 如果拿不到end就直接将最后一位的索引返回
  const end = size[2] || totalSize - 1;
  // 如果拿不到start就直接将第一位的索引返回
  const start = size[1] || totalSize - end;

  // 非法情况
  if (start > end || start < 0 || end > totalSize) {
    return {code: 200};
  }

  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Range', `byte ${start}-${end}/${totalSize}`);
  res.setHeader('Content-Length', end - start);
  return {
    code: 206, // 206的状态码表示部分内容，partialContent
    start: Number(start),
    end: Number(end),
  };
};
