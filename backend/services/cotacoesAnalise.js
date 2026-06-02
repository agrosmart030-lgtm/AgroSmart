const PROVEDOR_LABELS = {
  coamo: 'COAMO',
  larAgro: 'LAR',
  granos: 'GRANOS',
  cvale: 'CVALE',
};

const PERIOD_DAYS = {
  '7d': 7,
  '30d': 30,
  '6m': 180,
  '1y': 365,
};

export async function gerarAnaliseCotacoes(pool, filtros = {}) {
  const graoFiltro = normalizarGrao(filtros.grao || '');
  const period = PERIOD_DAYS[filtros.period] ? filtros.period : '30d';
  const since = new Date();
  since.setDate(since.getDate() - PERIOD_DAYS[period]);

  const [cacheResult, historicoResult] = await Promise.all([
    pool.query(
      'SELECT provedor, dados, data_atualizacao FROM tb_cotacoes_cache ORDER BY provedor'
    ),
    buscarHistorico(pool, since, graoFiltro),
  ]);

  const cotacoesAtuais = extrairCotacoesAtuais(cacheResult.rows).filter((item) =>
    graoFiltro ? item.grao === graoFiltro : true
  );
  const historico = historicoResult.rows
    .map((row) => ({
      provedor: row.provedor,
      grao: normalizarGrao(row.grao),
      preco: Number(row.preco),
      data: row.dt,
    }))
    .filter((item) => item.grao && Number.isFinite(item.preco));

  const graos = Array.from(
    new Set([...cotacoesAtuais.map((item) => item.grao), ...historico.map((item) => item.grao)])
  ).sort();

  const analisesPorGrao = graos.map((grao) =>
    analisarGrao(
      grao,
      cotacoesAtuais.filter((item) => item.grao === grao),
      historico.filter((item) => item.grao === grao)
    )
  );

  const estatisticas = calcularEstatisticas(cotacoesAtuais);
  const melhoresPrecos = analisesPorGrao
    .map((item) => item.melhorPreco)
    .filter(Boolean)
    .sort((a, b) => b.preco - a.preco);

  return {
    generatedAt: new Date().toISOString(),
    filters: {
      grao: graoFiltro || null,
      period,
    },
    resumo: gerarResumo(analisesPorGrao, estatisticas),
    estatisticas,
    melhoresPrecos,
    graos: analisesPorGrao,
  };
}

async function buscarHistorico(pool, since, graoFiltro) {
  const params = [since];
  let whereGrao = '';

  if (graoFiltro) {
    params.push(`%${graoFiltro}%`);
    whereGrao = 'AND grao ILIKE $2';
  }

  return pool.query(
    `
      SELECT provedor, grao, preco, COALESCE(data_hora, created_at) AS dt
      FROM tb_cotacoes_historico
      WHERE COALESCE(data_hora, created_at) >= $1
        AND preco IS NOT NULL
        ${whereGrao}
      ORDER BY dt ASC
    `,
    params
  );
}

function extrairCotacoesAtuais(rows) {
  const items = [];

  for (const row of rows) {
    const dados = Array.isArray(row.dados) ? row.dados : [];
    for (const item of dados) {
      const grao = normalizarGrao(item?.grao);
      const preco = parsePreco(item?.preco);

      if (!grao || !Number.isFinite(preco)) continue;

      items.push({
        provedor: PROVEDOR_LABELS[row.provedor] || row.provedor,
        grao,
        preco,
        precoFormatado: formatCurrency(preco),
        local: item.local || null,
        unidade: item.unidade || null,
        data_hora: item.data_hora || row.data_atualizacao,
        dataAtualizacaoCache: row.data_atualizacao,
      });
    }
  }

  return items;
}

function analisarGrao(grao, atuais, historico) {
  const atualOrdenado = [...atuais].sort((a, b) => b.preco - a.preco);
  const melhorPreco = atualOrdenado[0]
    ? {
        grao,
        cooperativa: atualOrdenado[0].provedor,
        preco: atualOrdenado[0].preco,
        precoFormatado: atualOrdenado[0].precoFormatado,
        local: atualOrdenado[0].local,
      }
    : null;
  const precoAtual = media(atuais.map((item) => item.preco));
  const serie = consolidarSerie(historico);
  const precoAnterior = serie.length >= 2 ? serie[serie.length - 2].price : null;
  const variacaoPercentual =
    Number.isFinite(precoAtual) && Number.isFinite(precoAnterior) && precoAnterior > 0
      ? ((precoAtual - precoAnterior) / precoAnterior) * 100
      : null;
  const tendencia = classificarTendencia(variacaoPercentual);

  return {
    grao,
    tendencia,
    variacaoPercentual:
      variacaoPercentual === null ? null : Number(variacaoPercentual.toFixed(2)),
    precoAtual: Number.isFinite(precoAtual) ? Number(precoAtual.toFixed(2)) : null,
    precoAtualFormatado: Number.isFinite(precoAtual) ? formatCurrency(precoAtual) : null,
    precoAnterior:
      Number.isFinite(precoAnterior) ? Number(Number(precoAnterior).toFixed(2)) : null,
    precoAnteriorFormatado: Number.isFinite(precoAnterior) ? formatCurrency(precoAnterior) : null,
    melhorPreco,
    registrosAtuais: atuais.length,
    pontosHistorico: serie.length,
    serie,
    sugestao: gerarSugestao(grao, tendencia, variacaoPercentual, melhorPreco, serie.length),
  };
}

