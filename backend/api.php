<?php
require_once __DIR__ . '/config/database.php';

// ----- CORS Headers -----
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ----- Router -----
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip leading path segments if running in a subdirectory
// e.g. /backend/api.php/clubs → /clubs
$script = $_SERVER['SCRIPT_NAME']; // e.g. /backend/api.php
$path = ltrim(str_replace($script, '', $uri), '/');
$segments = explode('/', $path);

$resource = $segments[0] ?? '';      // e.g. "auth", "clubs", "events"
$action = $segments[1] ?? '';      // e.g. "login", "logout", or an ID
$sub = $segments[2] ?? '';      // e.g. sub-action

$body = json_decode(file_get_contents('php://input'), true) ?? [];

// ----- Helper functions -----
function respond(int $code, $data): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function notFound(): void
{
    respond(404, ['error' => 'Not found']);
}

function badRequest(string $msg): void
{
    respond(400, ['error' => $msg]);
}

// ============================================================
// AUTH
// ============================================================
function handleAuth(string $action, array $body): void
{
    $db = getDB();

    if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $identifier = trim($body['identifier'] ?? '');
        $password = $body['password'] ?? '';

        if (!$identifier || !$password) {
            badRequest('Identifier and password are required.');
        }

        $stmt = $db->prepare("SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1");
        $stmt->execute([$identifier, $identifier]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            respond(401, ['error' => 'Invalid credentials.']);
        }

        unset($user['password']);
        respond(200, ['success' => true, 'user' => $user]);
    }

    if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $name = trim($body['name'] ?? '');
        $username = strtolower(trim($body['username'] ?? ''));
        $email = strtolower(trim($body['email'] ?? ''));
        $password = $body['password'] ?? '';
        $role = $body['role'] ?? 'student';

        if ($name === '' || $username === '' || $email === '' || $password === '') {
            badRequest('Name, username, email and password are required.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            badRequest('Please enter a valid email address.');
        }
        if (!preg_match('/^[a-z0-9._]{3,30}$/', $username)) {
            badRequest('Username must be 3-30 characters using only letters, numbers, dots or underscores.');
        }
        if (strlen($password) < 6) {
            badRequest('Password must be at least 6 characters.');
        }
        if (!in_array($role, ['student', 'coordinator'], true)) {
            badRequest('Invalid role.');
        }

        $check = $db->prepare('SELECT id FROM users WHERE email = ? OR username = ?');
        $check->execute([$email, $username]);
        if ($check->fetch()) {
            respond(409, ['error' => 'An account with that email or username already exists.']);
        }

        $department = trim($body['department'] ?? '') ?: null;
        $year = trim($body['year'] ?? '') ?: null;
        $rollNumber = trim($body['roll_number'] ?? '') ?: null;

        $hashed = password_hash($password, PASSWORD_BCRYPT);

        try {
            $stmt = $db->prepare("INSERT INTO users
                (name, username, email, password, role, department, year, roll_number, created_at)
                VALUES (?,?,?,?,?,?,?,?, NOW())
                RETURNING id");
            $stmt->execute([$name, $username, $email, $hashed, $role, $department, $year, $rollNumber]);
            $userId = $stmt->fetchColumn();
        } catch (PDOException $e) {
            if (($e->errorInfo[0] ?? '') === '23505') {
                respond(409, ['error' => 'An account with that email or username already exists.']);
            }
            throw $e;
        }

        respond(201, [
            'success' => true,
            'user' => [
                'id' => (int) $userId,
                'name' => $name,
                'username' => $username,
                'email' => $email,
                'role' => $role,
            ],
        ]);
    }

    notFound();
}

