import { CONFIG } from "../config/config.js";
import { log } from "../core/logger.js";

export async function selectSchedule(page) {
    log(`Seleccionando hora`);

    const response = await page.waitForResponse(res =>
        res.url().includes("availaptmentbyhour.php")
    );

    if (response.status() !== 200) {
        throw new Error(`availaptmentbyhour.php devolvió ${response.status()}`);
    }

    //await page.route("**/amountclientbyinterval.php", async route => {
        /*log("MOCK → amountclientbyinterval.php");

        // ⏳ delay de 2 segundos
        await new Promise(resolve => setTimeout(resolve, 2000));

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([
                { amount: 100 }
            ])
        });
    });*/

    await page.waitForTimeout(CONFIG.WAIT.SHORT);
    await page.locator("button.MuiButtonBase-root.MuiCardActionArea-root").nth(1).click();

    log("Hora seleccionada OK");
}
