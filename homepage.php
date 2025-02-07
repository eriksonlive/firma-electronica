<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editor de Campos de Firma Estilo SignWell</title>
    <!-- PDF.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.min.js"></script>
    <link href="assets/css/style.css" rel="stylesheet">
    <link href="assets/output.css" rel="stylesheet">
</head>

<body class="bg-gray-100 p-6">
    <!-- Contenedor general con dos columnas (Flex) -->
    <div class="flex flex-col md:flex-row">
        <!-- Columna izquierda: Editor de PDF y campos de firma -->
        <div class="flex-1 bg-white p-6 rounded-lg shadow-md md:mr-4 mb-4 md:mb-0">
            <h2 class="text-xl font-semibold mb-4">Sube un documento PDF y agrega campos de firma</h2>
            <!-- Input para subir PDF -->
            <input type="file" id="pdf-upload" accept="application/pdf" class="mb-4 block w-full border rounded-lg p-2" onChange="uploadFile(event)">

            <!-- Toolbar: select de firmantes y botón para agregar nuevos -->
            <div id="toolbar" class="flex flex-wrap items-center space-x-4 mb-4">
                <label for="user-select" class="font-medium">Selecciona un firmante:</label>
                <select id="user-select" class="border rounded-lg p-2">
                    <option value="">Seleccione un firmante</option>
                    <option value="motrox@hotmail.it">Juan Pérez</option>
                    <option value="motrox@hotmail.it">María López</option>
                </select>
                <button onclick="agregarFirmante()" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-2">Agregar Firmante</button>
            </div>

            <!-- Formulario oculto para agregar nuevo firmante -->
            <div id="nuevo-firmante" class="hidden my-4">
                <input type="text" id="nombre-firmante" placeholder="Nombre del firmante" class="block w-full mb-2 border rounded p-2">
                <input type="email" id="email-firmante" placeholder="Correo electrónico" class="block w-full mb-2 border rounded p-2">
                <button onclick="guardarFirmante()" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Guardar Nuevo Firmante</button>
            </div>

            <!-- Contenedor para renderizar el PDF (con scroll) -->
            <div id="pdf-container" class="relative border p-2 bg-gray-50 max-h-96 overflow-auto">
                <!-- Se agregarán aquí los contenedores de cada página -->
            </div>

            <!-- Botón para enviar los datos (ejemplo de envío a API) -->
            <button onclick="sendToServer()" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Guardar Campos y Enviar
            </button>
        </div>

        <!-- Columna derecha: Archivos cargados -->
        <div class="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Archivos cargados</h2>
            <div id="file-list" class="space-y-2">
                <!-- Aquí se listarán los archivos de la carpeta uploads/ -->
            </div>
        </div>
    </div>
    <script src="assets/js/script.js"></script>
</body>

</html>