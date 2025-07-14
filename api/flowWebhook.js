// /api/flowWebhook.js
export default async function handler(req, res) {
  console.log("Notificación recibida de Flow:", req.body);
  // Aquí deberías validar la firma que envía Flow, y luego actualizar el pedido en tu base de datos

  // Flow espera que respondas con HTTP 200
  res.status(200).send("OK");
}
