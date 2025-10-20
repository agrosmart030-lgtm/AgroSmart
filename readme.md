# Projeto AgroSmart

## Descrição

O **AgroSmart** é uma plataforma web para gestão de cooperativas agrícolas, produtores e empresários do agronegócio. O sistema permite cadastro, login, gerenciamento de usuários, consulta e inserção de dados em tabelas do banco, além de um canal de FAQ integrado ao banco de dados.

- **Backend:** Node.js + Express + PostgreSQL
- **Frontend:** React + Tailwind CSS + DaisyUI + Vite
- **Documentação:** Swagger (disponível em `/api-docs`)

## Principais Funcionalidades

- Cadastro e login de usuários (agricultor, empresário, cooperativa)
- Painel administrativo com gerenciamento de usuários, tabelas e FAQ
- Consulta e inserção de dados em tabelas do banco via interface amigável
- Visualização de estatísticas e logs do sistema
- Canal de FAQ integrado ao banco de dados
- Dashboard com gráficos de distribuição de usuários

## Estrutura de Pastas

```
backend/
  server.js           # Inicialização do servidor e rotas principais
  templateBD.sql      # Script para criar o banco e tabelas
  insertValues.sql    # Script para popular o banco com dados de exemplo
  .env                # Configurações do banco de dados
  routes/
    login.js          # Rota de login
    registro.js       # Rota de cadastro
    tabelas.js        # Rotas CRUD para tabelas principais
    faq.js            # Rotas do FAQ (mensagens)
    configuracao.js   # Rotas de perfil/configuração do usuário
    usuarios.js       # Rotas para gerenciamento de usuários
    dbTest.js         # Rotas de teste de conexão com o banco

frontend/
  src/
    App.jsx           # Rotas principais do frontend
    pages/            # Páginas principais (login, cadastro, dashboard, faq, home, admin)
    componentes/      # Componentes reutilizáveis (navbar, footer, tabelas, etc)
    context/          # Contextos globais (ex: autenticação)
    assets/           # Imagens e arquivos estáticos
  public/
    vite.svg          # Ícone do projeto
  tailwind.config.js  # Configuração do Tailwind CSS
  ...
```

## Como Rodar o Projeto Localmente

### 1. Pré-requisitos

- Node.js 18+
- npm
- PostgreSQL

### 2. Banco de Dados

- Execute o arquivo `backend/templateBD.sql` para criar o banco e as tabelas necessárias.
- (Opcional) Execute `backend/insertValues.sql` para popular o banco com dados de exemplo.
- Configure o arquivo `.env` no backend com as credenciais do seu PostgreSQL (exemplo incluso).

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

### Backend

- **Login:** `POST /api/login` — autenticação de usuário
- **Login Admin:** `POST /api/login/admin` — autenticação de administrador
- **Cadastro:** `POST /api/registro` — registro de novos usuários (agricultor, empresário, cooperativa)
- **Usuários:** 
  - `GET /api/usuarios` — lista todos os usuários com detalhes
  - `PATCH /api/usuarios/:id/status` — ativa/inativa usuário
- **CRUD Tabelas:**
  - `GET /api/tabelas` — lista nomes das tabelas
  - `GET /api/tabelas/dados` — lista registros de todas as tabelas
  - `GET /api/tabelas/:tabela` — lista registros de uma tabela específica
  - `POST` para cada tabela (`/api/tabelas/agricultores`, `/api/tabelas/empresarios`, etc.)
- **FAQ:**
  - `POST /api/faq` — envia mensagem para o FAQ
  - `GET /api/faq` — lista mensagens do FAQ
- **Configuração de Perfil:**
  - `GET /api/configuracao/:usuario_id` — retorna dados completos do usuário logado
- **Testes de banco:**
  - `GET /test/db-status` — testa conexão
  - `GET /test/db-version` — retorna versão do PostgreSQL

### Frontend

- **Páginas principais:** Home, Login, Cadastro, Dashboard, FAQ, Configuração de Perfil
- **Admin:** Painel do administrador, gerenciamento de usuários, tabelas do banco, FAQ, estatísticas e logs

## Observações

- O FAQ está totalmente integrado: mensagens enviadas pelo frontend são salvas no banco via backend.
- Para resetar o banco, basta rodar novamente o `templateBD.sql`.
- Para popular com exemplos, rode o `insertValues.sql`.
- Para mais detalhes técnicos das rotas, consulte o Swagger em `/api-docs`.
- Para um guia de instalação detalhado, consulte o arquivo `PASSO_A_PASSO.txt` (se disponível).

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm (versão 7 ou superior)
- PostgreSQL (para o banco de dados)

### Instalação

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd AgroSmart
   ```

2. Instale as dependências:
   ```bash
   npm run install:all
   ```
   
   Ou instale manualmente em cada pasta:
   ```bash
   # Na raiz do projeto
   npm install
   
   # No frontend
   cd frontend
   npm install
   
   # No backend
   cd ../backend
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na pasta `backend` baseado no `.env.example`
   - Configure as credenciais do banco de dados e outras variáveis necessárias

### Executando o Projeto

- **Modo de desenvolvimento** (frontend + backend):
  ```bash
  npm run dev
  ```
  - Frontend: http://localhost:3000
  - Backend: http://localhost:5000

- **Apenas frontend**:
  ```bash
  cd frontend
  npm run dev
  ```

- **Apenas backend**:
  ```bash
  cd backend
  npm run dev
  ```

### Comandos Úteis

- `npm run build` - Constrói o projeto para produção
- `npm run lint` - Executa a verificação de lint
- `npm run install:all` - Instala todas as dependências (raiz, frontend e backend)

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Dúvidas ou problemas? Consulte os arquivos de documentação ou entre em contato com o responsável pelo projeto.