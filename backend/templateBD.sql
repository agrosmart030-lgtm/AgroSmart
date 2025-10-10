CREATE TABLE tb_usuario (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(100),
    tipo_usuario VARCHAR(20) CHECK (tipo_usuario IN ('agricultor', 'empresario', 'cooperativa')) NOT NULL,
    codigo_ibge INTEGER,
    status VARCHAR(10) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'))
);

CREATE TABLE tb_agricultor (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES tb_usuario(id) ON DELETE CASCADE,
    cpf CHAR(11) NOT NULL,
    nome_propriedade VARCHAR(255),
    area_cultivada NUMERIC(10,2)
);

CREATE TABLE tb_empresario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES tb_usuario(id) ON DELETE CASCADE,
    cpf CHAR(11),
    nome_empresa VARCHAR(255) NOT NULL,
    cnpj CHAR(14)
);

CREATE TABLE tb_cooperativa (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES tb_usuario(id) ON DELETE CASCADE,
    nome_cooperativa VARCHAR(255) NOT NULL,
    cnpj CHAR(14) NOT NULL,
    regiao_atuacao VARCHAR(255),
    numero_associados INTEGER
);

CREATE TABLE tb_grao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo_api VARCHAR(50),
    unidade_medida VARCHAR(20),
    cotacao_atual NUMERIC(10,2),
    data_atualizacao TIMESTAMP
);

CREATE TABLE tb_usuario_grao (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES tb_usuario(id) ON DELETE CASCADE,
    grao_id INTEGER REFERENCES tb_grao(id) ON DELETE CASCADE,
    tipo_relacao VARCHAR(20) CHECK (tipo_relacao IN ('cultiva', 'interesse')) NOT NULL
);

CREATE TABLE tb_historico_cotacao (
    id SERIAL PRIMARY KEY,
    grao_id INTEGER REFERENCES tb_grao(id) ON DELETE CASCADE,
    preco NUMERIC(10,2) NOT NULL,
    data_cotacao DATE NOT NULL
);

-- Tabela simples para cachear cotações por cooperativa/provedor
CREATE TABLE tb_cotacoes_cache (
    id SERIAL PRIMARY KEY,
    provedor VARCHAR(100) NOT NULL,
    dados JSONB NOT NULL,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_faq (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    resposta TEXT,
    status VARCHAR(20) DEFAULT 'nova' CHECK (status IN ('nova', 'pendente', 'respondido')),
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_admin (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE DATABASE agrosmart
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'pt-BR'
    LC_CTYPE = 'pt-BR'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;