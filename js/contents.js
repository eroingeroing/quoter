//
// "content_scripts"で指定したcontents.jsは、
// "matches"で合致したURLで、実行されるJavaScript
// 通常では、JavaScriptでCSSやHTMLのDOMを操作することに使用する
// レイアウトのみを操作する
//
// 下記は、manifest.jsonの指定が正しいかを確認するための記述

//alert("Hello World !!!");
// TODO 名前Quarterにした方がいいかも

$(function() {
  // 名前空間
  qt = {}

  // TODO 名前再検討、名前空間も
  qt.waiting = [] // 表示待ち
  qt.paneling = {} // 表示中
  qt.paneled = [] // 表示済み
  qt.trush = {} // 削除済み

  // console.log(iconURL)
            // TODO 相対パスを絶対パスに置換する関数
            // TODO / で始まったらドメイン直結
            // TODO . で始まってたら消す
            // TODO ..は数分消す
//   qt.absolutize = (html, regexp, url) => {
//     var dir = new String(url).substring(0, url.lastIndexOf('/'));
//     var root = new String(url).substring(0, url.indexOf('/', 9));
//     console.log(dir)
//     console.log(root)
//
//     html.replace(/(\.)\//g), dir)
////     str.replace(/.\//g), root)
//     return html
//   }
//            var imgs = $('img', $(html))
//            //console.log(imgs)
//            imgs.each((i, elm) => {
//              var href = $(elm).attr('src')
//              console.log('★'+ $(elm).attr('src'))
//              if(href.indexOf('http') !== 0){
//                $(elm).attr('src', root + href)
//              }
//              console.log($(elm).attr('src'))
//            })
//            // TODO なぜかhead内は取れない
//            var links = $('[href]', $(data))
//            console.log(links)
//            links.each((i, elm) => {
//              var href = $(elm).attr('href')
//              console.log($(elm).attr('href'))
////              if(href.indexOf('http') !== 0){
////                $(elm).attr('href', root + href)
////              }
////              console.log($(elm).attr('href'))
//            })


  // var self = this

  // ボタン設置
  var iconURL = chrome.extension.getURL("images/icon.png")
  console.log(iconURL)
  $('div[class="voice_search_button"]').before('<div class="qcss-button qjs-button"><img src="' + iconURL + '" title="Search by Quoter"></div>')
  $('div.qjs-button').click(() => {
    var url = location.protocol + '//www.google.co.jp/search?q=' + $('input[name="q"]').val().replace(' ', '+')
    console.log(url)
    $.ajax({
      url: url,
      type:'GET'
    })
    .done( (data) => {
      var html = $($.parseHTML(data))
//      console.log(html)
//      var titles = $('div.srg div.rc div.r a h3', $(html))
      // キャッシュでもはじかれる
      var titles = $('div.srg div.rc div.r span div.action-menu-panel.ab_dropdown li a.fl:contains("キャッシュ")', $(html))
      console.log(titles)
      // var self = this
      titles.each((i, elm) => {
        // console.log(i + ':' + $(e).parent().attr('href'))
        // console.log(i + ':' + $(e).html())
        qt.waiting.push({
          url: $(elm).attr('href'),
//          title: $(elm).html()
        })
      })
      console.log(qt.waiting)

      // 描画
      // TODO 元のhtml全部消していいのか（input残した方がいい？）
      $.get(chrome.runtime.getURL('html/panels.html'), (data) => {
//        console.log(data)
        $('html').html(data)
        $('head').append('<link rel="stylesheet" href="' + chrome.extension.getURL("css/panels.css") + '" />')
        $('div.qjs-panel').each((i, panel) => {
//        $(panel).html('<iframe src="' + qt.waiting[i].url + '"></iframe>')
//          $(panel).load(qt.waiting[i].url)
          $.ajax({
            url: qt.waiting[i].url,
            type:'GET'
          })
          .done( (data) => {
//            console.log(data);
            // TODO basename関数が必要？
            var root = qt.waiting[i].url
            root = new String(root).substring(0, root.lastIndexOf('/') + 1);
            console.log(root)
//            qt.absolutize(data, '', qt.waiting[i].url)

            console.log(data);
            var html = $($.parseHTML(data))
            console.log(html);

            // キャッシュ本体を取得
            var base = $('base', $(html))
            var body = $('div:last-child', $(html))
            console.log(body);
            // TODO 相対パスを絶対パスに置換する関数
            // TODO / で始まったらドメイン直結
            // TODO . で始まってたら消す
            // TODO ..は数分消す
//            var imgs = $('img', $(html))
//            //console.log(imgs)
//            imgs.each((i, elm) => {
//              var href = $(elm).attr('src')
//              console.log('★'+ $(elm).attr('src'))
//              if(href.indexOf('http') !== 0){
//                $(elm).attr('src', root + href)
//              }
//              console.log($(elm).attr('src'))
//            })
//            // TODO なぜかhead内は取れない
//            var links = $('[href]', $(data))
//            console.log(links)
//            links.each((i, elm) => {
//              var href = $(elm).attr('href')
//              console.log($(elm).attr('href'))
////              if(href.indexOf('http') !== 0){
////                $(elm).attr('href', root + href)
////              }
////              console.log($(elm).attr('href'))
//            })
//            $(panel).html(html);
            $(panel).html(base)
            $(panel).append(body);
          })
          .fail( (data) => {
            console.log(data);
          })
        })
      })
    })
    .fail( (data) => {
      console.log(data);
    })
    .always( (data) => {
    })
  })
})
