// /api/createOrder.js
import axios from "axios";
import qs from "qs";
import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { producto } = req.query;

    // Catálogo fijo con descripción y precio
    const catalogo = {
      locker1: { description: "Locker Producto A", price: 9990 },
      locker2: { description: "Locker Producto B", price: 12990 },
    };

    const item = catalogo[producto];
    if (!item) return res.status(400).send("Producto inválido");

    const apiKey = "35CF733F-8EF6-4B6E-BD72-592E8L5ACD6C";           // <-- pon tu apiKey
    const secretKey = "5c20ed3b2f8e4d973e876788a4a1ebc535721070";     // <-- pon tu secretKey

    const params = {
      apiKey: apiKey,
      commerceOrder: "ORD" + Date.now(),  // orden única
      subject: item.description,
      currency: "CLP",
      amount: item.price,
      email: "cliente@email.com",  // puedes poner genérico si no tienes el real
      paymentMethod: 9,
      urlConfirmation: "https://auto-thermo-pro.vercel.app/api/flowWebhook",
      urlReturn: "https://auto-thermo-pro.vercel.app/confirmacion"
    };

    // Ordenar parámetros alfabéticamente
    const ordered = Object.keys(params).sort().reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

    // Crear firma
    const strToSign = qs.stringify(ordered, { encode: false });
    const signature = crypto.createHmac('sha256', secretKey).update(strToSign).digest('hex');

    const data = { ...params, s: signature };

    // Llamar API Flow
    const response = await axios.post(
      "https://sandbox.flow.cl/api/payment/create",
      qs.stringify(data),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { url, token } = response.data;

    // Redirigir directo al checkout
    return res.redirect(`${url}?token=${token}`);

  } catch (error) {
    console.error("Error Flow:", error.response?.data || error.message);
    return res.status(500).send("Error al crear la orden");
  }
}
