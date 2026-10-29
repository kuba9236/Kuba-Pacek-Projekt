<?php
require __DIR__ . '/db.php';
$action = $_GET['action'] ?? '';
$data = jsonInput();

if ($action === 'me') {
    if (empty($_SESSION['user_id'])) respond(['user' => null]);
    respond(['user' => ['id' => (int)$_SESSION['user_id'], 'username' => $_SESSION['username']]]);
}

if ($action === 'register') {
    $username = trim((string)($data['username'] ?? ''));
    $password = (string)($data['password'] ?? '');
    if (mb_strlen($username) < 3 || mb_strlen($username) > 100 || strlen($password) < 8) {
        respond(['error' => 'Nazwa użytkownika musi mieć 3–100 znaków, a hasło co najmniej 8 znaków.'], 422);
    }
    try {
        $stmt = $pdo->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
        $stmt->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
        session_regenerate_id(true);
        $_SESSION['user_id'] = (int)$pdo->lastInsertId();
        $_SESSION['username'] = $username;
        respond(['message' => 'Konto zostało utworzone.', 'user' => ['id' => $_SESSION['user_id'], 'username' => $username]], 201);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') respond(['error' => 'Ta nazwa użytkownika jest już zajęta.'], 409);
        respond(['error' => 'Nie udało się utworzyć konta.'], 500);
    }
}

if ($action === 'login') {
    $username = trim((string)($data['username'] ?? ''));
    $password = (string)($data['password'] ?? '');
    $stmt = $pdo->prepare('SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    if (!$user || !password_verify($password, $user['password_hash'])) respond(['error' => 'Nieprawidłowa nazwa użytkownika lub hasło.'], 401);
    session_regenerate_id(true);
    $_SESSION['user_id'] = (int)$user['id'];
    $_SESSION['username'] = $user['username'];
    respond(['message' => 'Zalogowano.', 'user' => ['id' => (int)$user['id'], 'username' => $user['username']]]);
}

if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    respond(['message' => 'Wylogowano.']);
}
respond(['error' => 'Nieznana akcja.'], 404);
