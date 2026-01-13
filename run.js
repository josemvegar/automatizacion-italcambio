import { chromium } from "playwright";
import { appointmentFlow } from "./flows/appointmentFlow.js";
import { parseCookieHeader } from "./core/cookies.js";
import { log } from "./core/logger.js";
//require('dotenv').config();
import "dotenv/config";

export async function runAppointment() {
    const browser = await chromium.launch({
        headless: true,
        //headless: false,
        //slowMo: 50, // opcional, recomendado
        args: [
            "--disable-blink-features=AutomationControlled"
        ]
    });

    /*const context = await browser.newContext({
        storageState: "sessions/italcambio-session.json"
    });*/

    const context = await browser.newContext();

    console.log("ITAL_COOKIES =", process.env.ITAL_COOKIES);



    // ✅ INYECTAR COOKIES
    if (process.env.ITAL_COOKIES) {
        const cookies = parseCookieHeader(
            process.env.ITAL_COOKIES,
            ".italcambio.com"
        );

        await context.addCookies(cookies);
        log("Cookies de sesión inyectadas");
    } else {
        log("⚠️ No hay cookies, se usará flujo no autenticado");
    }

    // ⬇️ AQUÍ FALTABA ESTO
    const page = await context.newPage();

    // Estado compartido
    page.__LAST_API_STATUS = 200;
    page.__RETRY_COUNT = page.__RETRY_COUNT ?? 0;
    page.__IS_ROLLBACK = false;

    // Listener de API
    page.on("response", res => {
        if (res.url().includes("/appointmentAPI/")) {
            page.__LAST_API_STATUS = res.status();
            log(`API ${res.status()} → ${res.url()}`);
        }
    });

    await appointmentFlow(page);

    await context.storageState({ path: "sessions/italcambio-session.json" });
    await browser.close();
};