// ============================================================
// CLUBS
// ============================================================
function handleClubs(string $idOrAction, string $sub, array $body): void
{
    $db = getDB();
    $method = $_SERVER['REQUEST_METHOD'];

    // GET /clubs  or  GET /clubs?status=Verified
    if ($method === 'GET' && $idOrAction === '') {
        $status = $_GET['status'] ?? null;
        if ($status) {
            $stmt = $db->prepare("SELECT * FROM clubs WHERE status = ? ORDER BY created_at DESC");
            $stmt->execute([$status]);
        } else {
            $stmt = $db->query("SELECT * FROM clubs ORDER BY created_at DESC");
        }
        respond(200, $stmt->fetchAll());
    }

    // POST /clubs  — create
    if ($method === 'POST' && $idOrAction === '') {
        $required = [
            'name',
            'category',
            'description',
            'faculty_coordinator',
            'student_coordinator',
            'email',
            'identification_details',
            'coordinator_name',
            'coordinator_email'
        ];
        foreach ($required as $f) {
            if (empty($body[$f])) {
                badRequest("Field '$f' is required.");
            }
        }

        // Create coordinator user account
        $coordEmail = $body['coordinator_email'];
        $username = strtolower(preg_replace('/[^a-z0-9]/i', '', explode('@', $coordEmail)[0]));
        $rawPass = 'Club@' . rand(1000, 9999);
        $hashed = password_hash($rawPass, PASSWORD_BCRYPT);

        // Insert club
        $stmt = $db->prepare("INSERT INTO clubs
            (name, category, description, logo, faculty_coordinator, student_coordinator,
             email, status, identification_details, coordinator_name, coordinator_email, rejection_note, created_at)
            VALUES (?,?,?,?,?,?,?,'Pending',?,?,?,'', NOW())
            RETURNING id");
        $stmt->execute([
            $body['name'],
            $body['category'],
            $body['description'],
            $body['logo'] ?? 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
            $body['faculty_coordinator'],
            $body['student_coordinator'],
            $body['email'],
            $body['identification_details'],
            $body['coordinator_name'],
            $coordEmail,
        ]);
        $clubId = $stmt->fetchColumn();

        // Check if coordinator user already exists
        $check = $db->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$coordEmail]);
        if (!$check->fetch()) {
            $uStmt = $db->prepare("INSERT INTO users (name, username, email, password, role, club_id, created_at)
                                   VALUES (?,?,?,?,'coordinator',?, NOW())");
            $uStmt->execute([$body['coordinator_name'], $username, $coordEmail, $hashed, $clubId]);
        } else {
            // Update existing coordinator's club_id
            $uStmt = $db->prepare("UPDATE users SET club_id = ? WHERE email = ?");
            $uStmt->execute([$clubId, $coordEmail]);
        }

        respond(201, [
            'success' => true,
            'club_id' => (int) $clubId,
            'credentials' => ['username' => $username, 'email' => $coordEmail, 'password' => $rawPass]
        ]);
    }

    // GET /clubs/:id
    if ($method === 'GET' && $idOrAction !== '') {
        $stmt = $db->prepare("SELECT * FROM clubs WHERE id = ?");
        $stmt->execute([$idOrAction]);
        $club = $stmt->fetch();
        if (!$club)
            notFound();
        respond(200, $club);
    }

    // PATCH /clubs/:id/status  — verify or reject
    if ($method === 'PATCH' && $sub === 'status') {
        $status = $body['status'] ?? null;
        $note = $body['rejection_note'] ?? '';
        if (!in_array($status, ['Verified', 'Rejected', 'Pending'])) {
            badRequest('Invalid status value.');
        }
        $stmt = $db->prepare("UPDATE clubs SET status = ?, rejection_note = ? WHERE id = ?");
        $stmt->execute([$status, $note, $idOrAction]);
        respond(200, ['success' => true]);
    }

    notFound();
}

