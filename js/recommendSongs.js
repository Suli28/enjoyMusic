$(function () {

  //获取audio
  window.audio = $('#audio')[0];

  //根据歌曲的id获取音频
  //http://www.arthurdon.top:3000/song/url?id=1398294372

  var baseAudioUrl = 'http://www.arthurdon.top:3000/song/url';

  //开始截取下标
  var startIndex = 12;

  //截取数据数量
  var count = 12;

  //标记是否存在数据
  var isHas = true;

  //生成页面数据
  function createData(data) {

    $.each(data, function (i, v) {

      console.log('v.id ==> ', v.id);

      var div = $(`<div data-id="${v.id}" data-play="0" class="songs-list-item">
              <div class="songs-img">
                <img class="auto-img" src="${v.al.picUrl}" />
              </div>
              <div class="songs-info">
                <div class="t1 one-text1 song-name">${v.al.name}</div>
                <div class="t2 one-text1 singer-name">${v.name}</div>
              </div>
              <div class="songs-time" data-dt="${v.dt}">${formatTime(v.dt)}</div>
              <div class="songs-play">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>`);

      $('.songs-list').append(div);

    })

  }

  //保存当前滚动的所有定时器序号
  var timers = [];


  //获取header高度
  var headerHeight = parseFloat($('header').css('height'));
  console.log('headerHeight ==> ', headerHeight);


  $('.main-content2').on('scroll', function () {

    if (!isHas) {
      return;
    }

    //保留当前this的指向
    var self = this;

    //获取缓存数据
    var currentSongs = JSON.parse(localStorage.getItem('currentSongs'));

    var songData = currentSongs.playlist.tracks;

    var timer = setTimeout(function () {

      for (var i = 1; i < timers.length; i++) {
        clearTimeout(timers[i]);
      }

      var scrollTop = $(self).scrollTop()
      // console.log('scrollTop ==> ', scrollTop);

      //获取最后一个节点
      var last = $('.songs-list-item').last();
      var lastTop = last.offset().top;

      var lastHeight = parseFloat(last.css('height'));

      console.log('lastTop ==> ', lastTop);

      console.log('scrollTop + headerHeight + lastHeight ==> ', scrollTop + headerHeight + lastHeight)

      if (scrollTop + headerHeight + lastHeight >= lastTop) {
        console.log('触发加载');

        // console.log('songData 111 ==> ', songData);

        //每次加载12条数据
        var data = songData.slice(startIndex, startIndex + count)
        createData(data);

        //重置下次开始截取数据的下标
        startIndex += count;

        if (data.length < count) {
          //本次不足12条数据，下次没有数据可加载
          isHas = false;
        }


        //最近播放歌曲id匹配歌单详情的歌曲id
        var cId = $('.singer-avatar').attr('id');

        var $songsListItems = $('.songs-list>.songs-list-item');

        var controlsName = $('.controls').attr('name');

        for (var i = 0; i < $songsListItems.length; i++) {
          var sId = $($songsListItems[i]).data('id');

          if (cId == sId) {
            $($songsListItems[i]).addClass('active').data('play', controlsName);

            if (controlsName == 0) {
              $($songsListItems[i]).find('.songs-play').removeClass('play-active');
            } else {
              $($songsListItems[i]).find('.songs-play').addClass('play-active');
            }
          }

        }


      }

      timers = [];

    }, 400)


    timers.push(timer);

  })

  //绑定audio可以播放事件
  audio.oncanplay = function () {

    index = 0;

    //控制条的进度条百分比
    percent = 0;

    console.log('可以播放');
    
    //移除之前的歌词
    $('.words-box').empty();

    this.play();

    //判断是否点击最近播放列表播放歌曲
    if (isRecent) {

      var $rsic = $('.recent-songs-item.active');
      //获取播放歌曲的id
      var sId = $rsic.data('id');

      //获取图片链接
      var imgSrc = $rsic.data('avatar');
      console.log('imgSrc ==> ', imgSrc);

      console.log('从最近播放列表播放歌曲');

      //将播放标记修改为1
      $('.controls').attr('name', 1);

      //设置头像
      var d0 = $rsic.data('dt');
      $('.singer-avatar').attr('id', sId).addClass('active').data('dt', d0).find('img').attr('src', imgSrc);

      //歌词面板音频时间
      $('.duration').text(formatTime(d0));

      //执行音符动画
      $('.yinfu').addClass('active');

      //修改播放暂停图标
      $('.play').css({
        backgroundImage: 'url("./icons/pause.png")'
      })

      //修改歌手和歌名
      $('.singer-info .song-name').text($rsic.find('.recent-songname').text());
      $('.singer-info .singer').text($rsic.find('.recent-singer').text());

      //歌词面板的歌名
      $('.sname').text($rsic.find('.recent-songname').text());

      //重置判断是否点击最近播放列表播放歌曲
      isRecent = false;
    } else {

      //animation-play-state: running
      //paused: 停止动画
      //running: 执行动画

      //data-play: 0  停止
      //data-play: 1  播放
      var $songsListItemActive = $('.songs-list-item.active');
      $songsListItemActive.data('play', 1).find('.songs-play').addClass('play-active');

      //标记当前歌曲是播放状态
      $('.controls').attr('name', 1);

      $('.play').css({
        backgroundImage: 'url("./icons/pause.png")'
      })

      //记录播放歌曲的id
      $('.singer-avatar').attr('id', $songsListItemActive.data('id'));

      //记录音频时间
      var d1 = $songsListItemActive.find('.songs-time').data('dt')
      $('.singer-avatar').data('dt', d1);

       //歌词面板音频时间
       $('.duration').text(formatTime(d1));

      //歌名
      $('.singer-info').find('.song-name').text($songsListItemActive.find('.song-name').text());

      //歌手
      $('.singer-info').find('.singer').text($songsListItemActive.find('.singer-name').text());

      //执行音符动画
      $('.yinfu').addClass('active');

      //换头像并且转动头像
      var imgUrl = $('.songs-list-item.active').find('img').attr('src');
      $('.singer-avatar').addClass('active').find('img').attr('src', imgUrl);

      //歌词面板的歌名
      $('.sname').text($songsListItemActive.find('.song-name').text());

      //获取最近播放歌曲
      var recentSongsList = JSON.parse(localStorage.getItem('recentSongsList'));

      console.log('recentSongsList ==> ', recentSongsList);

      //将播放歌曲添加到本地存储

      var songId = $songsListItemActive.data('id')

      //验证当前播放歌曲的id是否在本地存储中, 如果存在，则不需要将当前播放的歌曲缓存在本地存储中
      for (var i = 0; i < recentSongsList.length; i++) {
        if (songId == recentSongsList[i].songId) {
          return;
        }
      }

      //歌曲id
      song.songId = songId;

      //图片
      song.imgUrl = $songsListItemActive.find('img').attr('src');

      //歌名
      song.songName = $songsListItemActive.find('.song-name').text();

      //歌手
      song.singerName = $songsListItemActive.find('.singer-name').text();

      //歌曲总时间
      song.songTime = $songsListItemActive.find('.songs-time').data('dt');

      if (recentSongsList.length >= 99) {
        recentSongsList.pop();
      }

      recentSongsList.unshift(song);

      localStorage.setItem('recentSongsList', JSON.stringify(recentSongsList));
    }


    //初始化歌词面板
    var songid = $('.singer-avatar').attr('id');
    $.ajax({
      type: 'GET',
      url: 'http://www.arthurdon.top:3000/lyric',
      data: {
        //歌曲id
        id: songid
      },
      success: function (data) {

        console.log('歌词加载完毕');

        //获取歌词
        var lrc = data.lrc.lyric
      
        lrc = lrc.split(/[\n\r]/);

        //去除最后一个空值
        lrc.splice(-1, 1);
        // console.log('lrc ==> ', lrc);

        //保存歌词和歌词时间
        // var lrcData = [];

        for (var i = 0; i < lrc.length; i++) {

          // var o = {};
          
          var lrcItem = lrc[i].split(/\]/);
          // console.log('lrcItem ==> ', lrcItem);

          //当前歌词的时间
          var songCt = lrcItem[0].slice(1);

          //歌词时间
          var time = songCt.split(/:/);

          //获取分钟
          var minute = Number(time[0]) * 60;

          //获取秒钟
          var second = Number(time[1]);

          //当前歌词的时刻
          var t0 = minute + second;

          // o.time = t0;
          // o.text = lrcItem[1];

          //创建歌词列表
          var p = $(`<p name="${t0}">${lrcItem[1]}</p>`);
          $('.words-box').append(p);

          // console.log('minute ==> ', minute);
          // console.log('second ==> ', second);
          // console.log('t0 ==> ', t0);

          // lrcData.push(o);

        }

        // console.log('lrcData ==> ', lrcData);

        
       

      }
    })

  }


  //绑定歌曲列表事件
  $('.songs-list').on('click', '.songs-list-item', function () {

    var self = this;

    //当前是否处于激活状态
    if ($(this).hasClass('active')) {

      //如果当前播放状态, 则需要停止
      var playStatus = $(this).data('play');

      if (playStatus == 1) {
        //停止音频
        audio.pause();
        $(this).data('play', 0).find('.songs-play').removeClass('play-active');
        $('.controls').attr('name', 0);

        $('.play').css({
          backgroundImage: 'url("./icons/play.png")'
        })

        //停止音符动画
        $('.yinfu').removeClass('active');

        //停止转动头像
        $('.singer-avatar').removeClass('active');

      } else {
        //播放音频
        audio.play();
        $(this).data('play', 1).find('.songs-play').addClass('play-active');
        $('.controls').attr('name', 1);

        $('.play').css({
          backgroundImage: 'url("./icons/pause.png")'
        })

        //执行音符动画
        $('.yinfu').addClass('active');

        //停止转动头像
        $('.singer-avatar').addClass('active');
      }

    } else {

      //歌曲id
      var songId = $(this).data('id');
      console.log('songId ==> ', songId);

      //根据歌曲id查询歌曲信息
      $.ajax({
        type: 'GET',
        url: baseAudioUrl,
        data: {
          id: songId
        },
        success: function (result) {
          console.log('result aaa ==> ', result);

          //查找之前激活的songs-list-item
          var $songsListItem = $('.songs-list-item.active');
          console.log('$songsListItem ==> ', $songsListItem);

          //如果存在之前激活的songs-list-item
          if ($songsListItem.length == 1) {
            $songsListItem.removeClass('active').data('play', 0);

            var $songPlay = $songsListItem.find('.songs-play');
            if ($songPlay.hasClass('play-active')) {
              //移除播放动画类名
              $songPlay.removeClass('play-active');
            }
          }

          //设置audio链接
          $(audio).attr('src', result.data[0].url);

          $(self).addClass('active');

          //保存音频链接
          song.audioUrl = result.data[0].url;

        }
      })

    }



  })

})