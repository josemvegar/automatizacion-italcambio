import { chromium } from "playwright";
import { appointmentFlow } from "./flows/appointmentFlow.js";
import { parseCookieHeader } from "./core/cookies.js";
import { log } from "./core/logger.js";
import "dotenv/config";

export async function runAppointment() {
    const browser = await chromium.launch({
        headless: true,
        args: [
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--single-process", // ⬅️ Mantenlo para cuando bajes a 1GB, ayuda a la estabilidad
            "--disable-gpu",
            "--no-zygote"
        ]
    });

    try {
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1280, height: 720 }
        });

        if (process.env.ITAL_COOKIES) {
            const cookies = parseCookieHeader(process.env.ITAL_COOKIES, ".italcambio.com");
            await context.addCookies(cookies);
            log("Cookies de sesión inyectadas");
        }

        const page = await context.newPage();

        // Configuración de estado inicial
        page.__LAST_API_STATUS = 200;
        page.__RETRY_COUNT = 0;
        page.__IS_ROLLBACK = false;

        // Listener de API
        page.on("response", res => {
            if (res.url().includes("/appointmentAPI/")) {
                page.__LAST_API_STATUS = res.status();
                log(`API ${res.status()} → ${res.url()}`);
            }
        });

        // 🛡️ BLOQUEO ESTRATÉGICO: Bloqueamos imágenes y fuentes (ahorran mucha RAM), 
        // pero DEJAMOS el CSS para que la web no se rompa visualmente.
        await page.route('**/*.{png,jpg,jpeg,gif,webp,svg,woff,woff2}', route => route.abort());

        await appointmentFlow(page);
        log("✅ Proceso completado exitosamente");

    } catch (err) {
        log(`❌ Error durante la ejecución: ${err.message}`);
        throw err;
    } finally {
        await browser.close();
        log("Navegador cerrado.");
    }
};