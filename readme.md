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
    <a href="#-sobre">Sobre</a> •
    <a href="#-recursos">Recursos</a> •
    <a href="#-tecnologias">Tecnologias</a> •
    <a href="#-instalação">Instalação</a> •
    <a href="#-documentação">Documentação</a> •
    <a href="#-equipe">Equipe</a>
  </p>
</div>

## 🌟 Sobre o Projeto

O **AgroSmart** é uma solução completa para gestão de cooperativas agrícolas, produtores e empresários do agronegócio. Desenvolvida com tecnologias modernas, nossa plataforma oferece ferramentas poderosas para otimizar a gestão agrícola, desde o cadastro de usuários até a análise de dados e suporte ao cliente.

### 🎯 Objetivos

- Simplificar a gestão de operações agrícolas
- Facilitar a comunicação entre produtores e cooperativas
- Fornecer insights baseados em dados para tomada de decisão
- Oferecer uma experiência de usuário intuitiva e responsiva

## ✨ Recursos Principais

### 👥 Gestão de Usuários
- Cadastro e autenticação segura
- Múltiplos perfis (Agricultor, Empresário, Cooperativa)
- Gerenciamento de acessos e permissões
- Atualização de perfil e preferências

### 📊 Painel Administrativo
- Visão geral do sistema
- Gerenciamento de usuários
- Monitoramento de atividades
- Estatísticas de uso

### 📋 Gestão de Dados
- CRUD completo para tabelas do banco
- Importação/exportação de dados
- Filtros e buscas avançadas
- Visualização em formato de tabela e cartões

### 💬 FAQ Integrado
- Sistema de tickets para suporte
- Respostas automáticas
- Acompanhamento de status
- Histórico de conversas

### 📈 Dashboard Interativo
- Gráficos e métricas em tempo real
- Análise de dados agrícolas
- Relatórios personalizáveis
- Exportação de relatórios (PDF, Excel)

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web rápido e flexível
- **PostgreSQL** - Banco de dados relacional
- **Sequelize** - ORM para Node.js
- **JWT** - Autenticação segura
- **Swagger** - Documentação da API

### Frontend
- **React** - Biblioteca JavaScript para interfaces
- **Vite** - Ferramenta de build e desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **DaisyUI** - Componentes UI prontos
- **React Query** - Gerenciamento de estado
- **Recharts** - Biblioteca de gráficos

### Ferramentas
- **Git** - Controle de versão
- **ESLint** - Análise de código
- **Prettier** - Formatação de código
- **Docker** - Containerização

## 📁 Estrutura do Projeto

```
agrosmart/
├── backend/                  # Código do servidor
│   ├── config/              # Configurações
│   ├── controllers/         # Lógica dos controladores
│   ├── middleware/          # Middlewares
│   ├── models/              # Modelos do banco de dados
│   ├── routes/              # Definição de rotas
│   ├── services/            # Lógica de negócios
│   ├── utils/               # Utilitários
│   ├── .env                 # Variáveis de ambiente
│   ├── server.js            # Ponto de entrada
│   └── package.json         # Dependências
│
└── frontend/                # Aplicação web
    ├── public/              # Arquivos estáticos
    └── src/
        ├── assets/          # Imagens, ícones, etc.
        ├── components/      # Componentes reutilizáveis
        ├── context/         # Contextos do React
        ├── hooks/           # Custom hooks
        ├── pages/           # Páginas da aplicação
        ├── services/        # Chamadas à API
        ├── styles/          # Estilos globais
        ├── App.jsx          # Componente raiz
        └── main.jsx         # Ponto de entrada
```

## Como Rodar o Projeto Localmente

### 1. Pré-requisitos
- Node.js 18.x ou superior
- npm 9.x ou superior
- PostgreSQL 13.x ou superior
- Git
- Docker (opcional)

### Passo a Passo

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/seu-usuario/agrosmart.git
   cd agrosmart
   ```

2. **Configurar o ambiente**
   ```bash
   # Instalar dependências do backend
   cd backend
   cp .env.example .env
   # Edite o .env com suas configurações
   npm install
   
   # Instalar dependências do frontend
   cd ../frontend
   npm install
   ```

3. **Configurar o banco de dados**
   ```bash
   # No diretório backend
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all  # Dados iniciais
   ```

4. **Iniciar a aplicação**
   ```bash
   # Em terminais separados:
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

### 🐳 Usando Docker (opcional)

```bash
# Construir e iniciar os containers
docker-compose up --build

# Acessar a aplicação
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Banco de dados: localhost:5432
```

### 📊 Acessando a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Documentação Swagger**: http://localhost:5000/api-docs
- **Banco de Dados**: localhost:5432

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

- **Matheus Yamanari** - Desenvolvedor Backend
- [Adicione seu nome aqui] - Seu cargo

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte, entre em contato:
- Email: suporte@agrosmart.com
- Issues: [GitHub Issues](https://github.com/seu-usuario/agrosmart/issues)

---

Dúvidas ou problemas? Consulte os arquivos de documentação ou entre em contato com o responsável pelo projeto.