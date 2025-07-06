fetch('puntos.txt')
  .then(res => res.text())
  .then(data => {
    const bloques = data.split(/\[beneficio\d+\]/).filter(Boolean);
    const contenedor = document.createElement('div');
    contenedor.className = 'benefits-puntos';  // clase única

    bloques.forEach(bloque => {
      const icono = /icono=(.+)/.exec(bloque)?.[1]?.trim() || '';
      const titulo = /titulo=(.+)/.exec(bloque)?.[1]?.trim() || '';
      const texto = /texto=(.+)/.exec(bloque)?.[1]?.trim() || '';

      const div = document.createElement('div');
      div.className = 'benefit-punto';  // clase única
      div.innerHTML = `
        <h3>${icono} ${titulo}</h3>
        <p>${texto}</p>
      `;

      contenedor.appendChild(div);
    });

    document.querySelector('.container')?.appendChild(contenedor);
  });
