const axios = require("axios");
const crypto = require("crypto");

module.exports = async (req, res) => {
  const apiKey = "35CF733F-8EF6-4B6E-BD72-592E8L5ACD6C";
  const secretKey = "5c20ed3b2f8e4d973e876788a4a1ebc535721070";
  const flowApiUrl = "https://sandbox.flow.cl/api/payment/create";

  try {
    const params = {
      apiKey,
      subject: "Compra de ejemplo",
      currency: "CLP",
      amount: 1000,
      email: "cliente@example.com",
      urlReturn: "https://auto-thermo-pro.vercel.app/confirmacion",
      urlConfirmation: "https://auto-thermo-pro.vercel.app/api/flowWebhook",
      s: "1"
    };

    // Flow requiere que firmes todos los parámetros (ordenados alfabéticamente)
    const sortedKeys = Object.keys(params).sort();
    const concatenated = sortedKeys.map(key => `${key}${params[key]}`).join('');

    // HMAC-SHA256 usando secretKey
    const sign = crypto.createHmac('sha256', secretKey)
                       .update(concatenated)
                       .digest('hex');

    params.sign = sign;

    const response = await axios.post(flowApiUrl, params, {
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
};
