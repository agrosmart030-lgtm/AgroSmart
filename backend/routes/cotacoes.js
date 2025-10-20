import { Router } from 'express';
import scrapeCoamo from '../services/scrapers/coamoScraper.js';
import scrapeLarAgro from '../services/scrapers/larScraper.js';

export default function createCotacoesRoutes(pool) {
  const router = Router();

  // Logger para diagnosticar requisições nesta rota
  router.use((req, _res, next) => {
    console.log('[cotacoes]', req.method, req.path);
    next();
  });

  // Rota base para verificar montagem
  router.get('/', (_req, res) => {
    res.json({ ok: true, routes: ['/coamo', '/lar', '/todos', '/historico'] });
  });

  // GET /api/cotacoes/coamo - executa scraper da Coamo
  router.get('/coamo', async (_req, res) => {
    try {
      const dados = await scrapeCoamo();
      res.json(dados);
    } catch (err) {
      console.error('Erro ao obter cotações da Coamo:', err);
      res.status(500).json({ error: 'Erro ao obter cotações da Coamo' });
    }
  });

  // GET /api/cotacoes/lar - executa scraper da LAR
  router.get('/lar', async (_req, res) => {
    try {
      const dados = await scrapeLarAgro();
      res.json(dados);
    } catch (err) {
      console.error('Erro ao obter cotações da LAR:', err);
      res.status(500).json({ error: 'Erro ao obter cotações da LAR' });
    }
  });

  // GET /api/cotacoes/todos - lê cache; se vazio, executa scrapers, salva e retorna
  router.get('/todos', async (_req, res) => {
    try {
      const result = await pool.query(
        'SELECT provedor, dados, data_atualizacao FROM tb_cotacoes_cache ORDER BY provedor'
      );
      if (result.rows.length > 0) {
        const data = {};
        for (const row of result.rows) {
          data[row.provedor] = row.dados;
        }
        return res.json(data);
      }

      // Sem cache: executa scrapers
      const [coamoData, larAgroData] = await Promise.all([
        scrapeCoamo(),
        scrapeLarAgro(),
      ]);
      const aggregated = { coamo: coamoData || [], larAgro: larAgroData || [], cocamar: [] };

      // Salva no cache
      const now = new Date();
      const inserts = [];
      inserts.push(
        pool.query(
          'INSERT INTO tb_cotacoes_cache (provedor, dados, data_atualizacao) VALUES ($1, $2, $3)',
          ['coamo', aggregated.coamo, now]
        )
      );
      inserts.push(
        pool.query(
          'INSERT INTO tb_cotacoes_cache (provedor, dados, data_atualizacao) VALUES ($1, $2, $3)',
          ['larAgro', aggregated.larAgro, now]
        )
      );
      await Promise.all(inserts);

      return res.json(aggregated);
    } catch (err) {
      console.error('Erro na rota /api/cotacoes/todos:', err);
      res.status(500).json({ error: 'Erro ao obter cotações' });
    }
  });

  // GET /api/cotacoes/historico?coop=&grao=&period=
  // coop: 'COAMO' | 'LAR' (case-insensitive accepted)
  // grao: optional string to filter (ILIKE)
  // period: '6m' | '1y' (default '6m')
  router.get('/historico', async (req, res) => {
    try {
      const coopRaw = (req.query.coop || '').toString().trim();
      const coop = coopRaw.toUpperCase();
      if (!coop || (coop !== 'COAMO' && coop !== 'LAR')) {
        return res.status(400).json({ error: "Parâmetro 'coop' inválido. Use 'COAMO' ou 'LAR'." });
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
        .filter(r => r.preco !== null)
        .map(r => ({ date: r.dt, price: Number(r.preco) }));

      res.json({ coop, grao: grao || null, period, series });
    } catch (err) {
      console.error('Erro em /api/cotacoes/historico:', err);
      res.status(500).json({ error: 'Erro ao obter histórico de cotações' });
    }
  });

  return router;
}
