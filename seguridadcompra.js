fetch('seguridadcompra.txt')
  .then(res => res.text())
  .then(data => {
    const bloques = data.split(/\[\s*seguridad\d+\s*\]/gi).filter(Boolean);
    const contenedor = document.createElement('div');
    contenedor.className = 'benefits';

    bloques.forEach(bloque => {
      const img = /imagen=(.+)/.exec(bloque)?.[1]?.trim() || '';
      const titulo = /titulo=(.+)/.exec(bloque)?.[1]?.trim() || '';
      const visible = /visible=(.+)/.exec(bloque)?.[1]?.trim() || 'false';
      if (visible.toLowerCase() !== 'true') return;

      const div = document.createElement('div');
      div.className = 'benefit';
div.innerHTML = `
  <img class="benefit-img" src="${img}" alt="${titulo}">
  <h3 class="benefit-titulo">${titulo}</h3>
`;

      contenedor.appendChild(div);
    });

    document.querySelector('#seccion-seguridad')?.appendChild(contenedor);
  });
