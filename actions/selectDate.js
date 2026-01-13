import { CONFIG } from "../config/config.js";
import { log } from "../core/logger.js";

export async function selectDate(page) {
    log(`Seleccionando fecha`);

    const response = await page.waitForResponse(res =>
        res.url().includes("availaptment.php")
    );

    if (response.status() !== 200) {
        throw new Error(`availaptment.php devolvió ${response.status()}`);
    }

    await page.waitForTimeout(CONFIG.WAIT.SHORT);
    await page.locator("button.MuiButtonBase-root.MuiCardActionArea-root").nth(0).click();

    log("Fecha seleccionada OK");
}
