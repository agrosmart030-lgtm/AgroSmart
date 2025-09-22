-- Migração inicial para criar todas as tabelas necessárias

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS tb_usuario (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(100),
    tipo_usuario VARCHAR(20) CHECK (tipo_usuario IN ('agricultor', 'empresario', 'cooperativa')) NOT NULL,
    codigo_ibge INTEGER,
    status VARCHAR(10) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de agricultores
CREATE TABLE IF NOT EXISTS tb_agricultor (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES tb_usuario(id) ON DELETE CASCADE,
    cpf CHAR(11) NOT NULL,
    nome_propriedade VARCHAR(255),
    area_cultivada NUMERIC(10,2),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de empresários
CREATE TABLE IF NOT EXISTS tb_empresario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES tb_usuario(id) ON DELETE CASCADE,
    cpf CHAR(11),
    nome_empresa VARCHAR(255) NOT NULL,
    cnpj CHAR(14),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cooperativas
CREATE TABLE IF NOT EXISTS tb_cooperativa (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES tb_usuario(id) ON DELETE CASCADE,
    nome_cooperativa VARCHAR(255) NOT NULL,
    cnpj CHAR(14) NOT NULL,
    regiao_atuacao VARCHAR(255),
    numero_associados INTEGER,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de grãos
CREATE TABLE IF NOT EXISTS tb_grao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo_api VARCHAR(50),
    unidade_medida VARCHAR(20),
    cotacao_atual NUMERIC(10,2),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relacionamento entre usuários e grãos
CREATE TABLE IF NOT EXISTS tb_usuario_grao (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES tb_usuario(id) ON DELETE CASCADE,
    grao_id INTEGER REFERENCES tb_grao(id) ON DELETE CASCADE,
    data_plantio DATE,
    area_plantada NUMERIC(10,2),
    produtividade_esperada NUMERIC(10,2),
    data_colheita_prevista DATE,
    status VARCHAR(20) DEFAULT 'planejado' CHECK (status IN ('planejado', 'em_andamento', 'colhido', 'cancelado')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, grao_id, data_plantio)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_usuario_email ON tb_usuario(email);
CREATE INDEX IF NOT EXISTS idx_usuario_tipo ON tb_usuario(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_usuario_grao_usuario ON tb_usuario_grao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuario_grao_grao ON tb_usuario_grao(grao_id);

-- Função para atualizar automaticamente o campo data_atualizacao
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualização automática de data
DO $$
DECLARE
    t record;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name IN ('tb_usuario', 'tb_agricultor', 'tb_empresario', 'tb_cooperativa', 'tb_grao', 'tb_usuario_grao')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_modtime ON %I', t.table_name, t.table_name);
        EXECUTE format('CREATE TRIGGER update_%s_modtime
            BEFORE UPDATE ON %I
            FOR EACH ROW EXECUTE FUNCTION update_modified_column();', 
            t.table_name, t.table_name);
    END LOOP;
END;
$$;
