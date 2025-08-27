import { MySQLService } from "./mysql.service";
import { pino } from "pino";

import { EventBridgeService } from "./eventbridge.service";
import { Appointment } from "../models/appointment.model";
import { SQSRecord } from "aws-lambda";

const logger = pino();

export class CountryAppointmentHandler {
  constructor(
    private country: "PE" | "CL",
    private mysqlService = new MySQLService(),
    private eventBridge = new EventBridgeService()
  ) {}

  async processAppointment(record: SQSRecord): Promise<void> {
    const messageBody = JSON.parse(record.body);
    const appointmentData = messageBody.Message ? JSON.parse(messageBody.Message) : messageBody;

    await this.mysqlService.saveAppointment({ ...appointmentData, status: "COMPLETED" }, this.country);

    logger.info({ appointmentId: appointmentData.id, country: this.country }, "Publishing appointment processed event");
    await this.eventBridge.publishAppointmentProcessed(appointmentData.id);
  }
}
