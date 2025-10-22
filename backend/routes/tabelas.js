import { Router } from "express";

export default function createTabelasRoutes() {
  const router = Router();

  // Lista todas as tabelas do schema "public"
  router.get("/", async (req, res) => {
    const supabase = req.app.get("supabase"); // Obtém o cliente Supabase configurado
    try {
      const { data, error } = await supabase.rpc("listar_tabelas_public"); // precisa criar essa função RPC
      if (error) throw error;
      res.json({ tabelas: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Lista todas as tabelas + dados + colunas
  router.get("/dados", async (req, res) => {
    const supabase = req.app.get("supabase"); // Obtém o cliente Supabase configurado
    try {
      const { data: tabelas, error: tabelasError } = await supabase.rpc("listar_tabelas_public");
      if (tabelasError) throw tabelasError;

      const dados = {};
      const colunas = {};

      for (const tabela of tabelas) {
        const { data, error } = await supabase.from(tabela).select("*");
        dados[tabela] = error ? { erro: error.message } : data;

        const { data: cols, error: colError } = await supabase.rpc("listar_colunas_public", {
          tabela_nome: tabela,
        });
        colunas[tabela] = colError
          ? []
          : cols.map((col) => ({
              nome: col.column_name,
              nomeExibicao: col.column_name,
              tipo: col.data_type,
            }));
      }

      res.json({ tabelas, dados, colunas });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Retorna dados e colunas de uma tabela específica
  router.get("/:tabela", async (req, res) => {
    const supabase = req.app.get("supabase"); // Obtém o cliente Supabase configurado
    const { tabela } = req.params;
    try {
      const { data, error } = await supabase.from(tabela).select("*");
      if (error) throw error;

      const { data: colunasData, error: colunasError } = await supabase.rpc("listar_colunas_public", {
        tabela_nome: tabela,
      });
      if (colunasError) throw colunasError;

      const colunas = colunasData.map((col) => ({
        nome: col.column_name,
        nomeExibicao: col.column_name,
        tipo: col.data_type,
      }));

      res.json({ tabela, dados: data, colunas });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Agricultor
  router.post("/agricultores", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("tb_agricultor")
        .insert(req.body)
        .select()
        .single();
      if (error) throw error;
      res.status(201).json({ agricultor: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Empresário
  router.post("/empresarios", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("tb_empresario")
        .insert(req.body)
        .select()
        .single();
      if (error) throw error;
      res.status(201).json({ empresario: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Cooperativa
  router.post("/cooperativas", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("tb_cooperativa")
        .insert(req.body)
        .select()
        .single();
      if (error) throw error;
      res.status(201).json({ cooperativa: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Grão
  router.post("/graos", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("tb_grao")
        .insert(req.body)
        .select()
        .single();
      if (error) throw error;
      res.status(201).json({ grao: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Usuário-Grão
  router.post("/usuario-grao", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("tb_usuario_grao")
        .insert(req.body)
        .select()
        .single();
      if (error) throw error;
      res.status(201).json({ usuario_grao: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Histórico de Cotação
  router.post("/historico-cotacao", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("tb_historico_cotacao")
        .insert(req.body)
        .select()
        .single();
      if (error) throw error;
      res.status(201).json({ historico_cotacao: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
