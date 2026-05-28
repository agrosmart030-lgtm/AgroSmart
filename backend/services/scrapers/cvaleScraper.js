export default async function scrapeCvale() {
  // O site da C.Vale não está funcionando bem, então usamos dados mocados temporariamente.
  // Baseado na estrutura do scraper da Granos.
  
  console.log("[Scraper] C.Vale: Iniciando (usando dados mocados)...");
  
  try {
    const dataHoraAtual = new Date().toISOString();
    
    const mockData = [
      { grao: "SOJA", preco: "131,50", unidade: "sc", local: "PALOTINA", data_hora: dataHoraAtual },
      { grao: "MILHO", preco: "57,20", unidade: "sc", local: "PALOTINA", data_hora: dataHoraAtual },
      { grao: "TRIGO", preco: "70,00", unidade: "sc", local: "PALOTINA", data_hora: dataHoraAtual }
    ];
    
    console.log(`[Scraper] C.Vale: cotações obtidas: ${mockData.length}`);
    return mockData;
  } catch (error) {
    console.error("Erro no scrapeCvale:", error);
    return [];
  }
}
