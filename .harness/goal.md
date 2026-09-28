# ゴール: シェアブック報告書

## 目的

クリニックのスタッフが報告書をブラウザで入力し、PDFとして指定の宛先へ送信できるようにする。

## 対象範囲

- 入力画面（`index.html` / `app.js` / `styles.css`）とログイン（`login.html`）
- PDF送信: Node.js版（`server.js`、Render）とPHP版（`send-report.php`、Xserver）

## 完了条件

- [ ] <!-- 今取り組んでいる作業の完了条件を書く -->

## 制約

- `.env` / `.env.production` は読まない・コミットしない。
- 本物の宛先へメールを送らない。

## 確認方法

- `npm run check`
- `npm start` で起動し、画面で確認する（メール送信は除く）。
