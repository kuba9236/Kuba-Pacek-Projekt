<?php
require __DIR__ . '/db.php';
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id || $id < 1) respond(['error' => 'Nieprawidłowy identyfikator produktu.'], 400);
try {
    $stmt = $pdo->prepare("SELECT p.id, p.name, p.category_id, c.name AS category, p.price, p.image, p.description, p.stock, p.is_available FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ? LIMIT 1");
    $stmt->execute([$id]);
    $product = $stmt->fetch();
    if (!$product) respond(['error' => 'Nie znaleziono produktu.'], 404);
    respond(['product' => $product]);
} catch (Throwable $e) {
    respond(['error' => 'Nie udało się pobrać szczegółów produktu.'], 500);
}
