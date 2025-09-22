<div align="center">
  <img src="https://via.placeholder.com/150/4CAF50/FFFFFF?text=AGRO" alt="AgroSmart Logo" width="150">
  <h1>🌱 AgroSmart</h1>
  <h3>Plataforma Inteligente de Gestão Agrícola</h3>
  
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

  <p align="center">
    <a href="#-visão-geral">Visão Geral</a> •
    <a href="#-funcionalidades">Funcionalidades</a> •
    <a href="#-tecnologias">Tecnologias</a> •
    <a href="#-configuração">Configuração</a> •
    <a href="#-instalação">Instalação</a> •
    <a href="#-uso">Uso</a> •
    <a href="#-equipe">Equipe</a>
  </p>
</div>

## 📋 Visão Geral

O **AgroSmart** é uma plataforma web abrangente projetada para atender às necessidades de gestão agrícola, conectando produtores, cooperativas e empresários do agronegócio em um único ecossistema integrado.

### 🎯 Objetivos

- Fornecer uma solução completa para gestão de operações agrícolas
- Facilitar a comunicação entre todos os atores da cadeia produtiva
- Oferecer ferramentas de análise de dados para tomada de decisão
- Garantir segurança e escalabilidade na gestão de informações
- Promover a eficiência operacional no campo

### 🔍 Público-Alvo

- Pequenos e médios produtores rurais
- Cooperativas agrícolas
- Empresas do agronegócio
- Técnicos agrícolas e agrônomos
- Gestores de propriedades rurais

## 🚀 Funcionalidades

### 👤 Módulo de Autenticação
- Cadastro seguro de usuários
- Login com autenticação JWT
- Recuperação de senha
- Verificação de e-mail
- Controle de sessões ativas
- Limitação de tentativas de login

### 👥 Gestão de Usuários
- Perfis personalizados (Agricultor, Empresário, Cooperativa)
- Níveis de permissão
- Atualização de dados cadastrais
- Upload de foto de perfil
- Gerenciamento de preferências

### 📊 Painel Administrativo
- Visão geral do sistema
- Gerenciamento de usuários
- Monitoramento de atividades
- Estatísticas de uso
- Logs do sistema
- Backup de dados

### 🌱 Gestão Agrícola
- Cadastro de propriedades
- Controle de culturas
- Acompanhamento de safras
- Gestão de estoque
- Controle de insumos
- Planejamento agrícola

### 📈 Dashboard Analítico
- Gráficos em tempo real
- Indicadores de desempenho
- Análise de produtividade
- Previsões climáticas
- Relatórios personalizáveis
- Exportação de dados (PDF, Excel, CSV)

### 💬 Sistema de Suporte
- FAQ interativo
- Chat em tempo real
- Sistema de tickets
- Base de conhecimento
- Acompanhamento de solicitações

### 🔄 Integrações
- API RESTful
- Webhooks
- Exportação/importação de dados
- Integração com serviços meteorológicos
- Conexão com sistemas de pagamento

## 💻 Tecnologias

### Backend
| Tecnologia | Descrição |
|------------|-----------|
| Node.js | Ambiente de execução JavaScript |
| Express | Framework web para APIs |
| PostgreSQL | Banco de dados relacional |
| Sequelize | ORM para Node.js |
| JWT | Autenticação segura |
| Bcrypt | Criptografia de senhas |
| Nodemailer | Envio de e-mails |
| Winston | Sistema de logs |
| Swagger | Documentação da API |
| Jest | Testes automatizados |

### Frontend
| Tecnologia | Descrição |
|------------|-----------|
| React | Biblioteca para interfaces |
| Vite | Build tool e servidor de desenvolvimento |
| React Router | Navegação entre páginas |
| Tailwind CSS | Framework CSS utilitário |
| DaisyUI | Componentes UI prontos |
| React Query | Gerenciamento de estado e cache |
| Axios | Cliente HTTP |
| Recharts | Gráficos interativos |
| React Hook Form | Validação de formulários |

### Ferramentas de Desenvolvimento
| Ferramenta | Uso |
|------------|-----|
| Git | Controle de versão |
| ESLint | Análise estática de código |
| Prettier | Formatação de código |
| Docker | Containerização |
| Postman | Testes de API |
| Figma | Design de interface |

## 🛠️ Configuração

### Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior
- PostgreSQL 13.x ou superior
- Git
- Opcional: Docker e Docker Compose

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:

