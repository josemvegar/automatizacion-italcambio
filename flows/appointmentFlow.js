import * as Actions from "../actions/index.js";
import { handleRetry } from "../core/retry.js";
import { log } from "../core/logger.js";

let STATE = "INIT";

export async function appointmentFlow(page) {

    while (STATE !== "DONE") {
        try {

            log(`Estado actual → ${STATE}`);

            switch (STATE) {
                case "INIT":
                    await Actions.openApp(page);
                    STATE = "VSTATE";
                    break;

                case "VSTATE":
                    await Actions.selectState(page);
                    STATE = "SUC";
                    break;

                case "SUC":
                    await Actions.selectSuc(page);
                    STATE = "DATE";
                    break;

                case "DATE":
                    await Actions.selectDate(page);
                    STATE = "SCHEDULE";
                    break;

                case "SCHEDULE":
                    await Actions.selectSchedule(page);
                    STATE = "AMOUNT";
                    break;

                case "AMOUNT":
                    await Actions.selectAmount(page);
                    STATE = "CONFIRM";
                    break;

                case "CONFIRM":
                    await Actions.confirmAppointment(page);
                    STATE = "DONE";
                    break;
            }

        } catch (err) {
            log(`Error en estado ${STATE}: ${err.message}`);

            const nextState = await handleRetry(
                page,
                STATE,
                page.__LAST_API_STATUS
            );

            STATE = nextState;
            continue; // vuelve al loop principal
        }
    }
}
