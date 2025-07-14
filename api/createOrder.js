// /api/createOrder.js
import axios from "axios";

export default async function handler(req, res) {
  const apiKey = "35CF733F-8EF6-4B6E-BD72-592E8L5ACD6C";
  const secretKey = "5c20ed3b2f8e4d973e876788a4a1ebc535721070";
  const flowApiUrl = "https://sandbox.flow.cl/api/payment/create"; // Usa sandbox primero

  try {
    // Aquí defines los datos de la orden
    const data = {
      apiKey: apiKey,
      subject: "Compra de ejemplo",
      currency: "CLP",
      amount: 1000,
      email: "cliente@example.com",
      // URL donde Flow redirigirá después del pago
      urlReturn: "https://tusitio.com/confirmacion", 
      urlConfirmation: "https://tusitio.com/api/flowWebhook", 
    };

    // Firma: se debe generar según docs de Flow
    // Para ejemplo rápido, Flow permite crear la orden sin firma
    // Pero en producción **DEBES** firmar el request con tu secretKey (HMAC-SHA256)
    // Te puedo ayudar a hacerlo bien

    const response = await axios.post(flowApiUrl, data, {
      headers: { "Content-Type": "application/json" }
    });

    if (response.data && response.data.url) {
      return res.status(200).json({ url: response.data.url });
    } else {
      return res.status(500).json({ error: "No se pudo crear la orden" });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: "Error al crear la orden" });
  }
}
