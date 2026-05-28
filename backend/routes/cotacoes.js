import { Router } from 'express';
import axios from 'axios';

const SCRAPING_API_URL = (
  process.env.AGROSMART_SCRAPING_API_URL || 'https://agrosmartapi.onrender.com'
).replace(/\/$/, '');

const scrapingApi = axios.create({
  baseURL: SCRAPING_API_URL,
  timeout: 60000,
  headers: {
    ...(process.env.AGROSMART_SCRAPING_API_TOKEN && {
      'x-api-token': process.env.AGROSMART_SCRAPING_API_TOKEN,
    }),
  },
});

export default function createCotacoesRoutes(pool) {
  const router = Router();

  router.use((req, _res, next) => {
    console.log('[cotacoes]', req.method, req.path);
    next();
  });

  router.get('/', (_req, res) => {
    res.json({ ok: true, routes: ['/todos', '/historico'] });
  });

  // GET /api/cotacoes/todos — busca da API externa, salva cache e histórico
  router.get('/todos', async (_req, res) => {
    try {
      // Tenta cache local primeiro
      const cached = await pool.query(
        'SELECT provedor, dados, data_atualizacao FROM tb_cotacoes_cache ORDER BY provedor'
      );
      if (cached.rows.length > 0) {
        const data = {};
        for (const row of cached.rows) {
          data[row.provedor] = row.dados;
        }
        return res.json(data);
      }

      // Sem cache: busca da API externa
      const { data } = await scrapingApi.get('/api/cotacoes/todos');
      await salvarCacheEHistorico(pool, data);
      return res.json(data);
    } catch (err) {
      console.error('Erro na rota /api/cotacoes/todos:', err.message || err);
      res.status(500).json({ error: 'Erro ao obter cotações' });
    }
  });

  // GET /api/cotacoes/historico?coop=&grao=&period=
  router.get('/historico', async (req, res) => {
    try {
      const coopRaw = (req.query.coop || '').toString().trim();
      const coop = coopRaw.toUpperCase();
      if (!coop || !['COAMO', 'LAR', 'GRANOS', 'CVALE'].includes(coop)) {
        return res.status(400).json({
          error: "Parâmetro 'coop' inválido. Use 'COAMO', 'LAR', 'GRANOS' ou 'CVALE'.",
        });
      }

      const grao = (req.query.grao || '').toString().trim();
      const period = (req.query.period || '6m').toString();

      let since = new Date();
      if (period === '1y') {
        since.setFullYear(since.getFullYear() - 1);
      } else {
        since.setMonth(since.getMonth() - 6);
      }

      const params = [coop, since];
      let whereGrao = '';
      if (grao) {
        params.push(`%${grao}%`);
        whereGrao = 'AND grao ILIKE $3';
      }

      const query = `
        SELECT COALESCE(data_hora, created_at) AS dt, preco
        FROM tb_cotacoes_historico
        WHERE provedor = $1
          AND COALESCE(data_hora, created_at) >= $2
          ${whereGrao}
        ORDER BY dt ASC
      `;
      const result = await pool.query(query, params);
      const series = result.rows
        .filter((r) => r.preco !== null)
        .map((r) => ({ date: r.dt, price: Number(r.preco) }));

      res.json({ coop, grao: grao || null, period, series });
    } catch (err) {
      console.error('Erro em /api/cotacoes/historico:', err);
      res.status(500).json({ error: 'Erro ao obter histórico de cotações' });
    }
  });

  return router;
}

// ---

const parsePreco = (s) => {
  if (!s || typeof s !== 'string') return null;
  const cleaned = s.replace(/[^0-9,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? null : num;
};

const toTimestamp = (s) => {
  const d = s ? new Date(s) : null;
  return Number.isNaN(d?.getTime?.()) ? null : d;
};

async function salvarCacheEHistorico(pool, data) {
  const now = new Date();

  await pool.query('DELETE FROM tb_cotacoes_cache');

  const provedores = ['coamo', 'larAgro', 'granos', 'cvale'];
  await Promise.all(
    provedores.map((p) =>
      pool.query(
        'INSERT INTO tb_cotacoes_cache (provedor, dados, data_atualizacao) VALUES ($1, $2::jsonb, $3)',
        [p, JSON.stringify(data[p] || []), now]
      )
    )
  );

  const mapaProvedor = { coamo: 'COAMO', larAgro: 'LAR', granos: 'GRANOS', cvale: 'CVALE' };
  const histInserts = [];
  for (const [chave, label] of Object.entries(mapaProvedor)) {
    for (const item of data[chave] || []) {
      histInserts.push(
        pool.query(
          `INSERT INTO tb_cotacoes_historico (provedor, grao, preco, unidade, local, data_hora, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            label,
            item.grao || null,
            parsePreco(item.preco),
            item.unidade || null,
            item.local || null,
            toTimestamp(item.data_hora) || now,
            now,
          ]
        )
      );
    }
  }
  await Promise.all(histInserts);
}
