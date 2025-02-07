<?php

namespace App\Router;

use App\Controller\SignWellApiController;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Capturar el cuerpo de la solicitud
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['file_url']) || !isset($input['signers'])) {
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

$signWell = new SignWellApiController();

var_dump('lorem');
// $response = $signWell->createDocument($input['file_url'], $input['signers']);

// echo json_encode($response);
