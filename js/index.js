$(function () {

  //记录播放歌曲的数据，以便写入到本地存储中
  window.song = {};

  //初始化播放列表
  var recentSongsList = localStorage.getItem('recentSongsList');

  if (!recentSongsList) {
    localStorage.setItem('recentSongsList', JSON.stringify([]));
  }

  // console.log('recentSongsList ==> ', recentSongsList);

  $('.child-list').on('click', 'span', function () {

    //获取data-module
    var module = $(this).data('module');

    // 隐藏其他name="song1"的元素
    $('[name="song1"]').hide();

    $('.' + module).show().attr('name', 'song1');

    $('.songs-list').empty();

  })

  //最近播放列表
  $('.list-menu').on('click', function () {

    $('.recent-songs').empty();

    //生成列表
    var songsList = JSON.parse(localStorage.getItem('recentSongsList'));

    //name: 标记当前歌曲是否播放停止，1：播放，0：停止
    $.each(songsList, function (i, v) {
      var div = $(`<div class="recent-songs-item" data-dt="${v.songTime}" data-id="${v.songId}" data-audiourl="${v.audioUrl}" data-avatar="${v.imgUrl}">
            <div class="fl">
              <span class="fl index">${i + 1 >= 10 ? i + 1 : '0' + (i + 1)}</span>
              <div class="fl recent-avatar" style="background-image: url(${v.imgUrl});">
                
              </div>
              <div class="fl">
                <div class="recent-songname one-text">${v.songName}</div>
                <div class="recent-singer one-text">${v.singerName}</div>
              </div>
            </div>
            <div class="fr delete"></div>
          </div>`);

      $('.recent-songs').append(div);

    })

    //获取当前播放歌曲的id
    var currentSongId = $('.singer-avatar').attr('id');
    console.log('currentSongId ==> ', currentSongId);

    //如果歌曲id存在
    if (currentSongId != undefined) {

      $('.recent-songs-item').each(function (i, v) {

        var dataId = $(v).data('id');

        if (currentSongId == dataId) {
          $(v).addClass('active');
        }

      })

    }

    $('.recent-list').show().animate({
      top: 0
    }, 300);   

  })

  //隐藏播放最近播放列表
  $('.recent-list').on('click', function (e) {
    var target = e.target;
    console.log('target ==> ', target);

    if (target === this) {
      $(this).animate({
        top: '100%'
      }, 300, function () {
        $(this).hide();
      })
    }
  })

  //删除本地存储歌曲
  $('.recent-songs').on('click', '.delete', function (e) {
    //阻止事件冒泡
    e.stopPropagation();
    
    //获取删除歌曲的id
    var parent = $(this).parents('.recent-songs-item');
    var songId = parent.data('id');
    console.log('songId ==> ', songId);

    var recentSongs = JSON.parse(localStorage.getItem('recentSongsList'));

    $.each(recentSongs, function (i, v) {
      console.log('i ==> ', i);

      //如果找到删除歌曲的id
      if (v.songId == songId) {

        recentSongs.splice(i, 1);

        parent.remove();

        localStorage.setItem('recentSongsList', JSON.stringify(recentSongs));

        //更正序号
        var $indexs = $('.index');
        for (var j = i; j < recentSongs.length; j++) {
          $indexs.eq(j).text(j + 1 >= 10 ? j + 1 : '0' + (j + 1));
        }

        //跳出循环, 终止遍历
        return false;
      }

    })

  })

  //点击最近播放列表歌曲

  //判断是否点击最近播放列表播放歌曲
  window.isRecent = false;
  $('.recent-songs').on('click', '.recent-songs-item', function (e) {
    //阻止事件冒泡
    e.stopPropagation();

    //如果当前歌曲是处于激活状态
    if ($(this).hasClass('active')) {
      // 暂停播放
      toggleMusicStatus();
    } else {

      //判断是否点击最近播放列表播放歌曲
      isRecent = true;

      //去除已经激活的歌曲状态
      $('.recent-songs-item.active').removeClass('active');

      //判断详细歌单面板是否显示
      var isHidden = $('.main-content2').is(':hidden');
      // console.log('isHidden ==> ', isHidden);

      //查找当前播放歌曲是否歌单中
      if (!isHidden) {
        var sId = $(this).data('id');
        // console.log('sId ==> ', sId);

        var $songsListItems = $('.songs-list>.songs-list-item');

        for (var i = 0; i < $songsListItems.length; i++) {
          var cId = $($songsListItems[i]).data('id');
          if (sId == cId) {
            //找到
            $($songsListItems[i]).addClass('active').data('play', 1).find('.songs-play').addClass('play-active');

            //打断当前循环
            break;
          }
        }

        
      }

      

      //播放新歌曲
      var audioUrl = $(this).data('audiourl');
      console.log('audioUrl ==> ', audioUrl);

      audio.src = audioUrl;

      $(this).addClass('active');

    }

  })

  //暂停播放
  function toggleMusicStatus() {
    var controlsName = $('.controls').attr('name');

      if (controlsName == 0) {
        //播放
        audio.play();
        $('.controls').attr('name', 1);
        $('.singer-avatar').addClass('active');
        $('.play').css({
          backgroundImage: 'url("./icons/pause.png")'
        })
        //执行音符动画
        $('.yinfu').addClass('active');

        $('.songs-list-item.active').data('play', 1).find('.songs-play').addClass('play-active');
      } else {
        //停止
        audio.pause();
        $('.controls').attr('name', 0);
        $('.singer-avatar').removeClass('active');
        $('.play').css({
          backgroundImage: 'url("./icons/play.png")'
        })
        //停止音符动画
        $('.yinfu').removeClass('active');

        $('.songs-list-item.active').data('play', 0).find('.songs-play').removeClass('play-active');
      }
  }

  //控制台的播放暂停
  $('.play').on('click', function () {

    var isHasUrl = audio.getAttribute('src');
    console.log('isHasUrl ==> ', isHasUrl);

    //如果不存url
    if (!isHasUrl) {
      console.log('音频不存在');
      return;
    }

    //暂停播放
    toggleMusicStatus();
   

  })

  //点击头像
  $('.singer-avatar').on('click', function () {

    $('.song-word').animate({
      top: 0
    }, 300)

  })


})