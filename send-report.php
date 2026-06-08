<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

$to = 'info@araoclinic.net';
$from = 'info@araoclinic.net';
$fromName = 'シェアブック報告書';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POSTで送信してください。'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!isset($_FILES['pdf']) || $_FILES['pdf']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'PDFが添付されていません。'], JSON_UNESCAPED_UNICODE);
    exit;
}

$file = $_FILES['pdf'];
if ($file['size'] > 8 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'PDFサイズが大きすぎます。'], JSON_UNESCAPED_UNICODE);
    exit;
}

$patientName = trim((string)($_POST['patientName'] ?? 'シェアブック'));
$reportDate = trim((string)($_POST['reportDate'] ?? date('Y-m-d')));
$filename = preg_replace('/[^\w.\-ぁ-んァ-ヶ一-龠ー]/u', '_', $file['name'] ?: 'report.pdf');
$subject = "報告書 {$patientName} {$reportDate}";
$body = "共有ウェブページから報告書PDFが送信されました。\n\n報告書: {$patientName}\n報告日: {$reportDate}\n";

$boundary = 'report_' . bin2hex(random_bytes(16));
$encodedSubject = mb_encode_mimeheader($subject, 'UTF-8');
$encodedFromName = mb_encode_mimeheader($fromName, 'UTF-8');
$encodedFilename = mb_encode_mimeheader($filename, 'UTF-8');
$attachment = chunk_split(base64_encode((string)file_get_contents($file['tmp_name'])));

$headers = [
    "From: {$encodedFromName} <{$from}>",
    "Reply-To: {$from}",
    "MIME-Version: 1.0",
    "Content-Type: multipart/mixed; boundary=\"{$boundary}\""
];

$message = "--{$boundary}\r\n";
$message .= "Content-Type: text/plain; charset=UTF-8\r\n";
$message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$message .= $body . "\r\n";
$message .= "--{$boundary}\r\n";
$message .= "Content-Type: application/pdf; name=\"{$encodedFilename}\"\r\n";
$message .= "Content-Transfer-Encoding: base64\r\n";
$message .= "Content-Disposition: attachment; filename=\"{$encodedFilename}\"\r\n\r\n";
$message .= $attachment . "\r\n";
$message .= "--{$boundary}--\r\n";

$sent = mb_send_mail($to, $encodedSubject, $message, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['error' => 'メール送信に失敗しました。Xserverのメール設定をご確認ください。'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
