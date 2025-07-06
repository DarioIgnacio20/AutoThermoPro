// regiones_comunas.js
function cargarRegionesYComunas() {
  const selectRegion = document.getElementById('region');
  const selectComuna = document.getElementById('comuna');
  const comunasPorRegion = {};

  // Cargar comunas desde archivo CSV
  fetch('comunas.txt')
    .then(response => response.text())
    .then(texto => {
      const lineas = texto.trim().split('\n');
      lineas.shift(); // eliminar encabezado

      lineas.forEach(linea => {
        const [region, comuna] = linea.split(',');
        const regionLimpia = region.trim();
        const comunaLimpia = comuna.trim();

        if (!comunasPorRegion[regionLimpia]) {
          comunasPorRegion[regionLimpia] = [];
        }
        comunasPorRegion[regionLimpia].push(comunaLimpia);
      });

      // Rellenar <select> de regiones
      Object.keys(comunasPorRegion).forEach(region => {
        const opcion = document.createElement('option');
        opcion.value = region;
        opcion.textContent = region;
        selectRegion.appendChild(opcion);
      });

      // Escuchar cambio de región
      selectRegion.addEventListener('change', () => {
        const regionSeleccionada = selectRegion.value;
        const comunas = comunasPorRegion[regionSeleccionada] || [];

        selectComuna.innerHTML = '<option value="">Selecciona comuna</option>';
        comunas.forEach(comuna => {
          const opcion = document.createElement('option');
          opcion.value = comuna;
          opcion.textContent = comuna;
          selectComuna.appendChild(opcion);
        });

        selectComuna.disabled = comunas.length === 0;
      });
    })
    .catch(error => {
      console.error("Error cargando comunas:", error);
    });
}

document.addEventListener('DOMContentLoaded', cargarRegionesYComunas);
