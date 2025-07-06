fetch('gift.txt')
  .then(res => res.text())
  .then(data => {
    const secciones = data.split(/\[beneficio\d+\]/).filter(x => x.trim());
    const gifContainer = document.createElement('div');
    gifContainer.className = 'gif-benefits';

    secciones.forEach((seccion, index) => {
      const gif = /gif=(.+)/.exec(seccion)?.[1]?.trim() || '';
      const titulo = /titulo=(.+)/.exec(seccion)?.[1]?.trim() || '';
      const texto = /texto=(.+)/.exec(seccion)?.[1]?.trim() || '';

      const filaClase = index % 2 === 0 ? 'fila-derecha' : 'fila-izquierda';

      const html = `
        <div class="gif-benefit ${filaClase}">
          <div class="gif-texto">
            <h3>${titulo}</h3>
            <p>${texto}</p>
          </div>
          <div class="gif-imagen">
            <img src="${gif}" alt="${titulo}">
          </div>
        </div>
      `;

      gifContainer.innerHTML += html;
    });

    const destino = document.getElementById("seccion-gif-beneficios");
    if (destino) {
      destino.appendChild(gifContainer);
    }
  });
