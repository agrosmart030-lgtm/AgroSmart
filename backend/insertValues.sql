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



INSERT INTO tb_usuario (nome_completo, email, senha, cidade, estado, tipo_usuario, codigo_ibge, status) VALUES
('Ana Clara Costa', 'ana.costa@email.com', 'senha_hashed_1', 'São Paulo', 'SP', 'agricultor', 3550308, 'ativo'),
('Bruno Eduardo Silva', 'bruno.silva@email.com', 'senha_hashed_2', 'Rio de Janeiro', 'RJ', 'empresario', 3304557, 'ativo'),
('Carla Dias Pereira', 'carla.pereira@email.com', 'senha_hashed_3', 'Belo Horizonte', 'MG', 'cooperativa', 3106200, 'ativo'),
('Daniel Felipe Santos', 'daniel.santos@email.com', 'senha_hashed_4', 'Porto Alegre', 'RS', 'agricultor', 4314902, 'ativo'),
('Eduarda Gomes Almeida', 'eduarda.almeida@email.com', 'senha_hashed_5', 'Curitiba', 'PR', 'empresario', 4106902, 'ativo'),
('Fernando Henrique Lima', 'fernando.lima@email.com', 'senha_hashed_6', 'Salvador', 'BA', 'cooperativa', 2927408, 'ativo'),
('Giovanna Isabella Ribeiro', 'giovanna.ribeiro@email.com', 'senha_hashed_7', 'Fortaleza', 'CE', 'agricultor', 2304400, 'ativo'),
('Heitor Joaquim Souza', 'heitor.souza@email.com', 'senha_hashed_8', 'Recife', 'PE', 'empresario', 2611606, 'ativo'),
('Isabela Luana Oliveira', 'isabela.oliveira@email.com', 'senha_hashed_9', 'Manaus', 'AM', 'cooperativa', 1302603, 'ativo'),
('João Miguel Martins', 'joao.martins@email.com', 'senha_hashed_10', 'Brasília', 'DF', 'agricultor', 5300108, 'ativo'),
('Karen Natália Ferreira', 'karen.ferreira@email.com', 'senha_hashed_11', 'Campinas', 'SP', 'empresario', 3509502, 'ativo'),
('Lucas Otávio Rodrigues', 'lucas.rodrigues@email.com', 'senha_hashed_12', 'Goiânia', 'GO', 'cooperativa', 5208707, 'ativo'),
('Mariana Paula Rocha', 'mariana.rocha@email.com', 'senha_hashed_13', 'Belém', 'PA', 'agricultor', 1501402, 'ativo'),
('Nikolas Queiroz Fonseca', 'nikolas.fonseca@email.com', 'senha_hashed_14', 'Vitória', 'ES', 'empresario', 3205309, 'ativo'),
('Olivia Raquel Costa', 'olivia.costa@email.com', 'senha_hashed_15', 'Campo Grande', 'MS', 'cooperativa', 5002704, 'ativo'),
('Pedro Sérgio Nunes', 'pedro.nunes@email.com', 'senha_hashed_16', 'Florianópolis', 'SC', 'agricultor', 4205407, 'ativo'),
('Quiteria Tatiana Mendes', 'quiteria.mendes@email.com', 'senha_hashed_17', 'Natal', 'RN', 'empresario', 2408102, 'ativo'),
('Rafael Ulisses Alves', 'rafael.alves@email.com', 'senha_hashed_18', 'João Pessoa', 'PB', 'cooperativa', 2507507, 'ativo'),
('Sofia Vitória Barros', 'sofia.barros@email.com', 'senha_hashed_19', 'Teresina', 'PI', 'agricultor', 2211001, 'ativo'),
('Thiago Xavier Vieira', 'thiago.vieira@email.com', 'senha_hashed_20', 'São Luís', 'MA', 'empresario', 2111300, 'ativo'),
('Ursula Yara Cardoso', 'ursula.cardoso@email.com', 'senha_hashed_21', 'Maceió', 'AL', 'cooperativa', 2704302, 'ativo'),
('Victor Zeca Gomes', 'victor.gomes@email.com', 'senha_hashed_22', 'Aracaju', 'SE', 'agricultor', 2800308, 'ativo'),
('Wanessa Augusta Correia', 'wanessa.correia@email.com', 'senha_hashed_23', 'Cuiabá', 'MT', 'empresario', 5103403, 'ativo'),
('Xavier Bento Fernandes', 'xavier.fernandes@email.com', 'senha_hashed_24', 'Palmas', 'TO', 'cooperativa', 1721008, 'ativo'),
('Yara Cecília Guimarães', 'yara.guimaraes@email.com', 'senha_hashed_25', 'Rio Branco', 'AC', 'agricultor', 1200401, 'ativo'),
('Zeca Demétrio Costa', 'zeca.costa@email.com', 'senha_hashed_26', 'Boa Vista', 'RR', 'empresario', 1400100, 'ativo'),
('Alice Ester Castro', 'alice.castro@email.com', 'senha_hashed_27', 'Porto Velho', 'RO', 'cooperativa', 1100205, 'ativo'),
('Benício Fábio Dantas', 'benicio.dantas@email.com', 'senha_hashed_28', 'Macapá', 'AP', 'agricultor', 1600303, 'ativo'),
('Cecília Gabriela Esteves', 'cecilia.esteves@email.com', 'senha_hashed_29', 'Natal', 'RN', 'empresario', 2408102, 'ativo'),
('Diego Horácio Franco', 'diego.franco@email.com', 'senha_hashed_30', 'Recife', 'PE', 'cooperativa', 2611606, 'ativo'),
('Erika Isabel Freire', 'erika.freire@email.com', 'senha_hashed_31', 'São Paulo', 'SP', 'agricultor', 3550308, 'ativo'),
('Felipe Jorge Guedes', 'felipe.guedes@email.com', 'senha_hashed_32', 'Rio de Janeiro', 'RJ', 'empresario', 3304557, 'ativo'),
('Gisele Kátia Honorato', 'gisele.honorato@email.com', 'senha_hashed_33', 'Belo Horizonte', 'MG', 'cooperativa', 3106200, 'ativo'),
('Hugo Laís Lemos', 'hugo.lemos@email.com', 'senha_hashed_34', 'Porto Alegre', 'RS', 'agricultor', 4314902, 'ativo'),
('Igor Mara Lopes', 'igor.lopes@email.com', 'senha_hashed_35', 'Curitiba', 'PR', 'empresario', 4106902, 'ativo'),
('Júlia Nina Machado', 'julia.machado@email.com', 'senha_hashed_36', 'Salvador', 'BA', 'cooperativa', 2927408, 'ativo'),
('Kevin Olavo Melo', 'kevin.melo@email.com', 'senha_hashed_37', 'Fortaleza', 'CE', 'agricultor', 2304400, 'ativo'),
('Laura Patrícia Novaes', 'laura.novaes@email.com', 'senha_hashed_38', 'Recife', 'PE', 'empresario', 2611606, 'ativo'),
('Marcelo Quíria Pires', 'marcelo.pires@email.com', 'senha_hashed_39', 'Manaus', 'AM', 'cooperativa', 1302603, 'ativo'),
('Natália Regina Quintella', 'natalia.quintella@email.com', 'senha_hashed_40', 'Brasília', 'DF', 'agricultor', 5300108, 'ativo'),
('Otávio Selma Rocha', 'otavio.rocha@email.com', 'senha_hashed_41', 'Campinas', 'SP', 'empresario', 3509502, 'ativo'),
('Priscila Tânia Salles', 'priscila.salles@email.com', 'senha_hashed_42', 'Goiânia', 'GO', 'cooperativa', 5208707, 'ativo'),
('Quentin Urbano Sousa', 'quentin.sousa@email.com', 'senha_hashed_43', 'Belém', 'PA', 'agricultor', 1501402, 'ativo'),
('Renata Vanessa Tavares', 'renata.tavares@email.com', 'senha_hashed_44', 'Vitória', 'ES', 'empresario', 3205309, 'ativo'),
('Samuel Wesley Teixeira', 'samuel.teixeira@email.com', 'senha_hashed_45', 'Campo Grande', 'MS', 'cooperativa', 5002704, 'ativo'),
('Tatiana Xênia Torres', 'tatiana.torres@email.com', 'senha_hashed_46', 'Florianópolis', 'SC', 'agricultor', 4205407, 'ativo'),
('Ubiratã Zélia Vaz', 'ubirata.vaz@email.com', 'senha_hashed_47', 'Natal', 'RN', 'empresario', 2408102, 'ativo'),
('Valéria Amélia Viana', 'valeria.viana@email.com', 'senha_hashed_48', 'João Pessoa', 'PB', 'cooperativa', 2507507, 'ativo'),
('Wagner Beatriz Xavier', 'wagner.xavier@email.com', 'senha_hashed_49', 'Teresina', 'PI', 'agricultor', 2211001, 'ativo'),
('Ximena Clara Yunes', 'ximena.yunes@email.com', 'senha_hashed_50', 'São Luís', 'MA', 'empresario', 2111300, 'ativo'),
('Yago Dalila Zang', 'yago.zang@email.com', 'senha_hashed_51', 'Maceió', 'AL', 'cooperativa', 2704302, 'ativo'),
('Zoe Eduarda Abreu', 'zoe.abreu@email.com', 'senha_hashed_52', 'Aracaju', 'SE', 'agricultor', 2800308, 'ativo'),
('Arthur Bianca Barbosa', 'arthur.barbosa@email.com', 'senha_hashed_53', 'Cuiabá', 'MT', 'empresario', 5103403, 'ativo'),
('Brenda Carlos Camargo', 'brenda.camargo@email.com', 'senha_hashed_54', 'Palmas', 'TO', 'cooperativa', 1721008, 'ativo'),
('Cíntia Dora Campos', 'cintia.campos@email.com', 'senha_hashed_55', 'Rio Branco', 'AC', 'agricultor', 1200401, 'ativo'),
('Douglas Elaine Costa', 'douglas.costa@email.com', 'senha_hashed_56', 'Boa Vista', 'RR', 'empresario', 1400100, 'ativo'),
('Eliza Fábio Dutra', 'eliza.dutra@email.com', 'senha_hashed_57', 'Porto Velho', 'RO', 'cooperativa', 1100205, 'ativo'),
('Fábio Gabriela Esteves', 'fabio.esteves@email.com', 'senha_hashed_58', 'Macapá', 'AP', 'agricultor', 1600303, 'ativo'),
('Giovana Heloísa Fernandes', 'giovana.fernandes@email.com', 'senha_hashed_59', 'São Paulo', 'SP', 'empresario', 3550308, 'ativo'),
('Heitor Iago Figueiredo', 'heitor.figueiredo@email.com', 'senha_hashed_60', 'Rio de Janeiro', 'RJ', 'cooperativa', 3304557, 'ativo'),
('Isadora Juliana Fogaça', 'isadora.fogaca@email.com', 'senha_hashed_61', 'Belo Horizonte', 'MG', 'agricultor', 3106200, 'ativo'),
('João Kleber Fonseca', 'joao.fonseca@email.com', 'senha_hashed_62', 'Porto Alegre', 'RS', 'empresario', 4314902, 'ativo'),
('Ketlin Luan Garcia', 'ketlin.garcia@email.com', 'senha_hashed_63', 'Curitiba', 'PR', 'cooperativa', 4106902, 'ativo'),
('Leonardo Manuela Guedes', 'leonardo.guedes@email.com', 'senha_hashed_64', 'Salvador', 'BA', 'agricultor', 2927408, 'ativo'),
('Mônica Nara Haddad', 'monica.haddad@email.com', 'senha_hashed_65', 'Fortaleza', 'CE', 'empresario', 2304400, 'ativo'),
('Noel Olívia Ibarra', 'noel.ibarra@email.com', 'senha_hashed_66', 'Recife', 'PE', 'cooperativa', 2611606, 'ativo'),
('Otávio Pedro Jansen', 'otavio.jansen@email.com', 'senha_hashed_67', 'Manaus', 'AM', 'agricultor', 1302603, 'ativo'),
('Paula Quirino Kaiser', 'paula.kaiser@email.com', 'senha_hashed_68', 'Brasília', 'DF', 'empresario', 5300108, 'ativo'),
('Ricardo Soraia Lacerda', 'ricardo.lacerda@email.com', 'senha_hashed_69', 'Campinas', 'SP', 'cooperativa', 3509502, 'ativo'),
('Sabrina Tatiana Leal', 'sabrina.leal@email.com', 'senha_hashed_70', 'Goiânia', 'GO', 'agricultor', 5208707, 'ativo'),
('Thiago Úrsula Machado', 'thiago.machado@email.com', 'senha_hashed_71', 'Belém', 'PA', 'empresario', 1501402, 'ativo'),
('Vitor Vera Nogueira', 'vitor.nogueira@email.com', 'senha_hashed_72', 'Vitória', 'ES', 'cooperativa', 3205309, 'ativo'),
('Wendell Xuxa Oliveira', 'wendell.oliveira@email.com', 'senha_hashed_73', 'Campo Grande', 'MS', 'agricultor', 5002704, 'ativo'),
('Yara Zélia Pires', 'yara.pires@email.com', 'senha_hashed_74', 'Florianópolis', 'SC', 'empresario', 4205407, 'ativo'),
('Aline Bernardo Queiroz', 'aline.queiroz@email.com', 'senha_hashed_75', 'Natal', 'RN', 'cooperativa', 2408102, 'ativo'),
('Breno Cecília Ribeiro', 'breno.ribeiro@email.com', 'senha_hashed_76', 'João Pessoa', 'PB', 'agricultor', 2507507, 'ativo'),
('Cláudia David Sampaio', 'claudia.sampaio@email.com', 'senha_hashed_77', 'Teresina', 'PI', 'empresario', 2211001, 'ativo'),
('Diego Emília Teles', 'diego.teles@email.com', 'senha_hashed_78', 'São Luís', 'MA', 'cooperativa', 2111300, 'ativo'),
('Felipe Gisele Uchôa', 'felipe.uchoa@email.com', 'senha_hashed_79', 'Maceió', 'AL', 'agricultor', 2704302, 'ativo'),
('Gustavo Helena Valadares', 'gustavo.valadares@email.com', 'senha_hashed_80', 'Aracaju', 'SE', 'empresario', 2800308, 'ativo'),
('Isis Joana Westphal', 'isis.westphal@email.com', 'senha_hashed_81', 'Cuiabá', 'MT', 'cooperativa', 5103403, 'ativo'),
('Júlio Kauã Ximenes', 'julio.ximenes@email.com', 'senha_hashed_82', 'Palmas', 'TO', 'agricultor', 1721008, 'ativo'),
('Larissa Márcio Zabini', 'larissa.zabini@email.com', 'senha_hashed_83', 'Rio Branco', 'AC', 'empresario', 1200401, 'ativo'),
('Mário Natália Azevedo', 'mario.azevedo@email.com', 'senha_hashed_84', 'Boa Vista', 'RR', 'cooperativa', 1400100, 'ativo'),
('Nicole Otávio Barreto', 'nicole.barreto@email.com', 'senha_hashed_85', 'Porto Velho', 'RO', 'agricultor', 1100205, 'ativo'),
('Paulo Priscila Batista', 'paulo.batista@email.com', 'senha_hashed_86', 'Macapá', 'AP', 'empresario', 1600303, 'ativo'),
('Queiroz Rafael Benício', 'queiroz.benicio@email.com', 'senha_hashed_87', 'São Paulo', 'SP', 'cooperativa', 3550308, 'ativo'),
('Renato Sofia Bernardes', 'renato.bernardes@email.com', 'senha_hashed_88', 'Rio de Janeiro', 'RJ', 'agricultor', 3304557, 'ativo'),
('Silvia Thiago Bitencourt', 'silvia.bitencourt@email.com', 'senha_hashed_89', 'Belo Horizonte', 'MG', 'empresario', 3106200, 'ativo'),
('Tomás Úrsula Borges', 'tomas.borges@email.com', 'senha_hashed_90', 'Porto Alegre', 'RS', 'cooperativa', 4314902, 'ativo'),
('Viviane Wanderley Branco', 'viviane.branco@email.com', 'senha_hashed_91', 'Curitiba', 'PR', 'agricultor', 4106902, 'ativo'),
('Xavier Yasmin Bueno', 'xavier.bueno@email.com', 'senha_hashed_92', 'Salvador', 'BA', 'empresario', 2927408, 'ativo'),
('Yago Zara Cabral', 'yago.cabral@email.com', 'senha_hashed_93', 'Fortaleza', 'CE', 'cooperativa', 2304400, 'ativo'),
('Zélia Amélia Caires', 'zelia.caires@email.com', 'senha_hashed_94', 'Recife', 'PE', 'agricultor', 2611606, 'ativo'),
('André Bruna Caldeira', 'andre.caldeira@email.com', 'senha_hashed_95', 'Manaus', 'AM', 'empresario', 1302603, 'ativo'),
('Beatriz Caio Campos', 'beatriz.campos@email.com', 'senha_hashed_96', 'Brasília', 'DF', 'cooperativa', 5300108, 'ativo'),
('Cláudio Daniel Cândido', 'claudio.candido@email.com', 'senha_hashed_97', 'Campinas', 'SP', 'agricultor', 3509502, 'ativo'),
('Diana Erica Cano', 'diana.cano@email.com', 'senha_hashed_98', 'Goiânia', 'GO', 'empresario', 5208707, 'ativo'),
('Edson Felipe Carmo', 'edson.carmo@email.com', 'senha_hashed_99', 'Belém', 'PA', 'cooperativa', 1501402, 'ativo'),
('Fernanda Gabriel Carvalho', 'fernanda.carvalho@email.com', 'senha_hashed_100', 'Vitória', 'ES', 'agricultor', 3205309, 'ativo');


