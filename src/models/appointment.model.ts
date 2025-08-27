export interface AppointmentRequest {
  insuredId: string;
  scheduleId: number;
  countryISO: "PE" | "CL";
}

export interface Appointment {
  id: string;
  insuredId: string;
  scheduleId: number;
  countryISO: "PE" | "CL";
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  scheduleId: number;
  centerId: number;
  specialtyId: number;
  medicId: number;
  date: string;
}
