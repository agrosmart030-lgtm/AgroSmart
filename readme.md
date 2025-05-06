# Projeto AgroSmart

## Descrição

O AgroSmart é uma aplicação web desenvolvida para facilitar a gestão de cooperativas agrícolas. Este projeto é dividido em duas partes principais: o **frontend**, que é responsável pela interface do usuário, e o **backend**, que gerencia a lógica de negócios e o banco de dados. Este README foca na parte do **frontend**.

## Tecnologias Utilizadas no Frontend

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **React Router**: Gerenciamento de rotas no frontend.
- **Tailwind CSS**: Framework de CSS para estilização rápida e responsiva.
- **DaisyUI**: Componentes pré-construídos para Tailwind CSS.
- **Vite**: Ferramenta de build rápida para desenvolvimento com React.

## Estrutura de Pastas do Frontend

```
frontend/
├── public/                # Arquivos públicos, como imagens e ícones
├── src/                   # Código-fonte principal
│   ├── assets/            # Imagens e outros recursos estáticos
│   ├── componentes/       # Componentes reutilizáveis
│   │   ├── footer.jsx     # Componente de rodapé
│   │   ├── inputField.jsx # Componente de campo de entrada
│   │   ├── navbar.jsx     # Componente de barra de navegação
│   ├── pages/             # Páginas principais da aplicação
│   │   ├── home/          # Página inicial
│   │   ├── cadastro/      # Página de cadastro
│   │   ├── dashboard/     # Página de dashboard
│   │   ├── login/         # Página de login
│   ├── App.jsx            # Componente principal da aplicação
│   ├── main.jsx           # Ponto de entrada do React
│   ├── index.css          # Estilos globais com Tailwind CSS
├── vite.config.js         # Configuração do Vite
├── tailwind.config.js     # Configuração do Tailwind CSS
├── postcss.config.js      # Configuração do PostCSS
```

## Funcionalidades do Frontend

- **Página Inicial**:
  - Exibe informações gerais sobre a aplicação.
  - Apresenta os serviços oferecidos pela cooperativa.
- **Cadastro**:
  - Formulário dividido em etapas para registro de novos usuários.
- **Login**:
  - Autenticação de usuários.
- **Dashboard**:
  - Área restrita para usuários autenticados.

## Como Rodar o Frontend

1. Certifique-se de que o Node.js está instalado na sua máquina.
2. Navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse a aplicação no navegador em `http://localhost:5173`.

## Estilização

- O projeto utiliza **Tailwind CSS** para estilização, permitindo um design responsivo e moderno.
- Componentes do **DaisyUI** são usados para acelerar o desenvolvimento de interfaces.

## Melhorias Futuras

- Implementar testes unitários e de integração para os componentes.
- Adicionar suporte a temas (modo claro e escuro).
- Melhorar a acessibilidade (WCAG).

---

Para mais informações sobre o backend, consulte o README específico ou a documentação do projeto.
