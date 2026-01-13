import { CONFIG } from "../config/config.js";
import { log } from "../core/logger.js";

export async function selectSuc(page) {
  log("Seleccionando sucursal");

  const response = await page.waitForResponse(res =>
    res.url().includes("location.php")
  );

  if (response.status() !== 200) {
    throw new Error(`location.php devolvió ${response.status()}`);
  }

  await page.waitForTimeout(CONFIG.WAIT.SHORT);
  await page.locator("button.MuiButtonBase-root.MuiCardActionArea-root").nth(1).click();

  log("Sucursal seleccionada OK");

}
