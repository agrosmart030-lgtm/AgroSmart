INSERT INTO tb_usuario (nome_completo, email, senha, cidade, estado, tipo_usuario, codigo_ibge)
VALUES
('Carlos Silva', 'carlos@gmail.com', 'senha123', 'Maringá', 'PR', 'agricultor', 4115200),
('Fernanda Souza', 'fernanda@gmail.com', 'senha456', 'Londrina', 'PR', 'empresario', 4113700),
('Cooperativa Vale Verde', 'valeverde@coop.com', 'coop123', 'Campo Mourão', 'PR', 'cooperativa', 4104303),
('José Oliveira', 'jose@gmail.com', 'senha789', 'Cascavel', 'PR', 'agricultor', 4104808),
('Ana Martins', 'ana@gmail.com', 'senhaabc', 'Curitiba', 'PR', 'empresario', 4106902),
('AgroCoop Central', 'central@agrocoop.com', 'agrocoop321', 'Umuarama', 'PR', 'cooperativa', 4128104),
('Mateus Lima', 'mateus@gmail.com', 'senha321', 'Ponta Grossa', 'PR', 'agricultor', 4119905),
('Lucas Pereira', 'lucas@gmail.com', 'senha654', 'Foz do Iguaçu', 'PR', 'empresario', 4108304),
('CoopAgro Oeste', 'oeste@coop.com', 'coop456', 'Toledo', 'PR', 'cooperativa', 4127709),
('Mariana Costa', 'mariana@gmail.com', 'senha987', 'Apucarana', 'PR', 'agricultor', 4101508),
('Bruno Ramos', 'bruno@gmail.com', 'senha741', 'Guarapuava', 'PR', 'empresario', 4109401),
('Cooperativa Campo Bom', 'campobom@coop.com', 'coop789', 'Francisco Beltrão', 'PR', 'cooperativa', 4108403),
('Gustavo Rocha', 'gustavo@gmail.com', 'senha159', 'Cianorte', 'PR', 'agricultor', 4105508),
('Renata Dias', 'renata@gmail.com', 'senha753', 'Paranavaí', 'PR', 'empresario', 4118400),
('Eduardo Nunes', 'eduardo@gmail.com', 'senha852', 'Arapongas', 'PR', 'agricultor', 4101805);

INSERT INTO tb_agricultor (usuario_id, cpf, nome_propriedade, area_cultivada)
VALUES
(1, '12345678901', 'Sítio Bela Vista', 45.50),
(4, '98765432100', 'Chácara Santa Luzia', 32.10),
(7, '45678912300', 'Fazenda Novo Horizonte', 100.00),
(10, '32165498700', 'Sítio Três Lagoas', 27.75),
(13, '15975348620', 'Fazenda Santa Rita', 65.30),
(15, '75315985220', 'Sítio Bom Jesus', 40.00);

INSERT INTO tb_empresario (usuario_id, cpf, nome_empresa, cnpj)
VALUES
(2, '11122233344', 'AgroTech Ltda', '12345678000199'),
(5, '55566677788', 'GreenAgro Brasil', '98765432000155'),
(8, '99988877766', 'CampoFértil Agro', '55443322000188'),
(11, '33322211100', 'MegaAgrícola', '99887766000111'),
(14, '77788899900', 'Terra Boa Agro', '11122233000144');

INSERT INTO tb_cooperativa (usuario_id, nome_cooperativa, cnpj, regiao_atuacao, numero_associados)
VALUES
(3, 'Cooperativa Vale Verde', '11223344000100', 'Noroeste do PR', 150),
(6, 'AgroCoop Central', '55667788000155', 'Oeste do PR', 230),
(9, 'CoopAgro Oeste', '44556677000122', 'Oeste do PR', 185),
(12, 'Cooperativa Campo Bom', '77889911000133', 'Sudoeste do PR', 200);

INSERT INTO tb_grao (nome, codigo_api, unidade_medida, cotacao_atual, data_atualizacao)
VALUES
('Soja', 'SOJA01', 'saca', 135.20, NOW()),
('Milho', 'MILHO01', 'saca', 75.50, NOW()),
('Trigo', 'TRIGO01', 'saca', 98.30, NOW()),
('Feijão', 'FEIJAO01', 'saca', 220.00, NOW());

INSERT INTO tb_usuario_grao (usuario_id, grao_id, tipo_relacao)
VALUES
(1, 1, 'cultiva'),
(4, 2, 'cultiva'),
(7, 3, 'cultiva'),
(10, 1, 'cultiva'),
(13, 2, 'cultiva'),
(15, 4, 'cultiva'),
(2, 1, 'interesse'),
(5, 2, 'interesse'),
(8, 3, 'interesse'),
(11, 4, 'interesse'),
(3, 1, 'interesse'),
(6, 2, 'interesse'),
(9, 3, 'interesse'),
(12, 4, 'interesse');

INSERT INTO tb_historico_cotacao (grao_id, preco, data_cotacao)
VALUES
(1, 134.00, '2024-05-01'),
(1, 135.20, '2024-05-15'),
(2, 74.00, '2024-05-01'),
(2, 75.50, '2024-05-15'),
(3, 97.00, '2024-05-01'),
(3, 98.30, '2024-05-15'),
(4, 215.00, '2024-05-01'),
(4, 220.00, '2024-05-15');

INSERT INTO tb_faq (nome, email, mensagem)
VALUES
('Carlos Silva', 'carlos@gmail.com', 'Como posso atualizar minhas cotações?'),
('Fernanda Souza', 'fernanda@gmail.com', 'Posso adicionar mais de uma empresa?'),
('José Oliveira', 'jose@gmail.com', 'Tem como alterar meu cadastro?');

INSERT INTO tb_admin (nome, senha)
VALUES
('Admin1', 'admin123'),
('Admin2', 'senha456');
