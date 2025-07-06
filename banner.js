document.addEventListener("DOMContentLoaded", () => {
  fetch('banner.txt')
    .then(response => response.text())
    .then(text => {
      const config = {};
      text.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value) config[key.trim()] = value.join('=').trim();
      });

      const bannerText = document.getElementById('bannerText');
      const bannerHeader = document.getElementById('bannerHeader');

      // Texto
      bannerText.textContent = config.texto || 'Banner por defecto';

      // Estilos del header
      bannerHeader.style.backgroundColor = config.colorFondo || '#000';
      bannerHeader.style.width = config.ancho || '100%';
      bannerHeader.style.height = config.alto || '40px';

      // Estilos del texto
      bannerText.style.color = config.colorTexto || '#fff';
      bannerText.style.fontSize = config.tamano || '16px';
      bannerText.style.fontFamily = config.fuente || 'Arial, sans-serif';

      // Animación con velocidad
      bannerText.style.display = 'inline-block';
      bannerText.style.paddingLeft = '100%';
      bannerText.style.animation = `scroll-left ${config.velocidad || '15s'} linear infinite`;
    })
    .catch(error => {
      console.error('Error al cargar banner.txt:', error);
    });
});