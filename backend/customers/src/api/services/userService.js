const { USER_SERVICE_END_POINT } = require("../../config");
const ApiService = require("./apiService");

class UserService {
  constructor() {
    this.apiService = new ApiService(USER_SERVICE_END_POINT);
  }
  // User operations
  async createUser(userData) {
    return this.apiService.request("post", "", userData);
  }

  async viewUsers() {
    return this.apiService.request("get", "");
  }

  async viewUsersById(userId) {
    return this.apiService.request("get", userId.toString());
  }

  async deleteUser(userId) {
    return this.apiService.request("delete", userId.toString());
  }
}
module.exports = UserService;
