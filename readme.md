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
- Dashboard de cotações com filtros por grão/cooperativa, histórico e página de análise com comparativos separados por grão.
- Cache e histórico de cotações no PostgreSQL.
- Análise inteligente simples de cotações, baseada em regras e estatísticas do histórico.
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
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key_here
EMAIL_FROM="AgroSmart" <your_verified_sender@example.com>
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_REQUIRE_TLS=true
SMTP_FAMILY=4
EMAIL_TIMEOUT_MS=30000

EMBRAPA_CONSUMER_KEY=
EMBRAPA_CONSUMER_SECRET=

COTACOES_REFRESH_MINUTES=30
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=
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

O envio de codigo por e-mail e obrigatorio no cadastro. O backend so aceita finalizar o cadastro depois que `/api/verify-code` valida o codigo enviado e retorna um token de verificacao para o mesmo e-mail.

No plano Free do Render, nao use Gmail SMTP nas portas `25`, `465` ou `587`, pois essas conexoes podem falhar com timeout. Use SendGrid SMTP na porta `2525`.

Para SendGrid SMTP:

- `EMAIL_USER` deve ser literalmente `apikey`.
- `EMAIL_PASSWORD` deve ser a API Key do SendGrid, configurada somente no ambiente.
- `EMAIL_FROM` deve ser um remetente verificado no SendGrid; em producao, use `"AgroSmart" <agrosmart030@gmail.com>`.
- No SendGrid, crie/verifique um Single Sender.
- Crie uma API Key com Custom Access e libere somente Mail Send com Full Access.
- Nao coloque a API Key no GitHub, no README ou em logs.

```text
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key_here
EMAIL_FROM="AgroSmart" <agrosmart030@gmail.com>
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_REQUIRE_TLS=true
SMTP_FAMILY=4
EMAIL_TIMEOUT_MS=30000
```

O endpoint `/api/send-verification-email` salva o codigo somente quando o SMTP aceita o envio. Se o provider retornar erro, a API responde `success: false` e nenhum codigo fica valido para aquele e-mail.

Teste direto do envio:

```http
POST /api/send-verification-email
Content-Type: application/json

{
  "email": "email-de-teste@gmail.com"
}
```

Resposta esperada:

```json
{
  "success": true,
  "message": "E-mail de verificação enviado com sucesso."
}
```

Teste do fluxo real: faca um cadastro pelo frontend, aguarde o e-mail, valide o codigo em `/api/verify-code` e finalize o cadastro em `/api/registro` com o `emailVerificationToken` retornado. O backend nao aceita finalizar cadastro sem esse token valido.

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
| GET | `/api/cotacoes/analise` | Análise simples por grão, com tendência, variação, médias e comparação entre cooperativas |
| POST | `/api/cotacoes/refresh` | Atualiza o cache de cotações a partir da API externa |
| GET | `/api/cotacoes/cache-status` | Diagnóstico do cache e disponibilidade de cotação do dia |
| GET/POST | `/api/faq` | Mensagens de FAQ |
| GET | `/api/responde-agro` | Consulta técnica Embrapa |
| GET | `/api/configuracao/:usuario_id` | Dados do perfil |
| GET | `/api/usuarios` | Listagem administrativa de usuários |
| PATCH | `/api/usuarios/:id/status` | Alteração de status |
| GET | `/api/tabelas` | Listagem de tabelas |
| GET | `/api/tabelas/:tabela` | Dados de uma tabela |

## Painel de Cotações e Análise Inteligente

O painel de cotações usa dados de `/api/cotacoes/todos`, histórico de `/api/cotacoes/historico` e a rota `/api/cotacoes/analise`. A aba `Cotação` mostra os preços do dia por cooperativa. A aba `Histórico` mostra séries filtradas por cooperativa, grão e período. A aba `Análise` concentra os indicadores inteligentes.

- cards de maior cotação, menor cotação, média de preço e última atualização sempre separados por grão;
- gráfico comparativo entre cooperativas para um único grão selecionado;
- gráfico de evolução histórica por cooperativa, grão e período;
- resumo inteligente com tendência de alta, queda, estabilidade ou dados insuficientes;
- sugestão textual simples para o produtor com base em variação percentual e melhor preço encontrado.

Importante: o sistema não calcula média nem ranqueia maior/menor preço misturando grãos diferentes. Quando `/api/cotacoes/analise` é chamada sem `grao`, a resposta traz uma lista em `graos`, e cada item possui suas próprias `estatisticas` e `comparativoCooperativas`.

A análise inteligente não depende de API paga de IA. Ela usa regras determinísticas, estatística básica e os registros salvos em `tb_cotacoes_cache` e `tb_cotacoes_historico`.

Teste da análise no backend:

```http
GET /api/cotacoes/analise?period=30d
Authorization: Bearer <token>
```

Filtros aceitos:

```text
period=7d | 30d | 6m | 1y
grao=SOJA | MILHO | TRIGO | CAFE | FEIJAO
```

Exemplo:

```http
GET /api/cotacoes/analise?grao=SOJA&period=6m
Authorization: Bearer <token>
```

Limitações: a análise depende da qualidade e frequência das fontes de cotação. Quando há poucos registros históricos, a API retorna mensagem de dados insuficientes em vez de inferir tendência artificialmente.

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
