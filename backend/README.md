# AgroSmart Backend

Backend do sistema AgroSmart para gerenciamento agrícola, desenvolvido com Node.js, Express e PostgreSQL.

## 📋 Requisitos

- Node.js >= 18.0.0
- PostgreSQL >= 13.0
- NPM >= 9.0.0

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

## 🔄 Fluxo de Autenticação

1. **Registro**
   - `POST /api/auth/register` - Registra um novo usuário
   - Envia código de verificação por e-mail/WhatsApp

2. **Verificação de Conta**
   - `POST /api/auth/verify-account` - Verifica o código de ativação

3. **Login**
   - `POST /api/auth/login` - Realiza o login
   - Retorna um token JWT para autenticação

4. **2FA (Opcional)**
   - `POST /api/2fa/enable` - Habilita autenticação em duas etapas
   - `POST /api/2fa/verify` - Verifica código 2FA

## 🛡️ Segurança

- Limite de tentativas de login (5 tentativas, bloqueio por 10s)
- Validação de entrada em todas as rotas
- Proteção contra SQL Injection
- CORS configurado
- Headers de segurança com Helmet
- Sessões seguras

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

## 📦 Estrutura do Projeto

```
backend/
├── config/           # Configurações do projeto
├── controllers/      # Lógica dos controladores
├── middleware/       # Middlewares customizados
├── migrations/       # Migrações do banco de dados
├── models/           # Modelos do banco de dados
├── routes/           # Definição das rotas
├── services/         # Lógica de negócios
├── utils/            # Utilitários
├── validators/       # Validações de entrada
├── .env.example      # Exemplo de variáveis de ambiente
├── .eslintrc.js      # Configuração do ESLint
├── package.json      # Dependências e scripts
└── server.js         # Ponto de entrada da aplicação
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido por Equipe AgroSmart - 2025
