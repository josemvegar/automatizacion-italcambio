import { CONFIG } from "../config/config.js";
import { log } from "../core/logger.js";

export async function selectAmount(page) {
    log(`Seleccionando cantidad`);

    //if (!page.__IS_ROLLBACK) {
    const response = await page.waitForResponse(res =>
        res.url().includes("amountclientbyinterval.php")
    );

    if (response.status() !== 200) {
        throw new Error(`amountclientbyinterval.php devolvió ${response.status()}`);
    }
    /*}else{
        if (page.__LAST_API_STATUS !== 200) {
        throw new Error(`Rollback: availaptment.php devolvió ${page.__LAST_API_STATUS}`);
        } 
    }*/

    await page.waitForTimeout(CONFIG.WAIT.SHORT);
    await page.locator("button.MuiButtonBase-root.MuiCardActionArea-root").nth(2).click();

    await page.locator("button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-colorPrimary.MuiButton-fullWidth.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-colorPrimary.MuiButton-fullWidth").nth(0).click();

    page.__IS_ROLLBACK = false; // 👈 RESET

    log("Cantidad seleccionada OK");
}
