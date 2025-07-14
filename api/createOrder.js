// /api/createOrder.js
const axios = require("axios");
const qs = require("qs");
const crypto = require("crypto");

module.exports = async function handler(req, res) {
  try {
    const { producto } = req.query;

    const catalogo = {
      locker1: { description: "Locker Producto A", price: 9990 },
      locker2: { description: "Locker Producto B", price: 12990 },
    };

    const item = catalogo[producto];
    if (!item) return res.status(400).send("Producto inválido");

    const apiKey = "35CF733F-8EF6-4B6E-BD72-592E8L5ACD6C";
    const secretKey = "5c20ed3b2f8e4d973e876788a4a1ebc535721070";

    const params = {
      apiKey: apiKey,
      commerceOrder: "ORD" + Date.now(),
      subject: item.description,
      currency: "CLP",
      amount: item.price,
      email: "dariocarvajalsepulveda@gmail.com",
      paymentMethod: 9,
      urlConfirmation: "https://auto-thermo-pro.vercel.app/api/flowWebhook",
      urlReturn: "https://auto-thermo-pro.vercel.app/confirmacion"
    };

    // Ordenar parámetros alfabéticamente
    const ordered = Object.keys(params).sort().reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

    const strToSign = qs.stringify(ordered, { encode: false });
    const signature = crypto.createHmac('sha256', secretKey).update(strToSign).digest('hex');

    const data = { ...params, s: signature };

    const response = await axios.post(
      "https://www.flow.cl/api/payment/create",
      qs.stringify(data),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { url, token } = response.data;

    return res.redirect(`${url}?token=${token}`);

  } catch (error) {
    console.error("Error Flow:", error.response?.data || error.message);
    return res.status(500).send("Error al crear la orden");
  }
};
