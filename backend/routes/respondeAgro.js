import express from "express";
import axios from "axios";

const router = express.Router();

// Função para gerar o token de acesso da Embrapa puxando do .env
async function getEmbrapaToken() {
  try {
    const consumerKey = process.env.EMBRAPA_CONSUMER_KEY?.trim();
    const consumerSecret = process.env.EMBRAPA_CONSUMER_SECRET?.trim();

    if (!consumerKey || !consumerSecret) {
      throw new Error("Chaves da Embrapa não configuradas no .env");
    }

    // Cria a string key:secret e converte para Base64
    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
    ).toString("base64");

    const response = await axios.post(
      "https://api.cnptia.embrapa.br/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Erro ao gerar token da Embrapa:",
      error.response ? error.response.data : error.message,
    );
    throw new Error("Falha na autenticação com a Embrapa");
  }
}

router.get("/", async (req, res) => {
  try {
    const { categoria, busca } = req.query;
    console.log(
      `Recebido pedido do Front -> Categoria: ${categoria}, Busca: "${busca}"`,
    );

    // Se a busca estiver vazia, retorna instrução
    if (!busca) {
      const dadosSimulados = [
        {
          id: 1,
          tag: categoria === "Todas" ? "Geral" : categoria,
          iconeTag: "FaLeaf",
          corFundo: "bg-[#E8F5E9]",
          corTexto: "text-[#2D5A27]",
          pergunta: "O que é o RespondeAgro?",
          resposta:
            "Digite uma dúvida específica na barra de busca para consultar a base de dados oficial da Embrapa.",
        },
      ];
      return res.status(200).json(dadosSimulados);
    }

    // 1. Gera o Token de Acesso
    const accessToken = await getEmbrapaToken();

    // 2. Monta o corpo da requisição no formato da nova API (Elasticsearch Template)
    const requestBody = {
      id: "query_all", // Busca em todos os livros
      params: {
        query_string: categoria !== "Todas" ? `${categoria} ${busca}` : busca,
        from: 0,
        size: 20 // Limita a 20 resultados para a tela não ficar enorme
      }
    };

    // 3. Pesquisa na API oficial atualizada
    const response = await axios.post(
      "https://api.cnptia.embrapa.br/respondeagro/v1/_search/template",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    // A resposta agora vem no formato do Elasticsearch
    const hits = response.data?.hits?.hits;

    if (!hits || hits.length === 0) {
      return res.status(200).json([]);
    }

    // 4. Formata para o Front
    const resultadosFormatados = hits.map((item, index) => {
      const source = item._source;
      // Remove as tags HTML <p> que a API da Embrapa retorna na resposta
      const respostaLimpa = source.answer ? source.answer.replace(/<[^>]+>/g, '').trim() : '';

      return {
        id: index,
        tag: categoria !== "Todas" ? categoria : "Embrapa",
        iconeTag: "FaLeaf",
        corFundo: "bg-[#E8F5E9]",
        corTexto: "text-[#2D5A27]",
        pergunta: source.question,
        resposta: respostaLimpa,
      };
    });

    res.status(200).json(resultadosFormatados);
  } catch (error) {
    console.error("Erro na rota responde-agro:", error.response?.data || error.message);
    
    // Retorna mensagem de erro amigável pro frontend não quebrar a tela
    const fallback = [
      {
        id: 0,
        tag: "Aviso",
        iconeTag: "FaLeaf",
        corFundo: "bg-[#fff8e1]",
        corTexto: "text-[#513700]",
        pergunta: "Não foi possível consultar a Embrapa no momento",
        resposta:
          "Houve uma falha de comunicação com o serviço. " + (error.message || ""),
      },
    ];
    res.status(200).json(fallback);
  }
});

export default router;
