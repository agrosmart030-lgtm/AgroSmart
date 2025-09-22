<div align="center">
  <img src="https://via.placeholder.com/150" alt="AgroSmart Logo" width="150">
  <h1>AgroSmart Backend</h1>
  <p>
    <strong>Sistema de Gerenciamento Agrícola Inteligente</strong>
  </p>
  <p>
    <a href="#-sobre">Sobre</a> •
    <a href="#-recursos">Recursos</a> •
    <a href="#-início-rápido">Início Rápido</a> •
    <a href="#-documentação">Documentação</a> •
    <a href="#-desenvolvimento">Desenvolvimento</a>
  </p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue)](https://www.postgresql.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
</div>

## 🌱 Sobre

O AgroSmart é uma solução completa para gestão agrícola que ajuda produtores a gerenciarem suas culturas, estoque e operações de forma eficiente. Este repositório contém o backend da aplicação, desenvolvido com Node.js, Express e PostgreSQL.

## ✨ Recursos

- **Autenticação Segura**
  - Login com e-mail/senha
  - Verificação em duas etapas (2FA) via e-mail/WhatsApp
  - Renovação de token
  - Controle de sessões ativas

- **Gestão de Usuários**
  - Cadastro com confirmação por e-mail/WhatsApp
  - Recuperação de senha
  - Perfis de acesso
  - Atualização de dados cadastrais

- **Segurança Avançada**
  - Limite de tentativas de login (5 tentativas, bloqueio por 10s)
  - Criptografia de senhas com bcrypt
  - Tokens JWT assinados
  - Proteção contra ataques comuns (XSS, CSRF, etc.)
  - Headers de segurança configurados

- **Documentação Completa**
  - Documentação interativa da API (Swagger)
  - Exemplos de requisições/respostas
  - Guia de contribuição
  - Política de segurança

## 🚀 Início Rápido

### 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) 18.x ou superior
- [PostgreSQL](https://www.postgresql.org/) 13.x ou superior
- [NPM](https://www.npmjs.com/) 9.x ou superior
- [Git](https://git-scm.com/)

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

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte, entre em contato com nossa equipe em [suporte@agrosmart.com](mailto:suporte@agrosmart.com) ou abra uma issue no GitHub.

## 🤝 Parceiros

- [Instituto Federal de Educação, Ciência e Tecnologia](https://www.ifsp.edu.br/)
- [Empresa Júnior de Computação](https://compjr.com.br/)

## 🌟 Agradecimentos

Agradecemos a todos os contribuidores que ajudaram a tornar este projeto possível.

---

<div align="center">
  <p>Desenvolvido com ❤️ por <strong>Equipe AgroSmart</strong></p>
  <p>© 2025 AgroSmart - Todos os direitos reservados</p>
</div>
