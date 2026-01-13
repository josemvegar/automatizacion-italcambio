import { CONFIG } from "./../config/config.js";
import { log } from "./logger.js";

export async function waitForApi200(page, options = {}) {
  const {
    timeout = CONFIG.WAIT.LONG,
    endpoint = "/appointmentAPI/"
  } = options;

  log("Esperando respuesta 200 del backend...");

  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (page.__LAST_API_STATUS === 200) {
      log("Backend respondió 200");
      return;
    }
    await page.waitForTimeout(200);
  }

  throw new Error("Timeout esperando respuesta 200 del backend");
}