import { Appointment } from "../models/appointment.model";
import { getConnection } from "../config/db";

export class MySQLService {
  async saveAppointment(appointment: Appointment, country: string): Promise<void> {
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO appointments_${country.toLowerCase()} 
         (appointment_id, insured_id, schedule_id, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      [
        appointment.id,
        appointment.insuredId,
        appointment.scheduleId,
        appointment.status,
        appointment.createdAt,
        appointment.updatedAt,
      ]
    );
  }
}