```env
# Configurações do Servidor
NODE_ENV=development
PORT=5000

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agrosmart
DB_USER=postgres
DB_PASSWORD=sua_senha

# Autenticação
JWT_SECRET=seu_segredo_jwt
JWT_EXPIRES_IN=7d

# E-mail (opcional para funcionalidades de e-mail)
SMTP_HOST=smtp.exemplo.com
SMTP_PORT=587
SMTP_USER=seu_email@exemplo.com
SMTP_PASS=sua_senha
SMTP_FROM=nao-responda@agrosmart.com

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Estrutura do Projeto

```
agrosmart/
├── backend/                  # Código do servidor
│   ├── config/              # Configurações do sistema
│   ├── controllers/         # Lógica dos controladores
│   ├── middleware/          # Middlewares de autenticação e validação
│   ├── migrations/          # Migrações do banco de dados
│   ├── models/              # Modelos do Sequelize
│   ├── routes/              # Definição de rotas da API
│   ├── services/            # Lógica de negócios
│   ├── utils/               # Utilitários e helpers
│   ├── validators/          # Validações de entrada
│   ├── .env                 # Variáveis de ambiente
│   ├── server.js            # Ponto de entrada da aplicação
│   └── package.json         # Dependências e scripts
│
└── frontend/                # Aplicação web
    ├── public/              # Arquivos estáticos
    └── src/
        ├── assets/          # Imagens, ícones e fontes
        ├── components/      # Componentes reutilizáveis
        │   ├── common/      # Componentes comuns (botões, inputs, etc.)
        │   ├── layout/      # Componentes de layout (header, sidebar, etc.)
        │   └── ui/          # Componentes de interface do usuário
        ├── context/         # Contextos do React (autenticação, tema, etc.)
        ├── hooks/           # Custom hooks
        ├── pages/           # Páginas da aplicação
        │   ├── auth/        # Páginas de autenticação
        │   ├── dashboard/   # Painel principal
        │   └── ...          # Outras páginas
        ├── services/        # Configuração de chamadas à API
        ├── styles/          # Estilos globais e temas
        ├── utils/           # Utilitários e helpers
        ├── App.jsx          # Componente raiz da aplicação
        └── main.jsx         # Ponto de entrada
```

## 🚀 Instalação

### Opção 1: Instalação Local

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/seu-usuario/agrosmart.git
   cd agrosmart
   ```

2. **Configurar o Backend**
   ```bash
   # Acessar diretório do backend
   cd backend
   
   # Instalar dependências
   npm install
   
   # Configurar variáveis de ambiente
   cp .env.example .env
   # Editar o arquivo .env com suas configurações
   
   # Iniciar o servidor em modo desenvolvimento
   npm run dev
   ```

3. **Configurar o Frontend**
   ```bash
   # Acessar diretório do frontend
   cd ../frontend
   
   # Instalar dependências
   npm install
   
   # Iniciar o servidor de desenvolvimento
   npm run dev
   ```

### Opção 2: Usando Docker

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/seu-usuario/agrosmart.git
   cd agrosmart
   ```

2. **Configurar as variáveis de ambiente**
   ```bash
   cp backend/.env.example backend/.env
   # Editar o arquivo backend/.env conforme necessário
   ```

3. **Iniciar os containers**
   ```bash
   docker-compose up --build
   ```

### 📊 Acessando a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Documentação Swagger**: http://localhost:5000/api-docs
- **Banco de Dados (se usando Docker)**:
  - Host: localhost
  - Porta: 5432
  - Banco: agrosmart
  - Usuário: postgres
  - Senha: (definida no .env)

## 🔧 Configuração do Banco de Dados

### Criando o Banco de Dados

1. **Usando Migrações (Recomendado)**
   ```bash
   cd backend
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all  # Para dados iniciais
   ```

2. **Usando Script SQL**
   ```sql
   -- Conecte-se ao PostgreSQL
   psql -U postgres
   
   -- Criar banco de dados
   CREATE DATABASE agrosmart;
   
   -- Conectar ao banco
   \c agrosmart
   
   -- Executar o script de criação das tabelas
   \i backend/database/schema.sql
   
   -- (Opcional) Popular com dados iniciais
   \i backend/database/seed.sql
   ```

### Backup e Restauração

```bash
# Fazer backup
pg_dump -U postgres -d agrosmart > backup_agrosmart_$(date +%Y%m%d).sql

