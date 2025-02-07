// Variables globales
let pdfDoc = null,
  fields = [],
  currentFirmante = null,
  currentFirmanteEmail = null,
  draggingSignature = false; // Bandera para evitar duplicados durante el drag

// Actualiza currentFirmante al cambiar la selección
document.getElementById('user-select').addEventListener('change', function () {
  currentFirmante = this.options[this.selectedIndex].text;
  currentFirmanteEmail = this.value;
});

// Función para mostrar el formulario de nuevo firmante
function agregarFirmante() {
  document.getElementById('nuevo-firmante').classList.remove('hidden');
}

// Función para guardar el nuevo firmante y agregarlo al select
function guardarFirmante() {
  let nombre = document.getElementById('nombre-firmante').value.trim();
  let email = document.getElementById('email-firmante').value.trim();
  if (nombre === '' || email === '') {
    alert('Por favor, ingresa el nombre y el correo del firmante.');
    return;
  }
  let option = document.createElement('option');
  option.value = email; // Puedes cambiar esto según tu lógica (por ejemplo, usar un ID)
  option.innerText = nombre;
  document.getElementById('user-select').appendChild(option);
  // Seleccionar el nuevo firmante automáticamente
  document.getElementById('user-select').value = email;
  currentFirmante = nombre;
  currentFirmanteEmail = email;
  // Limpiar y ocultar el formulario
  document.getElementById('nombre-firmante').value = '';
  document.getElementById('email-firmante').value = '';
  document.getElementById('nuevo-firmante').classList.add('hidden');
}

async function uploadFile(event) {
  let file = event.target.files[0];
  if (!file) return;

  let formData = new FormData();
  formData.append('pdf', file);

  try {
    let response = await fetch('upload', {
      method: 'POST',
      body: formData,
    });

    let result = await response.json();

    if (result.success) {
      console.log('Archivo subido con éxito:', result.file_url);
      sessionStorage.setItem('pdfUrl', result.file_url); // 🔹 Guardamos la URL subida
      loadPdfFromUrl(result.file_url);
      loadFiles();
    } else {
      console.error('Error al subir el archivo:', result.error);
    }
  } catch (error) {
    console.error('Error en la petición de carga:', error);
  }
}

// Configuración de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';

// Función para cargar el listado de archivos desde el servidor
async function loadFiles() {
  try {
    // Se asume que existe un endpoint que retorna un JSON con un arreglo de nombres de archivos
    const response = await fetch('uploads');
    const files = await response.json();
    const fileListContainer = document.getElementById('file-list');
    fileListContainer.innerHTML = '';

    files.forEach((file) => {
      const fileItem = document.createElement('div');
      fileItem.className =
        'flex justify-between items-center p-2 border rounded cursor-pointer hover:bg-gray-100';

      // Nombre del archivo (click para cargarlo)
      const fileName = document.createElement('span');
      fileName.innerText = file;
      fileName.className = 'flex-1 cursor-pointer';
      fileName.addEventListener('click', () => selectFile(file));

      // Botón de eliminar
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Eliminar';
      deleteButton.className = 'text-red-500 hover:text-red-700';
      deleteButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Evitar que se active el evento de selección
        deleteFile(file);
      });

      fileItem.appendChild(fileName);
      fileItem.appendChild(deleteButton);
      fileListContainer.appendChild(fileItem);
    });
  } catch (error) {
    console.error('Error al cargar la lista de archivos:', error);
  }
}

