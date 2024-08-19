const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", enrollmentController.enrollUser);
router.get("/", enrollmentController.listEnrollments);
router.get("/user/enrollments", enrollmentController.listUserEnrollments);

// GET /course/:id - Retrieve a enrollment by ID
router.get("/:id", enrollmentController.viewEnrolledUserByCourseId);
module.exports = router;
