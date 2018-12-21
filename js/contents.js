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
  var iconURL = chrome.extension.getURL("images/icon.png")
  console.log(iconURL)
//  $('input[type="text"][name="q"]').after('<button class="quoter-button"><img src="' + iconURL + '"></button>');
  $('div[class="voice_search_button"]').before('<div class="qcss-button qjs-button"><img src="' + iconURL + '" title="Search by Ouoter"></div>')
  $('div.qjs-button').click(function() {
    console.log("cliced!")
  })
})
