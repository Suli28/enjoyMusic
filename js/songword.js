$(function () {

  //防止按下拖拽时出现卡音
  var isPress = false;

  //歌词面板
  window.index = 0;

  //控制条的进度条百分比
  window.percent = 0;

  //获取progress-box的宽度
  var progressBoxWidth = $('.progress-box').width();
  console.log('progressBoxWidth ==> ', progressBoxWidth);

  //获取mask宽度
  var maskWidth = $('.mask').width();
  console.log('maskWidth ==> ', maskWidth);

  //mask移动范围
  var minLeft = 0;

  var maxLeft = progressBoxWidth - maskWidth;

  var wordsBoxTop = parseFloat($('.words-box').css('top'));
  // console.log('wordsBoxTop ==> ', wordsBoxTop);

  //监听音频实时变化
  audio.ontimeupdate = function () {

    if (isPress) {
      return;
    }

    var thisT = this.currentTime;

    // console.log(this.currentTime);
    var dt = $('.singer-avatar').data('dt') / 1000;
    // console.log('dt ==> ', dt);

    var percent1 = thisT / dt;

    $('.currenttime').text(formatTime(thisT * 1000));

    //移动滑块
    $('.mask').css({
      left: maxLeft * percent1 + 'px'
    })

    //激活进度条
    $('.active-progress').css({
      width: (maxLeft * percent1) + maskWidth / 2 + 'px'
    })


    //移动歌词


    var $ps = $('.words-box>p');

    //获取p高度
    var pHeight = $($ps[0]).height();
    // console.log('pHeight ==> ', pHeight);

    for (var i = index; i < $ps.length; i++) {

      //获取当前p的时间
      var t1 = Number($($ps[i]).attr('name'));
      // console.log('t1 ==> ', t1);

      // console.log('thisT ==> ', thisT);

      //获取下一个p时间
      //防止越界
      var t2 = 0;
      if ($ps[i + 1]) {
        t2 = Number($($ps[i + 1]).attr('name'));
      } else {
        t2 = Number.MAX_VALUE;
      }

      // console.log('t2 ==> ', t2);

      //如果满足条件，歌词处于 $ps[i]
      if (thisT >= t1 && thisT < t2) {

        index = i;

        // console.log('进来');

        $($ps[i]).addClass('active').prev().removeClass('active');

        //words-box移动top
        var top = wordsBoxTop - pHeight * i;
        // console.log('top ==> ', top);

        $('.words-box').animate({
          top: top + 'px'
        }, 60)

        break;
      }

    }

  }


  $('.header-colse').on('click', function () {

    //隐藏歌词面板
    $('.song-word').animate({
      top: '100%'
    }, 300)

  })


  //手机端： 没有鼠标，使用触摸事件
  //ontouchstart: 手指触碰屏幕时触发
  //ontouchmove: 手指屏幕在移动时触发
  //ontouchend: 手指离开屏幕时触发
  //ontouchcancel: 触摸事件被取消 (来电显示)


  function move(e) {
    //获取相对于整个页面的x坐标
    var pageX = e.changedTouches[0].pageX;
    // console.log('pageX ==> ', pageX);

    var left = pageX - maskWidth / 2;

    left = left <= minLeft ? minLeft : left >= maxLeft ? maxLeft : left;

    //移动mask
    $('.mask').css({
      left: left + 'px'
    })

    //激活进度条
    $('.active-progress').css({
      width: left + 'px'
    })


    //设置音频进度
    percent = left / maxLeft;

  }



  //手指开始触碰屏幕
  $('.layer').on('touchstart', function (e) {
    isPress = true;
    move(e);

  })

  //手指在屏幕移动时
  $('.layer').on('touchmove', function (e) {
    move(e);
  })

  //手指离开屏幕时
  $('.layer').on('touchend', function () {
    var ct = audio.duration * percent;
    audio.currentTime = ct;
    $('.currenttime').text(formatTime(ct * 1000));

    isPress = false;
  })


})