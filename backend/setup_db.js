import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { Pool } = pg;

const pool = new Pool();

const query = `
CREATE TABLE IF NOT EXISTS tb_conhecimento_agro (
    id SERIAL PRIMARY KEY,
    tag VARCHAR(50),
    icone_tag VARCHAR(50),
    cor_fundo VARCHAR(20),
    cor_texto VARCHAR(20),
    pergunta TEXT NOT NULL,
    resposta TEXT NOT NULL,
    categoria VARCHAR(50),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_conhecimento_agro (tag, icone_tag, cor_fundo, cor_texto, pergunta, resposta, categoria)
VALUES
('Soja', 'FaLeaf', 'bg-[#e8f5e9]', 'text-[#1B4332]', 'Qual o melhor período para o plantio da soja no Centro-Oeste?', 'O período ideal para o plantio da soja no Centro-Oeste brasileiro ocorre geralmente entre outubro e novembro, logo após o início das chuvas regulares. Entretanto, é fundamental consultar o Calendário de Zoneamento Agrícola de Risco Climático (ZARC).', 'Plantio'),
('Milho', 'FaSeedling', 'bg-[#fff8e1]', 'text-[#513700]', 'Como identificar e controlar a lagarta-do-cartucho no milho?', 'A lagarta-do-cartucho é identificada pelo formato de ''Y'' invertido na cabeça. O dano principal ocorre no cartucho da planta, onde a lagarta se aloja e consome as folhas.', 'Pragas'),
('Solo', 'FaSeedling', 'bg-[#efebe9]', 'text-[#3e2723]', 'Como fazer a calagem do solo corretamente?', 'A calagem deve ser feita com base na análise de solo. O calcário deve ser distribuído uniformemente e incorporado ao solo, preferencialmente de 2 a 3 meses antes do plantio ou da adubação.', 'Solo'),
('Clima', 'FaSun', 'bg-[#e3f2fd]', 'text-[#0d47a1]', 'Como o El Niño afeta a agricultura no Sul do Brasil?', 'No Sul do Brasil, o El Niño geralmente traz chuvas acima da média, o que pode favorecer algumas culturas, mas também aumentar o risco de doenças fúngicas e dificultar a colheita.', 'Clima')
;
`;

pool.query(query)
  .then(() => {
    console.log('Tabela criada e populada com sucesso!');
    pool.end();
  })
  .catch(err => {
    console.error('Erro:', err.message);
    pool.end();
  });
