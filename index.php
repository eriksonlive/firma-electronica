<?php

require_once __DIR__ . '/bootstrap.php';
// require __DIR__ . '/homepage.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($uri) {
    case 'create-document':
        require __DIR__ . '/src/Router/CreateDocument.php';
        break;

    case '/':
        require __DIR__ . '/homepage.php';
        break;

    case '/upload':
        require __DIR__ . '/src/upload.php';
        break;

    case '/uploads':
        require __DIR__ . '/src/uploads.php';
        break;

    case '/delete_file':
        require __DIR__ . '/src/delete.php';
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Página no encontrada"]);
        break;
}
