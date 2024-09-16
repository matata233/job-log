import puppeteer from "puppeteer";

export async function scrapeJD(link: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  await page.goto(link, {waitUntil: "networkidle0"});
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const textContent: string = await page.evaluate(() => document.body.innerText);
  await browser.close();
  return {
    scrappedText: textContent
  };
}
