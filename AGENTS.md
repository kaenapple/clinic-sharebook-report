# エージェント向けガイド

Codex と Claude Code（ローカル / Web）で共通の作業ルールです。`CLAUDE.md` はこのファイルを読み込みます。
プロジェクトの説明は `README.md`、デプロイ手順は `DEPLOY.md`（Render）と `XSERVER_DEPLOY.md`（Xserver）を参照してください。

## 作業の入口と区切り

- 作業開始時に `.harness/goal.md` と `.harness/state.md` を読む（開始時フックでも読み込まれる）。
- 作業の区切りや、モデル・ツールを切り替える前に `.harness/state.md` の「完了したこと」「現在地」「次の一手」を更新する。
- 目的や完了条件が変わったら `.harness/goal.md` を更新する。

## コマンド

```bash
npm install      # 依存関係のインストール
npm run check    # 構文チェック（テストはまだありません）
npm start        # http://localhost:3000 で起動
```

## ルール

- `.env` / `.env.production` は読まない・コミットしない。新しい環境変数は `.env.example` と `.env.production.example` の両方に追記する。
- メール送信を実際に試さない（本物の宛先に届くため）。
- Node.js 版（`server.js`）と PHP 版（`send-report.php`）の API 仕様を変えるときは両方を揃える。
- 利用者向けの文言・ドキュメントは日本語で書く。