// ============================================================
// EVENTS
// ============================================================
function handleEvents(string $idOrAction, string $sub, array $body): void
{
    $db = getDB();
    $method = $_SERVER['REQUEST_METHOD'];

    // GET /events
    if ($method === 'GET' && $idOrAction === '') {
        $clubId = $_GET['club_id'] ?? null;
        $status = $_GET['status'] ?? null;

        $where = [];
        $params = [];
        if ($clubId) {
            $where[] = 'club_id = ?';
            $params[] = $clubId;
        }
        if ($status) {
            $where[] = 'status = ?';
            $params[] = $status;
        }

        $sql = "SELECT * FROM events" . ($where ? " WHERE " . implode(' AND ', $where) : '') . " ORDER BY start_datetime ASC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        respond(200, $stmt->fetchAll());
    }

    // POST /events  — create
    if ($method === 'POST' && $idOrAction === '') {
        $required = ['club_id', 'title', 'category', 'description', 'venue', 'start_datetime', 'end_datetime'];
        foreach ($required as $f) {
            if (empty($body[$f]))
                badRequest("Field '$f' is required.");
        }

        $stmt = $db->prepare("INSERT INTO events
            (club_id, title, category, description, banner, venue, start_datetime, end_datetime, status, created_at)
            VALUES (?,?,?,?,?,?,?,?,'published', NOW())
            RETURNING id");
        $stmt->execute([
            $body['club_id'],
            $body['title'],
            $body['category'],
            $body['description'],
            $body['banner'] ?? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
            $body['venue'],
            $body['start_datetime'],
            $body['end_datetime'],
        ]);
        $eventId = $stmt->fetchColumn();
        respond(201, ['success' => true, 'event_id' => (int) $eventId]);
    }

    // GET /events/:id
    if ($method === 'GET' && $idOrAction !== '') {
        $stmt = $db->prepare("SELECT * FROM events WHERE id = ?");
        $stmt->execute([$idOrAction]);
        $event = $stmt->fetch();
        if (!$event)
            notFound();
        respond(200, $event);
    }

    // PATCH /events/:id/cancel
    if ($method === 'PATCH' && $sub === 'cancel') {
        $stmt = $db->prepare("UPDATE events SET status = 'cancelled' WHERE id = ?");
        $stmt->execute([$idOrAction]);
        respond(200, ['success' => true]);
    }

    // PUT /events/:id  — update
    if ($method === 'PUT' && $idOrAction !== '') {
        $fields = [];
        $params = [];
        $allowed = ['title', 'category', 'description', 'banner', 'venue', 'start_datetime', 'end_datetime', 'status'];
        foreach ($allowed as $f) {
            if (isset($body[$f])) {
                $fields[] = "$f = ?";
                $params[] = $body[$f];
            }
        }
        if (!$fields)
            badRequest('No fields to update.');
        $params[] = $idOrAction;
        $stmt = $db->prepare("UPDATE events SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($params);
        respond(200, ['success' => true]);
    }

    notFound();
}

// ============================================================
// USERS (admin only, follow-club for students)
// ============================================================
function handleUsers(string $idOrAction, string $sub, array $body): void
{
    $db = getDB();
    $method = $_SERVER['REQUEST_METHOD'];

    // GET /users
    if ($method === 'GET' && $idOrAction === '') {
        $stmt = $db->query("SELECT id, name, username, email, role, club_id, department, year, roll_number, created_at FROM users ORDER BY created_at DESC");
        respond(200, $stmt->fetchAll());
    }

    // GET /users/:id
    if ($method === 'GET' && $idOrAction !== '') {
        $stmt = $db->prepare("SELECT id, name, username, email, role, club_id, department, year, roll_number, created_at FROM users WHERE id = ?");
        $stmt->execute([$idOrAction]);
        $user = $stmt->fetch();
        if (!$user)
            notFound();

        // Attach followed clubs for students
        if ($user['role'] === 'student') {
            $fStmt = $db->prepare("SELECT club_id FROM student_followed_clubs WHERE student_id = ?");
            $fStmt->execute([$idOrAction]);
            $user['followed_clubs'] = array_column($fStmt->fetchAll(), 'club_id');
        }
        respond(200, $user);
    }

    // POST /users/:id/follow  — toggle follow club
    if ($method === 'POST' && $sub === 'follow') {
        $clubId = $body['club_id'] ?? null;
        if (!$clubId)
            badRequest('club_id is required.');

        $check = $db->prepare("SELECT id FROM student_followed_clubs WHERE student_id = ? AND club_id = ?");
        $check->execute([$idOrAction, $clubId]);
        if ($check->fetch()) {
            $db->prepare("DELETE FROM student_followed_clubs WHERE student_id = ? AND club_id = ?")
                ->execute([$idOrAction, $clubId]);
            respond(200, ['following' => false]);
        } else {
            $db->prepare("INSERT INTO student_followed_clubs (student_id, club_id) VALUES (?,?)")
                ->execute([$idOrAction, $clubId]);
            respond(200, ['following' => true]);
        }
    }

    notFound();
}

// ============================================================
// ANNOUNCEMENTS
// ============================================================
function handleAnnouncements(string $idOrAction, string $sub, array $body): void
{
    $db = getDB();
    $method = $_SERVER['REQUEST_METHOD'];

    // GET /announcements  (optional ?club_id=)
    if ($method === 'GET' && $idOrAction === '') {
        $clubId = $_GET['club_id'] ?? null;
        if ($clubId) {
            $stmt = $db->prepare("SELECT * FROM announcements WHERE club_id = ? ORDER BY posted_at DESC");
            $stmt->execute([$clubId]);
        } else {
            $stmt = $db->query("SELECT * FROM announcements ORDER BY posted_at DESC");
        }
        respond(200, $stmt->fetchAll());
    }

    // POST /announcements  — create
    if ($method === 'POST' && $idOrAction === '') {
        if (empty($body['club_id']) || empty($body['message'])) {
            badRequest('club_id and message are required.');
        }
        $type = $body['type'] ?? 'announcement';
        $allowed = ['announcement', 'update', 'reminder', 'resource', 'volunteer'];
        if (!in_array($type, $allowed, true)) {
            badRequest('Invalid announcement type.');
        }
        $stmt = $db->prepare("INSERT INTO announcements (club_id, message, type, posted_at)
                              VALUES (?,?,?, NOW()) RETURNING id");
        $stmt->execute([$body['club_id'], $body['message'], $type]);
        respond(201, ['success' => true, 'announcement_id' => (int) $stmt->fetchColumn()]);
    }

    notFound();
}

// ============================================================
// Route dispatch
// ============================================================
switch ($resource) {
    case 'auth':
        handleAuth($action, $body);
        break;
    case 'clubs':
        handleClubs($action, $sub, $body);
        break;
    case 'events':
        handleEvents($action, $sub, $body);
        break;
    case 'users':
        handleUsers($action, $sub, $body);
        break;
    case 'announcements':
        handleAnnouncements($action, $sub, $body);
        break;
    default:
        notFound();
}