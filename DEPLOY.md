# Deploy AgroSmart

Este guia coloca o AgroSmart online com:

- Banco de dados: Supabase PostgreSQL
- Backend: Render
- Frontend: Vercel

Nunca coloque senhas, tokens ou chaves reais no codigo. Use apenas variaveis de ambiente nas plataformas.

## Arquivos de deploy

- `backend/supabase-schema.sql`: schema pronto para executar no SQL Editor do Supabase.
- `render.yaml`: Blueprint do backend no Render.
- `frontend/vercel.json`: rewrite para o React Router funcionar em rotas como `/login` e `/dashboard`.
- `frontend/.npmrc`: garante instalacao com dependencias que ainda usam peer deps antigas.
- `backend/.env.example`: exemplo de variaveis do backend.
- `frontend/.env.example`: exemplo de variaveis do frontend.

## 1. Supabase

1. Crie um projeto no Supabase.
2. Abra `SQL Editor`.
3. Execute o arquivo `backend/supabase-schema.sql`.
4. Opcional: execute `backend/insertValues.sql` somente para dados de teste.

Importante: `insertValues.sql` possui dados demonstrativos e senhas de exemplo. Para producao, prefira criar usuarios pelo fluxo da aplicacao e criar admins com credenciais reais seguras.

Depois copie a connection string do Postgres em `Connect`.

Use uma destas opcoes:

- `Session Pooler`, recomendada se a conexao direta falhar por IPv6.
- `Direct Connection`, se o ambiente aceitar IPv6.

No Render, a forma mais simples e colar essa string em `DATABASE_URL`.

## 2. Render

Opção A: Blueprint

1. No Render, crie um novo Blueprint.
2. Selecione o repositorio `AgroSmart`.
3. O Render deve detectar `render.yaml`.
4. Preencha as variaveis marcadas como secretas.

Opção B: Web Service manual

1. Crie um `Web Service`.
2. Conecte o repositorio `AgroSmart`.
3. Configure:
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/health`

Variaveis de ambiente do backend:

```text
NODE_ENV=production
NODE_VERSION=24.14.1
PUPPETEER_CACHE_DIR=.cache/puppeteer
DATABASE_URL=
FRONTEND_URL=
JWT_SECRET=
CAPTCHA_ENABLED=false
RECAPTCHA_SECRET_KEY=
EMAIL_USER=
EMAIL_PASSWORD=
EMBRAPA_CONSUMER_KEY=
EMBRAPA_CONSUMER_SECRET=
COTACOES_REFRESH_MINUTES=30
```

Se preferir nao usar `DATABASE_URL`, configure estas variaveis em vez dela:

```text
PGUSER=
PGHOST=
PGDATABASE=
PGPASSWORD=
PGPORT=5432
PGSSL=require
```

Teste o backend depois do deploy:

```text
https://SUA-URL-DO-RENDER/health
https://SUA-URL-DO-RENDER/test/db-status
```

Guarde a URL final do Render, por exemplo:

```text
https://agrosmart-backend.onrender.com
```

## 3. Vercel

1. Crie um projeto na Vercel.
2. Conecte o repositorio `AgroSmart`.
3. Configure:
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Configure as variaveis de ambiente:

```text
VITE_API_URL=https://SUA-URL-DO-RENDER
VITE_OPENWEATHER_API_KEY=
VITE_RECAPTCHA_SITE_KEY=
```

Depois do deploy, guarde a URL final da Vercel, por exemplo:

```text
https://agrosmart.vercel.app
```

## 4. Pos-deploy

1. Volte ao Render.
2. Altere `FRONTEND_URL` para a URL final da Vercel.
3. Se tiver previews da Vercel, adicione URLs separadas por virgula:

```text
FRONTEND_URL=https://agrosmart.vercel.app,https://agrosmart-git-main-time.vercel.app
```

4. Faca redeploy do backend.
5. Teste:
   - `/`
   - `/login`
   - `/cadastro`
   - `/dashboard`
   - `/clima`
   - `/faq`
   - `/duvidas`
   - rotas administrativas, se aplicavel

## Desenvolvimento local

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
