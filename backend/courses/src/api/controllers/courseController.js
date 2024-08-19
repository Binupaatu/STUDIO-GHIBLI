const { search } = require("../routes/courseRoutes");
const CourseService = require("../services/courseService");
const courseService = require("../services/courseService");
const courseValidationSchema = require("../validations/courseSchema");
const service = new courseService();

const CourseController = {
  /**
   * This function validate the given request and trigger the Course Service
   * @param {*} req
   * @param {*} res
   * @returns JsonResponse
   */
  async createCourse(req, res) {
    const { error } = courseValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    } else {
      try {
        const course = await service.createCourse(req.body);
        res.status(201).send({
          message: "Course has been created successfully",
          data: course,
        });
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error creating Course", error: error.message });
      }
    }
  },
  async editCourse(req, res) {
    const { error } = courseValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    } else {
      try {
        const courseId = req.params.id;
        const updateCourse = await service.editCourse(courseId, req.body);
        res.status(201).send({
          message: "Course has been updated successfully",
          data: updateCourse,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  },

  async getCourseDetails(req, res) {
    const courseId = req.params.id;

    try {
      const courseInfo = await service.getCourseDetails(courseId);
      res.status(201).send({
        message: "Course has been fetched successfully",
        data: courseInfo,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteCourse(req, res) {
    try {
      const courseId = req.params.id;
      const updateCourse = await service.deleteCourse(courseId);
      if (updateCourse) {
        res.status(201).send({
          message: "Course has been trashed successfully",
          data: updateCourse,
        });
      } else {
        res.status(500).send({
          message: "Unable to delete the Course",
          data: updateCourse,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAllCourses(req, res) {
    try {
      const courses = await service.getAllCourses(
        req.query.search,
        req.query.order_by,
        req.query.sort
      );
      if (courses) {
        res.status(201).send({
          message: "Course has been fetched successfully",
          data: courses,
        });
      } else {
        res.status(500).send({
          message: "Unable to fetch the courses",
          data: [],
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Error in Fetching Courses" , error: error.message });
    }
  },
};

module.exports = CourseController;
