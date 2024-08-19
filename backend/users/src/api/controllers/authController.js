const authService = require("../services/authService");

const authController = {
  async authenticateUser(req, res) {
    try {
      const { email, password } = req.body;
      const token = await authService.authenticateUser(email, password);
      res.status(200).json({ message: "Authentication successful", token });
    } catch (error) {
      res.status(500).json({ message: "Auth Controller " + error.message });
    }
  },
};

module.exports = authController;
