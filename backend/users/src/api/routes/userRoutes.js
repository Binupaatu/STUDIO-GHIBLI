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

// PUT /users/:id - Update a user's details
router.put("/:id", userController.updateUser);

// DELETE /users/:id - Delete a user
router.delete("/:id", userController.deleteUser);

// POST /users/logout - User logout
router.post("/logout", authMiddleware, userController.logoutUser);

// POST /users/logout - User logout
router.get("/verify/token", authMiddleware, userController.verifyUser);

// GET /users/:id/profile - Get user's profile
router.get("/:id/profile", authMiddleware, userController.getUserProfile);

// GET /users/:id/profile - Get user's profile
router.get("/:id/profile", authMiddleware, userController.getUserProfile);

// PUT /users/:id/password - Update user's password
router.put("/:id/password", authMiddleware, userController.updatePassword);

module.exports = router;