INSERT INTO tb_agricultor (usuario_id, cpf, nome_propriedade, area_cultivada) VALUES
(16, '10000000001', 'Sítio São José', 50.0),
(20, '10000000002', 'Fazenda Primavera', 75.5),
(24, '10000000003', 'Chácara Esperança', 30.0),
(28, '10000000004', 'Fazenda Bela Vista', 60.0),
(32, '10000000005', 'Sítio Recanto Feliz', 45.0),
(36, '10000000006', 'Fazenda Nova Vida', 80.0),
(40, '10000000007', 'Chácara Boa Terra', 35.0),
(44, '10000000008', 'Fazenda Horizonte', 90.0),
(48, '10000000009', 'Sítio Santa Luzia', 55.0),
(52, '10000000010', 'Fazenda Dois Irmãos', 70.0),
(56, '10000000011', 'Chácara do Sol', 40.0),
(60, '10000000012', 'Fazenda São Pedro', 65.0),
(64, '10000000013', 'Sítio Verde Vale', 38.0),
(68, '10000000014', 'Fazenda Bom Jesus', 85.0),
(72, '10000000015', 'Chácara Bela União', 42.0),
(76, '10000000016', 'Fazenda Santa Maria', 77.0),
(80, '10000000017', 'Sítio das Palmeiras', 53.0),
(84, '10000000018', 'Fazenda Estrela', 68.0),
(88, '10000000019', 'Chácara Aurora', 36.0),
(92, '10000000020', 'Fazenda Paraíso', 82.0);

