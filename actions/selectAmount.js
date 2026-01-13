import { CONFIG } from "../config/config.js";
import { log } from "../core/logger.js";

export async function selectAmount(page) {
    log(`Seleccionando cantidad`);

    const response = await page.waitForResponse(res =>
        res.url().includes("amountclientbyinterval.php")
    );

    if (response.status() !== 200) {
        throw new Error(`amountclientbyinterval.php devolvió ${response.status()}`);
    }

    await page.waitForTimeout(CONFIG.WAIT.SHORT);
    await page.locator("button.MuiButtonBase-root.MuiCardActionArea-root").nth(2).click();

    await page.locator("button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-colorPrimary.MuiButton-fullWidth.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-colorPrimary.MuiButton-fullWidth").nth(0).click();

    log("Cantidad seleccionada OK");
}
