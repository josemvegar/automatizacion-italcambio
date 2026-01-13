import { CONFIG } from "../config/config.js";
import { log } from "../core/logger.js";

/**
 * Descripción clara de la acción humana que representa.
 */
export async function actionName(page, params = {}) {
  log("Descripción de lo que hace la acción");

  // 1️⃣ Esperar que el UI esté listo
  await page.waitForSelector("SELECTOR_ESPERADO", {
    timeout: CONFIG.WAIT.MEDIUM
  });

  // 2️⃣ Interacción humana
  // (click, fill, selectOption, etc.)

  // 3️⃣ Espera corta para render
  await page.waitForTimeout(CONFIG.WAIT.SHORT);

  // 4️⃣ Validación (OBLIGATORIA)
  const ok = await page.$("SELECTOR_DE_VALIDACION");
  if (!ok) {
    throw new Error("Mensaje claro del error");
  }

  log("Acción completada correctamente");
}
