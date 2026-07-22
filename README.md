# 北北桃中公園探索

整合臺北市、新北市、桃園市、臺中市公園資料的靜態網站，提供篩選、排序、地圖標示與防災資訊查詢。

**線上預覽**：[hsuchihting.github.io/taipei_park_info](https://hsuchihting.github.io/taipei_park_info/)

## 資料來源

| 資料集 | 城市 | 更新方式 |
|--------|------|----------|
| 臺北市公園基本資料 | 臺北市 | 手動更新 |
| 新北市公園資料 | 新北市 | 手動更新 |
| 防災公園資訊 | 臺北市 | 手動更新 |
| 桃園市特色公園 | 桃園市 | GitHub Actions 每週自動抓取 |
| 共融式遊戲場 | 臺中市 | 手動更新 |

## 技術架構

- **框架**：Nuxt 4 + Vue 3（`ssr: false` 靜態輸出）
- **樣式**：Tailwind CSS 4 + Vite plugin（自訂色彩：`ink`、`moss`、`leaf`、`river`、`clay`、`mist`）
- **部署**：GitHub Pages（`nuxt generate` → `.output/public`）
- **自動化**：GitHub Actions

## 專案結構

```
├── app/
│   ├── app.vue                # 根元件，載入資料
│   ├── assets/css/main.css    # Tailwind 4 theme 與全域樣式
│   ├── components/            # Vue 元件
│   └── composables/           # 核心狀態與資料邏輯
├── nuxt.config.ts             # Nuxt 設定（base URL、ssr: false）
├── tsconfig.json              # Nuxt 4 project references
├── public/
│   ├── 臺北市公園基本資料.json
│   ├── 新北市公園_export.json
│   ├── 防災公園資訊.json
│   ├── 桃園市特色公園.json    # 由 CI 自動產生
│   └── 共融式遊戲場.JSON      # 臺中市共融式遊戲場
└── .github/workflows/
    ├── deploy-pages.yml       # Push main 時自動建置並部署
    └── update-taoyuan-data.yml # 每週一抓取桃園公園資料並 commit
```

## 本機開發

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 建置預覽

```bash
npm run typecheck
npm run build    # 輸出至 .output/public
npx serve .output/public
```

## GitHub Pages 部署

1. 建立 GitHub repository，將程式碼 push 到 `main` branch。
2. 到 `Settings > Pages`，將 `Source` 設為 `GitHub Actions`。
3. 開啟 `Settings > Actions > General`，確認 Actions 有寫入權限（供 `update-taoyuan-data.yml` commit 用）。
4. 之後每次 push `main`，GitHub Actions 會自動建置並部署。

> **注意**：`nuxt.config.ts` 中 `app.baseURL` 預設為 `/`，正式部署時由 GitHub Actions workflow 透過環境變數 `NUXT_APP_BASE_URL=/taipei_park_info/` 覆寫。
