<?php
require __DIR__ . '/db.php';
try {
    $stmt = $pdo->query('SELECT id, name FROM categories ORDER BY name');
    respond(['categories' => $stmt->fetchAll()]);
} catch (Throwable $e) {
    respond(['error' => 'Nie udało się pobrać kategorii.'], 500);
}
