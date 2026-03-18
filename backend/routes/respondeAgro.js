import express from "express";
import axios from "axios";

const router = express.Router();

// Função para gerar o token de acesso da Embrapa puxando do .env
async function getEmbrapaToken() {
  try {
    const consumerKey = process.env.EMBRAPA_CONSUMER_KEY;
    const consumerSecret = process.env.EMBRAPA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error("Chaves da Embrapa não configuradas no .env");
    }

    // Cria a string key:secret e converte para Base64
    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
    ).toString("base64");

    const response = await axios.post(
      "https://api.cnptia.embrapa.br/token",
      "grant_type=client_credentials", // Corpo URL Encoded
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

    // 1. Gera o Token de Acesso (autenticação oficial via .env)
    const accessToken = await getEmbrapaToken();

    // 2. Monta o corpo da requisição GraphQL
    const requestBody = {
      query:
        "query BuscarRespostas($pergunta: String!) { respondeAgro(pergunta: $pergunta) { pergunta resposta score } }",
      variables: {
        pergunta: categoria !== "Todas" ? `[${categoria}] ${busca}` : busca,
      },
    };

    // 3. Pesquisa na API oficial
    const response = await axios.post(
      "https://api.cnptia.embrapa.br/agritec/v1/respondeagro",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const dadosEmbrapa = response.data.data.respondeAgro;

    if (!dadosEmbrapa || dadosEmbrapa.length === 0) {
      return res.status(200).json([]);
    }

    // 4. Formata para o Front
    const resultadosFormatados = dadosEmbrapa.map((item, index) => ({
      id: index,
      tag: categoria !== "Todas" ? categoria : "Embrapa",
      iconeTag: "FaLeaf",
      corFundo: "bg-[#E8F5E9]",
      corTexto: "text-[#2D5A27]",
      pergunta: item.pergunta,
      resposta: item.resposta,
    }));

    res.status(200).json(resultadosFormatados);
  } catch (error) {
    console.error("Erro na rota responde-agro:", error);
    res.status(500).json({ error: "Erro interno ao consultar a Embrapa" });
  }
});

// Usando export default para combinar com a estrutura "type": "module" do seu projeto
export default router;
