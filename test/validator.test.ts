import { Validator } from "../src/utils/validator";

describe("Validator", () => {
  describe("validateAppointmentRequest", () => {
    it("should validate valid appointment request", () => {
      const request = {
        insuredId: "12345",
        scheduleId: 100,
        countryISO: "PE",
      };

      const result = Validator.validateAppointmentRequest(request);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject invalid insuredId", () => {
      const request = {
        insuredId: "123",
        scheduleId: 100,
        countryISO: "PE",
      };

      const result = Validator.validateAppointmentRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("insuredId must be exactly 5 digits");
    });

    it("should reject invalid countryISO", () => {
      const request = {
        insuredId: "12345",
        scheduleId: 100,
        countryISO: "US",
      };

      const result = Validator.validateAppointmentRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('countryISO must be either "PE" or "CL"');
    });
  });
});
