<div align="center">
  <img src="https://via.placeholder.com/150/4CAF50/FFFFFF?text=AGRO" alt="AgroSmart Logo" width="150">
  <h1>🌱 AgroSmart Backend</h1>
  <h3>Sistema Inteligente de Gestão Agrícola</h3>
  
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Build Status](https://img.shields.io/github/actions/workflow/status/agrosmart/backend/ci.yml?branch=main)](https://github.com/agrosmart/backend/actions)
  [![Coverage Status](https://coveralls.io/repos/github/agrosmart/backend/badge.svg?branch=main)](https://coveralls.io/github/agrosmart/backend?branch=main)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

  <p align="center">
    <a href="#-sobre">Sobre</a> •
    <a href="#-recursos">Recursos</a> •
    <a href="#-início-rápido">Início Rápido</a> •
    <a href="#-documentação">Documentação</a> •
    <a href="#-arquitetura">Arquitetura</a> •
    <a href="#-contribuição">Contribuição</a>
  </p>
  
  [![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
  [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/agrosmart/backend)
</div>

## 🌱 Sobre o Projeto

O **AgroSmart** é uma plataforma inovadora de gestão agrícola projetada para otimizar a produtividade no campo. Este repositório contém o backend da aplicação, desenvolvido com tecnologias modernas e escaláveis para atender às demandas do agronegócio.

### 🎯 Objetivos

- Fornecer uma solução completa para gestão de culturas agrícolas
- Facilitar o monitoramento em tempo real das operações no campo
- Oferecer ferramentas para tomada de decisão baseada em dados
- Garantir segurança e escalabilidade na gestão de informações sensíveis

### 🚀 Tecnologias Principais

- **Backend**: Node.js com Express
- **Banco de Dados**: PostgreSQL com migrações SQL
- **Autenticação**: JWT + 2FA
- **Documentação**: Swagger/OpenAPI
- **Monitoramento**: Winston para logs
- **Testes**: Jest + Supertest
- **CI/CD**: GitHub Actions
- **Containerização**: Docker

## ✨ Recursos Principais

### 🔐 Autenticação e Autorização
- Autenticação JWT com refresh tokens
- Verificação em duas etapas (2FA) via e-mail e WhatsApp
- Controle de sessões ativas e revogação de tokens
- Múltiplos níveis de permissão (admin, produtor, técnico)

### 👥 Gestão de Usuários
- Cadastro com confirmação por e-mail/WhatsApp
- Recuperação de senha segura
- Perfis personalizáveis
- Upload de foto de perfil

### 🛡️ Segurança Avançada
- Limite de tentativas de login (5 tentativas, bloqueio por 10s)
- Criptografia de ponta a ponta
- Proteção contra ataques comuns (XSS, CSRF, SQL Injection)
- Headers de segurança configurados (Helmet, CORS)
- Rate limiting para prevenção de abuso

### 📊 Gestão Agrícola
- Cadastro de propriedades rurais
- Controle de culturas e safras
- Monitoramento de estoque
- Registro de atividades no campo
- Relatórios personalizados

### 📱 Integrações
- Envio de notificações por e-mail
- Integração com WhatsApp para alertas
- Webhooks para sistemas externos
- API RESTful documentada

### 📝 Documentação
- Documentação interativa da API (Swagger UI)
- Guia de instalação e configuração
- Exemplos de código para todas as rotas
- Políticas de segurança e privacidade

## 🚀 Início Rápido

Siga estes passos para configurar o projeto localmente para desenvolvimento e teste.

### 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) 18.x ou superior
- [PostgreSQL](https://www.postgresql.org/) 13.x ou superior
- [NPM](https://www.npmjs.com/) 9.x ou superior
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (opcional, para ambiente containerizado)

### 🛠️ Configuração do Ambiente

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/agrosmart/backend.git
   cd backend
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas configurações locais.

4. **Configuração do Banco de Dados**
   - Inicie o servidor PostgreSQL
   - Crie um banco de dados vazio
   - Atualize as configurações no `.env`:
     ```env
     PGHOST=localhost
     PGUSER=seu_usuario
     PGPASSWORD=sua_senha
     PGDATABASE=agrosmart
     PGPORT=5432
     ```

5. **Executar migrações**
   ```bash
   npm run migrate
   ```

6. **Popular banco de dados (opcional)**
   ```bash
   npm run seed
   ```

7. **Iniciar o servidor**
   ```bash
   # Modo desenvolvimento (com hot-reload)
   npm run dev
   
   # Modo produção
   npm start
   ```

8. **Acessar a aplicação**
   - API: http://localhost:5001
   - Documentação: http://localhost:5001/api-docs
   - Health Check: http://localhost:5001/health

### 🐳 Usando Docker (opcional)

```bash
# Construir as imagens
docker-compose build

# Iniciar os containers
docker-compose up -d

# Visualizar logs
docker-compose logs -f
```

### 🔧 Instalação

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/agrosmart/backend.git
   cd backend
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar ambiente**
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas configurações locais.

4. **Configurar banco de dados**
   - Crie um banco de dados PostgreSQL
   - Atualize as configurações no `.env`
   ```env
   PGHOST=localhost
   PGUSER=seu_usuario
   PGPASSWORD=sua_senha
   PGDATABASE=agrosmart
   PGPORT=5432
   ```

5. **Executar migrações**
   ```bash
   npm run migrate
   ```

6. **Iniciar o servidor**
   ```bash
   # Modo desenvolvimento
   npm run dev
   
   # Modo produção
   npm start
   ```

7. **Acessar documentação**
   - API Docs: http://localhost:5001/api-docs
   - Health Check: http://localhost:5001/health

## 🛠️ Variáveis de Ambiente Principais

| Variável | Descrição | Obrigatório | Padrão |
|----------|-----------|-------------|--------|
| `NODE_ENV` | Ambiente de execução | Não | `development` |
| `PORT` | Porta do servidor | Não | `5001` |
| `JWT_SECRET` | Chave secreta para JWT | Sim | - |
| `SESSION_SECRET` | Chave secreta para sessões | Sim | - |
| `PGHOST` | Host do PostgreSQL | Sim | `localhost` |
| `PGDATABASE` | Nome do banco de dados | Sim | - |
| `SMTP_HOST` | Servidor SMTP para e-mails | Sim* | - |
| `VONAGE_API_KEY` | Chave da API Vonage (WhatsApp) | Não | - |
| `RECAPTCHA_SECRET_KEY` | Chave do reCAPTCHA | Não | - |

> *: Obrigatório apenas se estiver usando confirmação por e-mail

## 🚀 Começando

### 1. Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/agrosmart-backend.git
   cd agrosmart-backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure as variáveis de ambiente no arquivo `.env`.

### 2. Configuração do Banco de Dados

1. Certifique-se de ter o PostgreSQL instalado e em execução
2. Crie um banco de dados para o projeto
3. Atualize as configurações de conexão no arquivo `.env`

### 3. Executando Migrações

```bash
npm run migrate
```

## 🏃‍♂️ Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

## 📚 Documentação da API

A documentação da API está disponível em `http://localhost:5001/api-docs` quando o servidor estiver em execução.

## 🔒 Autenticação

O sistema utiliza JWT para autenticação. Inclua o token nas requisições protegidas:

```
Authorization: Bearer <token>
```

## 🔄 Fluxos Principais

### 1. Autenticação de Usuário

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "nome_completo": "João Silva",
  "email": "joao@exemplo.com",
  "senha": "Senha@123",
  "telefone": "+5511999999999",
  "estado": "SP",
  "tipo_usuario": "produtor",
  "verificationMethod": "email"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "senha": "Senha@123"
}
```

#### Verificação de Conta
```http
POST /api/auth/verify-account
Content-Type: application/json

{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "code": "123456"
}
```

### 2. Autenticação em Duas Etapas (2FA)

#### Habilitar 2FA
```http
POST /api/2fa/enable
Authorization: Bearer <token>
Content-Type: application/json

{
  "method": "email"
}
```

#### Verificar Código 2FA
```http
POST /api/2fa/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "123456"
}
```

## 🔒 Segurança

### Medidas de Segurança Implementadas

- **Autenticação Segura**
  - JWT com tempo de expiração
  - Refresh tokens
  - Revogação de tokens

- **Proteção de Dados**
  - Senhas criptografadas com bcrypt
  - Dados sensíveis ofuscados nos logs
  - Cabeçalhos de segurança com Helmet

- **Prevenção de Ataques**
  - Rate Limiting (100 requisições/15min por IP)
  - Proteção contra XSS
  - Prevenção de SQL Injection
  - CORS configurado de forma restritiva
  - CSRF Protection

- **Monitoramento**
  - Logs de segurança
  - Auditoria de acessos
  - Detecção de atividades suspeitas

## 🧪 Testes

```bash
npm test
```

## 🧹 Lint e Formatação

```bash
# Verificar estilo de código
npm run lint

# Formatar código
npm run format
```

## 🏗️ Estrutura do Projeto

```
agrosmart-backend/
├── config/                   # Configurações da aplicação
│   ├── database.js           # Configuração do banco de dados
│   └── swagger.js            # Configuração do Swagger
│
├── controllers/              # Controladores da aplicação
│   ├── authController.js     # Autenticação de usuários
│   ├── twoFactorController.js # Controle 2FA
│   └── ...
│
├── middleware/               # Middlewares
│   ├── auth.js               # Autenticação JWT
│   ├── errorHandler.js       # Tratamento de erros
│   └── rateLimit.js          # Limitação de requisições
│
├── migrations/               # Migrações do banco de dados
│   └── *.sql                 # Arquivos SQL de migração
│
├── models/                   # Modelos do banco de dados
│   ├── User.js               # Modelo de usuário
│   └── ...
│
├── routes/                   # Definição de rotas
│   ├── authRoutes.js         # Rotas de autenticação
│   ├── twoFactorRoutes.js    # Rotas 2FA
│   └── ...
│
├── services/                 # Lógica de negócios
│   ├── authService.js        # Serviços de autenticação
│   ├── emailService.js       # Serviço de e-mail
│   ├── whatsappService.js    # Serviço de WhatsApp
│   └── ...
│
├── utils/                    # Utilitários
│   ├── logger.js             # Sistema de logs
│   ├── migrate.js            # Utilitário de migração
│   └── ...
│
├── validators/               # Validações
│   ├── authValidator.js      # Validações de autenticação
│   └── ...
│
├── .env.example              # Exemplo de variáveis de ambiente
├── .eslintrc.js              # Configuração do ESLint
├── .gitignore                # Arquivos ignorados pelo Git
├── package.json              # Dependências e scripts
└── server.js                 # Ponto de entrada da aplicação
```

## 👥 Contribuição

Contribuições são bem-vindas! Siga estes passos para contribuir:
1. Verifique as [issues abertas](https://github.com/agrosmart/backend/issues) ou abra uma nova issue
2. Faça um fork do projeto
3. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
4. Adicione suas alterações (`git add .`)
5. Faça o commit das alterações (`git commit -m 'Adiciona nova feature'`)
6. Faça o push para a branch (`git push origin feature/nova-feature`)
7. Abra um Pull Request

### Padrões de Código

- Siga o [Guia de Estilo JavaScript](https://github.com/airbnb/javascript)
- Escreva testes para novas funcionalidades
- Atualize a documentação quando necessário
- Mantenha o código limpo e organizado

### Relatando Problemas

Ao relatar problemas, por favor inclua:
- Versão do Node.js
- Ambiente (desenvolvimento/produção)
- Passos para reproduzir o problema
- Comportamento esperado vs. real
- Capturas de tela, se aplicável

## 📊 Arquitetura

### Estrutura de Diretórios

```
agrosmart-backend/
├── config/               # Configurações da aplicação
├── controllers/          # Lógica dos controladores
├── middleware/           # Middlewares personalizados
├── migrations/           # Migrações do banco de dados
├── models/              # Modelos do Sequelize
├── routes/              # Definição das rotas
├── services/            # Lógica de negócios
├── utils/               # Utilitários e helpers
├── tests/               # Testes automatizados
├── validators/          # Validações de entrada
└── docs/                # Documentação adicional
```

### Padrões de Projeto

- **MVC** para organização do código
- **Repository Pattern** para acesso a dados
- **Service Layer** para lógica de negócios
- **Dependency Injection** para melhor testabilidade

### Fluxo de Dados

1. **Requisição HTTP** → 2. **Middleware** → 3. **Rota** → 4. **Validação** → 5. **Controller** → 6. **Service** → 7. **Repository** → 8. **Banco de Dados**

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch
npm run test:watch
```

### Tipos de Testes

- **Testes Unitários**: Testes isolados de funções e componentes
- **Testes de Integração**: Testes de fluxos completos da API
- **Testes E2E**: Testes de ponta a ponta

## 🚀 Implantação

### Pré-requisitos

- Servidor Linux (Ubuntu 20.04+ recomendado)
- Node.js 18+
- PostgreSQL 13+
- Nginx (como proxy reverso)
- PM2 (para gerenciamento de processos)

### Passos para Produção

1. Configurar variáveis de ambiente de produção
2. Construir a aplicação
3. Configurar o banco de dados
4. Configurar servidor web (Nginx)
5. Configurar SSL (certbot)
6. Configurar monitoramento

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- **Matheus Yamanari** - Desenvolvedor Backend
- [Adicione seu nome aqui] - Seu cargo

## 🤝 Como Contribuir

Contribuições são o que tornam a comunidade de código aberto um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1. Dê um Fork no projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/FeatureIncrivel`)
3. Adicione suas mudanças (`git add .`)
4. Comite suas mudanças (`git commit -m 'Adicionando uma feature incrível'`)
5. Faça o Push da Branch (`git push origin feature/FeatureIncrivel`)
6. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato conosco:

- Email: [suporte@agrosmart.com](mailto:suporte@agrosmart.com)
- Issues: [GitHub Issues](https://github.com/agrosmart/backend/issues)
- Discord: [Entre no nosso servidor](https://discord.gg/agrosmart)

## 🌟 Agradecimentos

- À todos os contribuidores que dedicaram seu tempo para melhorar este projeto
- Aos mentores e revisores de código
- À comunidade de código aberto por todo o suporte

---

<div align="center">
  <p>Desenvolvido com ❤️ pela <strong>Equipe AgroSmart</strong></p>
  <p>© 2025 AgroSmart - Todos os direitos reservados</p>
  
  [![Twitter](https://img.shields.io/twitter/follow/agrosmart?style=social)](https://twitter.com/agrosmart)
  [![GitHub stars](https://img.shields.io/github/stars/agrosmart/backend?style=social)](https://github.com/agrosmart/backend/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/agrosmart/backend?style=social)](https://github.com/agrosmart/backend/network/members)
</div>
