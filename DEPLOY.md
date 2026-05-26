# Deploy AgroSmart

Este guia prepara o AgroSmart para rodar com:

- Frontend: Vercel
- Backend: Render
- Banco de dados: Supabase PostgreSQL

Nao coloque senhas, tokens ou chaves reais no codigo. Use apenas variaveis de ambiente nas plataformas.

## Visao Geral

- Backend principal: `backend/server.js`
- Backend start script: `npm start` executa `node server.js`
- Frontend: Vite em `frontend`
- API do frontend: `VITE_API_URL`
- Banco: PostgreSQL via `PGUSER`, `PGHOST`, `PGDATABASE`, `PGPASSWORD`, `PGPORT`
- SSL do PostgreSQL e ativado automaticamente quando `PGHOST` aponta para Supabase.

## A) Supabase

1. Crie um projeto no Supabase.
2. Abra o painel do projeto e va em `SQL Editor`.
3. Execute o script de criacao de tabelas em `backend/templateBD.sql`.
4. Importante: o arquivo `backend/templateBD.sql` possui um bloco `CREATE DATABASE agrosmart` no final. No Supabase esse bloco nao deve ser executado, porque o banco ja existe. Execute apenas os `CREATE TABLE` e remova/ignore o bloco `CREATE DATABASE`.
5. Se quiser popular dados iniciais, execute `backend/insertValues.sql`.
6. Cuidado com `backend/insertValues.sql`: ele contem dados de exemplo. Para producao, revise os usuarios/admins de exemplo e use senhas reais apenas via fluxo seguro da aplicacao.
7. Copie os dados de conexao do Supabase para usar no Render:
   - `PGUSER`
   - `PGHOST`
   - `PGDATABASE`
   - `PGPASSWORD`
   - `PGPORT`

## B) Render

1. Crie um `Web Service` no Render.
2. Conecte sua conta do GitHub.
3. Selecione o repositorio `AgroSmart`.
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Configure as variaveis de ambiente do backend:

```text
PGUSER=
PGHOST=
PGDATABASE=
PGPASSWORD=
PGPORT=5432
JWT_SECRET=
EMAIL_USER=
EMAIL_PASSWORD=
EMBRAPA_CONSUMER_KEY=
EMBRAPA_CONSUMER_SECRET=
COTACOES_REFRESH_MINUTES=30
FRONTEND_URL=http://localhost:5173
```

6. Faca o deploy.
7. Teste a conexao com o banco:

```text
https://SUA-URL-DO-RENDER/test/db-status
```

8. Copie a URL final do Render. Exemplo:

```text
https://agrosmart-backend.onrender.com
```

## C) Vercel

1. Crie um projeto na Vercel.
2. Conecte sua conta do GitHub.
3. Selecione o repositorio `AgroSmart`.
4. Configure:
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Configure as variaveis de ambiente do frontend:

```text
VITE_API_URL=https://SUA-URL-DO-RENDER
VITE_RECAPTCHA_SITE_KEY=
```

6. Faca o deploy.
7. Copie a URL final da Vercel. Exemplo:

```text
https://agrosmart.vercel.app
```

## D) Pos-deploy

1. Pegue a URL final da Vercel.
2. No Render, altere `FRONTEND_URL` para a URL da Vercel:

```text
FRONTEND_URL=https://SUA-URL-DA-VERCEL
```

3. Faca redeploy do backend no Render.
4. Teste as paginas principais:
   - Home
   - Login
   - Cadastro
   - Dashboard
   - Clima
   - Cotacoes
   - FAQ
   - Responde Agro
   - Areas administrativas, se aplicavel

## Desenvolvimento Local

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

URLs locais esperadas:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5001
Banco:    Supabase ou PostgreSQL local configurado no backend/.env
```

## Notas de seguranca

- `.env` esta no `.gitignore`.
- Nunca versione `backend/.env`, `frontend/.env` ou arquivos com credenciais reais.
- `VITE_API_URL` deve apontar para a URL base do backend no Render, sem necessidade de adicionar `/api`.
- O backend aceita CORS local (`http://localhost:5173`, `http://localhost:3000`) e a URL de producao em `FRONTEND_URL`.
