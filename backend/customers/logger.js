const winston = require('winston');
const { LogstashTransport } = require('winston-logstash-transport');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new LogstashTransport({
      port: 5000, // Logstash TCP port
      host: 'logstash', // Logstash service name in Kubernetes or hostname if running locally
      protocol: 'tcp', // Protocol to use (tcp or udp)
      node_name: 'customer-service', // Optional: Node name to identify your service
      format: winston.format.json(),
    })
  ]
});

module.exports = logger;
