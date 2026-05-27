# AgroSmart+

O **AgroSmart+** é uma plataforma web acadêmica voltada ao agronegócio. O sistema reúne cadastro e autenticação de usuários, painel de cotações agrícolas, consulta climática, FAQ, consulta técnica via Embrapa, recursos de acessibilidade e área administrativa para acompanhamento de usuários e tabelas do banco.

No código-fonte a marca também aparece como **AgroSmart**. Este README utiliza **AgroSmart+** para manter alinhamento com a documentação acadêmica.

## Objetivo

Centralizar informações relevantes ao produtor rural, empresário agrícola e cooperativa em uma aplicação web responsiva, com backend próprio, persistência em PostgreSQL e possibilidade de deploy em Vercel, Render e Supabase.

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Frontend | React 19, Vite, React Router, Axios, Tailwind CSS, DaisyUI, React Hook Form, Lucide React, React Icons, Recharts, SweetAlert2, React Google reCAPTCHA |
| Backend | Node.js, Express 5, PostgreSQL `pg`, CORS, dotenv, bcrypt, jsonwebtoken, Nodemailer, Axios, Swagger UI, Puppeteer |
| Banco | PostgreSQL local ou Supabase PostgreSQL |
| Deploy previsto | Vercel para frontend, Render para backend e Supabase para banco |

## Estrutura de Pastas

```text
AgroSmart/
├── backend/
│   ├── routes/                 # Rotas Express
│   ├── services/               # E-mail, API Embrapa e scrapers
│   ├── utils/                  # Auth, validadores e CAPTCHA
│   ├── server.js               # Entrada da API
│   ├── supabase-schema.sql     # Schema compatível com Supabase/PostgreSQL
│   ├── templateBD.sql          # Modelo SQL original
│   └── insertValues.sql        # Dados demonstrativos
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── componentes/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   ├── vercel.json
│   └── vite.config.js
├── docs/
│   └── agrosmart-documentacao.tex
├── render.yaml
├── DEPLOY.md
├── package.json
└── readme.md
```

## Funcionalidades Principais

- Home institucional com identidade visual AgroSmart+.
- Cadastro em etapas para agricultor, empresário e cooperativa.
- Validação de CPF/CNPJ no frontend e backend.
- Verificação de e-mail por código.
- Login com JWT para usuários e administradores.
- Senhas de usuários com hash bcrypt.
- Recuperação e redefinição de senha por e-mail.
- Dashboard de cotações, filtros por grão/cooperativa e histórico.
- Cache e histórico de cotações no PostgreSQL.
- Consulta climática via OpenWeatherMap.
- FAQ público com gravação no banco.
- Consulta técnica via API RespondeAgro da Embrapa.
- Painel administrativo com usuários, status, tabelas do banco e FAQ.
- Rotas protegidas por token JWT.
- Página 404 personalizada com tema agrícola.
- Recursos de acessibilidade.

## Pré-requisitos

- Node.js `>=20.0.0 <25.0.0`
- npm `>=10.0.0`
- PostgreSQL local ou projeto Supabase
- Conta Google reCAPTCHA, se `CAPTCHA_ENABLED=true`
- Chave OpenWeatherMap para a página de clima
- Credenciais de e-mail para envio de códigos

## Instalação Local

```bash
npm run install:all
```

Ou instale por camada:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Variáveis de Ambiente do Backend

Crie `backend/.env` a partir de `backend/.env.example`.

```text
DATABASE_URL=
NODE_ENV=development

PGUSER=
PGHOST=
PGDATABASE=
PGPASSWORD=
PGPORT=5432
PGSSL=

JWT_SECRET=
CAPTCHA_ENABLED=false
RECAPTCHA_SECRET_KEY=
EMAIL_USER=
EMAIL_PASSWORD=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REQUIRE_TLS=true
EMAIL_TIMEOUT_MS=30000

EMBRAPA_CONSUMER_KEY=
EMBRAPA_CONSUMER_SECRET=

COTACOES_REFRESH_MINUTES=30
FRONTEND_URL=http://localhost:5173
```

Use `DATABASE_URL` para Supabase/Render ou as variáveis `PG*` para PostgreSQL local. Em Supabase, normalmente use `PGSSL=require` ou uma connection string com SSL.

## Variáveis de Ambiente do Frontend

Crie `frontend/.env` a partir de `frontend/.env.example`.

```text
VITE_API_URL=http://localhost:5001
VITE_OPENWEATHER_API_KEY=
VITE_RECAPTCHA_SITE_KEY=
```

`VITE_RECAPTCHA_SITE_KEY` só deve ser preenchida quando o backend estiver com `CAPTCHA_ENABLED=true`.

## Banco PostgreSQL/Supabase

Para Supabase:

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Execute `backend/supabase-schema.sql`.
4. Opcionalmente execute `backend/insertValues.sql` apenas para dados de demonstração.
5. Configure `DATABASE_URL` no backend.

Para PostgreSQL local, crie o banco e aplique o schema. O arquivo `templateBD.sql` mantém o modelo original; para deploy atual, prefira `backend/supabase-schema.sql`.

