const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");

//Create new Customer
router.post("/", customerController.createCustomer);

//List all Customers
router.get("/", customerController.listCustomers);

// GET /customer/enrollments - Retrieve customer enrollments
router.get("/enrollments", customerController.viewCustomerEnrollments);

// GET /customer/:id - Retrieve customer details
router.get("/:id", customerController.viewCustomer);

// GET /customer/user/:id - Retrieve customer details by user id
router.get("/user/:id", customerController.viewCustomerByUserId);

// UPDATE /user/:id - Update a customer
router.put("/:id", authMiddleware, customerController.updateCustomer);

// DELETE /customer/:id - Delete a customer
router.delete("/:id", authMiddleware, customerController.deleteCustomer);

module.exports = router;
