import puppeteer from "puppeteer";

export default async function scrapeCoamo() {
  try {
    const url = "https://www.coamo.com.br/preco-do-dia/";
    console.log("[Scraper] Coamo: iniciando Puppeteer");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    console.log("[Scraper] Coamo: acessando URL:", url);
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForSelector("table tbody");

    const cotacoes = await page.evaluate(() => {
      const dados = [];
      document.querySelectorAll("table tbody tr").forEach((row) => {
        const cols = row.querySelectorAll("td");
        if (cols.length > 0) {
          dados.push({
            fornecedor: "Coamo Agroindustrial Cooperativa",
            grao: cols[0]?.innerText.trim(),
            descricao: cols[1]?.innerText.trim(),
            data_hora: cols[2]?.innerText.trim(),
            preco: cols[3]?.innerText.trim(),
            unidade: cols[4]?.innerText.trim(),
            local: "Campo Mourão",
          });
        }
      });
      return dados;
    });

    await browser.close();
    console.log("[Scraper] Coamo: cotações obtidas:", cotacoes?.length ?? 0);
    return cotacoes;
  } catch (error) {
    console.error("[Scraper] Coamo: erro ao coletar cotações:", error);
    return [];
  }
}
