import { chromium } from "playwright";
import { appointmentFlow } from "./flows/appointmentFlow.js";
import { parseCookieHeader } from "./core/cookies.js";
import { log } from "./core/logger.js";
import "dotenv/config";

export async function runAppointment() {
    const browser = await chromium.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage", // Obligatorio: usa disco en lugar de RAM para archivos temporales 
            "--single-process",        // Ejecuta todo en un solo proceso para ahorrar RAM 
            "--disable-gpu",           // Desactiva aceleración por hardware
            "--no-zygote",             // Ahorra memoria al no crear procesos hijos innecesarios
            "--disable-renderer-backgrounding",
            "--disable-canvas-aa",     // Desactiva suavizado de bordes
            "--disable-2d-canvas-clip-utils",
            "--disable-gl-drawing-for-tests"
        ]
    });

    try {
        // Añade un User-Agent real para evitar bloqueos que cierren el contexto
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        // Inyección de cookies...
        if (process.env.ITAL_COOKIES) {
            const cookies = parseCookieHeader(process.env.ITAL_COOKIES, ".italcambio.com");
            await context.addCookies(cookies);
            log("Cookies de sesión inyectadas");
        } else {
            log("⚠️ No hay cookies, se usará flujo no autenticado");
        }

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

        // Bloqueo de recursos innecesarios (IMÁGENES Y CSS) para ahorrar RAM
        await page.route('**/*.{png,jpg,jpeg,gif,webp,svg,css,woff,woff2}', route => route.abort());

        await appointmentFlow(page);
    } catch (err) {
        log(`Error en ejecución: ${err.message}`);
        throw err;
    } finally {
        // Cerramos el navegador siempre, falle o no, para liberar los 256MB 
        await browser.close();
    }
};