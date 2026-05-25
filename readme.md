# AgroSmart+

O **AgroSmart+** é uma aplicação web voltada ao agronegócio, reunindo recursos para cadastro de usuários, consulta de cotações agrícolas, visualização de clima, suporte por FAQ, consulta técnica com base na API RespondeAgro da Embrapa e administração de usuários e tabelas do banco.

No código-fonte, a marca aparece majoritariamente como **AgroSmart**. Este README utiliza **AgroSmart+** para manter alinhamento com a documentação acadêmica solicitada.

## Visão Geral

O projeto foi construído com arquitetura separada entre **frontend**, **backend** e **banco de dados**:

| Camada | Descrição |
|---|---|
| Frontend | Aplicação React com Vite, Tailwind CSS, DaisyUI, rotas protegidas, dashboards e recursos de acessibilidade. |
| Backend | API Node.js com Express, PostgreSQL, autenticação JWT, envio de e-mail, scrapers de cotações e integração com APIs externas. |
| Banco de dados | PostgreSQL com tabelas para usuários, perfis, grãos, cotações, FAQ, administradores e cache/histórico de cotações. |

## Objetivo

O objetivo do AgroSmart+ é facilitar o acesso a informações úteis para usuários do setor agrícola, centralizando dados de mercado, clima, suporte e conhecimento técnico em uma interface web organizada.

## Contexto do Problema

Produtores, cooperativas e empresas do agronegócio frequentemente dependem de dados distribuídos em diferentes fontes, como sites de cooperativas, serviços climáticos, canais de atendimento e bases técnicas. O AgroSmart+ busca reduzir essa fragmentação ao oferecer um ambiente único para consulta e gestão dessas informações.

## Funcionalidades Principais

- Cadastro de usuários com perfis de **agricultor**, **empresário** e **cooperativa**.
- Verificação de e-mail por código durante o cadastro.
- Login com JWT para usuários comuns e administradores.
- Recuperação e redefinição de senha por e-mail.
- Dashboard de cotações agrícolas.
- Coleta de cotações da **COAMO** e **LAR** via Puppeteer.
- Cache e histórico de cotações no PostgreSQL.
- Consulta de clima atual e previsão com OpenWeatherMap.
- Busca de estados e cidades pela API de Localidades do IBGE.
- Consulta técnica pela API **RespondeAgro** da Embrapa.
- Formulário de suporte/FAQ com gravação no banco.
- Painel administrativo com usuários, status, tabelas e mensagens de FAQ.
- Recursos de acessibilidade, incluindo modo escuro, alto contraste, ajuste de fonte e comandos de voz.
- Link de contato via WhatsApp para cooperativas exibidas no dashboard.

## Tecnologias Utilizadas

### Frontend

- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- DaisyUI
- React Hook Form
- Zod
- Recharts
- Lucide React
- React Icons
- Framer Motion
- SweetAlert2
- React Google reCAPTCHA
- React Speech Recognition

### Backend

- Node.js
- Express 5
- PostgreSQL com `pg`
- CORS
- dotenv
- bcrypt
- jsonwebtoken
- Nodemailer
- Axios
- Swagger UI Express
- Puppeteer

### Banco de Dados

- PostgreSQL
- Scripts SQL em `backend/templateBD.sql` e `backend/insertValues.sql`
- Tabelas auxiliares criadas pelo servidor para cache e histórico de cotações

## Arquitetura Geral

```text
Usuário
  |
  v
Frontend React/Vite
  |
  v
Backend Node.js/Express
  |
  v
PostgreSQL
  |
  +--> APIs externas: IBGE, OpenWeatherMap, Embrapa, Gmail/Nodemailer
  +--> Scrapers: COAMO e LAR
  +--> WhatsApp: contato externo via link
```

O frontend consome a API do backend em `http://localhost:5001`. O backend centraliza regras de negócio, autenticação, acesso ao banco, envio de e-mails, consulta à Embrapa e atualização de cotações.

## Estrutura de Pastas

```text
AgroSmart/
├── backend/
│   ├── routes/              # Rotas da API
│   ├── services/            # Serviços e scrapers
│   ├── utils/               # Middlewares
│   ├── server.js            # Entrada do backend
│   ├── templateBD.sql       # Criação do banco/tabelas
│   ├── insertValues.sql     # Dados de exemplo
│   └── setup_db.js          # Tabela auxiliar de conhecimento agro
├── frontend/
│   ├── src/
│   │   ├── assets/          # Imagens e ícones
│   │   ├── componentes/     # Componentes reutilizáveis
│   │   ├── contexts/        # Contexto de acessibilidade
│   │   ├── hooks/           # Hooks e contexto de autenticação
│   │   ├── pages/           # Telas da aplicação
│   │   └── services/        # Cliente Axios
│   ├── index.html
│   └── vite.config.js
├── documentacao/            # Documentação acadêmica em LaTeX
├── package.json             # Workspaces e scripts principais
└── readme.md                # README principal
```

