import puppeteer from "puppeteer";

export default async function scrapeGranos() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        req.resourceType() === "image" ||
        req.resourceType() === "stylesheet" ||
        req.resourceType() === "font"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto("https://granoscorretora.com.br/cotacao-do-dia/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    console.log("[Scraper] Granos: acessando URL: https://granoscorretora.com.br/cotacao-do-dia/");
    console.log("[Scraper] Granos: Página carregada.");

    const tableData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tbody tr"));
      const pricesMap = {};

      rows.forEach((row) => {
        const columns = row.querySelectorAll("td");
        if (columns.length < 6) return;

        const cidade = columns[1]?.innerText?.trim() || "";
        if (!cidade.toUpperCase().includes("CAMPO GRANDE")) return;

        const dataOriginal = columns[0]?.innerText?.trim() || "";
        let dataHoraISO = null;
        if (dataOriginal) {
          const parts = dataOriginal.split("/");
          if (parts.length === 3) {
            dataHoraISO = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000Z`;
          }
        }

        const precos = [
          { grao: "SOJA", valor: columns[2]?.innerText?.trim() },
          { grao: "MILHO", valor: columns[3]?.innerText?.trim() },
          { grao: "TRIGO", valor: columns[4]?.innerText?.trim() },
          { grao: "SORGO", valor: columns[5]?.innerText?.trim() },
        ];

        precos.forEach((item) => {
          if (item.valor && item.valor !== "0,00" && item.valor !== "" && !pricesMap[item.grao]) {
            pricesMap[item.grao] = {
              grao: item.grao,
              preco: item.valor,
              unidade: "sc",
              local: cidade,
              data_hora: dataHoraISO,
            };
          }
        });
      });

      return Object.values(pricesMap);
    });

    console.log(`[Scraper] Granos: cotações obtidas: ${tableData.length}`);
    return tableData;
  } catch (error) {
    console.error("Erro no scrapeGranos:", error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
