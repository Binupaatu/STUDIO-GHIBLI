const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
// POST /users/login - User login
authController;
router.post("/login", authController.authenticateUser);

// POST /users - Create a new user
router.post("/", userController.createUser);

// GET /users - Retrieve all users
router.get("/", userController.getAllUsers);

// GET /users/:id - Retrieve a user by ID
router.get("/:id", userController.getUserById);

// POST /users/logout - User logout
router.get("/verify/token", authMiddleware, userController.verifyUser);

// POST /users/logout - User logout
router.post("/logout", authMiddleware, userController.logoutUser);

module.exports = router;
