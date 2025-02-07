<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $file = $data['file'] ?? '';

    if (!$file) {
        die(json_encode(["success" => false, "error" => "Archivo no especificado"]));
    }

    $filePath = __DIR__ . '/uploads/' . basename($file);

    if (file_exists($filePath) && unlink($filePath)) {
        die(json_encode(["success" => true, "message" => "Archivo eliminado correctamente"]));
    } else {
        die(json_encode(["success" => false, "error" => "No se pudo eliminar el archivo"]));
    }
}

http_response_code(405);
die(json_encode(["success" => false, "error" => "Método no permitido"]));
