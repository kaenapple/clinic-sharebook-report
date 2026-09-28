# エージェント向けガイド

Claude Code（ローカル / Web）と Codex などのエージェントで共通の作業ルールです。`CLAUDE.md` はこのファイルを読み込みます。

## プロジェクト概要

シェアブック報告書の入力ページ。入力内容を PDF にしてメール送信します。

- `index.html` / `login.html` / `styles.css` / `app.js`: フロントエンド
- `server.js`: Node.js（Express）サーバー。認証・PDF 受信・メール送信（Brevo API または SMTP）
- `send-report.php` / `.htaccess`: Xserver 用の PHP 版メール送信エンドポイント
- デプロイ手順: `DEPLOY.md`（Render）、`XSERVER_DEPLOY.md`（Xserver）

## コマンド

```bash
npm install      # 依存関係のインストール
npm run check    # 構文チェック（テストはまだありません）
npm start        # http://localhost:3000 で起動（パスワードは APP_PASSWORD、既定 1234）
```

## ルール

- `.env` / `.env.production` は読まない・コミットしない。新しい環境変数は `.env.example` と `.env.production.example` の両方に追記する。
- メール送信を実際に試さない（本物の宛先 `info@araoclinic.net` に届くため）。
- Node.js 版（`server.js`）と PHP 版（`send-report.php`）の API 仕様を変えるときは両方を揃える。
- 利用者向けの文言・ドキュメントは日本語で書く。
