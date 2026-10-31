# 聖經目錄大挑戰

這是一個純前端、單人使用的聖經目錄隨機選擇題網站，使用 HTML、CSS、JavaScript 製作，不需要資料庫或伺服器。

## 功能
- 舊約 39 卷、新約 27 卷、混合 66 卷抽考
- 三種模式：目錄順序填空、書卷分類配對、分辨新舊約（摩西五經、歷史書、詩歌智慧書、大小先知書、四福音書、教會歷史書、保羅書信、普通書信、預言書）
- 每回合固定 10 題
- 目錄順序模式支援簡單、普通、困難三種難度：簡單顯示缺漏書卷上方一卷；普通顯示上、下各一卷；困難顯示上、下各兩卷
- 題目目錄採直式排列，方便閱讀
- 隨機抽題、四選一、選項隨機排列
- 每題 40 秒倒數，時間到自動進入下一題；未作答計為錯題
- 答題後立即顯示對錯與正確答案
- 成績、答對數、答錯數、正確率統計
- 錯題列表與錯題重練
- 手機與電腦響應式版面

## 部署到 GitHub Pages

1. 登入 GitHub，建立一個新的 Repository（例如 `bible-directory-quiz`）。
2. 將本資料夾內的 `index.html`、`style.css`、`app.js`、`README.md` 上傳到 Repository 根目錄。
3. 開啟 Repository 的 **Settings → Pages**。
4. 在 **Build and deployment** 的 Source 選擇 **Deploy from a branch**。
5. Branch 選 `main`，資料夾選 `/(root)`，按 **Save**。
6. 等待 GitHub Pages 部署完成，網址通常會是：
   `https://你的GitHub帳號.github.io/bible-directory-quiz/`

若 Repository 名稱不同，網址最後一段也要改成實際 Repository 名稱。

## 本機預覽
直接用瀏覽器開啟 `index.html` 即可。
