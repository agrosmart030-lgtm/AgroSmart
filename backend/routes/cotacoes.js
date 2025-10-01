import { Router } from 'express';
import axios from 'axios';

export default function createCotacoesRoutes(pool) {
  const router = Router();

  // Função helper: tenta buscar cotações externas. Configure a URL via variáveis de ambiente
  async function fetchExternalCotacoes() {
    // Placeholder: configure process.env.COTACOES_URL para a API externa que retorna todas as cotações
    const url = process.env.COTACOES_URL;
    if (!url) return null;
    try {
      const resp = await axios.get(url);
      return resp.data;
    } catch (err) {
      console.error('Erro ao buscar cotações externas:', err.message || err);
      return null;
    }
  }

  // GET /api/cotacoes/todos - retorna cotações cacheadas por provedor
  router.get('/todos', async (req, res) => {
    try {
      const result = await pool.query(`SELECT provedor, dados, data_atualizacao FROM tb_cotacoes_cache ORDER BY provedor`);
      if (result.rows.length > 0) {
        const data = {};
        for (const row of result.rows) {
          data[row.provedor] = row.dados;
        }
        return res.json(data);
      }

      // Se não há dados no cache, tenta buscar externamente (se configurado) e salva
      const external = await fetchExternalCotacoes();
      if (external) {
        // external é esperado no formato { coamo: [...], larAgro: [...], cocamar: [...] }
        const now = new Date();
        const inserts = [];
        for (const provedor of Object.keys(external)) {
          inserts.push(pool.query(`INSERT INTO tb_cotacoes_cache (provedor, dados, data_atualizacao) VALUES ($1, $2, $3) RETURNING *`, [provedor, external[provedor], now]));
        }
        await Promise.all(inserts);
        return res.json(external);
      }

      // Sem cache e sem fonte externa configurada: retorna objeto vazio previsível
      return res.json({ coamo: [], larAgro: [], cocamar: [] });
    } catch (err) {
      console.error('Erro na rota /api/cotacoes/todos:', err);
      res.status(500).json({ error: 'Erro ao obter cotações' });
    }
  });

  return router;
}
