import { Router } from "express";
import axios from "axios";

export default function createCotacoesRoutes() {
  const router = Router();

  // Função helper: tenta buscar cotações externas
  async function fetchExternalCotacoes() {
    const url = process.env.COTACOES_URL;
    if (!url) return null;
    try {
      const resp = await axios.get(url);
      return resp.data;
    } catch (err) {
      console.error("Erro ao buscar cotações externas:", err.message || err);
      return null;
    }
  }

  // GET /api/cotacoes/todos
  router.get("/todos", async (req, res) => {
    const supabase = req.app.get("supabase"); // Obtém o cliente Supabase configurado
    try {
      // Busca do cache
      const { data: cotacoes, error: errorCache } = await supabase
        .from("tb_cotacoes_cache")
        .select("provedor, dados, data_atualizacao")
        .order("provedor", { ascending: true });

      if (errorCache) throw errorCache;

      if (cotacoes && cotacoes.length > 0) {
        const data = {};
        for (const row of cotacoes) {
          data[row.provedor] = row.dados;
        }
        return res.json(data);
      }

      // Sem cache → busca externa
      const external = await fetchExternalCotacoes();
      if (external) {
        const now = new Date();

        // Cria um array de inserts (um por provedor)
        const inserts = Object.entries(external).map(([provedor, dados]) =>
          supabase
            .from("tb_cotacoes_cache")
            .insert([{ provedor, dados, data_atualizacao: now }])
        );

        // Executa tudo em paralelo
        const results = await Promise.all(inserts);

        // Se algum der erro, lança
        const erroInsercao = results.find((r) => r.error);
        if (erroInsercao?.error) throw erroInsercao.error;

        return res.json(external);
      }

      // Sem cache e sem fonte externa
      return res.json({ coamo: [], larAgro: [], cocamar: [] });
    } catch (err) {
      console.error("Erro na rota /api/cotacoes/todos:", err);
      res.status(500).json({ error: "Erro ao obter cotações" });
    }
  });

  return router;
}