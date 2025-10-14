import puppeteer from "puppeteer";

export default async function scrapeLarAgro() {
  try {
    const url = "https://www.lar.ind.br/lar-agro/agricola/#cotacao";
    console.log("[Scraper] LAR: iniciando Puppeteer");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";
    await page.setUserAgent(userAgent);

    console.log("[Scraper] LAR: acessando URL:", url);
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("select#cotacao");

    const optionValue = await page.evaluate(() => {
      const select = document.querySelector("select#cotacao");
      if (!select) return null;
      const desiredOption = Array.from(select.options).find((option) =>
        option.text.toUpperCase().includes("UNIDADE CAMPO GRANDE - MS")
      );
      if (desiredOption) return desiredOption.value;
      if (select.options.length >= 49) return select.options[48].value;
      return null;
    });

    if (!optionValue) {
      console.error("[Scraper] LAR: não foi possível encontrar a opção desejada no menu suspenso.");
      await browser.close();
      return [];
    }

    console.log("[Scraper] LAR: selecionando opção:", optionValue);
    await page.select("select#cotacao", optionValue);

    console.log("[Scraper] LAR: clicando em submit...");
    await page.waitForSelector('form[action*="cotacao"] button[type="submit"]', { timeout: 10000 });
    const botaoSubmit = await page.$('form[action*="cotacao"] button[type="submit"]');
    if (botaoSubmit) {
      await botaoSubmit.click();
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    console.log("[Scraper] LAR: aguardando tabela...");
    await page.waitForSelector("table tbody", { timeout: 60000 });

    const cotacoes = await page.evaluate(() => {
      const dados = [];
      document.querySelectorAll("table tbody tr").forEach((row) => {
        const cols = row.querySelectorAll("td");
        if (cols.length > 0) {
          dados.push({
            fornecedor: "Lar Agro",
            grao: cols[1]?.innerText.trim(),
            descricao: "No Data",
            data_hora: cols[2]?.innerText.trim(),
            preco: cols[4]?.innerText.trim(),
            unidade: "SC",
            local: cols[0]?.innerText.trim(),
          });
        }
      });
      return dados;
    });

    await browser.close();
    console.log("[Scraper] LAR: cotações obtidas:", cotacoes?.length ?? 0);
    return cotacoes;
  } catch (error) {
    console.error("[Scraper] LAR: erro ao coletar cotações:", error);
    return [];
  }
}
