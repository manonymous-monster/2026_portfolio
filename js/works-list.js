(function () {
  var listEl = document.getElementById("works-list");
  if (!listEl) return;

  fetch("data/works.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load works.json");
      return res.json();
    })
    .then(function (works) {
      var html = works
        .map(function (work) {
          var label = work.category + "&nbsp;|&nbsp;" + work.type;
          return (
            "<li>" +
            '<a href="work.html?id=' +
            encodeURIComponent(work.id) +
            '">' +
            '<img alt="' +
            escapeHtml(work.title) +
            '" src="' +
            escapeAttr(work.thumbnail) +
            '">' +
            "</a>" +
            "<p>" +
            escapeHtml(work.title) +
            "<br>" +
            "<span>" +
            label +
            "</span></p>" +
            "</li>"
          );
        })
        .join("");
      listEl.innerHTML = html;
    })
    .catch(function (err) {
      console.error(err);
      listEl.innerHTML =
        "<li><p>Worksデータを読み込めませんでした。<br><span>ローカルサーバー経由で開いてください。</span></p></li>";
    });

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }
})();
