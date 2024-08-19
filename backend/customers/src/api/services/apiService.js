const axios = require("axios");
const { trace, propagation, context } = require('@opentelemetry/api');


class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(method, path, data = {}, headers = {}) {
    try {
      const url = `${this.baseUrl}${path ? "/" + path : ""}`;
      console.log("Request URL : ",url, "base : ",this.baseUrl);

      propagation.inject(context.active(), headers, {
        set: (headers, key, value) => headers[key] = value,
    });
      const response = await axios({ method, url, data,headers });
      return response.data;
    } catch (error) {
      // A more refined error handling can be implemented based on requirements
      console.error("API Request Failed:", error);
      throw new Error(error.response ? error.response.data : error.message);
    }
  }
}

module.exports = ApiService;