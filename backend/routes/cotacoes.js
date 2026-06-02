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

const COTACOES_REFRESH_MINUTES = Number(process.env.COTACOES_REFRESH_MINUTES || 30);
const COTACOES_REFRESH_MS = Math.max(COTACOES_REFRESH_MINUTES, 1) * 60 * 1000;
const COTACOES_PROVEDORES = ['coamo', 'larAgro', 'granos', 'cvale'];
const COTACOES_TIME_ZONE = 'America/Sao_Paulo';

export default function createCotacoesRoutes(pool) {
  const router = Router();

  router.use((req, _res, next) => {
    console.log('[cotacoes]', req.method, req.path);
    next();
  });

  router.get('/', (_req, res) => {
    res.json({ ok: true, routes: ['/todos', '/historico', '/refresh', '/cache-status'] });
  });

  router.get('/todos', async (_req, res) => {
    try {
      const cached = await pool.query(
        'SELECT provedor, dados, data_atualizacao FROM tb_cotacoes_cache ORDER BY provedor'
      );

      const cachedData = montarDadosDoCache(cached.rows);
      if (cached.rows.length > 0 && !cacheEstaExpirado(cached.rows)) {
        return res.json(cachedData);
      }

      try {
        const { data } = await scrapingApi.get('/api/cotacoes/todos');
        const mergedData = mesclarComCache(cachedData, data);
        await salvarCacheEHistorico(pool, mergedData);
        return res.json(mergedData);
      } catch (scrapingErr) {
        if (cached.rows.length > 0) {
          console.warn(
            'Erro ao atualizar cotacoes; retornando cache local:',
            scrapingErr.message || scrapingErr
          );
          return res.json(cachedData);
        }

        throw scrapingErr;
      }
    } catch (err) {
      console.error('Erro na rota /api/cotacoes/todos:', err.message || err);
      res.status(500).json({ error: 'Erro ao obter cotacoes' });
    }
  });

  router.post('/refresh', async (_req, res) => {
    try {
      const cached = await pool.query(
        'SELECT provedor, dados, data_atualizacao FROM tb_cotacoes_cache ORDER BY provedor'
      );
      const cachedData = montarDadosDoCache(cached.rows);
      const { data } = await scrapingApi.get('/api/cotacoes/todos');
      const mergedData = mesclarComCache(cachedData, data);
      await salvarCacheEHistorico(pool, mergedData);

      res.json({
        success: true,
        data: mergedData,
      });
    } catch (err) {
      console.error('Erro na rota /api/cotacoes/refresh:', err.message || err);
      res.status(500).json({ error: 'Erro ao atualizar cotacoes' });
    }
  });

  router.get('/cache-status', async (_req, res) => {
    try {
      const cached = await pool.query(
        'SELECT provedor, jsonb_array_length(dados) AS total, data_atualizacao FROM tb_cotacoes_cache ORDER BY provedor'
      );

      res.json({
        refreshMinutes: COTACOES_REFRESH_MINUTES,
        expired: cacheEstaExpirado(cached.rows),
        today: dataHojeKey(),
        providers: cached.rows.map((row) => ({
          ...row,
          hasTodayQuote: temCotacaoDeHoje(row.dados),
        })),
      });
    } catch (err) {
      console.error('Erro na rota /api/cotacoes/cache-status:', err.message || err);
      res.status(500).json({ error: 'Erro ao consultar cache de cotacoes' });
    }
  });

  router.get('/historico', async (req, res) => {
    try {
      const coopRaw = (req.query.coop || '').toString().trim();
      const coop = coopRaw.toUpperCase();
      if (!coop || !['COAMO', 'LAR', 'GRANOS', 'CVALE'].includes(coop)) {
        return res.status(400).json({
          error: "Parametro 'coop' invalido. Use 'COAMO', 'LAR', 'GRANOS' ou 'CVALE'.",
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
      res.status(500).json({ error: 'Erro ao obter historico de cotacoes' });
    }
  });

  return router;
}

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

function montarDadosDoCache(rows) {
  const data = {};
  for (const provedor of COTACOES_PROVEDORES) {
    data[provedor] = [];
  }
  for (const row of rows) {
    data[row.provedor] = row.dados;
  }
  return data;
}

function cacheEstaExpirado(rows) {
  if (rows.length === 0) return true;

  const timestamps = rows
    .map((row) => new Date(row.data_atualizacao).getTime())
    .filter(Number.isFinite);
  const oldestTimestamp = Math.min(...timestamps);

  return !Number.isFinite(oldestTimestamp) || Date.now() - oldestTimestamp > COTACOES_REFRESH_MS;
}

function mesclarComCache(cachedData, freshData) {
  const merged = {};
  for (const provedor of COTACOES_PROVEDORES) {
    const freshItems = Array.isArray(freshData?.[provedor]) ? freshData[provedor] : [];
    const cachedItems = Array.isArray(cachedData?.[provedor]) ? cachedData[provedor] : [];
    const hasFreshToday = temCotacaoDeHoje(freshItems);

    if (hasFreshToday) {
      merged[provedor] = freshItems;
    } else {
      merged[provedor] = cachedItems.length > 0 ? cachedItems : freshItems;
    }
  }
  return merged;
}

function temCotacaoDeHoje(items) {
  if (!Array.isArray(items) || items.length === 0) return false;
  const today = dataHojeKey();
  return items.some((item) => dataCotacaoKey(item?.data_hora) === today);
}

function dataHojeKey() {
  return dateKeyFromDate(new Date());
}

function dataCotacaoKey(value) {
  if (!value) return null;

  const raw = String(value).trim();
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  const brMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (brMatch) {
    const [, day, month, year] = brMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;

  return dateKeyFromDate(parsed);
}

function dateKeyFromDate(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: COTACOES_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

async function salvarCacheEHistorico(pool, data) {
  const now = new Date();

  await pool.query('DELETE FROM tb_cotacoes_cache');

  await Promise.all(
    COTACOES_PROVEDORES.map((p) =>
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
