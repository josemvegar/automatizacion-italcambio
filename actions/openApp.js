import { CONFIG } from "../config/config.js";
import { log } from "../core/logger.js";

export async function openApp(page) {
  log("Abriendo aplicación");

  await page.goto(CONFIG.BASE_URL, { waitUntil: "networkidle" });

  // Validación: la app cargó
  const root = await page.$("#root");
  if (!root) {
    throw new Error("La aplicación no cargó");
  }

  //page.waitForTimeout(CONFIG.WAIT.SHORT);
  log("Aplicación cargada correctamente");
}
