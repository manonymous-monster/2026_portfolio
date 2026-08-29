# 2026_portfolio

静的HTMLで構成したポートフォリオサイトです。

## 設計方針（SEO / LLMO）

フレームワーク全面移行ではなく、**JSONをソース・オブ・トゥルースにした静的HTML生成（SSG）** で公開しています。

- 一覧・詳細の本文はビルド時にHTMLへ埋め込み（クローラがJS実行なしで読める）
- 作品詳細はパス型URL: `/works/{id}/`（`h1` は案件名）
- 各作品・プロフィールに `description` を持ち、`<title>` / meta / OGP に反映
- 旧URL `work.html?id=` は `work.html` からパス型へリダイレクト

## データ

| ファイル | 主なメタ項目 |
| --- | --- |
| `data/works.json` | `id`, `title`, `description`, … |
| `data/profile.json` | `name`, `description`, `bio`, `policy` |

## 開発

```bash
npm install
npm run build      # CSS + dist/ + works/{id}/
npm run dev        # ビルドしてから Vite（:5173）
```

`/works/{id}/` を見る前に **必ず一度 `npm run build`（または `npm run dev`）** してください。未生成のまま Vite をルートで動かすと、存在しないパスがトップに落ちて WORKS/PROFILE が出ることがあります（`appType: 'mpa'` でフォールバックは無効化済み）。

編集するのは `data/`・`css/`・`js/`（インタラクション）・`scripts/build.mjs`。公開物は `dist/` です。
