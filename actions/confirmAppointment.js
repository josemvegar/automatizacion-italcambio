import { log } from "../core/logger.js";

export async function confirmAppointment(page) {
    log(`Confirmación de Cita Agendada`);

    const response = await page.waitForResponse(res =>
        res.url().includes("appointment.php")
    );

    if (response.status() !== 200) {
        throw new Error(`appointment.php devolvió ${response.status()}`);
    }

    await page.pause();

    log("Cita Agendada OK");
}
