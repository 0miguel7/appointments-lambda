import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { Appointment } from "../models/appointment.model";

export class SNSService {
  private snsClient = new SNSClient({ region: "us-east-1" });
  private topicArn = process.env.SNS_TOPIC_ARN;

  async publishAppointment(appointment: Appointment): Promise<void> {
    await this.snsClient.send(
      new PublishCommand({
        TopicArn: this.topicArn,
        Message: JSON.stringify(appointment),
        MessageAttributes: {
          country: {
            DataType: "String",
            StringValue: appointment.countryISO,
          },
        },
      })
    );
  }
}
