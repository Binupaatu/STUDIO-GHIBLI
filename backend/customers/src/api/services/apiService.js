const axios = require("axios");

class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(method, path, data = {}) {
    try {
      const url = `${this.baseUrl}${path ? "/" + path : ""}`;
      console.log(url);
      const response = await axios({ method, url, data });
      return response.data;
    } catch (error) {
      // A more refined error handling can be implemented based on requirements
      throw new Error(error.response ? error.response.data : error.message);
    }
  }
}

module.exports = ApiService;