## Principais Telas e Módulos

| Tela/Módulo | Situação | Descrição |
|---|---|---|
| Home | Implementada | Apresenta serviços, parceiros e chamadas para login/cadastro. |
| Cadastro | Implementado | Cadastro em etapas com tipo de perfil, reCAPTCHA e verificação por e-mail. |
| Login | Implementado | Autentica usuários e administradores pela rota principal. |
| Recuperação de senha | Implementada | Envio de código e redefinição de senha. |
| Dashboard | Implementado | Cotações por cooperativa, filtros e histórico. |
| Clima | Implementado | Consulta clima atual, previsão e geolocalização. |
| FAQ público | Implementado | Envia mensagens para o banco. |
| RespondeAgro | Implementado | Consulta técnica via API da Embrapa. |
| Configuração de perfil | Parcial | Exibe dados; edição atualiza apenas estado local. |
| Painel administrativo | Parcial | Usuários, tabelas e FAQ funcionam; algumas telas são estáticas. |
| Novo Admin, Logs, Estatísticas | Parcial | Telas existem, mas sem persistência completa identificada. |

## Backend e Rotas

O backend roda na porta `5001` e disponibiliza Swagger parcial em:

```text
http://localhost:5001/api-docs
```

Rotas principais identificadas:

| Método | Rota | Finalidade |
|---|---|---|
| POST | `/api/login` | Login de usuário comum ou administrador. |
| POST | `/api/registro` | Cadastro de usuário e perfil. |
| POST | `/api/send-verification-email` | Envio de código de verificação. |
| POST | `/api/verify-code` | Validação do código de cadastro. |
| POST | `/api/forgot-password` | Envio de código para recuperação de senha. |
| POST | `/api/reset-password` | Redefinição de senha. |
| GET | `/api/cotacoes/todos` | Retorna cotações agregadas/cacheadas. |
| GET | `/api/cotacoes/historico` | Retorna histórico de cotações. |
| GET | `/api/responde-agro` | Consulta a API RespondeAgro. |
| GET/POST | `/api/faq` | Lista ou grava mensagens de FAQ. |
| GET | `/api/configuracao/:usuario_id` | Retorna dados completos do usuário. |
| GET | `/api/usuarios` | Lista usuários com detalhes. |
| PATCH | `/api/usuarios/:id/status` | Altera status do usuário. |
| GET | `/api/tabelas` | Lista tabelas do banco. |
| GET | `/api/tabelas/:tabela` | Lista registros e colunas de uma tabela. |
| GET | `/test/db-status` | Testa conexão com PostgreSQL. |

## Banco de Dados

As principais tabelas identificadas são:

- `tb_usuario`
- `tb_agricultor`
- `tb_empresario`
- `tb_cooperativa`
- `tb_grao`
- `tb_usuario_grao`
- `tb_historico_cotacao`
- `tb_cotacoes_cache`
- `tb_cotacoes_historico`
- `tb_faq`
- `tb_admin`
- `tb_conhecimento_agro`

Observações:

- `templateBD.sql` cria o modelo principal do banco.
- `insertValues.sql` popula dados de exemplo, incluindo usuários, perfis, grãos, FAQ e administradores.
- `setup_db.js` cria uma tabela auxiliar de conhecimento agro, mas não foi identificada rota ativa que a consuma diretamente.
- O servidor também garante a existência de tabelas de cache e histórico de cotações na inicialização.

## Fluxo Geral do Sistema

1. O visitante acessa a home.
2. O usuário realiza cadastro em etapas.
3. O sistema envia um código de verificação por e-mail.
4. Após a verificação, o backend grava o usuário e seu perfil.
5. O usuário faz login e recebe um token JWT.
6. O frontend armazena usuário e token em `localStorage`.
7. O usuário acessa dashboard, clima, FAQ, RespondeAgro e perfil.
8. Administradores acessam o painel administrativo e gerenciam usuários, tabelas e mensagens.
9. O backend atualiza cotações periodicamente por scrapers e grava cache/histórico.

## Integrações Externas

| Integração | Uso no projeto |
|---|---|
| IBGE Localidades | Estados e municípios em cadastro/configuração. |
| OpenWeatherMap | Clima atual, previsão e geolocalização. |
| Embrapa RespondeAgro | Consulta técnica de perguntas e respostas. |
| Gmail/Nodemailer | Envio de códigos por e-mail. |
| COAMO | Scraping de cotações. |
| LAR | Scraping de cotações. |
| WhatsApp | Link externo de contato com vendedores/cooperativas. |
| Google reCAPTCHA | Validação visual no frontend quando configurado. |

## Requisitos Funcionais Resumidos

