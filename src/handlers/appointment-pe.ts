import { SQSEvent } from "aws-lambda";
import { pino } from "pino";
import { CountryAppointmentHandler } from "../services/country-appointment.service";

const appointmentHandler = new CountryAppointmentHandler("PE");
const logger = pino();

export const processAppointment = async (event: SQSEvent) => {
  logger.info({ recordCount: event.Records.length }, "Processing SQS_CL messages");

  for (const record of event.Records) {
    try {
      logger.info({ body: record.body }, "Processing appointment record");

      await appointmentHandler.processAppointment(record);

      logger.info("Successfully processed appointment record");
    } catch (error: any) {
      logger.error({ messageId: record.messageId, error: error.message }, "Error processing appointment record");
    }
  }
};
