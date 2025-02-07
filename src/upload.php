<?php

$uploadDir = __DIR__ . '/uploads/'; // Carpeta donde se guardarán los archivos

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['pdf'])) {
    $file = $_FILES['pdf'];

    // Verificar tipo de archivo
    if ($file['type'] !== 'application/pdf') {
        echo json_encode(["error" => "Solo se permiten archivos PDF"]);
        exit;
    }

    // Crear un nombre único
    $fileName = uniqid() . '-' . basename($file['name']);
    $filePath = $uploadDir . $fileName;

    // Mover archivo al servidor
    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        echo json_encode([
            "success" => true,
            "file_url" => "/src/uploads/" . $fileName // Ruta accesible públicamente
        ]);
    } else {
        echo json_encode(["error" => "Error al guardar el archivo"]);
    }
}
