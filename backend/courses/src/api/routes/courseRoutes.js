const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.post("/create", courseController.createCourse);
router.put("/:id", courseController.editCourse);
router.delete("/:id", courseController.deleteCourse);
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseDetails);

module.exports = router;