INSERT INTO tb_empresario (usuario_id, cpf, nome_empresa, cnpj) VALUES
(17, '20000000001', 'AgroBusiness SP', '10000000000101'),
(21, '20000000002', 'Campo Forte RJ', '10000000000102'),
(25, '20000000003', 'Empreendimentos MG', '10000000000103'),
(29, '20000000004', 'SulAgro RS', '10000000000104'),
(33, '20000000005', 'AgroCuritiba', '10000000000105'),
(37, '20000000006', 'Salvador Agro', '10000000000106'),
(41, '20000000007', 'FortAgro', '10000000000107'),
(45, '20000000008', 'Recife Agro', '10000000000108'),
(49, '20000000009', 'Manaus Agro', '10000000000109'),
(53, '20000000010', 'DF Agro', '10000000000110'),
(57, '20000000011', 'Campinas Agro', '10000000000111'),
(61, '20000000012', 'Goiânia Agro', '10000000000112'),
(65, '20000000013', 'Belém Agro', '10000000000113'),
(69, '20000000014', 'Vitória Agro', '10000000000114'),
(73, '20000000015', 'Campo Grande Agro', '10000000000115'),
(77, '20000000016', 'Florianópolis Agro', '10000000000116'),
(81, '20000000017', 'Natal Agro', '10000000000117'),
(85, '20000000018', 'João Pessoa Agro', '10000000000118'),
(89, '20000000019', 'Teresina Agro', '10000000000119'),
(93, '20000000020', 'São Luís Agro', '10000000000120');


