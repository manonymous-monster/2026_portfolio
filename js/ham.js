//ハンバーガーメニューをクリックしたら、htmlとbtnにステータスを追加する
$(".openbtn").click(function () {
  $(this).toggleClass('active');
  $("html").toggleClass('open');
});
//メニューエリアをクリックしたら、ステータスを解除する
$(".nav").click(function () {
  $(".openbtn").removeClass('active');
  $("html").removeClass('open');
});