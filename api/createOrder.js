const axios = require("axios");
const crypto = require("crypto");
const qs = require("qs"); // Para enviar datos como x-www-form-urlencoded

module.exports = async (req, res) => {
  const apiKey = "35CF733F-8EF6-4B6E-BD72-592E8L5ACD6C";
  const secretKey = "5c20ed3b2f8e4d973e876788a4a1ebc535721070";
  const flowApiUrl = "https://sandbox.flow.cl/api/payment/create";

  try {
    const params = {
      apiKey,
      commerceOrder: `${Date.now()}`, // string única, por ej: timestamp
      subject: "Compra de ejemplo",
      currency: "CLP",
      amount: 1000,
      email: "cliente@example.com",
      paymentMethod: 9,
      urlReturn: "https://auto-thermo-pro.vercel.app/confirmacion",
      urlConfirmation: "https://auto-thermo-pro.vercel.app/api/flowWebhook"
    };

    // Ordenamos las claves y concatenamos para la firma
    const keys = Object.keys(params).sort();
    const stringToSign = keys.map(key => key + params[key]).join('');

    // Generamos la firma 's'
    const signature = crypto.createHmac('sha256', secretKey).update(stringToSign).digest('hex');

    // Añadimos la firma al parámetro s (obligatorio)
    params.s = signature;

    // Enviamos los datos con application/x-www-form-urlencoded
    const response = await axios.post(flowApiUrl, qs.stringify(params), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    if (response.data && response.data.url && response.data.token) {
      const paymentUrl = `${response.data.url}?token=${response.data.token}`;
      return res.status(200).json({ url: paymentUrl });
    } else {
      console.error("Respuesta inválida de Flow:", response.data);
      return res.status(500).json({ error: "No se pudo crear la orden" });
    }
  } catch (error) {
    console.error("Error Flow:", error.response?.data || error.message);
    return res.status(500).json({ error: "Error al crear la orden" });
  }
};
