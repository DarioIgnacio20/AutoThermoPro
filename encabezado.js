fetch('encabezado.txt')
  .then(response => response.text())
  .then(data => {
    const lines = data.trim().split('\n');
    const config = {};
    lines.forEach(line => {
      if (line.includes('=') && !line.trim().startsWith('#')) {
        const [key, value] = line.split('=');
        config[key.trim()] = value.trim();
      }
    });

    // Hasta 5 encabezados, puedes subir más si quieres
    for (let i = 1; i <= 5; i++) {
      const texto = config[`encabezado_${i}_texto`];
      const visible = (config[`encabezado_${i}_visible`] || 'false').toLowerCase().trim() === 'true';
      const el = document.getElementById(`encabezado_${i}`);
      if (el) {
        if (visible && texto) {
          el.textContent = texto;

          // Estilos
          if (config.encabezado_colorTexto) el.style.color = config.encabezado_colorTexto;
          if (config.encabezado_tamano) el.style.fontSize = config.encabezado_tamano;
          if (config.encabezado_fuente) el.style.fontFamily = config.encabezado_fuente.replace(/['"]/g, '');
          if (config.encabezado_negrita !== undefined) el.style.fontWeight = config.encabezado_negrita === 'true' ? 'bold' : 'normal';
          if (config.encabezado_cursiva !== undefined) el.style.fontStyle = config.encabezado_cursiva === 'true' ? 'italic' : 'normal';
        } else {
          el.style.display = 'none';
        }
      }
    }
  });
