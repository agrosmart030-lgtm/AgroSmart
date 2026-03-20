import axios from 'axios';
import express from 'express';

const router = express.Router();

async function getEmbrapaToken() {
  try {
    const consumerKey = process.env.EMBRAPA_CONSUMER_KEY.trim();
    const consumerSecret = process.env.EMBRAPA_CONSUMER_SECRET.trim();

    if (!consumerKey || !consumerSecret) {
      throw new Error("Chaves da Embrapa não configuradas no .env");
    }

    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const response = await axios.post(
      'https://api.cnptia.embrapa.br/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("[Embrapa Auth] Erro ao gerar token:", error.response ? error.response.data : error.message);
    throw new Error("Falha na autenticação com a Embrapa");
  }
}

router.get('/', async (req, res) => {
  const { busca, categoria } = req.query;

  // 1. Trava anti-erro 400: Se a busca vier vazia do front, devolve lista vazia sem chamar a Embrapa
  if (!busca || busca.trim() === "") {
    return res.status(200).json([]);
  }

  console.log(`[0] Recebido pedido do Front -> Categoria: ${categoria}, Busca: "${busca}"`);

  try {
    const token = await getEmbrapaToken();

    const requestBody = {
      id: "query_all",
      params: {
        query_string: busca,
        from: 0,
        size: 15
      }
    };

    const response = await axios.post(
      'https://api.cnptia.embrapa.br/respondeagro/v1/_search/template',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 2. Limpador de HTML: Remove as tags <p>, <br>, etc., do texto da Embrapa
    const limparHtml = (texto) => texto ? texto.replace(/<[^>]*>?/gm, '') : '';

    const hits = response.data.hits ? response.data.hits.hits : [];
    const respostas = hits.map(hit => ({
      pergunta: limparHtml(hit._source.question || hit._source.pergunta),
      resposta: limparHtml(hit._source.answer || hit._source.resposta),
      score: hit._score
    }));

    return res.json(respostas);

  } catch (error) {
    console.error("\n[0] ❌ ERRO 500 DA EMBRAPA:");
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }

    console.log("\n[0] 🛡️ Ativando dados de Fallback para a tela não quebrar...");

    const termo = busca ? busca.toLowerCase() : 'agricultura';
    const fallbackData = [
      {
        pergunta: `Como realizar o manejo correto de ${termo}?`,
        resposta: `O manejo ideal de ${termo} envolve o acompanhamento do zoneamento agrícola (ZARC), uso de sementes certificadas e controle preventivo de pragas. Recomenda-se sempre a consultoria de um agrônomo.`,
        score: 1.0
      },
      {
        pergunta: `Quais as melhores práticas de irrigação para ${termo}?`,
        resposta: `A irrigação deve ser baseada na evapotranspiração da cultura e umidade do solo. O uso de tensiômetros ajuda a otimizar o uso da água evitando estresse hídrico.`,
        score: 0.85
      },
      {
        pergunta: `⚠️ Nota de Contingência AgroSmart`,
        resposta: `No momento, a API da Embrapa está indisponível. Esta é uma resposta de contingência gerada pela arquitetura resiliente do AgroSmart para manter o serviço ativo.`,
        score: 0.5
      }
    ];

    return res.status(200).json(fallbackData);
  }
});

export default router;