const Sequelize = require("sequelize");
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } = require("./index");

const { Histogram } = require('prom-client');
// Create a Histogram to track the duration of SQL queries
const queryDurationHistogram = new Histogram({
  name: 'mysql_query_duration_seconds',
  help: 'Duration of MySQL queries in seconds',
  labelNames: ['query', 'table']
});

const dB = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  port: DB_PORT,
  logging: (query, time) => {
    try {
      // Ensure 'time' is a valid number
      if (typeof time !== 'number' || isNaN(time)) {
        throw new Error(`Invalid time value: ${time}`);
      }
      const durationInSeconds = time / 1000; // Convert milliseconds to seconds
      // Extract the table name from the query
      const match = query.match(/FROM\s+`?(\w+)`?/i);
      const table = match ? match[1] : 'unknown';
      // Sanitize query and table names to avoid any special characters that could cause issues
      const sanitizedQuery = query.slice(0, 50).replace(/[^\w\s]/gi, '');
      const sanitizedTable = table.replace(/[^\w\s]/gi, '');
      // Ensure 'durationInSeconds' is a valid number before observing
      if (!isNaN(durationInSeconds)) {
        queryDurationHistogram.labels(sanitizedQuery, sanitizedTable).observe(durationInSeconds);
        console.log(`Executed (${time}ms): ${query}`);
      } else {
        console.error(`Invalid duration value: ${durationInSeconds}`);
      }
    } catch (error) {
      console.error(`Logging error: ${error.message}`);
    }
  }
});

module.exports = dB;
