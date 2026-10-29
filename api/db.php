<?php
declare(strict_types=1);

session_start();
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$host = '127.0.0.1';
$dbname = 'skleplego';
$dbuser = 'root';
$dbpass = ''; // Wpisz hasło MySQL, jeśli je ustawiono.

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        $dbuser,
        $dbpass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Nie można połączyć się z bazą danych. Sprawdź ustawienia w api/db.php.'], JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonInput(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

function respond(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requireLogin(): int {
    if (empty($_SESSION['user_id'])) {
        respond(['error' => 'Zaloguj się, aby wykonać tę operację.'], 401);
    }
    return (int) $_SESSION['user_id'];
}