# Restaurar backup
psql -U postgres -d agrosmart < backup_agrosmart_20230922.sql
```

## 🛠️ Comandos Úteis

### Backend
| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento |
| `npm start` | Inicia o servidor em produção |
| `npm test` | Executa os testes |
| `npm run lint` | Executa análise estática do código |
| `npm run format` | Formata o código automaticamente |
| `npx sequelize-cli db:migrate` | Executa as migrações |
| `npx sequelize-cli db:seed:all` | Popula o banco com dados iniciais |

### Frontend
| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Constrói a aplicação para produção |
| `npm run preview` | Previsualiza a build de produção |
| `npm test` | Executa os testes |
| `npm run lint` | Executa análise estática do código |

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger em:
http://localhost:5000/api-docs

### Principais Endpoints

#### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Obter informações do usuário logado

#### Usuários
- `GET /api/users` - Listar usuários (apenas admin)
- `GET /api/users/:id` - Obter usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Remover usuário

#### Propriedades
- `GET /api/properties` - Listar propriedades
- `POST /api/properties` - Criar propriedade
- `GET /api/properties/:id` - Obter propriedade por ID
- `PUT /api/properties/:id` - Atualizar propriedade
- `DELETE /api/properties/:id` - Remover propriedade

#### Culturas
- `GET /api/crops` - Listar culturas
- `POST /api/crops` - Criar cultura
- `GET /api/crops/:id` - Obter cultura por ID
- `PUT /api/crops/:id` - Atualizar cultura
- `DELETE /api/crops/:id` - Remover cultura

#### Relatórios
- `GET /api/reports/production` - Relatório de produção
- `GET /api/reports/financial` - Relatório financeiro
- `POST /api/reports/export` - Exportar relatório

## 🧪 Testes

### Executando Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd ../frontend
npm test
```

### Cobertura de Testes

```bash
# Backend
cd backend
npm run test:coverage

# Frontend
cd ../frontend
npm run test:coverage
```

## 🔒 Segurança

### Melhores Práticas

1. **Autenticação**
   - Use senhas fortes
   - Ative a verificação em duas etapas
   - Renove os tokens regularmente

2. **Banco de Dados**
   - Faça backups regulares
   - Use conexões seguras (SSL)
   - Restrinja permissões de usuário

3. **API**
   - Use HTTPS em produção
   - Implemente rate limiting
   - Valide todas as entradas
   - Use CORS corretamente

## 🤝 Como Contribuir

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Adicione suas mudanças (`git add .`)
4. Comite suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. Faça o Push da Branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

### Padrões de Código

- Siga as convenções do [JavaScript Standard Style](https://standardjs.com/)
- Escreva testes para novas funcionalidades
- Documente as alterações na API
- Mantenha o histórico de commits organizado

## 👥 Equipe

- Giuliano R. da Silva
- Luís F. da Conceição Franco
- Matheus Victor M. Yamanari
- Rubens Gallina Junior
- Thiago A. Akatsuka

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte, entre em contato:
- E-mail: suporte@agrosmart.com
- Issues: [GitHub Issues](https://github.com/seu-usuario/agrosmart/issues)

---

<div align="center">
  <p>Desenvolvido com ❤️ pela Equipe AgroSmart</p>
  <p>© 2025 AgroSmart - Todos os direitos reservados</p>
</div>

## 📚 Documentação

### Rotas da API

A documentação completa da API está disponível via Swagger em:
http://localhost:5000/api-docs

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:

```env
# Servidor
NODE_ENV=development
PORT=5000

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agrosmart
DB_USER=postgres
DB_PASSWORD=sua_senha

# Autenticação
JWT_SECRET=seu_segredo_jwt
JWT_EXPIRES_IN=7d

# Outras configurações
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testes

```bash
# Executar testes do backend
cd backend
npm test

# Executar testes do frontend
cd ../frontend
npm test
```

## 🛠️ Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento |
| `npm run build` | Constrói a aplicação para produção |
| `npm run lint` | Executa análise estática do código |
| `npm run format` | Formata o código automaticamente |
| `npm run test` | Executa os testes |
| `npm run test:coverage` | Gera relatório de cobertura de testes |

## 🤝 Como Contribuir

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/FeatureIncrivel`)
3. Adicione suas mudanças (`git add .`)
4. Comite suas mudanças (`git commit -m 'Adicionando uma feature incrível'`)
5. Faça o Push da Branch (`git push origin feature/FeatureIncrivel`)
6. Abra um Pull Request

## 👥 Equipe

- Giuliano R. da Silva
- Luís F. da Conceição Franco
- Matheus Victor M. Yamanari
- Rubens Gallina Junior
- Thiago A. Akatsuka

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte, entre em contato:
- Email: suporte@agrosmart.com
- Issues: [GitHub Issues](https://github.com/seu-usuario/agrosmart/issues)

---

Dúvidas ou problemas? Consulte os arquivos de documentação ou entre em contato com o responsável pelo projeto.