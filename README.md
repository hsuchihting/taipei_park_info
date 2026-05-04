# 北北桃公園探索

這是一個使用 Tailwind CSS 製作的靜態網站，整合：

- 臺北市公園基本資料
- 新北市公園資料
- 桃園市特色公園 API，在 GitHub Actions 部署時產生 `桃園市特色公園.json`
- 防災公園資訊

## 本機預覽

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

接著開啟：

```text
http://127.0.0.1:4173/
```

## GitHub Pages 部署

此專案已包含 GitHub Actions workflow：

```text
.github/workflows/deploy-pages.yml
```

部署步驟：

1. 建立 GitHub repository。
2. 將此資料夾內容 push 到 `main` branch。
3. 到 GitHub repository 的 `Settings > Pages`。
4. 在 `Build and deployment` 的 `Source` 選擇 `GitHub Actions`。
5. 推送到 `main` 後，GitHub Actions 會自動部署。

網站是純靜態檔案，不需要 build step。
