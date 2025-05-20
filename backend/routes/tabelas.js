import { Router } from "express";

export default function createTabelasRoutes(pool) {
  const router = Router();

  router.get("/", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      res.json({ tabelas: result.rows.map((r) => r.table_name) });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/dados", async (req, res) => {
    try {
      const tabelasResult = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      const tabelas = tabelasResult.rows.map((r) => r.table_name);
      const dados = {};
      for (const tabela of tabelas) {
        try {
          const registros = await pool.query(
            `SELECT * FROM ${tabela} LIMIT 20`
          );
          dados[tabela] = registros.rows;
        } catch (err) {
          dados[tabela] = { erro: err.message };
        }
      }
      res.json({ tabelas, dados });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/:tabela", async (req, res) => {
    const { tabela } = req.params;
    try {
      const validTablesResult = await pool.query(`
        SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
      `);
      const validTables = validTablesResult.rows.map((r) => r.table_name);
      if (!validTables.includes(tabela)) {
        return res.status(400).json({ error: "Tabela não encontrada." });
      }
      const result = await pool.query(`SELECT * FROM ${tabela} LIMIT 20`);
      res.json({ tabela, dados: result.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Adiciona agricultor (exemplo de payload: { usuario_id, cpf, nome_propriedade, area_cultivada })
  router.post("/agricultores", async (req, res) => {
    const { usuario_id, cpf, nome_propriedade, area_cultivada } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO tb_agricultor (usuario_id, cpf, nome_propriedade, area_cultivada)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [usuario_id, cpf, nome_propriedade, area_cultivada]
      );
      res.status(201).json({ agricultor: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Adiciona empresário (exemplo de payload: { usuario_id, cpf, nome_empresa, cnpj })
  router.post("/empresarios", async (req, res) => {
    const { usuario_id, cpf, nome_empresa, cnpj } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO tb_empresario (usuario_id, cpf, nome_empresa, cnpj)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [usuario_id, cpf, nome_empresa, cnpj]
      );
      res.status(201).json({ empresario: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Adiciona cooperativa (exemplo de payload: { usuario_id, nome_cooperativa, cnpj, regiao_atuacao, numero_associados })
  router.post("/cooperativas", async (req, res) => {
    const {
      usuario_id,
      nome_cooperativa,
      cnpj,
      regiao_atuacao,
      numero_associados,
    } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO tb_cooperativa (usuario_id, nome_cooperativa, cnpj, regiao_atuacao, numero_associados)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [usuario_id, nome_cooperativa, cnpj, regiao_atuacao, numero_associados]
      );
      res.status(201).json({ cooperativa: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Adiciona grão (exemplo de payload: { nome, codigo_api, unidade_medida, cotacao_atual, data_atualizacao })
  router.post("/graos", async (req, res) => {
    const {
      nome,
      codigo_api,
      unidade_medida,
      cotacao_atual,
      data_atualizacao,
    } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO tb_grao (nome, codigo_api, unidade_medida, cotacao_atual, data_atualizacao)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [nome, codigo_api, unidade_medida, cotacao_atual, data_atualizacao]
      );
      res.status(201).json({ grao: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Adiciona relacionamento usuário-grão (exemplo de payload: { usuario_id, grao_id, tipo_relacao })
  router.post("/usuario-grao", async (req, res) => {
    const { usuario_id, grao_id, tipo_relacao } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO tb_usuario_grao (usuario_id, grao_id, tipo_relacao)
         VALUES ($1, $2, $3) RETURNING *`,
        [usuario_id, grao_id, tipo_relacao]
      );
      res.status(201).json({ usuario_grao: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Adiciona histórico de cotação (exemplo de payload: { grao_id, preco, data_cotacao })
  router.post("/historico-cotacao", async (req, res) => {
    const { grao_id, preco, data_cotacao } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO tb_historico_cotacao (grao_id, preco, data_cotacao)
         VALUES ($1, $2, $3) RETURNING *`,
        [grao_id, preco, data_cotacao]
      );
      res.status(201).json({ historico_cotacao: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
