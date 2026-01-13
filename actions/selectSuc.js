import { CONFIG } from "../config/config.js";
import { log } from "../core/logger.js";

export async function selectSuc(page) {
  log("Seleccionando sucursal");

  //if (!page.__IS_ROLLBACK) {
  const response = await page.waitForResponse(res =>
    res.url().includes("location.php")
  );

  if (response.status() !== 200) {
    throw new Error(`location.php devolvió ${response.status()}`);
  }
  /*}else{
    if (page.__LAST_API_STATUS !== 200) {
      throw new Error(`Rollback: location.php devolvió ${page.__LAST_API_STATUS}`);
    }
  }*/

  await page.waitForTimeout(CONFIG.WAIT.SHORT);
  await page.locator("button.MuiButtonBase-root.MuiCardActionArea-root").nth(1).click();

  page.__IS_ROLLBACK = false; // 👈 RESET

  log("Sucursal seleccionada OK");

}
