# GitHubから無料サーバーへ設置

この報告書ページはメール送信機能があるため、HTMLだけの無料サーバーではなく Node.js が動くサーバーに設置します。

## GitHubにアップロードする前の注意

`.env` にはメールパスワードが入っているため、GitHubにはアップロードしません。`.gitignore` で除外済みです。

## おすすめ: Render

RenderはGitHubリポジトリを接続して、無料のWebサービスとして Node.js アプリを動かせます。無料枠はアクセスが少ないと停止状態になり、最初の表示に少し時間がかかることがあります。

1. Render で New Web Service を作成します。
2. GitHub の `kaenapple/clinic-sharebook-report` リポジトリを選択します。
3. `render.yaml` があるため、基本設定は自動で読み込まれます。
4. Environment に下記を設定します。

```env
APP_PASSWORD=1234
REPORT_TO_EMAIL=info@araoclinic.net
REPORT_FROM_EMAIL=info@araoclinic.net
SMTP_HOST=sv13154.xserver.jp
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@araoclinic.net
SMTP_PASS=メールパスワード
SMTP_CONNECTION_TIMEOUT=30000
SMTP_GREETING_TIMEOUT=30000
SMTP_SOCKET_TIMEOUT=60000
```

送信先メールアドレスを後から増やす場合は、Render の Environment Variables で `REPORT_TO_EMAIL` を変更します。

```env
REPORT_TO_EMAIL=info@araoclinic.net,second@example.com
```

変更後、Renderで再デプロイまたはサービス再起動を行うと反映されます。

## タイムアウト時

Renderで `Connection timeout` が出る場合は、まず Environment Variables が `SMTP_PORT=465`、`SMTP_SECURE=true` になっているか確認してください。

それでもタイムアウトする場合、Render無料枠側でSMTP通信が制限されている可能性があります。その場合は、SendGrid、Brevo、MailgunなどのHTTP API型メール送信サービスに切り替えると回避しやすいです。

## 注意

- `.env` は公開しないでください。ローカル用の秘密設定です。
- サーバーに設置する場合、メールパスワードは必ず各サービスの Environment Variables に入力します。
- 公開URLはパスワード `APP_PASSWORD` で保護されます。現在の初期値は `1234` です。
