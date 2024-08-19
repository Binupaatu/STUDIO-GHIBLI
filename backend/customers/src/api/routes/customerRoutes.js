const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");

//Create new Customer
router.post("/", customerController.createCustomer);

//List all Customers
router.get("/", customerController.listCustomers);

// GET /customer/:id - Retrieve customer details
router.get("/:id", customerController.viewCustomer);

// GET /customer/user/:id - Retrieve customer details by user id
router.get("/user/:id", customerController.viewCustomerByUserId);


module.exports = router;