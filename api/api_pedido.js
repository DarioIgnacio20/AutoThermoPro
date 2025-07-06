export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

// 👇 pega aquí tu URL del script de Google Sheets
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzoTgnmIrINVgejEltpYJ8Q-1DKhw2qWjpJMc5l0EapaUW6rP4oIql46jW-1AzQkzVDiw/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const datos = req.body;

    // Envía los datos a Google Sheets
    await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    // También puedes mantener el log
    console.log('Nuevo pedido recibido y enviado a Sheets:', datos);

    res.status(200).json({ mensaje: 'Pedido guardado correctamente' });
  } catch (e) {
    console.error('Error en el servidor:', e);
    res.status(500).json({ error: 'Error al guardar en Google Sheets' });
  }
}