async function deleteFile(fileName) {
  if (!confirm(`¿Seguro que deseas eliminar el archivo "${fileName}"?`)) {
    return;
  }

  try {
    let response = await fetch(`delete_file`, {
      method: 'DELETE',
      body: JSON.stringify({ file: fileName }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let result = await response.json();

    if (result.success) {
      alert('Archivo eliminado con éxito.');
      loadFiles(); // Recargar la lista de archivos
    } else {
      alert('Error al eliminar el archivo: ' + result.error);
    }
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
  }
}

// Llama a loadFiles al cargar la página
document.addEventListener('DOMContentLoaded', loadFiles);

// Carga y renderiza el PDF desde el input
document
  .getElementById('pdf-upload')
  .addEventListener('change', function (event) {
    let file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = function (e) {
        renderPdf(e.target.result);
      };
      reader.readAsArrayBuffer(file);
    }
  });

// Función para cargar y renderizar un PDF dado su URL
function loadPdfFromUrl(url) {
  pdfjsLib
    .getDocument(url)
    .promise.then((pdf) => {
      renderPdf(null, pdf);
      sessionStorage.setItem('pdfUrl', url); // 🔹 Guardamos la URL actualizada
    })
    .catch((error) =>
      console.error('Error al cargar el PDF desde URL:', error)
    );
}

// Función que renderiza el PDF; si se pasa data, se carga desde ArrayBuffer, de lo contrario usa el objeto pdf
function renderPdf(data, pdfObj) {
  let pdfContainer = document.getElementById('pdf-container');
  pdfContainer.innerHTML = ''; // Limpiar el contenedor
  let loadingTask;
  if (data) {
    loadingTask = pdfjsLib.getDocument({
      data,
    });
  } else if (pdfObj) {
    // Si ya se tiene el objeto pdf, lo usamos directamente
    loadingTask = {
      promise: Promise.resolve(pdfObj),
    };
  }
  loadingTask.promise
    .then((pdf) => {
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        renderPage(pdf, pageNum);
      }
    })
    .catch((error) => console.error('Error al renderizar el PDF:', error));
}

// Renderiza cada página del PDF
function renderPage(pdf, pageNumber) {
  pdf.getPage(pageNumber).then((page) => {
    let scale = 1.33;
    let viewport = page.getViewport({
      scale,
    });
    let pageContainer = document.createElement('div');
    pageContainer.classList.add('pdf-page-container');

    // Etiqueta opcional con el número de página
    let pageLabel = document.createElement('div');
    pageLabel.className = 'text-xs text-gray-600 mb-1';
    pageLabel.innerText = `Página ${pageNumber}`;
    pageContainer.appendChild(pageLabel);

    let canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    let context = canvas.getContext('2d');

    let renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    page.render(renderContext);
    pageContainer.appendChild(canvas);

    document.getElementById('pdf-container').appendChild(pageContainer);

    // Permite agregar campos haciendo clic en la página
    pageContainer.addEventListener('click', function (event) {
      if (draggingSignature) {
        draggingSignature = false;
        return;
      }
      if (event.target.closest('.campo-firma')) return;
      if (!currentFirmante) {
        alert('Por favor, selecciona un firmante primero.');
        return;
      }
      let rect = pageContainer.getBoundingClientRect();
      let x = event.clientX - rect.left + pageContainer.scrollLeft;
      let y = event.clientY - rect.top + pageContainer.scrollTop;
      crearCampo(pageContainer, x, y, pageNumber);
    });
  });
}

// Función para cargar un PDF al hacer clic sobre un archivo listado
function selectFile(fileName) {
  let url = '/src/uploads/' + fileName;
  sessionStorage.setItem('pdfUrl', url); // 🔹 Guardamos la URL seleccionada
  loadPdfFromUrl(url);
}

// Crea un campo de firma en la posición (x, y) dentro del contenedor dado
function crearCampo(contenedor, x, y, pageNumber) {
  let campo = document.createElement('div');
  campo.className = 'campo-firma p-2';
  campo.style.left = `${x}px`;
  campo.style.top = `${y}px`;
  campo.style.width = '150px';
  campo.style.height = '40px';

  // Muestra el nombre del firmante
  let nombre = document.createElement('div');
  nombre.className = 'nombre-firmante overflow-hidden whitespace-nowrap';
  nombre.innerText = currentFirmante;
  campo.appendChild(nombre);

  let email = document.createElement('div');
  email.className = 'email-firmante overflow-hidden whitespace-nowrap';
  email.innerText = currentFirmanteEmail;
  campo.appendChild(email);

  let page = document.createElement('div');
  page.className = 'page-firmante overflow-hidden whitespace-nowrap hidden';
  page.innerText = pageNumber;
  campo.appendChild(page);

  // Botón para eliminar el campo
  let btnEliminar = document.createElement('div');
  btnEliminar.className = 'btn-eliminar';
  btnEliminar.innerText = 'X';
  btnEliminar.addEventListener('click', (e) => {
    e.stopPropagation();
    eliminarCampo(campo);
  });
  campo.appendChild(btnEliminar);

  contenedor.appendChild(campo);
  fields.push({
    element: campo,
    contenedor: contenedor,
  });
  habilitarArrastrar(campo);
  habilitarRedimensionar(campo);
}

// Habilita la funcionalidad de arrastrar para un campo
function habilitarArrastrar(elemento) {
  let offsetX,
    offsetY,
    isArrastrando = false;
  let inicioX, inicioY;

  elemento.addEventListener('mousedown', function (e) {
    isArrastrando = true;
    inicioX = e.clientX;
    inicioY = e.clientY;
    offsetX = e.clientX - elemento.getBoundingClientRect().left;
    offsetY = e.clientY - elemento.getBoundingClientRect().top;
    elemento.style.cursor = 'grabbing';
    e.stopPropagation();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isArrastrando) return;
    let dx = e.clientX - inicioX;
    let dy = e.clientY - inicioY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      draggingSignature = true;
    }
    let contenedorRect = elemento.parentElement.getBoundingClientRect();
    let x = e.clientX - contenedorRect.left - offsetX;
    let y = e.clientY - contenedorRect.top - offsetY;
    x = Math.max(0, Math.min(contenedorRect.width - elemento.offsetWidth, x));
    y = Math.max(0, Math.min(contenedorRect.height - elemento.offsetHeight, y));
    elemento.style.left = `${x}px`;
    elemento.style.top = `${y}px`;
  });

  document.addEventListener('mouseup', function () {
    if (isArrastrando) {
      isArrastrando = false;
      elemento.style.cursor = 'grab';
    }
  });
}

