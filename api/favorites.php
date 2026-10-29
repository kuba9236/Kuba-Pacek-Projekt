<?php
require __DIR__ . '/db.php';
$userId = requireLogin();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT p.id, p.name, p.category_id, c.name AS category, p.price, p.image, p.description, p.stock
                           FROM favorites f JOIN products p ON p.id = f.product_id
                           JOIN categories c ON c.id = p.category_id
                           WHERE f.user_id = ? AND p.is_available = 1 ORDER BY f.created_at DESC");
    $stmt->execute([$userId]);
    respond(['products' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $data = jsonInput();
    $productId = filter_var($data['product_id'] ?? null, FILTER_VALIDATE_INT);
    if (!$productId) respond(['error' => 'Nieprawidłowy produkt.'], 422);
    $check = $pdo->prepare('SELECT id FROM products WHERE id = ? AND is_available = 1');
    $check->execute([$productId]);
    if (!$check->fetch()) respond(['error' => 'Produkt nie istnieje.'], 404);
    $stmt = $pdo->prepare('INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)');
    $stmt->execute([$userId, $productId]);
    respond(['message' => 'Dodano do ulubionych.']);
}

if ($method === 'DELETE') {
    $data = jsonInput();
    $productId = filter_var($data['product_id'] ?? null, FILTER_VALIDATE_INT);
    if (!$productId) respond(['error' => 'Nieprawidłowy produkt.'], 422);
    $stmt = $pdo->prepare('DELETE FROM favorites WHERE user_id = ? AND product_id = ?');
    $stmt->execute([$userId, $productId]);
    respond(['message' => 'Usunięto z ulubionych.']);
}
respond(['error' => 'Niedozwolona metoda.'], 405);