- Cadastrar usuários por tipo de perfil.
- Verificar e-mail por código.
- Autenticar usuários e administradores.
- Recuperar senha por e-mail.
- Consultar cotações e histórico.
- Consultar clima.
- Enviar mensagens de FAQ.
- Consultar base técnica da Embrapa.
- Gerenciar usuários no painel administrativo.
- Consultar tabelas do banco.
- Oferecer recursos de acessibilidade.

## Requisitos Não Funcionais Resumidos

- Arquitetura separada entre frontend e backend.
- Persistência relacional em PostgreSQL.
- Uso de JWT em rotas protegidas.
- Hash de senha para usuários comuns.
- Interface responsiva.
- Organização modular de páginas, componentes, rotas e serviços.
- Uso de variáveis de ambiente para dados sensíveis.
- Documentação técnica e acadêmica do projeto.

## Execução Local

### Pré-requisitos

- Node.js 16 ou superior
- npm 7 ou superior
- PostgreSQL

### Instalação

```bash
npm run install:all
```

### Banco de dados

Execute os scripts do backend conforme a necessidade do ambiente:

```text
backend/templateBD.sql
backend/insertValues.sql
```

O arquivo `templateBD.sql` contém a criação das tabelas e também um comando `CREATE DATABASE` ao final. Em PostgreSQL, pode ser necessário separar a criação do banco da criação das tabelas.

### Variáveis de ambiente

O backend espera variáveis como:

```text
PGUSER
PGHOST
PGDATABASE
PGPASSWORD
PGPORT
JWT_SECRET
EMAIL_USER
EMAIL_PASSWORD
EMBRAPA_CONSUMER_KEY
EMBRAPA_CONSUMER_SECRET
COTACOES_REFRESH_MINUTES
```

O frontend usa ou referencia:

```text
VITE_API_URL
REACT_APP_API_URL
VITE_RECAPTCHA_SITE_KEY
```

Não versionar arquivos `.env` nem expor chaves, senhas ou tokens.

### Rodar em desenvolvimento

```bash
npm run dev
```

URLs esperadas:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5001
Swagger:  http://localhost:5001/api-docs
```

## Status Atual

O projeto possui uma base funcional de frontend, backend e banco, com módulos relevantes implementados. Algumas partes ainda estão incompletas ou funcionam como protótipo visual, especialmente telas administrativas, persistência de edição de perfil, ações do FAQ administrativo e integração completa da Granos.

## Limitações Conhecidas

- A documentação Swagger cobre apenas parte das rotas.
- A tela antiga de `LoginAdmin` chama `/api/login/admin`, mas essa rota está comentada no backend.
- Existem fluxos duplicados de recuperação de senha em arquivos diferentes.
- Rotas administrativas no backend exigem JWT, mas não aplicam de forma completa a verificação de papel `admin`.
- Senhas administrativas são comparadas em texto simples no backend.
- reCAPTCHA é usado no frontend, mas não há validação server-side identificada.
- A chave do serviço de clima aparece embutida no frontend; o valor foi omitido desta documentação por segurança.
- A edição de perfil altera apenas estado local, sem persistência identificada.
- Algumas ações do FAQ administrativo não possuem rotas backend correspondentes.
- A opção Granos aparece na interface, mas não há scraper ou integração real identificada.
- Não foi encontrada suíte automatizada de testes.

## Melhorias Futuras

- Migrar chaves sensíveis para variáveis de ambiente.
- Aplicar `bcrypt` também a administradores.
- Reforçar autorização administrativa no backend.
- Unificar recuperação de senha.
- Validar reCAPTCHA no backend.
- Implementar persistência de edição de perfil.
- Implementar criação de novos administradores.
- Implementar logs e estatísticas administrativas reais.
- Implementar CRUD completo para FAQ administrativo.
- Atualizar Swagger para todas as rotas.
- Criar testes automatizados de frontend, backend e banco.
- Revisar o script SQL de criação do banco.
- Integrar Granos de forma real ou ajustar a interface.

## Documentação Acadêmica

A documentação acadêmica em LaTeX está disponível em:

```text
documentacao/main.tex
```

Ela contém análise técnica e acadêmica completa do sistema, incluindo arquitetura, banco de dados, requisitos, casos de uso, endpoints, limitações e melhorias futuras.

## Informações Acadêmicas

| Item | Informação |
|---|---|
| Projeto | AgroSmart+ |
| Área | Desenvolvimento Web / Agronegócio |
| Tipo | Projeto acadêmico e técnico |
| Documentação | LaTeX em `documentacao/` |
| Equipe/autores | Não identificados formalmente no repositório |
| Licença | O `package.json` da raiz indica licença ISC; não foi identificado arquivo `LICENSE`. |

## Segurança

Este repositório não deve expor valores reais de `.env`, tokens, senhas, credenciais de banco, chaves de API, credenciais de e-mail ou dados sensíveis de usuários. Valores encontrados em scripts de exemplo devem ser tratados apenas como massa de desenvolvimento e não devem ser utilizados em produção.
