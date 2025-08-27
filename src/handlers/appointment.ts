import { APIGatewayProxyHandler } from "aws-lambda";
import { AppointmentService } from "../services/appointment.service";
import { ResponseUtil } from "../utils/response.utils";
import { Validator } from "../utils/validator";
import { pino } from "pino";

const appointmentService = new AppointmentService();
const logger = pino();

export const createAppointment: APIGatewayProxyHandler = async (event) => {
  try {
    logger.info(`Creating appointment ${JSON.stringify(event.body)}`);

    const body = JSON.parse(event.body || "{}");
    const validation = Validator.validateAppointmentRequest(body);

    if (!validation.isValid) {
      return ResponseUtil.badRequest(validation.errors);
    }

    const appointment = await appointmentService.createAppointment(body);

    return ResponseUtil.success({
      message: "Appointment scheduling is in process",
      appointmentId: appointment.id,
      status: appointment.status,
    });
  } catch (error) {
    logger.error(`Error creating appointment: ${error}`);
    return ResponseUtil.internalServerError("Failed to process appointment");
  }
};

export const getAppointmentsByInsured: APIGatewayProxyHandler = async (event) => {
  try {
    const insuredId = event.pathParameters?.insuredId;

    if (!insuredId || !Validator.validateInsuredId(insuredId)) {
      return ResponseUtil.badRequest(["Invalid insured ID"]);
    }

    const appointments = await appointmentService.getAppointmentsByInsured(insuredId);

    return ResponseUtil.success(appointments);
  } catch (error) {
    logger.error(`Error fetching appointments: ${error}`);
    return ResponseUtil.internalServerError("Failed to fetch appointments");
  }
};

export const processCompletionNotification = async (event: any) => {
  try {
    for (const record of event.Records) {
      const body = JSON.parse(record.body);
      logger.info("Processing completion notification", body);
      await appointmentService.completeAppointment(body.appointmentId);
      logger.info(`Appointment completed ${body.appointmentId}`);

      // TODO: send confirmation email
    }
  } catch (error) {
    logger.error(`Error processing completion notification: ${error}`);
    throw error;
  }
};