## reCAPTCHA

O CAPTCHA é opcional em desenvolvimento e controlado pelo backend.

Desabilitado localmente:

```text
CAPTCHA_ENABLED=false
VITE_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

Habilitado:

```text
CAPTCHA_ENABLED=true
RECAPTCHA_SECRET_KEY=sua_secret_key_do_google
VITE_RECAPTCHA_SITE_KEY=sua_site_key_do_google
```

A site key fica somente no frontend. A secret key fica somente no backend. Login e cadastro enviam `recaptchaToken`; o backend valida esse token na API do Google antes de aceitar a operação quando o CAPTCHA está habilitado.

## Verificação de E-mail

O envio de código por e-mail é obrigatório no cadastro. Configure SMTP real no backend:

```text
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REQUIRE_TLS=true
EMAIL_TIMEOUT_MS=30000
```

Para Gmail, use uma senha de app da conta e não a senha normal. O backend remove espaços da senha de app automaticamente, porque o Google costuma exibir o código em grupos. Se o Render ainda apresentar `Connection timeout`, use um provedor transacional com SMTP/HTTP API, como SendGrid, Mailgun, Resend ou Brevo.

## Execução

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Ambiente completo:

```bash
npm run dev
```

URLs locais:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5001
Swagger:  http://localhost:5001/api-docs
Health:   http://localhost:5001/health
Banco:    http://localhost:5001/test/db-status
```

## Build

```bash
npm run build
```

Ou por camada:

```bash
npm run build:frontend
npm run build:backend
```

## Rotas Principais da API

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/health` | Status da API e configurações essenciais |
| GET | `/test/db-status` | Teste de conexão com PostgreSQL |
| POST | `/api/login` | Login de usuário/admin |
| POST | `/api/registro` | Cadastro de usuário |
| POST | `/api/send-verification-email` | Envio de código de verificação |
| POST | `/api/verify-code` | Validação do código de e-mail |
| POST | `/api/forgot-password` | Envio de código para redefinição |
| POST | `/api/reset-password` | Redefinição de senha |
| GET | `/api/cotacoes/todos` | Cotações cacheadas/agregadas |
| GET | `/api/cotacoes/historico` | Histórico de cotações |
| GET/POST | `/api/faq` | Mensagens de FAQ |
| GET | `/api/responde-agro` | Consulta técnica Embrapa |
| GET | `/api/configuracao/:usuario_id` | Dados do perfil |
| GET | `/api/usuarios` | Listagem administrativa de usuários |
| PATCH | `/api/usuarios/:id/status` | Alteração de status |
| GET | `/api/tabelas` | Listagem de tabelas |
| GET | `/api/tabelas/:tabela` | Dados de uma tabela |

## Segurança e Boas Práticas

- Arquivos `.env` não devem ser versionados.
- JWT usa `JWT_SECRET` vindo do ambiente.
- Senhas de usuários são armazenadas com bcrypt.
- O backend valida CPF/CNPJ em cadastro.
- Rotas sensíveis usam middleware JWT.
- reCAPTCHA é validado no backend quando habilitado.
- CORS usa `FRONTEND_URL` e origens locais permitidas.
- Erros internos não expõem stack trace em produção.
- Chaves públicas do Vite ficam no bundle; não coloque secrets em variáveis `VITE_*`.

Observação: credenciais administrativas antigas podem existir em dados demonstrativos. Para produção, cadastre administradores com senha forte e hash seguro.

## Deploy

### Supabase

Use `backend/supabase-schema.sql` no SQL Editor e configure a connection string no Render.

### Render

`render.yaml` define:

```text
rootDir: backend
buildCommand: npm install
startCommand: npm start
healthCheckPath: /health
```

Configure as variáveis secretas no painel do Render.

### Vercel

Configure:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
VITE_API_URL=https://sua-api-render.onrender.com
VITE_OPENWEATHER_API_KEY=
VITE_RECAPTCHA_SITE_KEY=
```

`frontend/vercel.json` contém rewrite para que rotas React Router funcionem em produção.

## Status Atual

O projeto está funcional como base acadêmica full stack, com frontend responsivo, backend Express, integração PostgreSQL/Supabase e documentação técnica. Alguns módulos administrativos ainda são parciais ou demonstrativos.

## Próximos Passos

- Implementar CRUD completo para FAQ administrativo.
- Persistir edição completa de perfil.
- Criar fluxo seguro para cadastro de novos administradores.
- Migrar administradores legados para bcrypt.
- Ampliar Swagger para todas as rotas.
- Criar testes automatizados de frontend, backend e banco.
- Revisar rate limiting, logs e auditoria antes de produção real.

## Integrantes

Integrantes formais não foram identificados no repositório. Preencha esta seção conforme a equipe acadêmica responsável.

## Licença

O `package.json` da raiz indica licença ISC. Não foi identificado arquivo `LICENSE`.

## Observação Acadêmica

Este é um projeto acadêmico. Para uso em produção, revise políticas de privacidade, proteção de dados, hardening de infraestrutura, backups, rotação de credenciais, logs de auditoria e testes automatizados.
