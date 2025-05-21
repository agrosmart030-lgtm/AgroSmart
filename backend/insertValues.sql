-- Usuários
INSERT INTO tb_usuario (nome_completo, email, senha, cidade, estado, tipo_usuario, codigo_ibge)
VALUES
('Carlos Silva', 'carlos@gmail.com', 'senha123', 'Maringá', 'Paraná', 'agricultor', 4115200),
('Maria Oliveira', 'maria@gmail.com', 'senha456', 'Londrina', 'Paraná', 'empresario', 4113700),
('Coop Norte', 'coopnorte@gmail.com', 'senha789', 'Cascavel', 'Paraná', 'cooperativa', 4104808);

-- Agricultor (relacionado ao Carlos)
INSERT INTO tb_agricultor (usuario_id, cpf, nome_propriedade, area_cultivada)
VALUES (1, '12345678901', 'Sítio Primavera', 150.75);

-- Empresário (relacionado à Maria)
INSERT INTO tb_empresario (usuario_id, cpf, nome_empresa, cnpj)
VALUES (2, '10987654321', 'AgroComercial Ltda', '12345678000199');

-- Cooperativa (relacionada à Coop Norte)
INSERT INTO tb_cooperativa (usuario_id, nome_cooperativa, cnpj, regiao_atuacao, numero_associados)
VALUES (3, 'Cooperativa Norte', '98765432000155', 'Região Norte do PR', 120);

-- Grãos
INSERT INTO tb_grao (nome, codigo_api, unidade_medida, cotacao_atual, data_atualizacao)
VALUES
('Soja', 'SOJA_PR', 'saca', 120.50, CURRENT_TIMESTAMP),
('Milho', 'MILHO_PR', 'saca', 65.30, CURRENT_TIMESTAMP),
('Trigo', 'TRIGO_PR', 'saca', 98.75, CURRENT_TIMESTAMP);

-- Relacionamento de usuários com grãos
INSERT INTO tb_usuario_grao (usuario_id, grao_id, tipo_relacao)
VALUES
(1, 1, 'cultiva'),
(1, 2, 'interesse'),
(2, 1, 'interesse'),
(3, 3, 'cultiva');

-- Histórico de cotações
INSERT INTO tb_historico_cotacao (grao_id, preco, data_cotacao)
VALUES
(1, 118.00, '2025-05-19'),
(1, 120.50, '2025-05-20'),
(2, 64.00, '2025-05-19'),
(3, 97.50, '2025-05-19');

-- FAQ
INSERT INTO tb_faq (nome, email, mensagem)
VALUES
('João Teste', 'joao@gmail.com', 'Gostaria de saber mais sobre a cooperativa.'),
('Ana Cliente', 'ana@gmail.com', 'Como faço para me associar?');

-- Admin (já existia, mas vamos adicionar mais um pra testar)
INSERT INTO tb_admin (nome, senha)
VALUES ('admin', 'admin');
VALUES ('admin2', 'senhaadmin2');



--------------------------------------------------------------------------------------------------------------

-- Mais Usuários
INSERT INTO tb_usuario (nome_completo, email, senha, cidade, estado, tipo_usuario, codigo_ibge)
VALUES
('Pedro Almeida', 'pedro@gmail.com', 'senha789', 'Curitiba', 'Paraná', 'agricultor', 4106902),
('Lucas Mendes', 'lucas@gmail.com', 'senhaabc', 'Maringá', 'Paraná', 'empresario', 4115200),
('AgroSul Cooperativa', 'agrosul@gmail.com', 'senhaagro', 'Campo Mourão', 'Paraná', 'cooperativa', 4104303),
('Fernanda Souza', 'fernanda@gmail.com', 'senha456', 'Londrina', 'Paraná', 'agricultor', 4113700),
('Paulo Lima', 'paulo@gmail.com', 'senha123', 'Cascavel', 'Paraná', 'empresario', 4104808);

-- Agricultores
INSERT INTO tb_agricultor (usuario_id, cpf, nome_propriedade, area_cultivada)
VALUES
(4, '11122233344', 'Chácara Boa Vista', 80.50),
(7, '55566677788', 'Fazenda Santa Luzia', 200.00);

-- Empresários
INSERT INTO tb_empresario (usuario_id, cpf, nome_empresa, cnpj)
VALUES
(5, '22233344455', 'AgroMais Ltda', '11122233000155'),
(9, '77788899900', 'Comercial AgroLima', '22233344000166');

-- Cooperativas
INSERT INTO tb_cooperativa (usuario_id, nome_cooperativa, cnpj, regiao_atuacao, numero_associados)
VALUES
(6, 'AgroSul Cooperativa', '33344455000177', 'Região Centro-Oeste do PR', 85);

-- Relacionamento de usuários com grãos
INSERT INTO tb_usuario_grao (usuario_id, grao_id, tipo_relacao)
VALUES
(4, 1, 'cultiva'),
(4, 2, 'cultiva'),
(5, 1, 'interesse'),
(5, 3, 'interesse'),
(6, 1, 'cultiva'),
(7, 2, 'cultiva'),
(9, 3, 'interesse');

-- Histórico de cotações adicionais
INSERT INTO tb_historico_cotacao (grao_id, preco, data_cotacao)
VALUES
(1, 121.00, '2025-05-21'),
(2, 66.00, '2025-05-21'),
(3, 99.00, '2025-05-21');
