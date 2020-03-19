// 以iphone6为标准屏

function setRem() {

  //标准屏宽度
  var standardWidth = 375;

  //页面可视宽度
  var innerW = innerWidth;

  //字体大小
  var fontSize = innerWidth / 375 * 100;

  //1200px以上屏幕，设置html字体大小为 100px

  var style = document.createElement('style');

  style.innerHTML = 'html{font-size: ' + (innerW >= 1200 ? 100 : fontSize) + 'px;}';

  style.setAttribute('id', 'stylerem');

  document.getElementsByTagName('head')[0].appendChild(style);


}

setRem();

window.onresize = function () {
  var stylerem = document.getElementById('stylerem');
  //如果存在stylerem，则删除
  if (stylerem) {
    stylerem.remove();
  }
  setRem();
}