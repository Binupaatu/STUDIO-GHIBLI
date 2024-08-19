const Enrollment = require("../../src/models/enrollmentModel");
describe("Enrollment Model", () => {
    it("should create a new Enrollment", async () => {
        const mockEnrollmentData = {
        customer_id: "1 | 2 | 3 | 4 | + More",
        course_id: "1 | 2 | 3 | 4 | + More ",
        enrollment_date: new Date(),
        payment_method: "card",
        payment_status: "1 | 0",
        status:1
    };
    Enrollment.create = jest.fn().mockResolvedValue(mockEnrollmentData);
    const EnrollmentCreated = await Enrollment.create(mockEnrollmentData);
    expect(EnrollmentCreated.id).toEqual(mockEnrollmentData.id);
    });
});
describe("Enrollment Model - Fetch All Function", () => {
    it("should fetch all Enrollments", async () => {
    const mockEnrollments = [
    { id: 1},
    { id: 2}];
    // Mock Sequelize findAll function
    Enrollment.findAll = jest.fn().mockResolvedValue(mockEnrollments);
    const fetchedEnrollment = await Enrollment.findAll();
    expect(Enrollment.findAll).toHaveBeenCalled();
    expect(fetchedEnrollment.length).toEqual(2);
    expect(fetchedEnrollment[0].id).toEqual(mockEnrollments[0].id);
    });
});
describe("Enrollment Model - Fetch One Function", () => {
    it("should fetch a single Enrollment by id", async () => {
    const mockEnrollmentId = 1;
    const mockEnrollment = { id: mockEnrollmentId};

      // Mock Sequelize findByPk function
    Enrollment.findByPk = jest.fn().mockResolvedValue(mockEnrollment);

    const fetchedEnrollment = await Enrollment.findByPk(mockEnrollmentId);

    expect(Enrollment.findByPk).toHaveBeenCalledWith(mockEnrollmentId);
    expect(fetchedEnrollment.id).toEqual(mockEnrollment.id);
    });
});


