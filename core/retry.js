import { log } from "./logger.js";
import { CONFIG } from "../config/config.js";

const BACK_BUTTON_SELECTOR =
    "button.MuiButtonBase-root.MuiButton-root.MuiButton-outlined.MuiButton-outlinedPrimary";

const MENU_ITEM_SELECTOR =
    ".MuiButtonBase-root.MuiListItemButton-root.MuiListItemButton-gutters";

export async function handleRetry(page, currentState, status) {
    log(`handleRetry → estado=${currentState} status=${status}`);

    if (![500, 503, 429, 404, 504, 200, 400].includes(status)) {
        throw new Error(`Estado no recuperable (${status})`);
    }

    page.__RETRY_COUNT = (page.__RETRY_COUNT ?? 0) + 1;
    page.__IS_ROLLBACK = true;

    log(`Retry #${page.__RETRY_COUNT}`);

    if(status === 429){
        await page.waitForTimeout(CONFIG.WAIT.LONG);
    }

    /**
     * 🔴 CASO LÍMITE — NO SE PUEDE RETROCEDER MÁS
     * → Reinicio forzado del flujo UI
     */
    if (currentState === "VSTATE") {
        log("Límite alcanzado en VSTATE → reinicio completo del flujo");

        const menuItems = page.locator(MENU_ITEM_SELECTOR);

        // Esperamos a que el menú exista y sea visible
        await menuItems.first().waitFor({ state: "visible", timeout: CONFIG.WAIT.LONG });

        const count = await menuItems.count();
        if (count < 2) {
            throw new Error("No se encontraron suficientes botones del menú lateral");
        }

        // 🔎 DEBUG VISUAL
        //await page.pause();

        // Navegación intermedia
        await menuItems.nth(1).click({ force: true });

        //await page.pause();

        // Volver a Estados
        await menuItems.nth(0).click({ force: true });

        //await page.pause();

        return "VSTATE";
    }

    /**
     * 🔴 CASO INIT
     */
    if (currentState === "INIT") {
        log("Límite alcanzado en INIT → reload completo");

        await page.goto(CONFIG.BASE_URL, { waitUntil: "networkidle" });
        return "VSTATE";
    }

    /**
     * 🔁 RETROCESO NORMAL
     */
    log("Retroceso normal → botón Atrás");

    await page.click(BACK_BUTTON_SELECTOR, { force: true });

    /*if (currentState !== "SUC") {
        const response = await page.waitForResponse(res =>
            res.url().includes("appointmentAPI")
        );

        if (response.status() !== 200) {
            log(`Retroceso falló (${response.status()}) → seguir retrocediendo`);
            return getPreviousState(currentState);
        }
    }*/

    // ✅ RETROCESO EXITOSO
    page.__RETRY_COUNT = 0;
    page.__IS_ROLLBACK = true;

    return getPreviousState(currentState);
}

function getPreviousState(state) {
    switch (state) {
        case "CONFIRM":
            return "SUC";
        case "AMOUNT":
            return "SUC";
        case "SCHEDULE":
            return "SUC";
        case "DATE":
            return "SUC";
        case "SUC":
            return "VSTATE";
        case "VSTATE":
            return "INIT";
        default:
            return "INIT";
    }
}
