import { APIGatewayProxyHandler } from "aws-lambda";
import { AppointmentService } from "../services/appointment.service";
import { ResponseUtil } from "../utils/response.utils";
import { Validator } from "../utils/validator";
import { pino } from "pino";

const appointmentService = new AppointmentService();
const logger = pino();

export const createAppointment: APIGatewayProxyHandler = async (event) => {
  try {
    logger.info(event.body, "Creating appointment");

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
    logger.error(error, "Error creating appointment");
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
    logger.error(error, "Error fetching appointments");
    return ResponseUtil.internalServerError("Failed to fetch appointments");
  }
};

export const processCompletionNotification = async (event: any) => {
  try {
    for (const record of event.Records) {
      const body = JSON.parse(record.body);
      logger.info(body.detail, "detail");
      await appointmentService.completeAppointment(body.detail.appointmentId);
      logger.info(body.appointmentId, "Appointment completed");

      // TODO: send confirmation email
    }
  } catch (error) {
    logger.error(error, "Error processing completion notification");
    throw error;
  }
};
