import { DynamoDBService } from "../services/dynamodb.service";
import { Appointment } from "../models/appointment.model";
import { IRepository } from "./base.repository";

export class AppointmentRepository implements IRepository<Appointment> {
  constructor(private dynamoDB = new DynamoDBService()) {}

  async create(appointment: Appointment): Promise<Appointment> {
    await this.dynamoDB.put(appointment);
    return appointment;
  }

  async getById(id: string): Promise<Appointment | null> {
    return this.dynamoDB.get({ id });
  }

  async getByInsuredId(insuredId: string): Promise<Appointment[]> {
    return this.dynamoDB.query({
      IndexName: "insuredId-index",
      KeyConditionExpression: "insuredId = :insuredId",
      ExpressionAttributeValues: { ":insuredId": insuredId },
    });
  }

  async updateStatus(id: string, status: string): Promise<Appointment> {
    return this.dynamoDB.update(
      { id },
      {
        UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: {
          ":status": status,
          ":updatedAt": new Date().toISOString(),
        },
      }
    );
  }

  async update(id: string, item: Partial<Appointment>): Promise<Appointment> {
    return this.dynamoDB.update({ id }, item);
  }

  async delete(id: string): Promise<void> {
    await this.dynamoDB.delete({ id });
  }
}
