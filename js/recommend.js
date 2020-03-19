$(function () {

  //开始截取下标
  var startIndex = 0;

  //截取数据数量
  var count = 12;

  //标记是否存在数据
  var isHas = true;

  //生成页面数据
  function createData(data) {

    $.each(data, function (i, v) {

      var div = $(`<div id="${v.id}" class="info-item">
          <div class="recommend-info-layer">
            <div class="fr">
              <span class="fl listen-icon"></span>
              <span class="fl listen-count">${(v.playCount / 10000).toFixed(1)}万</span>
            </div>
          </div>
          <div class="info-img">
            <img class="auto-img" src="${v.picUrl}" alt="">
          </div>
          <div class="recommend-info-text two-text">${v.name}</div>
        </div>`);

      $('.recommend-info').append(div);

    })
  }

  //获取缓存数据
  var recommendInfo = localStorage.getItem('recommendInfo');
  // console.log('recommendInfo ==> ', recommendInfo);

  //如果不存在缓存数据，则需要请求数据
  if (!recommendInfo) {
    console.log('不存在缓存数据');

    //显示加载提示框
    $('.tip-box').show();

    //获取音乐库-推荐
    $.ajax({

      type: 'GET',

      url: 'http://www.arthurdon.top:3000/personalized',

      success: function (result) {
        console.log('result ==> ', result);

        //缓存在本地存储
        localStorage.setItem('recommendInfo', JSON.stringify(result));


        recommendInfo = result;

        //首次展示12条数据
        createData(result.result.slice(startIndex, startIndex + count));

        //重置下次开始截取数据的下标
        startIndex += count;

        //隐藏加载提示框
        $('.tip-box').hide();

      },

      error: function (err) {
        //请求失败
        console.log('err ==> ', err);
      }
    })
  } else {
    //将recommendInfo转换为普通对象
    recommendInfo = JSON.parse(recommendInfo);

    console.log('存在缓存数据');
    //首次展示12条数据
    createData(recommendInfo.result.slice(startIndex, startIndex + count));

    //重置下次开始截取数据的下标
    startIndex += count;
  }


  //懒加载歌单数据
  //获取header高度
  var headerHeight = parseFloat($('header').css('height'));
  console.log('headerHeight ==> ', headerHeight);

  //保存当前滚动的所有定时器序号
  var timers = [];

  $('.main-content1').on('scroll', function () {

    if (!isHas) {
      console.log('没有更多数据可加载');
      return;
    }

    //保留当前this的指向
    var self = this;

    var timer = setTimeout(function () {

      for (var i = 1; i < timers.length; i++) {
        clearTimeout(timers[i]);
      }

      var scrollTop = $(self).scrollTop()
      // console.log('scrollTop ==> ', scrollTop);

      //获取最后一个节点
      var last = $('.info-item').last();
      var lastTop = last.offset().top;

      var lastHeight = parseFloat(last.css('height'));

      // console.log('lastTop ==> ', lastTop);

      // console.log('scrollTop + headerHeight + lastHeight ==> ', scrollTop + headerHeight + lastHeight)

      if (scrollTop + headerHeight + lastHeight >= lastTop) {
        console.log('触发加载');
        //每次加载12条数据
        var data = recommendInfo.result.slice(startIndex, startIndex + count)
        createData(data);

        //重置下次开始截取数据的下标
        startIndex += count;
        if (data.length < count) {
          //本次不足12条数据，下次没有数据可加载
          isHas = false;
        }
      }

      timers = [];
    }, 400)

    timers.push(timer);

  })


  //绑定推荐歌单点击事件, 未来创建的节点也会绑定
  $('.recommend-info').on('click', '.info-item', function () {
    //获取歌单的id
    var songId = $(this).attr('id');
    console.log('songId ==> ', songId);

    //显示加载提示框
    $('.tip-box').show();

    //根据歌单id获取歌单详情
    $.ajax({
      type: 'GET',
      url: 'http://www.arthurdon.top:3000/playlist/detail?id=' + songId,
      success: function (result) {
        console.log('result ==> ', result);
        //隐藏加载提示框
        $('.tip-box').hide();

        $('.main-content1').hide().attr('name', 'song0');

        $('.main-content2').show().attr('name', 'song1');


        //绑定当前歌单数据
        $('#name').text(result.playlist.name);

        var data = result.playlist.tracks.slice(0, 12);

        //缓存当前数据
        localStorage.setItem('currentSongs', JSON.stringify(result))

        $.each(data, function (i,  v) {

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

        //保存专辑id
        song.id = result.playlist.id;

        //判断当前播放歌曲是否存在当前歌单中
        var isHasAudioUrl = $(audio).attr('src');

        if (!isHasAudioUrl) {
          return;
        }

        //获取controls的name
        var controlsName = $('.controls').attr('name');

        //当前播放歌曲的id
        var sId = $('.singer-avatar').attr('id');

        var $songsListItems = $('.songs-list>.songs-list-item');

        for (var i = 0; i < $songsListItems.length; i++) {

          var currentSongId = $($songsListItems[i]).data('id');

          //匹配成功
          if (sId == currentSongId) {
            console.log('进来');
            $($songsListItems[i]).data('play', controlsName).addClass('active');

            if (controlsName == 0) {
              //执行动画
              $($songsListItems[i]).find('.songs-play').removeClass('play-active');
            } else {
              $($songsListItems[i]).find('.songs-play').addClass('play-active');
            }

            return;
          }

        }
        

      }
    })
  })

})