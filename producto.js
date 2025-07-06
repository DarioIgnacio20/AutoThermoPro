// Función para aplicar estilos desde el config TXT
function aplicarEstilosDesdeConfig(elemento, config, claveBase) {
  const color = config[`${claveBase}_colorTexto`];
  const tamano = config[`${claveBase}_tamano`];
  const fuente = config[`${claveBase}_fuente`];
  const negrita = config[`${claveBase}_negrita`];
  const cursiva = config[`${claveBase}_cursiva`];

  if (color) elemento.style.color = color;
  if (tamano) elemento.style.fontSize = tamano;
  if (fuente) elemento.style.fontFamily = fuente.replace(/['"]/g, '');
  if (negrita !== undefined) elemento.style.fontWeight = negrita === 'true' ? 'bold' : 'normal';
  if (cursiva !== undefined) elemento.style.fontStyle = cursiva === 'true' ? 'italic' : 'normal';
}

// Animación simple de desvanecimiento al actualizar contenido
function actualizarConAnimacion(elemento, nuevoTexto) {
  elemento.style.opacity = 0;
  setTimeout(() => {
    elemento.textContent = nuevoTexto;
    elemento.style.opacity = 1;
  }, 200);
}

// Función para renderizar personas viendo con avatares y estilos
function renderPersonasViendo(config) {
  if ((config.mostrar_texto_personas || 'true').toLowerCase() !== 'true') return;

  const personasContainer = document.getElementById('personasViendo');
  if (!personasContainer) return;

  const cantidad = Math.floor(Math.random() * 6) + 5; // entre 5 y 10
  const texto = (config.texto_personas || '{cantidad} personas viendo ahora').replace('{cantidad}', cantidad);

  // Avatares de ejemplo, cámbialos si quieres
  const avatares = [
    'imagenes/Avatar Personas Viendo/img_avatar1.jpg',
    'imagenes/Avatar Personas Viendo/img_avatar2.jpg',
    'imagenes/Avatar Personas Viendo/img_avatar3.jpg',
    'imagenes/Avatar Personas Viendo/img_avatar4.jpg',
    'imagenes/Avatar Personas Viendo/img_avatar5.jpg'
  ];
  const seleccionados = avatares.sort(() => 0.5 - Math.random()).slice(0, 3);
  const avatarHTML = seleccionados
    .map(src => `<img src="${src}" alt="avatar" style="width:24px; height:24px; border-radius:50%; margin-right:4px;">`)
    .join('');

  const style = `
    color: ${config.personas_colorTexto || '#444'};
    font-size: ${config.personas_tamano || '14px'};
    font-family: ${config.personas_fuente ? config.personas_fuente.replace(/['"]/g, '') : 'Arial'};
    font-weight: ${config.personas_negrita === 'true' ? 'bold' : 'normal'};
    font-style: ${config.personas_cursiva === 'true' ? 'italic' : 'normal'};
  `;

  personasContainer.innerHTML = `
    <div class="avatar-stack" style="display:flex; align-items:center; margin-bottom:4px;">${avatarHTML}</div>
    <div class="texto" style="${style}">${texto}</div>
  `;
}

// ✅ Función modular para actualizar precios y aplicar estilos
function actualizarBloquePrecios(cant, producto, elementos) {
  const { precioEl, precioAntEl, descEl, cantidadEl } = elementos;

  actualizarConAnimacion(precioEl, `$${Number(producto[`precio_${cant}`]).toLocaleString("es-CL")}`);
  actualizarConAnimacion(precioAntEl, `$${Number(producto[`precio_anterior_${cant}`]).toLocaleString("es-CL")}`);
  if (!precioEl.classList.contains('precio-animado')) {
  precioEl.classList.add('precio-animado');
}





  const textoAhorro = producto.texto_ahorro || 'Ahorra {porcentaje}%';
  actualizarConAnimacion(descEl, textoAhorro.replace('{porcentaje}', producto[`descuento_${cant}`]));

  const textoCantidad = producto.texto_cantidad_mensaje || 'Cantidad: {cantidad} Cepillos';
  actualizarConAnimacion(cantidadEl, textoCantidad.replace('{cantidad}', producto[`cantidad_${cant}`]));

  aplicarEstilosDesdeConfig(precioEl, producto, 'precio');
  aplicarEstilosDesdeConfig(precioAntEl, producto, 'precioAnt');
  aplicarEstilosDesdeConfig(descEl, producto, 'descuento');
  aplicarEstilosDesdeConfig(cantidadEl, producto, 'cantidad');
}


fetch('producto.txt')
  .then(response => response.text())
  .then(data => {
    const lines = data.trim().split('\n');
    const producto = {};
    lines.forEach(line => {
      if (line.includes('=') && !line.trim().startsWith('#')) {
        const [key, value] = line.split('=');
        producto[key.trim()] = value.trim();
      }
    });

    // Elementos del DOM
    const tituloEl = document.getElementById('tituloProducto');
    const ratingEl = document.getElementById('reseñasProducto');
    const personasEl = document.getElementById('personasViendo');
    const precioEl = document.getElementById('precioActual');
    const precioAntEl = document.getElementById('precioAnterior');
    const descEl = document.getElementById('porcentajeDescuento');
    const cantidadEl = document.getElementById('cantidadProducto');

    actualizarConAnimacion(tituloEl, producto.titulo);
    aplicarEstilosDesdeConfig(tituloEl, producto, 'titulo');

    actualizarConAnimacion(ratingEl, `★★★★☆ ${producto.estrellas} - ${producto.reseñas} ${producto.texto_reseñas || 'Reseñas'}`);
    aplicarEstilosDesdeConfig(ratingEl, producto, 'reseñas');

    const opcionesContainer = document.getElementById('cantidadOpciones');

    for (let i = 1; i <= 3; i++) {
      const mostrar = (producto[`mostrar_boton_cantidad_${i}`] || 'true').toLowerCase().trim() === 'true';
      if (!mostrar) continue;

      const btnCantidad = document.createElement('button');
      btnCantidad.textContent = producto[`texto_cantidad_boton_${i}`] || `${i} Cantidad`;
      btnCantidad.dataset.cantidad = i;
      btnCantidad.style.marginRight = '10px';
      btnCantidad.style.padding = '8px 12px';
      btnCantidad.style.borderRadius = '8px';
      btnCantidad.style.border = '1px solid #ccc';
      btnCantidad.style.cursor = 'pointer';
      btnCantidad.style.fontWeight = 'bold';
      if (i === 1) btnCantidad.classList.add('activo');

      btnCantidad.addEventListener('click', () => {
        document.querySelectorAll('#cantidadOpciones button').forEach(b => b.classList.remove('activo'));
        btnCantidad.classList.add('activo');

        const cant = btnCantidad.dataset.cantidad;
        actualizarBloquePrecios(cant, producto, {
          precioEl,
          precioAntEl,
          descEl,
          cantidadEl
        });
      });

      opcionesContainer.appendChild(btnCantidad);
    }

    const style = document.createElement('style');
    style.textContent = `
      #cantidadOpciones button.activo {
        background-color: #e60000;
        color: white;
        border: none;
      }
    `;
    document.head.appendChild(style);

    const botonInicial = document.querySelector('#cantidadOpciones button[data-cantidad="1"]');
    if (botonInicial) botonInicial.click();

    const mostrarAhorro = (producto.mostrar_texto_ahorro || 'true').toLowerCase().trim() === 'true';
    if (mostrarAhorro) {
      const textoAhorro = producto.texto_ahorro || 'Ahorra {porcentaje}%';
      actualizarConAnimacion(descEl, textoAhorro.replace('{porcentaje}', producto[`descuento_1`]));
      aplicarEstilosDesdeConfig(descEl, producto, 'descuento');
    } else {
      descEl.style.display = 'none';
    }

    const mostrarCantidad = (producto.mostrar_texto_cantidad || 'true').toLowerCase().trim() === 'true';
    if (mostrarCantidad) {
      const textoCantidad = producto.texto_cantidad_mensaje || 'Cantidad: {cantidad} Cepillos';
      actualizarConAnimacion(cantidadEl, textoCantidad.replace('{cantidad}', producto[`cantidad_1`]));
      aplicarEstilosDesdeConfig(cantidadEl, producto, 'cantidad');
    } else {
      cantidadEl.style.display = 'none';
    }

    // === REEMPLAZAMOS ESTE BLOQUE ORIGINAL POR LLAMADA A renderPersonasViendo ===
    /*
    const actualizarPersonas = () => {
      const cantidad = Math.floor(Math.random() * (25 - 10 + 1)) + 10;
      const mostrarPersonas = (producto.mostrar_texto_personas || 'true').toLowerCase().trim() === 'true';
      if (mostrarPersonas) {
        const textoPersonas = producto.texto_personas || '{cantidad} personas están viendo esto ahora';
        actualizarConAnimacion(personasEl, textoPersonas.replace('{cantidad}', cantidad));
        aplicarEstilosDesdeConfig(personasEl, producto, 'personas');
      } else {
        personasEl.style.display = 'none';
      }
    };
    actualizarPersonas();
    setInterval(actualizarPersonas, 5000);
    */




  // 🔥 Ventjas:
  for (let i = 1; i <= 2; i++) {
    const texto = producto[`ventaja_${i}_texto`] || '';
    const visible = (producto[`ventaja_${i}_visible`] || 'true').toLowerCase().trim() === 'true';
    const el = document.getElementById(`ventaja_${i}`);
    if (el) {
      if (visible) {
        actualizarConAnimacion(el, texto);
        aplicarEstilosDesdeConfig(el, producto, 'ventaja');
el.style.textAlign = 'left';  // <-- 👈 aquí forzamos alineación izquierda


      // Aplicar márgenes si están en el txt
      if (producto.ventaja_marginTop) el.style.marginTop = producto.ventaja_marginTop;
      if (producto.ventaja_marginBottom) el.style.marginBottom = producto.ventaja_marginBottom;

      } else {
        el.style.display = 'none';
      }
    }
  }









    // Ahora usamos:
    renderPersonasViendo(producto);
    setInterval(() => renderPersonasViendo(producto), 5000);

    // Botón de compra
if ((producto.boton_comprar_visible || '').toLowerCase().trim() === 'true') {
  const btn = document.createElement('button');
  btn.textContent = producto.boton_comprar_texto || 'Comprar ahora';
  btn.id = 'btnAbrirModal';
  btn.classList.add('boton-tirita');

  btn.style.backgroundColor = producto.boton_comprar_colorFondo || '#e60000';
  btn.style.color = producto.boton_comprar_colorTexto || '#ffffff';
  btn.style.fontSize = producto.boton_comprar_tamano || '16px';
  btn.style.fontFamily = (producto.boton_comprar_fuente || 'Arial').replace(/['"]/g, '');
  btn.style.fontWeight = producto.boton_comprar_negrita === 'true' ? 'bold' : 'normal';
  btn.style.borderRadius = producto.boton_comprar_radio || '8px';
  btn.style.padding = producto.boton_comprar_padding || '12px';
  btn.style.marginTop = producto.boton_comprar_marginTop || '10px';
  btn.style.border = 'none';
  btn.style.cursor = 'pointer';
  btn.style.width = '100%';

  const detalles = document.querySelector('.product-details');
  detalles.appendChild(btn);

  btn.onclick = () => {
    const modal = document.getElementById('iframeModal');
    const iframe = modal.querySelector('iframe');
    const btnActivo = document.querySelector('#cantidadOpciones button.activo');
    const cantidad = btnActivo ? btnActivo.dataset.cantidad : '1';

    if (modal && iframe) {
      // 🔄 Recargar el iframe para que el formulario se reinicie limpio
      iframe.src = "index-popup.html";

      // Mostrar el modal después de recargar
      modal.style.display = 'block';
      document.body.classList.add('modal-open');

      // Esperar un poco para que el iframe se cargue antes de enviar la cantidad
      setTimeout(() => {
        iframe.contentWindow.postMessage({ cantidadSeleccionada: cantidad }, '*');
      }, 500);
    }
  };
} // ✅ Esta llave final es la que faltaba



    // Cambiar imagen principal al hacer clic en miniatura
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnails img.thumb');
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function() {
        mainImage.style.opacity = 0;
        setTimeout(() => {
          mainImage.src = this.src;
          mainImage.alt = this.alt;
          mainImage.style.opacity = 1;
        }, 200);
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });



// ✅ Carrusel automático de imágenes
let currentIndex = 0;
const totalThumbs = thumbnails.length;

function cambiarImagenAuto() {
  currentIndex = (currentIndex + 1) % totalThumbs; // avanza y vuelve a 0 al final
  const nextThumb = thumbnails[currentIndex];

  // Simula el click para reutilizar la animación y el cambio
  nextThumb.click();
}

// Cambia cada 4 segundos (4000ms)
setInterval(cambiarImagenAuto, 4000);







    // Simulación de stock limitado dinámico
    const stockEl = document.getElementById('stockLimitado');
    let stockActual = 7;
    let bajando = true;

    function actualizarStock() {
      const mostrarStock = (producto.mostrar_texto_stock || 'true').toLowerCase().trim() === 'true';
      if (mostrarStock) {
        const textoStock = producto.texto_stock || '🔥 Solo {cantidad} unidades en stock!';
        actualizarConAnimacion(stockEl, textoStock.replace('{cantidad}', stockActual));
      } else {
        stockEl.style.display = 'none';
      }

      if (bajando) {
        if (stockActual > 3) {
          stockActual--;
        } else {
          bajando = false;
        }
      } else {
        if (stockActual < 7) {
          stockActual++;
        } else {
          bajando = true;
        }
      }

      setTimeout(actualizarStock, Math.floor(Math.random() * 30000) + 60000);
    }

    actualizarStock();
  });
