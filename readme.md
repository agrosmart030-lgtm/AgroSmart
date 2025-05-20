# Projeto AgroSmart

## Descrição

O AgroSmart é uma aplicação web para gestão de cooperativas agrícolas, com backend em Node.js/Express e banco de dados PostgreSQL, e frontend em React. O sistema permite cadastro, login, gerenciamento de usuários, consulta e inserção de dados em tabelas agrícolas, além de um canal de FAQ integrado ao banco.

## Tecnologias Utilizadas

- **Backend:** Node.js, Express, PostgreSQL, dotenv, pg
- **Frontend:** React, React Router, Tailwind CSS, DaisyUI, Vite
- **Documentação:** Swagger (disponível em `/api-docs`)

## Estrutura de Pastas

```
backend/
  server.js           # Inicialização do servidor e rotas principais
  templateBD.sql      # Script para criar o banco e tabelas
  routes/
    login.js          # Rota de login
    registro.js       # Rota de cadastro
    tabelas.js        # Rotas CRUD para tabelas principais
    faq.js            # Rotas do FAQ (mensagens)
    dbTest.js         # Rotas de teste de conexão com o banco
frontend/
  src/
    pages/            # Páginas principais (login, cadastro, dashboard, faq, home)
    componentes/      # Componentes reutilizáveis
  ...
```

## Como Rodar o Projeto Localmente

### 1. Pré-requisitos

- Node.js 18+
- npm
- PostgreSQL

### 2. Banco de Dados

- Execute o arquivo `backend/templateBD.sql` para criar o banco e as tabelas necessárias.
- Configure o arquivo `.env` no backend com as credenciais do seu PostgreSQL.

### 3. Backend

```sh
cd backend
npm install
npm run dev
```

O backend ficará disponível em http://localhost:5001

### 4. Frontend

```sh
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em http://localhost:5173

### 5. Testes e Utilização

- Acesse o frontend em http://localhost:5173
- Acesse a documentação Swagger em http://localhost:5001/api-docs
- Realize cadastro, login, cadastros de dados agrícolas e envie mensagens pelo FAQ (integrado ao banco)

## Rotas e Funcionalidades

- **Login:** POST `/api/login` — autenticação de usuário
- **Cadastro:** POST `/api/registro` — registro de novos usuários (agricultor, empresário, cooperativa)
- **CRUD Tabelas:**
  - GET `/api/tabelas` — lista nomes das tabelas
  - GET `/api/tabelas/dados` — lista registros de todas as tabelas
  - GET `/api/tabelas/:tabela` — lista registros de uma tabela específica
  - POST para cada tabela (`/api/tabelas/agricultores`, `/api/tabelas/empresarios`, etc.)
- **FAQ:**
  - POST `/api/faq` — envia mensagem para o FAQ
  - GET `/api/faq` — lista mensagens do FAQ
- **Testes de banco:**
  - GET `/test/db-status` — testa conexão
  - GET `/test/db-version` — retorna versão do PostgreSQL

## Observações

- O FAQ está totalmente integrado: mensagens enviadas pelo frontend são salvas no banco via backend.
- Para resetar o banco, basta rodar novamente o `templateBD.sql`.
- Para mais detalhes técnicos das rotas, consulte o arquivo `ROTAS_EXPLICACAO.txt`.
- Para um guia de instalação detalhado, consulte o arquivo `PASSO_A_PASSO.txt`.

---

Dúvidas ou problemas? Consulte os arquivos de documentação ou entre em contato com o responsável pelo projeto.
