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
        document.title = "Not Found | AMANO RIEKO PORTFOLIO";
        container.innerHTML =
          '<div class="caption-detail"><h1>作品が見つかりません</h1><p>指定された作品が見つかりませんでした。</p><p><a href="index.html#WORKS">WORKS一覧へ戻る</a></p></div>';
        return;
      }

      var pageTitle = work.title + " | AMANO RIEKO PORTFOLIO";
      var description = buildDescription(work);
      setPageMeta(pageTitle, description);

      var sectionsHtml = (work.sections || [])
        .map(function (section) {
          return (
            "<h2>" +
            escapeHtml(section.heading) +
            "</h2>" +
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

      var metaLine =
        escapeHtml(work.category) +
        " | " +
        escapeHtml(work.type) +
        (work.year ? "（" + escapeHtml(work.year) + "）" : "");

      container.innerHTML =
        '<div class="caption-detail">' +
        "<h1>" +
        escapeHtml(work.title) +
        "</h1>" +
        '<p class="work-meta">' +
        metaLine +
        "</p>" +
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
        '<div class="caption-detail"><h1>読み込みエラー</h1><p>Worksデータを読み込めませんでした。</p><p>ローカルサーバー経由で開いてください。</p></div>';
    });

  function buildDescription(work) {
    var point = (work.sections || []).find(function (section) {
      return section.heading === "ポイント" || section.heading === "担当業務";
    });
    if (point && point.body) {
      return String(point.body).replace(/\s+/g, " ").trim().slice(0, 120);
    }
    return (
      work.title +
      "（" +
      work.category +
      " / " +
      work.type +
      "）。Amano Rieko のポートフォリオ作品です。"
    );
  }

  function setPageMeta(title, description) {
    document.title = title;
    setMetaById("meta-description", "content", description);
    setMetaById("meta-og-title", "content", title);
    setMetaById("meta-og-description", "content", description);
    setMetaById("meta-twitter-title", "content", title);
    setMetaById("meta-twitter-description", "content", description);
  }

  function setMetaById(id, attr, value) {
    var el = document.getElementById(id);
    if (el) el.setAttribute(attr, value);
  }

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
