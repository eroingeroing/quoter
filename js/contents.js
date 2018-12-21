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


  // var self = this

  // ボタン設置
  var iconURL = chrome.extension.getURL("images/icon.png")
  console.log(iconURL)
  $('div[class="voice_search_button"]').before('<div class="qcss-button qjs-button"><img src="' + iconURL + '" title="Search by Quoter"></div>')
  $('div.qjs-button').click(() => {
    console.log("cliced!")
    var url = location.protocol + '//www.google.co.jp/search?q=' + $('input[name="q"]').val().replace(' ', '+')
    console.log(url)
    $.ajax({
      url: url,
      type:'GET'
    })
    .done( (data) => {
      var html = $($.parseHTML(data))
      console.log(html)
      var titles = $('div.srg div.rc div.r a h3', $(data))
      console.log(titles)
      // var self = this
      titles.each((i, elm) => {
        // console.log(i + ':' + $(e).parent().attr('href'))
        // console.log(i + ':' + $(e).html())
        qt.waiting.push({
          url: $(elm).parent().attr('href'),
          title: $(elm).html()
        })
      })
      console.log(qt.waiting)

      // 描画
      // TODO 元のhtml全部消していいのか（input残した方がいい？）
      $.get(chrome.runtime.getURL('html/panels.html'), (data) => {
        console.log(data)
        $('html').html(data)
        $('head').append('<link rel="stylesheet" href="' + chrome.extension.getURL("css/panels.css") + '" />')
        $('div.qjs-panel').each((i, panel) => {
          //$(panel).html('<iframe src="' + qt.waiting[i].url + '"></iframe>')
          $.ajax({
            url: qt.waiting[i].url,
            type:'GET'
          })
          .done( (data) => {
            console.log(data);
            $(panel).html(data);
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
