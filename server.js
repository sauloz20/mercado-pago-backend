const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_TOKEN,
});

app.post("/create_preference", async (req, res) => {
  console.log("Recebi uma requisição!");
  console.log(req.body);

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
    console.error("Erro criando pagamento:");
    console.error(error);

    res.status(500).json({
      error: "Erro criando pagamento",
    });
  }
});

app.listen(3000, () => {
  console.log("Backend rodando na porta 3000");
});