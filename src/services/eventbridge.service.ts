import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { pino } from "pino";

const logger = pino();

export class EventBridgeService {
  private eventBridge: EventBridgeClient;
  private eventBusName: string;

  constructor() {
    this.eventBridge = new EventBridgeClient({ region: process.env.AWS_REGION || "us-east-1" });
    this.eventBusName = process.env.EVENTBRIDGE_BUS_NAME!;
  }

  async publishAppointmentProcessed(id: string): Promise<void> {
    const params = {
      Entries: [
        {
          Source: "medical-appointments",
          DetailType: "Appointment Processed",
          Detail: JSON.stringify({ appointmentId: id }),
          EventBusName: this.eventBusName,
        },
      ],
    };

    await this.eventBridge.send(new PutEventsCommand(params));
  }
}
