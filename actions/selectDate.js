import { CONFIG } from "../config/config.js";
import { log } from "../core/logger.js";

export async function selectDate(page) {
    log(`Seleccionando fecha`);

    //if (!page.__IS_ROLLBACK) {
    const response = await page.waitForResponse(res =>
        res.url().includes("availaptment.php")
    );

    if (response.status() !== 200) {
        throw new Error(`availaptment.php devolvió ${response.status()}`);
    }
    /*}else{
        if (page.__LAST_API_STATUS !== 200) {
        throw new Error(`Rollback: availaptment.php devolvió ${page.__LAST_API_STATUS}`);
        } 
    }*/

    await page.waitForTimeout(CONFIG.WAIT.SHORT);
    await page.locator("button.MuiButtonBase-root.MuiCardActionArea-root").nth(0).click();

    page.__IS_ROLLBACK = false; // 👈 RESET

    log("Fecha seleccionada OK");
}
