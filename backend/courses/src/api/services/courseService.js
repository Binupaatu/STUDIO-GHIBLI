const Course = require("../../models/courseModel");
const Chapter = require("../../models/courseChapterModel");
const { Op } = require("sequelize");

class CourseService {
  async createCourse(data) {
    try {
      const course = await Course.create(this.extractCourseFields(data));
      //await this.handleChapters(course.id, data.chapters);
      return course;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async editCourse(courseId, data) {
    try {
      const course = await Course.findByPk(courseId);
      if (!course) {
        throw new Error("Course not found!");
      }

      await course.update(this.extractCourseFields(data));
      await this.handleChapters(courseId, data.chapters);
      return course;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Extracts course fields from data
  extractCourseFields(data) {
    return {
      title: data.title,
      description: data.description,
      learning_outcomes: data.learning_outcomes,
      course_inclusions: data.course_inclusions,
      is_certified: data.is_certified,
      author: data.author,
      price: data.price,
      rating: data.rating,
      total_enrollments: data.total_enrollments,
      status: data.status,
      course_content: data.course_content,
    };
  }

  // Handle creation and updating of chapters
  async handleChapters(courseId, chapters) {
    if (chapters && 0 < chapters.length) {
      const chapter_data = chapters;
      const chapter_data_with_course = chapter_data.map((chapter) => ({
        ...chapter,
        course_id: courseId,
      }));

      await Chapter.destroy({ where: { course_id: courseId } });
      await Chapter.bulkCreate(chapter_data_with_course);
    }
  }

  //Get indiviadual course details
  async getCourseDetails(courseId) {
    try {
      let courseInfo = await Course.findByPk(courseId);
      const chapters = await Chapter.findAll({
        where: {
          course_id: courseId,
        },
      });
      courseInfo = courseInfo.get({ plain: true });

      courseInfo.chapters = chapters;
      return courseInfo;
    } catch (error) {
      throw new Error("Course not found");
    }
  }
  //Delete a course from the database
  async deleteCourse(courseId) {
    const course = await Course.findByPk(courseId);

    if (!course) {
      throw new Error("Course not found");
    } else {
      try {
        course.status = "-1";
        const deleteCourse = await course.save();
        return deleteCourse;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }

  //Fetch all courses those are not deleted

  async getAllCourses(searchTerm, order, sort) {
    let options = {
      where: {
        status: {
          [Op.ne]: "-1",
        },
      },
    };

    if (searchTerm) {
      options.where.title = {
        [Op.like]: `%${searchTerm}%`,
      };
    }

    if (order && sort) {
      options.order = [[order, sort]];
    }

    try {
      const courses = await Course.findAll(options);
      return courses;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = CourseService;
