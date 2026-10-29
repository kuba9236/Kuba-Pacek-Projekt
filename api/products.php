<?php
require __DIR__ . '/db.php';

try {
    $stmt = $pdo->query("SELECT p.id, p.name, p.category_id, c.name AS category, p.price, p.image, p.description, p.stock
                         FROM products p
                         JOIN categories c ON c.id = p.category_id
                         WHERE p.is_available = 1 AND p.stock > 0
                         ORDER BY p.id");
    respond(['products' => $stmt->fetchAll()]);
} catch (Throwable $e) {
    respond(['error' => 'Nie udało się pobrać produktów.'], 500);
}
