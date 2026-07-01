const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
console.log("SUPABASE_URL =", process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_ROLE =", process.env.SUPABASE_SERVICE_ROLE ? "OK" : "UNDEFINED");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

const app = express();

app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
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
// Cadastro de usuário
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        message: "Preencha todos os campos.",
      });
    }

    // Verifica se já existe
    const { data: usuarioExistente } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (usuarioExistente) {
      return res.status(400).json({
        message: "Este e-mail já está cadastrado.",
      });
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Salva no banco
    const { error } = await supabase.from("usuarios").insert([
      {
        nome,
        email,
        senha: senhaCriptografada,
      },
    ]);

    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Erro ao cadastrar usuário.",
      });
    }

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Erro interno do servidor.",
    });
  }
});
app.get("/", (req, res) => {
  res.send("Backend atualizado funcionando!");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});