/**
 * Static HTML generator for portfolio (SEO / LLMO-friendly).
 * Source of truth: data/*.json + css/js/images
 * Output: dist/ with path-based work pages at works/{id}/
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SITE_NAME = "AMANO RIEKO PORTFOLIO";
const AUTHOR = "Amano Rieko";
const CONTACT_MAIL =
  "mailto:syugarunes@yahoo.co.jp?subject=%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B";
const DEFAULT_OG = "/images/sample.jpg";

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
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

/** Resolve asset path relative to page depth ('' | '../..') */
function asset(prefix, relPath) {
  if (!relPath) return "";
  if (/^https?:\/\//i.test(relPath) || relPath.startsWith("/")) return relPath;
  return prefix ? `${prefix}/${relPath}` : relPath;
}

function workPath(id) {
  return `works/${id}/`;
}

function rmrf(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  mkdirp(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function copyFile(src, dest) {
  mkdirp(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function navLinks(prefix) {
  const home = asset(prefix, "index.html");
  return `
					<ul>
						<li>
							<a class="nav-link" href="${home}#WORKS">
								<span class="nav-link__track">
									<span class="nav-link__text">WORKS</span>
									<span class="nav-link__text" aria-hidden="true">WORKS</span>
								</span>
							</a>
						</li>
						<li>
							<a class="nav-link" href="${home}#PROFILE">
								<span class="nav-link__track">
									<span class="nav-link__text">PROFILE</span>
									<span class="nav-link__text" aria-hidden="true">PROFILE</span>
								</span>
							</a>
						</li>
						<li>
							<a class="nav-link" href="${CONTACT_MAIL}">
								<span class="nav-link__track">
									<span class="nav-link__text">CONTACT</span>
									<span class="nav-link__text" aria-hidden="true">CONTACT</span>
								</span>
							</a>
						</li>
					</ul>`;
}

function headMeta({ title, description, ogType, ogImage, prefix }) {
  const desc = escapeAttr(description);
  const ttl = escapeAttr(title);
  const img = ogImage.startsWith("/")
    ? ogImage
    : `/${ogImage.replace(/^\.\.\//, "").replace(/^\/?/, "")}`;
  return `<meta charset="UTF-8">
	<meta content="width=device-width, initial-scale=1.0" name="viewport">
	<title>${ttl}</title>
	<meta name="description" content="${desc}">
	<meta name="author" content="${AUTHOR}">
	<meta property="og:type" content="${ogType}">
	<meta property="og:site_name" content="${SITE_NAME}">
	<meta property="og:title" content="${ttl}">
	<meta property="og:description" content="${desc}">
	<meta property="og:image" content="${escapeAttr(img)}">
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content="${ttl}">
	<meta name="twitter:description" content="${desc}">
	<meta name="twitter:image" content="${escapeAttr(img)}">
	<link rel="icon" href="${asset(prefix, "favicon.ico")}" type="image/x-icon">
	<link href="${asset(prefix, "css/reset.css")}" rel="stylesheet">
	<link href="${asset(prefix, "css/style.css")}" rel="stylesheet">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@300;400;500;700;900&display=swap" rel="stylesheet">`;
}

function shell({ title, description, ogType, ogImage, prefix, bodyHtml, scripts }) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
	${headMeta({ title, description, ogType, ogImage, prefix })}
</head>
<body>
	<div class="wrap">
		<header class="header">
			<div class="header-inner">
				<a href="${asset(prefix, "index.html")}"><img alt="天野 ポートフォリオ" src="${asset(prefix, "images/AMANO_PORTFOLIO.svg")}"></a>
			</div>
			<div class="openbtn">
				<span></span><span></span><span></span>
			</div>
			<div class="nav">
				<nav>
${navLinks(prefix)}
				</nav>
			</div>
		</header>
${bodyHtml}
	</div>
	<footer class="footer">
		<p id="page-top"><a href="#">PAGE TOP</a></p><small>&copy;AMANO&nbsp;RIEKO&nbsp;All Rights Reserved.</small>
	</footer>
	<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
	<script src="${asset(prefix, "js/nav-hover.js")}"></script>
	<script src="${asset(prefix, "js/ham.js")}"></script>
	<script src="${asset(prefix, "js/scroll-btn.js")}"></script>
${scripts || ""}
</body>
</html>
`;
}

function renderWorksList(works, prefix) {
  return works
    .map((work) => {
      const href = asset(prefix, workPath(work.id));
      const label = `${escapeHtml(work.category)}&nbsp;|&nbsp;${escapeHtml(work.type)}`;
      return `<li>
					<a href="${href}">
						<img alt="${escapeAttr(work.title)}" src="${asset(prefix, work.thumbnail)}">
						<p>
							<span class="works_list__title">${escapeHtml(work.title)}</span>
							<span class="works_list__meta">${label}</span>
						</p>
					</a>
				</li>`;
    })
    .join("\n\t\t\t\t");
}

function renderProfile(profile, prefix) {
  const bioHtml = (profile.bio || [])
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("\n\t\t\t\t\t");
  const policy = profile.policy || {};
  const itemsHtml = (policy.items || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("\n\t\t\t\t\t\t");

  const policyHtml = policy.heading
    ? `<h3>${escapeHtml(policy.heading)}</h3>
						${policy.title ? `<p>${escapeHtml(policy.title)}</p>` : ""}
						${policy.lead ? `<p>${escapeHtml(policy.lead)}</p>` : ""}
						${itemsHtml ? `<ul class="profile-list">\n\t\t\t\t\t\t${itemsHtml}\n\t\t\t\t\t</ul>` : ""}
						${policy.closing ? `<p>${escapeHtml(policy.closing)}</p>` : ""}`
    : "";

  return `<div class="profile">
					<img alt="${escapeAttr(profile.photoAlt || profile.name)}" id="profile-img" src="${asset(prefix, profile.photo)}">
					<div class="caption">
						<h3>Name</h3>
						<p><span>${escapeHtml(profile.name)}</span></p>
						<h3>Bio</h3>
						${bioHtml}
						${policyHtml}
					</div>
				</div>`;
}

function renderWorkTags(tags) {
  if (!tags || !tags.length) return "";
  const items = tags
    .map((tag) => `<li>${escapeHtml(tag)}</li>`)
    .join("");
  return `<ul class="work-tags">${items}</ul>`;
}

function renderWorkDetail(work, prefix) {
  const metaLine = `${escapeHtml(work.category)} | ${escapeHtml(work.type)}${
    work.year ? `（${escapeHtml(work.year)}）` : ""
  }`;

  const sectionsHtml = (work.sections || [])
    .map(
      (section) =>
        `<h2>${escapeHtml(section.heading)}</h2>\n\t\t\t\t\t<p>${escapeHtml(section.body).replace(/\n/g, "<br>")}</p>`
    )
    .join("\n\t\t\t\t\t");

  const compsHtml = (work.designComps || [])
    .map((comp) => {
      const sizeClass = comp.size === "sm" ? "sm-size" : "pc-size";
      return `<img src="${asset(prefix, comp.src)}" alt="${escapeAttr(comp.alt || work.title)}" class="${sizeClass} portfolio_border">`;
    })
    .join("\n\t\t\t\t\t");

  return `<div class="info-container" id="work-detail">
				<div class="caption-detail">
					<h1>${escapeHtml(work.title)}</h1>
					<p class="work-meta">${metaLine}</p>
					${renderWorkTags(work.tags)}
					<img src="${asset(prefix, work.visual)}" alt="${escapeAttr(work.title)}" class="main-visual">
					${sectionsHtml}
				</div>
				${compsHtml ? `<div class="design-comp">\n\t\t\t\t\t${compsHtml}\n\t\t\t\t</div>` : ""}
			</div>`;
}

function buildIndex(works, profile) {
  const prefix = "";
  const description =
    profile.description ||
    "Web制作・フロントエンドを中心に、設計から実装・運用まで担当する Amano Rieko のポートフォリオサイトです。";

  const bodyHtml = `		<h1 class="visually-hidden">${SITE_NAME}</h1>
		<div class="main-visual"><img alt="メインビジュアル" src="${asset(prefix, "images/sample.jpg")}"></div>
		<div class="common-container">
			<div class="works-container">
				<h2 class="jump_point" id="WORKS">WORKS</h2>
				<div class="works_list">
					<ul id="works-list">
				${renderWorksList(works, prefix)}
					</ul>
				</div>
			</div>
			<div class="about-container">
				<h2 class="jump_point" id="PROFILE">PROFILE</h2>
				<div id="profile-content">
				${renderProfile(profile, prefix)}
				</div>
			</div>
		</div>`;

  return shell({
    title: SITE_NAME,
    description,
    ogType: "website",
    ogImage: DEFAULT_OG,
    prefix,
    bodyHtml,
  });
}

function buildWorkPage(work) {
  const prefix = "../..";
  const title = `${work.title} | ${SITE_NAME}`;
  const description =
    work.description ||
    `${work.title}（${work.category} / ${work.type}）。Amano Rieko のポートフォリオ作品です。`;
  const ogImage = work.visual
    ? `/${String(work.visual).replace(/^\//, "")}`
    : DEFAULT_OG;

  const bodyHtml = `		<div class="common-container">
			${renderWorkDetail(work, prefix)}
		</div>`;

  return shell({
    title,
    description,
    ogType: "article",
    ogImage,
    prefix,
    bodyHtml,
  });
}

function buildRedirectShim() {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<meta name="robots" content="noindex">
	<title>Redirecting… | ${SITE_NAME}</title>
	<script>
		(function () {
			var id = new URLSearchParams(location.search).get("id");
			if (id) {
				location.replace("works/" + encodeURIComponent(id) + "/");
			} else {
				location.replace("index.html");
			}
		})();
	</script>
	<meta http-equiv="refresh" content="0;url=index.html">
</head>
<body>
	<p>Redirecting… <a href="index.html">トップへ</a></p>
</body>
</html>
`;
}

function main() {
  const works = readJson("data/works.json");
  const profile = readJson("data/profile.json");

  rmrf(DIST);
  mkdirp(DIST);

  // CSS (compiled style.css + reset)
  copyFile(path.join(ROOT, "css/reset.css"), path.join(DIST, "css/reset.css"));
  copyFile(path.join(ROOT, "css/style.css"), path.join(DIST, "css/style.css"));

  const faviconSrc = path.join(ROOT, "favicon.ico");
  if (fs.existsSync(faviconSrc)) {
    copyFile(faviconSrc, path.join(DIST, "favicon.ico"));
  }

  // Interactive JS only (content is baked into HTML)
  for (const file of ["ham.js", "nav-hover.js", "scroll-btn.js"]) {
    copyFile(path.join(ROOT, "js", file), path.join(DIST, "js", file));
  }

  // Images
  copyDir(path.join(ROOT, "images"), path.join(DIST, "images"));

  // Optional: keep JSON in dist for transparency / future tooling
  mkdirp(path.join(DIST, "data"));
  copyFile(path.join(ROOT, "data/works.json"), path.join(DIST, "data/works.json"));
  copyFile(
    path.join(ROOT, "data/profile.json"),
    path.join(DIST, "data/profile.json")
  );

  fs.writeFileSync(path.join(DIST, "index.html"), buildIndex(works, profile));
  fs.writeFileSync(path.join(DIST, "work.html"), buildRedirectShim());

  // Also emit path pages under repo root so Vite (project root / :5173) can serve them.
  // Keep works/original/ untouched.
  const rootWorks = path.join(ROOT, "works");
  mkdirp(rootWorks);
  for (const entry of fs.readdirSync(rootWorks, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== "original") {
      rmrf(path.join(rootWorks, entry.name));
    }
  }

  for (const work of works) {
    const page = buildWorkPage(work);
    const distDir = path.join(DIST, "works", work.id);
    mkdirp(distDir);
    fs.writeFileSync(path.join(distDir, "index.html"), page);

    const rootDir = path.join(rootWorks, work.id);
    mkdirp(rootDir);
    fs.writeFileSync(path.join(rootDir, "index.html"), page);
  }

  console.log(`Built ${works.length} work pages → dist/ and works/{id}/`);
  console.log("  dist/index.html");
  console.log("  work.html (legacy ?id= redirect)");
  works.forEach((w) => console.log(`  works/${w.id}/`));
}

main();
