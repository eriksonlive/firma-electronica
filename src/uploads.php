<?php

$uploadDir = 'src/uploads/';
$ignoredFiles = ['.gitkeep']; // Archivos a ignorar

$files = array_diff(scandir($uploadDir), array('.', '..'));

$filteredFiles = array_filter($files, function ($file) use ($ignoredFiles) {
    return !in_array($file, $ignoredFiles); // Excluye archivos no deseados
});

echo json_encode(array_values($filteredFiles));
