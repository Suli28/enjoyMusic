//格式化时间，接收一个单位毫秒的参数
function formatTime(m) {
  //将毫秒转换为秒
  var second = Math.floor(m / 1000 % 60);

  second = second >= 10 ? second : '0' + second;

  //将毫秒转换为分钟
  var minute = Math.floor(m / 1000 / 60);

  minute = minute >= 10 ? minute : '0' + minute;

  return minute + ':' + second;
}