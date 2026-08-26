(function () {
  var container = document.getElementById("profile-content");
  if (!container) return;

  fetch("data/profile.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load profile.json");
      return res.json();
    })
    .then(function (profile) {
      var bioHtml = (profile.bio || [])
        .map(function (line) {
          return "<p>" + escapeHtml(line) + "</p>";
        })
        .join("");

      var policy = profile.policy || {};
      var interests = profile.interests || {};
      var favorite = profile.favorite || {};

      container.innerHTML =
        '<div class="profile reverse">' +
        '<div class="caption">' +
        "<h3>Name</h3>" +
        "<p><span>" +
        escapeHtml(profile.name) +
        "</span></p>" +
        "<h3>Bio</h3>" +
        bioHtml +
        "</div>" +
        '<img alt="' +
        escapeAttr(profile.photoAlt || profile.name) +
        '" id="profile-img" src="' +
        escapeAttr(profile.photo) +
        '">' +
        "</div>" +
        renderBlock(policy) +
        renderBlock(interests) +
        renderFavorite(favorite);
    })
    .catch(function (err) {
      console.error(err);
      container.innerHTML =
        "<p>Profileデータを読み込めませんでした。ローカルサーバー経由で開いてください。</p>";
    });

  function renderBlock(block) {
    if (!block || !block.heading) return "";
    var itemsHtml = (block.items || [])
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");

    return (
      '<div class="profile-block">' +
      "<h2>" +
      escapeHtml(block.heading) +
      "</h2>" +
      (block.title ? "<h3>" + escapeHtml(block.title) + "</h3>" : "") +
      (block.lead ? "<p>" + escapeHtml(block.lead) + "</p>" : "") +
      (itemsHtml ? '<ul class="profile-list">' + itemsHtml + "</ul>" : "") +
      (block.closing ? "<p>" + escapeHtml(block.closing) + "</p>" : "") +
      "</div>"
    );
  }

  function renderFavorite(favorite) {
    if (!favorite || !favorite.heading) return "";
    var tags = (favorite.tags || []).join(" / ");
    var detailsHtml = (favorite.details || [])
      .map(function (detail) {
        return (
          "<h3>" +
          escapeHtml(detail.label) +
          "</h3>" +
          "<p>" +
          escapeHtml(detail.body) +
          "</p>"
        );
      })
      .join("");

    return (
      '<div class="profile-block">' +
      "<h2>" +
      escapeHtml(favorite.heading) +
      "</h2>" +
      (favorite.title ? "<h3>" + escapeHtml(favorite.title) + "</h3>" : "") +
      (tags ? "<p>" + escapeHtml(tags) + "</p>" : "") +
      detailsHtml +
      "</div>"
    );
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