// Habilita el redimensionamiento del campo mediante un "resizer"
function habilitarRedimensionar(elemento) {
  const resizer = document.createElement('div');
  resizer.style.width = '12px';
  resizer.style.height = '12px';
  resizer.style.backgroundColor = 'blue';
  resizer.style.position = 'absolute';
  resizer.style.bottom = '0';
  resizer.style.right = '0';
  resizer.style.cursor = 'se-resize';
  elemento.appendChild(resizer);

  let isRedimensionando = false;
  let startX, startY, startWidth, startHeight;
  resizer.addEventListener('mousedown', function (e) {
    isRedimensionando = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(window.getComputedStyle(elemento).width, 10);
    startHeight = parseInt(window.getComputedStyle(elemento).height, 10);
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isRedimensionando) return;
    let width = startWidth + (e.clientX - startX);
    let height = startHeight + (e.clientY - startY);
    elemento.style.width = `${Math.max(100, width)}px`;
    elemento.style.height = `${Math.max(40, height)}px`;
  });

  document.addEventListener('mouseup', function () {
    isRedimensionando = false;
  });
}

// Elimina un campo y lo remueve del arreglo global
function eliminarCampo(elemento) {
  elemento.remove();
  fields = fields.filter((field) => field.element !== elemento);
}

// Función para enviar datos al servidor (ejemplo)
async function sendToServer() {
  // Se puede obtener la URL del PDF y los datos de cada campo
  let pdfUrl = sessionStorage.getItem('pdfUrl'); // 🔹 Obtener el PDF actual
  if (!pdfUrl) {
    alert('Por favor, selecciona o sube un archivo antes de enviarlo.');
    return;
  }

  const regex = /\/src\/uploads\/(.*)/;
  const coincidencia = pdfUrl.match(regex);

  let recipients = fields.map(({ element }) => ({
    send_email: true,
    send_email_delay: 0,
    id: element.querySelector('.email-firmante').innerText,
    name: element.querySelector('.nombre-firmante').innerText,
    email: element.querySelector('.email-firmante').innerText,
  }));

  // let files = {
  //   name: coincidencia[1],
  //   file_url: pdfUrl,
  // };

  let files = {
    name: 'dummy.pdf',
    file_url:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  };

  let fieldsData = fields.map(({ element }) => ({
    type: 'signature',
    required: true,
    fixed_width: false,
    lock_sign_date: false,
    x: element.style.left,
    y: element.style.top,
    page: element.querySelector('.page-firmante').innerText,
    recipient_id: element.querySelector('.email-firmante').innerText,
    width: element.style.width,
    height: element.style.height,
  }));

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-Api-Key': 'YWNjZXNzOmM4NzFiODNhZmVmNmY4YjAyN2E0ZGUxOGJiNTg0ZjM4',
    },
    body: JSON.stringify({
      test_mode: true,
      draft: false,
      with_signature_page: false,
      reminders: true,
      apply_signing_order: false,
      embedded_signing: true,
      embedded_signing_notifications: false,
      text_tags: false,
      allow_decline: true,
      allow_reassign: true,
      metadata: {},
      name: 'Example pdf',
      files: [files],
      recipients: recipients,
      fields: [fieldsData],
    }),
  };

  fetch('https://www.signwell.com/api/v1/documents/', options)
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));

  // console.log('Campos a enviar:', options);
  alert('Formulario enviado!');
}
