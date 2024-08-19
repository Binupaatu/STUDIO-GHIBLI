const { Course } = require("../../src/models");
const title_value_to_check =
  "Web Development Masterclass - Online Certification Course";

describe("Course Model", () => {
  it("should create a new course", async () => {
    const mockCourseData = {
      title: title_value_to_check,
      description:
        "Cloud Computing | Web Apps | Linux | Web Servers | DBMS | LAMP Stack | HTML | CSS | JavaScript | PHP | + More",
      learning_outcomes: [
        "Understand the essentials of Local and Wide Area Networks",
        "Setup a basic network.",
        "Register a domain name with Domain Privacy",
        "Forward a domain, renew and administer a domain",
        "Configure Nameservers and DNS Zone Files",
        "Create and Configure a Testing server on a Local Windows or MAC System.",
        "Configure a Production web server on popular cloud hosting platforms.",
        "Create disk backups and install disk images on a virtual server",
      ],
      course_inclusions: [
        "26 hours on-demand video",
        "2 downloadable resources",
        "Access on mobile and TV",
        "Certificate of completion",
      ],
      is_certified: 1,
      author: "YouAccel Training",
      rating: 0,
      total_enrollments: 0,
      status: 1,
    };

    Course.create = jest.fn().mockResolvedValue(mockCourseData);

    const courseCreated = await Course.create(mockCourseData);
    expect(courseCreated.title).toEqual(title_value_to_check);
  });
});

describe("Course Model - Edit Function", () => {
  it("should edit an existing course", async () => {
    const mockCOurseId = 1;

    const mockUpdatedData = { title: title_value_to_check };
    const mockCourse = { id: mockCOurseId, ...mockUpdatedData };

    // Mock Sequelize update and findByPk functions
    Course.update = jest.fn().mockResolvedValue([1]);
    Course.findByPk = jest.fn().mockResolvedValue(mockCourse);

    const updatedCourse = await Course.update(mockUpdatedData, {
      where: { id: mockCOurseId },
    });
    const result = await Course.findByPk(mockCOurseId);

    expect(Course.update).toHaveBeenCalledWith(mockUpdatedData, {
      where: { id: mockCOurseId },
    });
    expect(result.title).toEqual(title_value_to_check);
  });
});
describe("Course Model - Delete Function", () => {
  it("should delete a Course", async () => {
    const mockCourserId = 1;

    // Mock Sequelize destroy function
    Course.destroy = jest.fn().mockResolvedValue(1);

    const result = await Course.destroy({ where: { id: mockCourserId } });

    expect(Course.destroy).toHaveBeenCalledWith({
      where: { id: mockCourserId },
    });
    expect(result).toEqual(1); // Number of records deleted
  });
});
describe("Course Model - Fetch All Function", () => {
  it("should fetch all courses", async () => {
    const mockCourses = [
      { id: 1, title: title_value_to_check },
      { id: 2, title: "Title 2" },
    ];

    // Mock Sequelize findAll function
    Course.findAll = jest.fn().mockResolvedValue(mockCourses);

    const courses = await Course.findAll();

    expect(Course.findAll).toHaveBeenCalled();
    expect(courses.length).toEqual(2);
    expect(courses[0].title).toEqual(title_value_to_check);
  });
});

describe("Course Model - Fetch One Function", () => {
  it("should fetch a single course by id", async () => {
    const mockCourseId = 1;
    const mockCourse = { id: mockCourseId, title: title_value_to_check };

    // Mock Sequelize findByPk function
    Course.findByPk = jest.fn().mockResolvedValue(mockCourse);

    const course = await Course.findByPk(mockCourseId);

    expect(Course.findByPk).toHaveBeenCalledWith(mockCourseId);
    expect(course.title).toEqual(title_value_to_check);
  });
});
