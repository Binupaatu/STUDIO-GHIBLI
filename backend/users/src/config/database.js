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
    const durationInSeconds = time / 1000; // Convert milliseconds to seconds
    // Assume you have a way to identify the table from the query
    const table = query.match(/FROM\s+`?(\w+)`?/i)?.[1] || 'unknown';
    queryDurationHistogram.labels(query.slice(0, 50), table).observe(durationInSeconds);
    console.log(`Executed (${time}ms): ${query}`);
  }

});

module.exports = dB;
