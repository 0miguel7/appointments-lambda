import { AppointmentService } from "../src/services/appointment.service";
import { AppointmentRepository } from "../src/repositories/appointment.repository";
import { SNSService } from "../src/services/sns.service";

jest.mock("../src/repositories/appointment.repository");
jest.mock("../src/services/sns.service");

describe("AppointmentService", () => {
  let service: AppointmentService;
  let mockRepo: jest.Mocked<AppointmentRepository>;
  let mockSNS: jest.Mocked<SNSService>;

  beforeEach(() => {
    mockRepo = new AppointmentRepository() as jest.Mocked<AppointmentRepository>;
    mockSNS = new SNSService() as jest.Mocked<SNSService>;
    service = new AppointmentService(mockRepo, mockSNS);
  });

  describe("createAppointment", () => {
    it("should create appointment with pending status", async () => {
      const request = {
        insuredId: "12345",
        scheduleId: 100,
        countryISO: "PE" as const,
      };

      mockRepo.create.mockResolvedValue({
        id: "test-id",
        ...request,
        status: "PENDING",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      });

      const result = await service.createAppointment(request);

      expect(result.status).toBe("pending");
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockSNS.publishAppointment).toHaveBeenCalled();
    });
  });

  describe("getAppointmentsByInsured", () => {
    it("should return appointments for insured", async () => {
      const insuredId = "12345";
      const mockAppointments = [
        {
          id: "1",
          insuredId,
          scheduleId: 100,
          countryISO: "PE" as const,
          status: "COMPLETED" as const,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      mockRepo.getByInsuredId.mockResolvedValue(mockAppointments);

      const result = await service.getAppointmentsByInsured(insuredId);

      expect(result).toEqual(mockAppointments);
      expect(mockRepo.getByInsuredId).toHaveBeenCalledWith(insuredId);
    });
  });
});
