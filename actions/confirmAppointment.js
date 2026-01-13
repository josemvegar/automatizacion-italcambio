import { CONFIG } from "../config/config.js";
import { log } from "../core/logger.js";

export async function confirmAppointment(page) {
    log(`Confirmación de Cita Agendada`);

    //if (!page.__IS_ROLLBACK) {
    const response = await page.waitForResponse(res =>
        res.url().includes("appointment.php")
    );

    if (response.status() !== 200) {
        throw new Error(`appointment.php devolvió ${response.status()}`);
    }
    /*}else{
        if (page.__LAST_API_STATUS !== 200) {
        throw new Error(`Rollback: availaptment.php devolvió ${page.__LAST_API_STATUS}`);
        } 
    }*/

    await page.pause();

    log("Cita Agendada OK");
}
