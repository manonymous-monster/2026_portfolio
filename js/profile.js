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
      var itemsHtml = (policy.items || [])
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("");

      var policyHtml = "";
      if (policy.heading) {
        policyHtml =
          "<h3>" +
          escapeHtml(policy.heading) +
          "</h3>" +
          (policy.title ? "<p>" + escapeHtml(policy.title) + "</p>" : "") +
          (policy.lead ? "<p>" + escapeHtml(policy.lead) + "</p>" : "") +
          (itemsHtml ? '<ul class="profile-list">' + itemsHtml + "</ul>" : "") +
          (policy.closing ? "<p>" + escapeHtml(policy.closing) + "</p>" : "");
      }

      container.innerHTML =
        '<div class="profile">' +
        '<img alt="' +
        escapeAttr(profile.photoAlt || profile.name) +
        '" id="profile-img" src="' +
        escapeAttr(profile.photo) +
        '">' +
        '<div class="caption">' +
        "<h3>Name</h3>" +
        "<p><span>" +
        escapeHtml(profile.name) +
        "</span></p>" +
        "<h3>Bio</h3>" +
        bioHtml +
        policyHtml +
        "</div>" +
        "</div>";
    })
    .catch(function (err) {
      console.error(err);
      container.innerHTML =
        "<p>Profileデータを読み込めませんでした。ローカルサーバー経由で開いてください。</p>";
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
