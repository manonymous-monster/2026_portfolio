(function () {
  var container = document.getElementById("work-detail");
  if (!container) return;

  var params = new URLSearchParams(window.location.search);
  var workId = params.get("id");

  fetch("data/works.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load works.json");
      return res.json();
    })
    .then(function (works) {
      var work = works.find(function (item) {
        return item.id === workId;
      });

      if (!work) {
        container.innerHTML =
          '<div class="caption-detail"><h1>WORK</h1><p>指定された作品が見つかりませんでした。</p><p><a href="index.html#WORKS">WORKS一覧へ戻る</a></p></div>';
        return;
      }

      document.title = work.title + " | AMANO RIEKO PORTFOLIO";

      var sectionsHtml = (work.sections || [])
        .map(function (section) {
          return (
            "<h5>" +
            escapeHtml(section.heading) +
            "</h5>" +
            "<p>" +
            escapeHtml(section.body).replace(/\n/g, "<br>") +
            "</p>"
          );
        })
        .join("");

      var compsHtml = (work.designComps || [])
        .map(function (comp) {
          var sizeClass = comp.size === "sm" ? "sm-size" : "pc-size";
          return (
            '<img src="' +
            escapeAttr(comp.src) +
            '" alt="' +
            escapeHtml(comp.alt || work.title) +
            '" class="' +
            sizeClass +
            ' portfolio_border">'
          );
        })
        .join("");

      container.innerHTML =
        '<div class="caption-detail">' +
        "<h1>WORK</h1>" +
        "<h3>Project</h3>" +
        "<p>" +
        escapeHtml(work.project) +
        (work.year ? "（" + escapeHtml(work.year) + "）" : "") +
        "</p>" +
        "<br>" +
        '<img src="' +
        escapeAttr(work.visual) +
        '" alt="' +
        escapeHtml(work.title) +
        '" class="main-visual">' +
        sectionsHtml +
        "</div>" +
        (compsHtml
          ? '<div class="design-comp">' + compsHtml + "</div>"
          : "");
    })
    .catch(function (err) {
      console.error(err);
      container.innerHTML =
        '<div class="caption-detail"><h1>WORK</h1><p>Worksデータを読み込めませんでした。</p><p>ローカルサーバー経由で開いてください。</p></div>';
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
