import { v4 as uuidv4 } from "uuid";
import { AppointmentRepository } from "../repositories/appointment.repository";
import { SNSService } from "./sns.service";
import { AppointmentRequest, Appointment } from "../models/appointment.model";

export class AppointmentService {
  constructor(private appointmentRepo = new AppointmentRepository(), private snsService = new SNSService()) {}

  async createAppointment(request: AppointmentRequest): Promise<Appointment> {
    const appointment: Appointment = {
      id: uuidv4(),
      ...request,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.appointmentRepo.create(appointment);
    await this.snsService.publishAppointment(appointment);

    return appointment;
  }

  async getAppointmentsByInsured(insuredId: string): Promise<Appointment[]> {
    return this.appointmentRepo.getByInsuredId(insuredId);
  }

  async completeAppointment(appointmentId: string): Promise<void> {
    await this.appointmentRepo.updateStatus(appointmentId, "COMPLETED");
  }
}
