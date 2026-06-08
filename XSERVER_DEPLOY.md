# Xserverに設置する方法

Render無料枠ではSMTP送信がブロックされるため、XserverにHTML/PHPとして設置する方法です。

## アップロードするファイル

Xserverの公開フォルダへ以下をアップロードします。

- `index.html`
- `styles.css`
- `app.js`
- `.htaccess`
- `send-report.php`

## パスワード保護

Xserverのサーバーパネルで「アクセス制限」または「Basic認証」を設定してください。

- ユーザー名: 任意
- パスワード: `1234`

この方法なら、ページを開く前にサーバー側でパスワード確認されます。

## メール送信

`send-report.php` の送信先は現在 `info@araoclinic.net` 固定です。

送信先を増やす場合は、`send-report.php` の先頭を次のように変更します。

```php
$to = 'info@araoclinic.net,second@example.com';
```

## 補足

Renderと違い、Xserver上では同じサーバーのメール機能を使うため、SMTPポート制限の影響を受けにくくなります。
