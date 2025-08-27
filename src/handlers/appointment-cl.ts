import { SQSEvent } from "aws-lambda";
import { pino } from "pino";
import { CountryAppointmentHandler } from "../services/country-appointment.service";

const appointmentHandler = new CountryAppointmentHandler("CL");
const logger = pino();

export const processAppointment = async (event: SQSEvent) => {
  logger.info(`Processing SQS_CL messages, ${{ recordCount: event.Records.length }}`);

  for (const record of event.Records) {
    try {
      logger.info(`Processing appointment record, ${record.body.toString()}`);

      await appointmentHandler.processAppointment(record);

      logger.info(`Successfully processed appointment record, ${record.body.toString()}`);
    } catch (error: any) {
      logger.error(`Error processing appointment record, ${{ messageId: record.messageId, error: error.message }}`);
    }
  }
};
