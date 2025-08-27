import { AppointmentRequest } from "../models/appointment.model";

export class Validator {
  static validateAppointmentRequest(data: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.insuredId || typeof data.insuredId !== "string") {
      errors.push("insuredId is required and must be a string");
    } else if (!/^\d{5}$/.test(data.insuredId)) {
      errors.push("insuredId must be exactly 5 digits");
    }

    if (!data.scheduleId || typeof data.scheduleId !== "number") {
      errors.push("scheduleId is required and must be a number");
    }

    if (!data.countryISO || !["PE", "CL"].includes(data.countryISO)) {
      errors.push('countryISO must be either "PE" or "CL"');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateInsuredId(insuredId: string): boolean {
    return /^\d{5}$/.test(insuredId);
  }
}
