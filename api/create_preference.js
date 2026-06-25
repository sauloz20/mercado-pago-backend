const { MercadoPagoConfig, Preference } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: req.body.items,
        payer: req.body.payer,
        back_urls: {
          success: "https://google.com",
          failure: "https://google.com",
          pending: "https://google.com",
        },
        auto_return: "approved",
      },
    });

    res.json({
      init_point: result.init_point,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro criando pagamento",
    });
  }
};