# Backend Mercado Pago

![JavaScript](https://img.shields.io/badge/linguagem-JavaScript-blue)

Backend em Node.js que cria preferências de pagamento e oferece um endpoint de cadastro de usuários com Supabase. O repositório contém um servidor Express e uma função independente para implantação na Vercel.

## Tecnologias

Node.js, Express, Mercado Pago SDK, Supabase, bcrypt, dotenv e CORS.

## Requisitos

- Node.js e npm instalados.
- Projeto Supabase com tabela `usuarios`, incluindo colunas `nome`, `email` e `senha`.
- Credenciais apropriadas do Supabase e do Mercado Pago.

## Executar o servidor Express

```sh
git clone https://github.com/sauloz20/mercado-pago-backend.git
cd mercado-pago-backend
npm ci
```

Crie um arquivo `.env` na raiz com `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE` e `MERCADO_PAGO_ACCESS_TOKEN`. Opcionalmente, defina `PORT`. Preencha os valores localmente e nunca publique as credenciais. Inicie o servidor com:

```sh
node server.js
```

A porta padrão é 3000 e pode ser alterada em `PORT`. Não há testes automatizados configurados: `npm test` é apenas um placeholder que retorna erro.

## Rotas do servidor

- `GET /`: mensagem de estado.
- `POST /register`: recebe JSON com `nome`, `email` e `senha`; registra o usuário no Supabase.
- `POST /create_preference`: recebe JSON com `items` e `payer` compatíveis com a API do Mercado Pago e retorna `init_point`.

`vercel.json` encaminha `/create_preference` para `api/create_preference.js`. Essa função é separada do servidor Express e não fornece a rota de cadastro.

## Estrutura

```text
api/create_preference.js  Função para preferência de pagamento
server.js                 Servidor Express e rotas
supabase.js               Cliente Supabase separado
vercel.json               Roteamento da Vercel
package.json              Dependências e scripts
```

## Estado do protótipo

As URLs de retorno do pagamento apontam atualmente para o Google. A rota aceita itens enviados pelo cliente; antes de uso em produção, os preços e o pedido devem ser validados no servidor. O servidor também registra o corpo das requisições de pagamento e permite CORS amplo: revise esses pontos e o tratamento de dados antes de expô-lo publicamente.
