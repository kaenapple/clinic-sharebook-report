# シェアブック報告書

元PDFの「シェアブック」報告書をもとにした入力ページです。日付は開いた当日が自動入力され、作業時間、各作業のチェック、担当スタッフからの報告、お客様コメント、FC店連絡先を入力できます。

## 使い方

- サーバー起動後、パスワード `1234` で開けます。
- 「PDF確認」で入力済みの紙面をPDFとして保存できます。
- 「PDFを指定先へ送信」で、設定した固定メールアドレスへPDFを送信できます。

## ローカル起動

```bash
npm install
npm start
```

起動後、`http://localhost:3000` を開きます。

## メール送信設定

送信先は環境変数 `REPORT_TO_EMAIL` に固定します。現在の想定は `info@araoclinic.net` です。2件以上にする場合は、カンマ区切りで追加できます。

```env
REPORT_TO_EMAIL=info@araoclinic.net,second@example.com
```

GitHubにアップロードする場合、メールパスワード入りの `.env` はアップロードしないでください。公開サーバーでは `.env.production.example` を見ながら、Renderなどの Environment Variables に設定します。

無料サーバーに設置する場合は [DEPLOY.md](DEPLOY.md) を確認してください。
