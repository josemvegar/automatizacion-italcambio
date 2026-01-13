import { CONFIG } from "../config/config.js";
import { log } from "../core/logger.js";
import { waitForApi200 } from "../core/waitForApi200.js";

export async function selectState(page) {
  log("Seleccionando Estado");

  const response = await page.waitForResponse(res =>
    res.url().includes("statelocation.php")
  );

  if (response.status() !== 200) {
    throw new Error(`statelocation.php devolvió ${response.status()}`);
  }
  
  await page.waitForTimeout(CONFIG.WAIT.SHORT);
  await page.locator("button.MuiButtonBase-root.MuiCardActionArea-root").nth(9).click();

  log("Estado seleccionado OK");
}