function consolidarSerie(historico) {
  const byDate = new Map();

  for (const item of historico) {
    const date = toDateKey(item.data);
    if (!date) continue;

    const current = byDate.get(date) || [];
    current.push(Number(item.preco));
    byDate.set(date, current);
  }

  return Array.from(byDate.entries())
    .map(([date, values]) => ({
      date,
      price: Number(media(values).toFixed(2)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function calcularEstatisticas(cotacoes) {
  if (cotacoes.length === 0) {
    return {
      totalCotacoes: 0,
      maiorCotacao: null,
      menorCotacao: null,
      mediaPreco: null,
      mediaPrecoFormatada: null,
      ultimaAtualizacao: null,
    };
  }

  const ordenadas = [...cotacoes].sort((a, b) => b.preco - a.preco);
  const ultimaAtualizacao = cotacoes
    .map((item) => item.data_hora || item.dataAtualizacaoCache)
    .filter(Boolean)
    .sort((a, b) => toComparableTime(a) - toComparableTime(b))
    .at(-1);
  const mediaPreco = media(cotacoes.map((item) => item.preco));

  return {
    totalCotacoes: cotacoes.length,
    maiorCotacao: formatResumoCotacao(ordenadas[0]),
    menorCotacao: formatResumoCotacao(ordenadas[ordenadas.length - 1]),
    mediaPreco: Number(mediaPreco.toFixed(2)),
    mediaPrecoFormatada: formatCurrency(mediaPreco),
    ultimaAtualizacao,
  };
}

function formatResumoCotacao(item) {
  if (!item) return null;

  return {
    grao: item.grao,
    cooperativa: item.provedor,
    preco: item.preco,
    precoFormatado: item.precoFormatado,
    local: item.local,
    data_hora: item.data_hora,
  };
}

function gerarResumo(analises, estatisticas) {
  if (analises.length === 0 || estatisticas.totalCotacoes === 0) {
    return 'Ainda nao ha dados suficientes de cotacoes para gerar uma analise confiavel.';
  }

  const altas = analises.filter((item) => item.tendencia === 'alta').length;
  const quedas = analises.filter((item) => item.tendencia === 'queda').length;
  const estaveis = analises.filter((item) => item.tendencia === 'estabilidade').length;

  if (altas > quedas && altas > estaveis) {
    return 'As cotacoes analisadas indicam predominio de alta nos ultimos registros disponiveis.';
  }

  if (quedas > altas && quedas > estaveis) {
    return 'As cotacoes analisadas indicam maior pressao de queda nos ultimos registros disponiveis.';
  }

  return 'As cotacoes analisadas estao majoritariamente estaveis ou com variacoes moderadas.';
}

function gerarSugestao(grao, tendencia, variacaoPercentual, melhorPreco, pontosHistorico) {
  if (pontosHistorico < 2 || variacaoPercentual === null) {
    return `Ainda nao ha historico suficiente para estimar uma tendencia confiavel para ${grao}.`;
  }

  const destino = melhorPreco ? ` Melhor preco atual encontrado em ${melhorPreco.cooperativa}.` : '';

  if (tendencia === 'alta') {
    return `${grao} apresenta tendencia de alta nos ultimos registros.${destino}`;
  }

  if (tendencia === 'queda') {
    return `${grao} apresentou queda recente; acompanhe novas atualizacoes antes de decidir.${destino}`;
  }

  return `${grao} esta relativamente estavel; recomenda-se acompanhar as proximas cotacoes.${destino}`;
}

function classificarTendencia(variacaoPercentual) {
  if (variacaoPercentual === null || !Number.isFinite(variacaoPercentual)) return 'indefinida';
  if (variacaoPercentual > 1) return 'alta';
  if (variacaoPercentual < -1) return 'queda';
  return 'estabilidade';
}

function normalizarGrao(value = '') {
  const normalized = String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

  if (normalized.includes('SOJA')) return 'SOJA';
  if (normalized.includes('MILHO')) return 'MILHO';
  if (normalized.includes('TRIGO')) return 'TRIGO';
  if (normalized.includes('CAFE')) return 'CAFE';
  if (normalized.includes('FEIJAO')) return 'FEIJAO';

  return normalized.trim();
}

function parsePreco(value) {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'string') return null;

  const match = value.replace(/\u00a0/g, ' ').match(/\d{1,3}(?:\.\d{3})*,\d{2}|\d+(?:[.,]\d{1,2})?/);
  if (!match) return null;

  const parsed = Number(match[0].replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function media(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  if (valid.length === 0) return NaN;

  return valid.reduce((total, value) => total + value, 0) / valid.length;
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function toDateKey(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 10);
}

function toComparableTime(value) {
  if (!value) return 0;

  const raw = String(value).trim();
  const brMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (brMatch) {
    const [, day, month, year, hour = '0', minute = '0'] = brMatch;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute)
    ).getTime();
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}