INSERT INTO tb_cooperativa (usuario_id, nome_cooperativa, cnpj, regiao_atuacao, numero_associados) VALUES
(18, 'Cooperativa SP', '20000000000101', 'Sudeste', 100),
(22, 'Cooperativa RJ', '20000000000102', 'Sudeste', 120),
(26, 'Cooperativa MG', '20000000000103', 'Sudeste', 90),
(30, 'Cooperativa RS', '20000000000104', 'Sul', 110),
(34, 'Cooperativa PR', '20000000000105', 'Sul', 130),
(38, 'Cooperativa BA', '20000000000106', 'Nordeste', 80),
(42, 'Cooperativa CE', '20000000000107', 'Nordeste', 95),
(46, 'Cooperativa PE', '20000000000108', 'Nordeste', 105),
(50, 'Cooperativa AM', '20000000000109', 'Norte', 70),
(54, 'Cooperativa DF', '20000000000110', 'Centro-Oeste', 60),
(58, 'Cooperativa GO', '20000000000111', 'Centro-Oeste', 85),
(62, 'Cooperativa PA', '20000000000112', 'Norte', 75),
(66, 'Cooperativa ES', '20000000000113', 'Sudeste', 65),
(70, 'Cooperativa MS', '20000000000114', 'Centro-Oeste', 55),
(74, 'Cooperativa SC', '20000000000115', 'Sul', 115),
(78, 'Cooperativa RN', '20000000000116', 'Nordeste', 50),
(82, 'Cooperativa PB', '20000000000117', 'Nordeste', 45),
(86, 'Cooperativa PI', '20000000000118', 'Nordeste', 40),
(90, 'Cooperativa MA', '20000000000119', 'Nordeste', 35),
(94, 'Cooperativa AL', '20000000000120', 'Nordeste', 30);