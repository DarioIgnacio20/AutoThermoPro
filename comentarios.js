// Función para verificar si una imagen existe antes de mostrarla
function verificarImagen(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(src);    // ✅ imagen válida
    img.onerror = () => resolve(null);  // ❌ imagen rota
    img.src = src;
  });
}

fetch('comentarios.txt')
  .then(res => res.text())
  .then(data => {
    const comentarios = data.trim().split(/\[comentario\d+\]/).filter(Boolean);
    const contenedor = document.getElementById('comentarios-container');

    comentarios.forEach(async (bloque) => {
      const nombre = /nombre=(.+)/.exec(bloque)?.[1]?.trim() || '';
      const fecha = /fecha=(.+)/.exec(bloque)?.[1]?.trim() || '';
      const estrellas = +(/estrellas=(\d)/.exec(bloque)?.[1] || 5);
      const titulo = /titulo=(.+)/.exec(bloque)?.[1]?.trim() || '';
      const texto = /texto=(.+)/.exec(bloque)?.[1]?.trim() || '';
      const imagenesRaw = /imagenes=(.+)/.exec(bloque)?.[1]?.trim() || '';
      const imagenes = imagenesRaw.split(',').map(img => img.trim()).filter(img => img !== '');

      const imagenesVerificadas = await Promise.all(imagenes.map(verificarImagen));
      const imagenesHTML = imagenesVerificadas
        .filter(Boolean)
        .map(img => `<img src="${img}" alt="img">`)
        .join('');

      const estrellasHTML = '★'.repeat(estrellas) + '☆'.repeat(5 - estrellas);
      const inicial = nombre.charAt(0).toUpperCase();

      const html = `
        <div class="comentario">
          <div class="comentario-header">
            <div class="avatar">${inicial}</div>
            <div class="nombre-fecha">
              <strong>${nombre}</strong><br>
              <span class="estrellas">${estrellasHTML}</span><br>
              <small>${fecha}</small>
            </div>
          </div>
          <div class="comentario-titulo"><strong>${titulo}</strong></div>
          <div class="comentario-texto">${texto}</div>
          ${imagenesHTML ? `<div class="comentario-imagenes">${imagenesHTML}</div>` : ''}
        </div>
      `;

      contenedor.innerHTML += html;
    });
  });
